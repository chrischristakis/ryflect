const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check } = require('express-validator');
const validate = require('../middleware/validate.js');
const User = require('../models/User.js');
const { JWT_SECRET } = require('../utils/config.js');

const loginRules = [
    check('username')
        .isLength({min: 1}).withMessage("Username must be at least 1 charater long")
        .matches('^[A-Za-z0-9]+$').withMessage("Username must be within A-Z, a-z, 0-9")
        .trim().escape(),
    check('password')
        .isLength({min: 6}).withMessage("Password must be at least 6 charaters long")
        .trim().escape()
];

const registerRules = [
    check('email', 'Email must be valid').isEmail().trim().escape().normalizeEmail()
].concat(loginRules);

// Login with credentials and then return a JWT
router.post('/login', validate(loginRules), async (req, res) => {
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
        return res.status(404).send({error: "User cannot be found"});

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
router.post('/register', validate(registerRules), async (req, res) => {
    const {username, email, password} = req.body;

    // Check if username OR email already exists, if so, do not proceed.
    const foundUsername = await User.findOne({ username: username });
    const foundEmail = await User.findOne({ email: email });
    let errorBody = {};
    if(foundUsername)
        errorBody['username'] = ["Username already taken"];
    if(foundEmail)
        errorBody['email'] = ["Email already registered"];
    
    if(Object.keys(errorBody).length !== 0)
        return res.status(409).send({error: errorBody});

    // Hash password before storing in db.
    let hash;
    try {
        const salt = await bcrypt.genSalt();
        hash = await bcrypt.hash(password, salt);
    }
    catch(err) {
        return res.status(500).send({error: err});
    }

    const date = new Date();
    const user = new User({
        username: username,
        password: hash,
        email: email
    });
 
    const token = jwt.sign({username: username}, JWT_SECRET, { expiresIn: '1800s' });
    
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