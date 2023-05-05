const express = require('express');
const router = express.Router();
const Journals = require('../models/Journals.js');
const User = require('../models/User.js');
const { randomUUID, pbkdf2 } = require('crypto'); // for random uuid
const { getDate, getDateID, getCurrentDayInYear } = require('../utils/utils.js');

// const key = "this is my key!";
// const salt = '23904890';
// // 64 is keylen since sha 512 produces 512 bit keys, so 64*8 bits == 512 bits
// pbkdf2(key, salt, 1000000, 64, 'sha512', (err, derived) => {
//     if(err) throw err;
//     console.log(derived.toString('hex'))
// });

// Get a journal entry with a specified journal ID
router.get('/id/:id', async (req, res) => {
    const id = req.params.id;

    const found = await Journals.findOne({id: id});
    if(!found)
        return res.status(400).send({error: `No journals with ID: '${id}' found`});
    return res.send(found);
});

// Get all journal entries in a year
router.get('/year/:year', async (req, res) => {
    // Let us first get the journal IDs in a given year
    const user = await User.findOne({username: req.body.username});
    if(!user)
        return res.status(400).send("Username does not exist");

    // Check if the map actually contains and ids for a given year
    if(!user.journalIDs.has(req.params.year))
        return res.status(400).send(`No journal entries made in ${req.params.year}`);

    return res.send(user.journalIDs.get(req.params.year));
});

// Compile a list of our most recent journal entries
router.get('/recents', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(!user)
        return res.status(400).send("Username does not exist");

    return res.send(user.recentJournals);
});

// Save a new journal entry
router.post('/', async (req, res) => {
    const MAX_TEXT_BYTES = 4;
    const text = req.body.text;
    const byteSize = new Blob([text]).size; // Allows us to query how many bytes are in a given string

    if(byteSize > MAX_TEXT_BYTES)
        return res.status(400).send({error: `Text should be less than ${MAX_TEXT_BYTES} characters`});

    // Make sure username exists, we'll use this user later
    const user = await User.findOne({username: req.body.username});
    if(!user)
        return res.status(400).send({error: "Username does not exist"});

    const date = new Date();
    const journalID = getDateID(date, req.body.username);

    // We gotta check if the user already made a journal entry today, if so, do not proceed.
    if(await Journals.findOne({id: journalID}))
        return res.status(400).send({error: `Journal with ID '${journalID} already exists'`});

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
            {username: req.body.username}, 
            {
                $set: {
                    [`journalIDs.${date.getUTCFullYear()}.ids.${getCurrentDayInYear(date)}`]: journalID
                }
            }
        );

        // Now, just save it into our recent journals list
        // Append beginning of list, then slice out excess.
        const MAX_RECENTS = 2;
        let recents = user.recentJournals;
        recents.unshift(journalID);
        recents = recents.slice(0, MAX_RECENTS);

        await User.updateOne(
            {username: req.body.username},
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