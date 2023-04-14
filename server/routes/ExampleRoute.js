const express = require('express');
const router = express.Router();
const ExampleModel = require('../models/Example.js');
const Example = require('../models/Example.js');

router.get('/', async (req, res) => {
    const examples = await ExampleModel.find({}).exec();
    if(!examples)
        return res.status(400).send("Cannot retrieve Example documents");
    return res.send(examples);
});

router.post('/', async (req, res) => {
    const example = new Example({
        name: req.body.name,
        age: req.body.age
    });
   try {
    const data = await example.save();
    return res.send("Saved Example document");
   } 
   catch(err) {
    return res.status(500).send(err);
   } 
});

module.exports = router;