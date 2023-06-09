const express = require('express');
const router = express.Router();
const Journals = require('../models/Journals.js');
const User = require('../models/User.js');
const { getDate, getDateID, getCurrentDayInYear } = require('../utils/utils.js');
const verify = require('../middleware/verify.js');
const validate = require('../middleware/validate.js');
const { check } = require('express-validator');

const MAX_BYTES = 5000; // Max bytes for one journal entry

const journalRules = [
    check('text')
        .isString().withMessage("Text must be a string")
        .isLength({max: MAX_BYTES}).withMessage(`Journal entry cannot exceed ${MAX_BYTES} characters`)
        .trim().escape(),
];

// Get all user's journal IDS through all years
router.get('/', verify.user, async (req, res) => {
    const user = await User.findOne({username: req.userinfo.username});
    if(!user)
        return res.status(400).send({error: `User '${req.userinfo.username}' does not exist`});

    // Transform from a map object to a object
    let idMap = {};
    for(const [key, value] of user.journalIDs) {
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

    // You're not allowed to view other people's journals
    const usernameInId = found.id.split('-')[0];
    if(usernameInId !== req.userinfo.username)
        return res.status(403).send({error: `You are not authorized to view this content.`});

    return res.send(found);
});

// Get all journal entries in a year
router.get('/year/:year', verify.user, async (req, res) => {
    
    const user = await User.findOne({username: req.userinfo.username});
    if(!user)
        return res.status(400).send({error: `User '${req.userinfo.username}' does not exist`});

    // Check if the map actually contains and ids for a given year
    if(!user.journalIDs.has(req.params.year))
        return res.status(400).send(`No journal entries made in ${req.params.year}`);

    return res.send(user.journalIDs.get(req.params.year));
});

// Compile a list of our most recent journal entries
router.get('/recents', verify.user, async (req, res) => {
    const user = await User.findOne({username: req.userinfo.username});
    if(!user)
        return res.status(400).send("Username does not exist");

    return res.send(user.recentJournals);
});

// Save a new journal entry
router.post('/', verify.user, validate(journalRules), async (req, res) => {
    const MAX_RECENTS = 5;

    const text = req.body.text;

    // Make sure username exists, we'll use this user later
    const user = await User.findOne({username: req.userinfo.username});
    if(!user)
        return res.status(400).send({error: "Username does not exist"});

    const date = new Date();
    const journalID = getDateID(date, req.userinfo.username);

    // We gotta check if the user already made a journal entry today, if so, do not proceed.
    if(await Journals.findOne({id: journalID}))
        return res.status(409).send({error: `Journal with ID '${journalID} already exists'`});

    const journal = new Journals({
        id: journalID,
        date: getDate(date),
        text: text
    });

    try {
        await journal.save();

        // Now that we've saved a journal entry to the DB, lets add it to our list of journal entries in the user document.
        // We can safely assume no journal entry exists for the day as we checked this on our ID earlier
        await User.updateOne(
            {username: req.userinfo.username}, 
            {
                $set: {
                    [`journalIDs.${date.getUTCFullYear()}.ids.${getCurrentDayInYear(date)}`]: journalID
                }
            }
        );

        // Now, just save it into our recent journals list
        // Append beginning of list, then slice out excess.
        let recents = user.recentJournals;
        recents.unshift(journalID);
        recents = recents.slice(0, MAX_RECENTS);

        await User.updateOne(
            {username: req.userinfo.username},
            {
                $set: {
                    recentJournals: recents
                }
            }
        );
    
        return res.send({message: "Journal was successfully saved!"});
    } 
    catch(err) {
        return res.status(500).send({error: err});
    }
});

module.exports = router;