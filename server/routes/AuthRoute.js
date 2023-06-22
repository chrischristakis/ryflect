const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, param } = require('express-validator');
const validate = require('../middleware/validate.js');
const User = require('../models/User.js');
const Verification = require('../models/Verification.js');
const { JWT_SECRET, TEST_EMAIL } = require('../utils/config.js');
const crypto = require('crypto');
const mailHelper = require('../utils/Mailhelper.js');
const { token_cookie, username_cookie } = require('../utils/CookieRules.js');

const loginRules = [
    check('username')
        .isLength({min: 1}).withMessage("Username must be at least 1 charater long")
        .matches('^[A-Za-z0-9]+$').withMessage("Username must be within A-Z, a-z, 0-9")
        .escape(),
    check('password')
        .isLength({min: 6}).withMessage("Password must be at least 6 charaters long")
        .escape()
];

const registerRules = [
    check('email', 'Email must be valid').isEmail().trim().escape().normalizeEmail()
].concat(loginRules);

const verificationRules = [
    param('id').isString()
        .trim().escape()
];

// Login with credentials and then return a JWT
router.post('/login', validate(loginRules), async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password)
        return res.status(400).send({error: "Missing body fields.", fields:['username', 'password']});

    // Note that the user can submit either username or email to login.
    const user = await User.findOne({
        $or: [  // $or lets us match either on username or email, or both.
            {username: username}, 
            {email: username}
        ]
    });
    if(!user)
        return res.status(404).send({error: "User '" + username + "' cannot be found", fields:['username']});

    // Compare password to stored hashed/salted password
    try {
        if(!await bcrypt.compare(password, user.password))
            return res.status(401).send({error: "Invalid password", fields:['password']});
    }
    catch(err) {
        console.log('ERR [POST auth/login]:', err);
        return res.status(500).send({error: err});
    }

    // Check if user has verified their email yet
    if(!user.active) {
        return res.status(401).send({error: "User has not been activated yet. Check your email for a verification"});
    }

    const token = jwt.sign({username: user.username}, JWT_SECRET, { expiresIn: '1800s' });

    res.cookie("jwt", token, token_cookie);
    res.cookie("username", user.username, username_cookie);

    return res.send(token);
});

// Register a new user
router.post('/register', validate(registerRules), async (req, res) => {
    const {username, email, password} = req.body;

    // Check if username OR email already exists, if so, do not proceed.
    const foundUsername = await User.findOne({ username: username });
    const foundEmail = await User.findOne({ email: email });

    let errs = [];
    let fields = [];
    if(foundUsername) {
        errs.push('Username already taken'); 
        fields.push('username');
    }
    if(foundEmail) {
        errs.push('Email already in use'); 
        fields.push('email');
    }

    if(errs.length > 0)
        return res.status(409).send({error: errs, fields: fields});

    // Hash password before storing in db.
    let hash;
    try {
        const salt = await bcrypt.genSalt();
        hash = await bcrypt.hash(password, salt);
    }
    catch(err) {
        console.log('ERR [POST auth/register]:', err);
        return res.status(500).send({error: err});
    }

    const date = new Date();
    const user = new User({
        username: username,
        password: hash,
        active: false,
        email: email
    });
 
    const token = jwt.sign({username: username}, JWT_SECRET, { expiresIn: '1800s' });

    // Generate random ID for email verirification, make sure its not taken (unikely)
    let verificationID = crypto.randomBytes(16).toString('hex');
    while(await Verification.findOne({urlID: verificationID}))
        verificationID = crypto.randomBytes(16).toString('hex');

    const verification = new Verification({
        urlID: verificationID,
        token: token
    });
    
    // Commit new user to db and verification
    try {
        await verification.save();
        await user.save();
    } 
    catch(err) {
        console.log('ERR [POST auth/register]:', err);
        return res.status(500).send({error: err});
    } 

    // Finally, send an email to the user to verify.
    try {
        await mailHelper.sendVerification(TEST_EMAIL, verificationID);
        return res.send(verificationID);
    }
    catch(err) {
        console.log('ERR [POST auth/register]:', err);
        return res.status(500).send({error: 'Something went wrong.'});
    }
});

// Resend the email.
router.get('/resend/:id', validate(verificationRules), async (req, res) => {
    const id = req.params.id;

    const entry = await Verification.findOne({ urlID: id });
    if(!entry)
        return res.status(404).send({error: 'Could not find this ID pending for verification, try registering again.'});

    try {
        // TODO: CHANGE TEST EMAIL WITH THE USER'S EMAIL!
        const response = await mailHelper.sendVerification(TEST_EMAIL, entry.id);
        return res.send(response);
    }
    catch(err) {
        console.log('ERR [GET auth/resend/:id]:', err);
        return res.status(500).send({error: err});
    }
});

// This verifies a link sent in an email for a user's new account to be registered
// Once someone visits the link, the account is activated and it returns the token to log them in.
router.get('/verify/:id', validate(verificationRules), async (req, res) => {
    const id = req.params.id;

    const entry = await Verification.findOne({ urlID: id });
    if(!entry)
        return res.status(404).send({error: 'Could not find this pending ID for verification, try registering again.'});

    let decoded;
    try {
        decoded = jwt.verify(entry.token, JWT_SECRET);
    }
    catch(err) {
        return res.status(401).send('JWT expired, try registering again');
    }

    if(!(await User.findOne({username: decoded.username})))
        return res.status(404).send('User not found, please try registering again.')

    try {
        await User.updateOne({username: decoded.username}, {active: true});
        await Verification.deleteOne({urlID: id});
    }
    catch(err) {
        console.log('ERR [GET auth/verify/:id]:', err);
        return res.status(500).send({error: err.message});
    }

    res.cookie("jwt", entry.token, token_cookie);
    res.cookie("username", decoded.username, username_cookie);

    res.send(entry.token);
});

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('username');
    return res.send('Logged out');
});

module.exports = router;