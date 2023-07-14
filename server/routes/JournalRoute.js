const express = require('express');
const router = express.Router();
const Journals = require('../models/Journals.js');
const User = require('../models/User.js');
const { getDate, getDateID, getCurrentDayInYear } = require('../utils/utils.js');
const verify = require('../middleware/verify.js');
const validate = require('../middleware/validate.js');
const { check } = require('express-validator');
const DOMPurify = require('../utils/DOMPurify.js');
const { emojis } = require('../utils/Constants.js');

const MAX_BYTES = 5000; // Max bytes for one journal entry

const journalRules = [
    check('text', 'Submitted text must not be empty').notEmpty()
        .isString().withMessage("Text must be a string")
        .isLength({max: MAX_BYTES}).withMessage(`Journal entry cannot exceed ${MAX_BYTES} characters`),
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

// Get all user's journal IDS through all years
router.get('/', verify.user, async (req, res) => {
    // Transform from a map object to a object
    let idMap = {};
    for(const [key, value] of req.user.journalIDs) {
        idMap[key] = value;
    }

    return res.status(200).send(idMap);
});

// Get a journal entry with a specified journal ID
router.get('/id/:id', verify.user, async (req, res) => {
    const id = req.params.id;

    const found = await Journals.findOne({id: id});
    if(!found)
        return res.status(404).send({error: `No journals with ID: '${id}' found`});

    const usernameInId = found.id.split('-')[0];
    if(usernameInId !== req.user.username)
        return res.status(403).send({error: `You are not authorized to view this content.`});

    if(found.locked) {
        const unlock_date = (found.unlock_date)? new Date(found.unlock_date) : 'null';
        return res.status(403).send({error: `You cannot view this capsule entry yet! Come back on ${getDate(unlock_date)}`});
    }

    return res.send(found);
});

// Get all journal entries in a year
router.get('/year/:year', verify.user, async (req, res) => {

    // Check if the map actually contains and ids for a given year
    if(!req.user.journalIDs.has(req.params.year))
        return res.status(400).send(`No journal entries made in ${req.params.year}`);

    return res.send(req.user.journalIDs.get(req.params.year));
});

// Compile a list of a user's most recent journal entries
router.get('/recents', verify.user, async (req, res) => {
    try {
        const recentIDs = req.user.recentJournals;
        let recents = await Promise.all(recentIDs.map(async (id) => await Journals.findOne({id: id})));

        // If a id is in recents, but the journal was deleted for some reason, just removes null entries.
        // shouldn't really happen outside of dev but whatever.
        recents = recents.filter((obj) => obj); 

        return res.send(recents);
    }
    catch(err) {
        console.log('ERR [GET journals/recents]: ', err);
        return res.status(500).send({error: err});
    }
});

// Save a new journal entry
router.post('/', verify.user, validate(journalRules), async (req, res) => {
    const MAX_RECENTS = 5;

    let text = DOMPurify.sanitize(req.body.text);

    const user = await User.findOne({username: req.user.username});

    const date = new Date();
    const journalID = getDateID(date, req.user.username);

    // We gotta check if the user already made a journal entry today, if so, do not proceed.
    if(await Journals.findOne({id: journalID}))
        return res.status(409).send({error: `Journal with ID '${journalID} already exists'`});

    let plaintext = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, " ").trim(); // Remove HTML tags to store plaintext variant, and remove any extra spacing.

    // If plaintext is empty, user wrote no meaningful content.
    if(!plaintext)
        text = '<p>Today I wrote nothing :(</p>'

    const journal = new Journals({
        id: journalID,
        username: req.user.username,
        date: getDate(date),
        richtext: text,
        emoji: req.body.emoji
    });

    try {
        await journal.save();

        // Append beginning of list, then slice out excess.
        let recents = req.user.recentJournals;
        recents.unshift(journalID);
        recents = recents.slice(0, MAX_RECENTS);

        await User.updateOne(
            {username: req.user.username},
            {
                $set: {
                    recentJournals: recents,
                    [`journalIDs.${date.getUTCFullYear()}.ids.${getCurrentDayInYear(date)}`]: journalID
                }
            }
        );
    
        return res.send({message: "Journal was successfully saved!"});
    } 
    catch(err) {
        console.log('ERR [POST journals/]: ', err);
        return res.status(500).send({error: err});
    }
});

// Create a new time capsule entry
router.post('/timecapsule', verify.user, validate(capsuleRules), async (req, res) => {

    const UPPER_YEAR_BOUND = 100; // Only allow capsules 100 years in the future.
    const MAX_PENDING_CAPSULES = 100;

    let {text, emoji, unlock_year, unlock_month, unlock_day} = req.body;
    text = DOMPurify.sanitize(text);

    const pendingCapsules = await Journals.find({username: req.user.username, locked: true});
    if(pendingCapsules.length >= MAX_PENDING_CAPSULES)
        return res.status(429).send({error: `Sorry, but you can only have ${MAX_PENDING_CAPSULES} pending capsules at one time.`});

    const today = new Date();

    let unlock_date = new Date();
    unlock_date.setUTCFullYear(unlock_year);
    unlock_date.setUTCMonth(unlock_month);
    unlock_date.setUTCDate(unlock_day);

    if(unlock_date <= today)
        return res.status(400).send({error: 'Unlock date for a capsule must be in the future'});

    let upper_date_bound = new Date();
    upper_date_bound.setUTCFullYear(upper_date_bound.getUTCFullYear() + UPPER_YEAR_BOUND);

    if(unlock_date > upper_date_bound)
        return res.status(400).send({error: `Unlock date must be within ${UPPER_YEAR_BOUND} years of the future`});

    const capsuleID = getDateID(unlock_date, req.user.username) + '-capsule';  // Suffix to not conflict with journals made on same day as a capsule.

    if(await Journals.findOne({id: capsuleID}))
        return res.status(409).send({error: `Capsule with ID '${capsuleID} already exists'`});


    let plaintext = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, " ").trim();
    if(!plaintext)
        text = '<p>I have nothing to say to you, future self. Good day.</p>'

    const capsule = new Journals({
        id: capsuleID,
        username: req.user.username,
        date: getDate(today),
        richtext: text,
        emoji: emoji,
        unlock_date: unlock_date,
        locked: true
    });

    try {
        await capsule.save();
        await User.updateOne(
            {username: req.user.username},
            {
                $set: { [`capsuleIDs.${unlock_date.getUTCFullYear()}.ids.${getCurrentDayInYear(unlock_date)}`]: capsuleID }
            }
        );
    
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