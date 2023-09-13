const express = require('express');
const router = express.Router();
const Journals = require('../models/Journals.js');
const User = require('../models/User.js');
const { getDate, getDateID, getCurrentDayInYear } = require('../utils/utils.js');
const verify = require('../middleware/verify.js');
const validate = require('../middleware/validate.js');
const { check, query, param } = require('express-validator');
const DOMPurify = require('../utils/DOMPurify.js');
const cryptoHelper = require('../utils/CryptoHelper.js');
const { emojis, MAX_BYTES } = require('../utils/Constants.js');

const journalRules = [
    check('text', 'Submitted text must not be empty').notEmpty()
        .isString().withMessage("Text must be a string")
        .isLength({max: MAX_BYTES}).withMessage(`Journal entry cannot exceed ${MAX_BYTES} bytes`),
    check('emoji')
        .isString().withMessage("Emoji must be a string")
        .matches(`^[${emojis}]+$`).withMessage("Emoji field must be a valid emoji")
        .isLength({max: 2}).withMessage(`Emoji should be 2 bytes max`)
        .escape().trim()
];

const capsuleRules = [
    ...journalRules,
    check('unlock_year').isInt({min: 0}).withMessage('Unlock year must be a positive number'),
    check('unlock_month').isInt({min: 0}).withMessage('Unlock month must be a positive number'),
    check('unlock_day').isInt({min: 0}).withMessage('Unlock day must be a positive number')
];

const viewRules = [
    param('id').isString().withMessage('Journal ID must be a string')
        .trim().escape()
];

const recentRules = [
    query('limit').isInt({min: 0}).withMessage('Limit number should be a psoitive integer')
        .escape().trim(),
    query('skip').isInt({min: 0}).withMessage('Skip number should be a psoitive integer')
        .escape().trim()
];

// Get all journal IDs and Capsule IDs neatly arranged into indices of a year
router.get('/', verify.user, async (req, res) => {
    try {
        // Group journal entries belonging to a user by their year, and only return relevant properties (NOT ORDERED)
        const groupedJournalsByYear = await Journals.aggregate([
            { $match: { username: req.user.username } },
            {
                $group: {
                    _id: { $year: '$date' },
                    journals: { 
                        $push: {
                            id: '$id',
                            date: '$date',
                            is_time_capsule: '$is_time_capsule',
                            locked: '$locked',
                            created_date: '$created_date'
                        } 
                    }
                }
            },
            {
                $project: {
                    year: '$_id',
                    journals: 1
                }
            }
        ]);

        let idMap = new Map();

        for(const yearGroup of groupedJournalsByYear) {
            let yearMap = new Map();
    
            for(const journal of yearGroup.journals) {
                // Index from [0-364/365]
                const dayIndex = getCurrentDayInYear(new Date(journal.date));
    
                let data = {};
                if(yearMap.has(dayIndex))
                    data = {...yearMap.get(dayIndex)}
    
                if(journal.is_time_capsule)
                    data['capsuleInfo'] = {id: journal.id, locked: journal.locked};
                else
                    data['journalID'] = journal.id;
    
                yearMap.set(dayIndex, data);
            }
            idMap.set(yearGroup.year, Object.fromEntries(yearMap.entries()))
        }
    
        return res.send(Object.fromEntries(idMap.entries()));
    }
    catch(err) {
        console.log('ERR [GET journals/]: ', err);
        return res.status(500).send({error: err});
    }
});

// Get a journal entry with a specified journal ID
router.get('/id/:id', validate(viewRules), verify.user, async (req, res) => {
    const id = req.params.id;

    let found = await Journals.findOne({id: id});
    if(!found)
        return res.status(404).send({error: `No journals with ID: '${id}' found`});

    const usernameInId = found.id.split('-')[0];
    if(usernameInId !== req.user.username)
        return res.status(403).send({error: `You are not authorized to view this content.`});

    if(found.locked) {
        const unlock_date = found.date;
        return res.status(403).send({error: `You cannot view this capsule entry yet! Come back on ${getDate(unlock_date)}`});
    }

    // Decrypt the generated key so we can decrypt the entry
    try {
        const { encryptedGeneratedKey, encryptedGeneratedKeyIV } = req.user;
        const derivedKeyBuffer = Buffer.from(req.derivedKey);
        const generatedKey = cryptoHelper.decrypt(encryptedGeneratedKey, derivedKeyBuffer, encryptedGeneratedKeyIV).toString();

        const decrypted = cryptoHelper.decrypt(found.richtext, Buffer.from(generatedKey, 'hex'), found.iv);
        found.richtext = decrypted;
    } catch(err) {
        console.log('ERR [GET journals/id/:id]:', err);
        return res.status(401).send({error: 'Bad decrypt.'});
    }

    return res.send(found);
});

// Compile a list of a user's recent journal entries 
router.get('/recents', verify.user, validate(recentRules), async (req, res) => {
    const {limit, skip} = req.query;

    let paginatedRecents;
    try {
        const d = new Date();
        d.setMinutes(d.getMinutes() + 5);
        paginatedRecents = await Journals.find(
            {   
                username: req.user.username, 
                locked: {$ne: true}, 
                date: {$lte: d.toUTCString()}
            },
        ).sort({date: -1}).skip(skip).limit(limit);
    }
    catch(err) {
        console.log('ERR [GET journals/recents]: ', err);
        return res.status(500).send({error: err});
    }

    try {
        // Decrypt our generated key to decrypt the entries
        const { encryptedGeneratedKey, encryptedGeneratedKeyIV } = req.user;
        const derivedKeyBuffer = Buffer.from(req.derivedKey);
        const generatedKey = cryptoHelper.decrypt(encryptedGeneratedKey, derivedKeyBuffer, encryptedGeneratedKeyIV).toString();

        let decryptedEntries = [];
        for(let recent of paginatedRecents) {
            const decrypted = cryptoHelper.decrypt(recent.richtext, Buffer.from(generatedKey, 'hex'), recent.iv).toString('utf-8');
            recent.richtext = decrypted;
            decryptedEntries.push(recent);
        }

        return res.send(decryptedEntries);
    }
    catch(err) {
        console.log('ERR [GET journals/recents]: ', err);
        return res.status(401).send({error: 'Bad decrypt.'});
    }
});

