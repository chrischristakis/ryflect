const express = require('express');
const router = express.Router();
const Journals = require('../models/Journals.js');
const { randomUUID } = require('crypto'); // for uuid
const { getDate } = require('../utils/utils.js');

// Get a journal entry with a specified ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const found = await Journals.findOne({id: id});
    if(!found)
        return res.status(400).send({error: `No journals with ${id} found`});
    return res.send(found);
});

// Make a new journal entry
router.post('/', async (req, res) => {
    const MAX_TEXT_LEN = 2000;
    const text = req.body.text;

    if(text.length > MAX_TEXT_LEN)
        return res.status(400).send({error: `Text should be less than ${MAX_TEXT_LEN} characters`});

    const journal = new Journals({
        id: randomUUID(),
        date: getDate(),
        text: text
    });

    try {
        const data = await journal.save();
        return res.send({message: "Journal was successfully saved!"});
    } 
    catch(err) {
        return res.status(500).send({error: err});
    } 
});

module.exports = router;