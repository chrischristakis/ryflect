const express = require('express');
const router = express.Router();
const Journals = require('../models/Journals.js');
const User = require('../models/User.js');
const { randomUUID, pbkdf2 } = require('crypto'); // for random uuid
const { getDate, getDateID } = require('../utils/utils.js');

// const key = "this is my key!";
// const salt = '23904890';
// // 64 is keylen since sha 512 produces 512 bit keys, so 64*8 bits == 512 bits
// pbkdf2(key, salt, 1000000, 64, 'sha512', (err, derived) => {
//     if(err) throw err;
//     console.log(derived.toString('hex'))
// });

// Get a journal entry with a specified journal ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const found = await Journals.findOne({id: id});
    if(!found)
        return res.status(400).send({error: `No journals with ID: '${id}' found`});
    return res.send(found);
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
    } 
    catch(err) {
        return res.status(500).send({error: err});
    } 

    // Now that we've saved a journal entry to the DB, lets add it to our list of journal entries for the user.
    // We can safely assume no journal entry exists for the day as we checked it earlier.
    await User.updateOne(
        {username: req.body.username}, 
        {
            $push: {
                [`journalIDs.${date.getUTCFullYear()}.ids`]: {dayIndex: 60, id:journalID}
            }
        }
    );
    return res.send({message: "Journal was successfully saved!"});
});

module.exports = router;