// Save a new journal entry
router.post('/', verify.user, validate(journalRules), async (req, res) => {
    let text = DOMPurify.sanitize(req.body.text);

    const date = new Date();
    const journalID = getDateID(date, req.user.username);

    // We gotta check if the user already made a journal entry today, if so, do not proceed.
    if(await Journals.findOne({id: journalID}))
        return res.status(409).send({error: `Journal with ID '${journalID} already exists'`});

    let plaintext = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, " ").trim(); // Remove HTML tags to store plaintext variant, and remove any extra spacing.

    // If plaintext is empty, user wrote no meaningful content.
    if(!plaintext)
        text = '<p>Today I wrote nothing :(</p>';

    // Encrypt the text
    let encrypted;
    try {
        const { encryptedGeneratedKey, encryptedGeneratedKeyIV } = req.user;
        const derivedKeyBuffer = Buffer.from(req.derivedKey);
        const generatedKey = cryptoHelper.decrypt(encryptedGeneratedKey, derivedKeyBuffer, encryptedGeneratedKeyIV).toString();

        encrypted = cryptoHelper.encrypt(text, Buffer.from(generatedKey, 'hex'));
    } catch(err) {
        console.log('ERR [POST journals/]:', err);
        return res.status(401).send({error: 'Bad decrypt.'});
    }

    const journal = new Journals({
        id: journalID,
        username: req.user.username,
        date: date.toISOString(),
        richtext: encrypted.ciphertext,
        emoji: req.body.emoji,
        iv: encrypted.iv
    });

    try {
        await journal.save();
        return res.send({message: "Journal was successfully saved!"});
    } 
    catch(err) {
        console.log('ERR [POST journals/]: ', err);
        return res.status(500).send({error: err});
    }
});

// Create a new time capsule entry
router.post('/timecapsule', verify.user, validate(capsuleRules), async (req, res) => {

    const UPPER_YEAR_BOUND = 50; // Only allow capsules 50 years in the future.
    const MAX_PENDING_CAPSULES = 50;

    let {text, emoji, unlock_year, unlock_month, unlock_day} = req.body;
    text = DOMPurify.sanitize(text);

    const pendingCapsules = await Journals.find({username: req.user.username, locked: true});
    if(pendingCapsules.length >= MAX_PENDING_CAPSULES)
        return res.status(400).send({error: `Sorry, but you can only have ${MAX_PENDING_CAPSULES} pending capsules at a time.`});

    const today = new Date();

    // Unlock the capsule at 12am of the selected date (UTC)
    let unlock_date = new Date();
    unlock_date.setUTCFullYear(unlock_year);
    unlock_date.setUTCMonth(unlock_month);
    unlock_date.setUTCDate(unlock_day);
    unlock_date.setUTCHours(0, 0, 0, 0);

    if(unlock_date <= today)
        return res.status(400).send({error: 'Unlock date for a capsule must be in the future'});

    let upper_date_bound = new Date();
    upper_date_bound.setUTCFullYear(upper_date_bound.getUTCFullYear() + UPPER_YEAR_BOUND + 1);
    upper_date_bound.setUTCDate(1);
    upper_date_bound.setUTCMonth(0);
    upper_date_bound.setUTCHours(0, 0, 0, 0);

    if(unlock_date > upper_date_bound)
        return res.status(400).send({error: `Unlock date must be within ${UPPER_YEAR_BOUND} years of the future`});

    const capsuleID = getDateID(unlock_date, req.user.username) + '-capsule';  // Suffix to not conflict with journals made on same day as a capsule.

    if(await Journals.findOne({id: capsuleID}))
        return res.status(409).send({error: `Capsule with ID '${capsuleID} already exists'`});

    let plaintext = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, " ").trim();
    if(!plaintext)
        text = '<p>I have nothing to say to you, future self. Good day.</p>'

    // Encrypt the text
    let encrypted;
    try {
        const { encryptedGeneratedKey, encryptedGeneratedKeyIV } = req.user;
        const derivedKeyBuffer = Buffer.from(req.derivedKey);
        const generatedKey = cryptoHelper.decrypt(encryptedGeneratedKey, derivedKeyBuffer, encryptedGeneratedKeyIV).toString();

        encrypted = cryptoHelper.encrypt(text, Buffer.from(generatedKey, 'hex'));
    } catch(err) {
        console.log('ERR [POST journals/timecapsule]:', err);
        return res.status(401).send({error: 'Bad decrypt.'});
    }

    const capsule = new Journals({
        id: capsuleID,
        username: req.user.username,
        date: unlock_date.toISOString(),
        richtext: encrypted.ciphertext,
        emoji: emoji,
        iv: encrypted.iv,
        is_time_capsule: true,
        created_date: today.toISOString(),
        locked: true,
    });

    try {
        await capsule.save();
        return res.send({message: "Capsule was successfully saved!"});
    } 
    catch(err) {
        console.log('ERR [POST journals/createcapsule]: ', err);
        return res.status(500).send({error: err});
    }
});

// Check if a user has already made a post today
router.get('/check', verify.user, async (req, res) => {
     const found = await Journals.findOne({id: getDateID(new Date(), req.user.username)});
     if(found)
        return res.send(true);
    
    return res.send(false);
});

module.exports = router;