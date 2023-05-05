const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Journals = require('../models/Journals.js');

// Register a new user
router.post('/register', async (req, res) => {

    // Check if username OR email already exists, if so, do not proceed.
    const found = await User.findOne({
        $or: [  // $or lets us match either on username or email, or both.
            {username: req.body.username}, 
            {email: req.body.email}
        ]
    });
    if(found)
        return res.status(400).send({error: "User already exists"});

    const date = new Date();
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        journalIDs: {
            [date.getUTCFullYear()]: {
                ids: [],
                totalDaysInYear: 365
            } 
        } 
    });
 
    try {
        const data = await user.save();
        return res.send({message: "User was successfully registered!"});
    } 
    catch(err) {
        return res.status(500).send({error: err});
    } 
});

module.exports = router;