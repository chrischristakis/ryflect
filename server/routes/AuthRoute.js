const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const { JWT_SECRET } = require('../utils/config.js');

// WILL NEED THIS WHEN REGISTERING LATER FOR ENCRYPTION
// const key = "this is my key!";
// const salt = '23904890';
// // 64 is keylen since sha 512 produces 512 bit keys, so 64*8 bits == 512 bits
// pbkdf2(key, salt, 1000000, 64, 'sha512', (err, derived) => {
//     if(err) throw err;
//     console.log(derived.toString('hex'))
// });

// Login with credentials and then return a JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password)
        return res.status(400).send({error: "Missing body fields"});

    // Note that the user can submit either username or email to login.
    const user = await User.findOne({
        $or: [  // $or lets us match either on username or email, or both.
            {username: username}, 
            {email: username}
        ]
    });
    if(!user)
        return res.status(400).send({error: "User cannot be found"});

    // Compare password to stored hashed/salted password
    try {
        if(!await bcrypt.compare(password, user.password))
            return res.status(401).send({error: "Invalid password"});
    }
    catch(err) {
        return res.status(500).send({error: err});
    }

    const token = jwt.sign({username: user.username}, JWT_SECRET, { expiresIn: '1800s' });
    return res.send(token);
});

// Register a new user
router.post('/register', async (req, res) => {

    // Check if username OR email already exists, if so, do not proceed.
    const found = await User.findOne({
        $or: [
            {username: req.body.username}, 
            {email: req.body.email}
        ]
    });
    if(found)
        return res.status(400).send({error: "User already exists"});

    // Hash password before storing in db.
    let hash;
    try {
        const salt = await bcrypt.genSalt();
        hash = await bcrypt.hash(req.body.password, salt);
    }
    catch(err) {
        return res.status(500).send({error: err});
    }

    const date = new Date();
    const user = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email
    });
 
    const token = jwt.sign({username: req.body.username}, JWT_SECRET, { expiresIn: '1800s' });
    
    // Commit new user to db
    try {
        await user.save();
        return res.send(token);
    } 
    catch(err) {
        return res.status(500).send({error: err});
    } 
});

module.exports = router;