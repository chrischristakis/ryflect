const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, param } = require('express-validator');
const validate = require('../middleware/validate.js');
const { RateLimit, incrementRateAttempts } = require('../middleware/RateLimit.js');
const User = require('../models/User.js');
const Verification = require('../models/Verification.js');
const { JWT_SECRET } = require('../utils/config.js');
const crypto = require('crypto');
const mailHelper = require('../utils/Mailhelper.js');
const { token_cookie } = require('../utils/CookieRules.js');

const loginRules = [
    check('username', 'Enter a username').notEmpty()
        .isString().withMessage("Username must be a string")
        .escape(),
    check('password', 'Enter a password').notEmpty()
        .isString().withMessage("Password must be a string")
        .escape()
];

const registerRules = [
    check('username', 'Enter a username').notEmpty()
        .isString().withMessage("Username must be a string")
        .isLength({max: 50}).withMessage("Username should be less than 20 characters")
        .matches('^[A-Za-z0-9]+$').withMessage("Username must be within A-Z, a-z, 0-9")
        .escape(),
    check('password')
        .isString().withMessage("Password must be a string")
        .isLength({min: 6}).withMessage("Password must be at least 6 charaters long")
        .isLength({max: 100}).withMessage("Password should be less than 100 characters")
        .escape(),
    check('email', 'Email must be valid').isEmail()
        .isLength({max: 100}).withMessage("Email should be less than 100 characters")
        .normalizeEmail()
].concat(loginRules);

const verificationRules = [
    param('id').isString().withMessage("ID must be a string")
        .trim().escape()
];

function signAccessToken(username, email) {
    return jwt.sign({username: username, email: email}, JWT_SECRET, { expiresIn: '1800s' });
}

// Login with credentials and then return a JWT
router.post('/login', validate(loginRules), async (req, res) => {
    const { username, password } = req.body;

    // Note that the user can submit either username or email to login.
    const user = await User.findOne({
        $or: [  // $or lets us match either on username or email, or both.
            {username_lower: username.toLowerCase()}, 
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
        return res.status(401).send({error: "User has not been activated yet. Check your inbox for a verification email."});
    }

    const token = signAccessToken(user.username, user.email);

    res.cookie("jwt", token, token_cookie);

    return res.send(token);
});

// Register a new user (Allow 5 registrations per 24 hours)
router.post('/register', validate(registerRules), RateLimit('/auth/register', 5, 1000 * 60 * 60 * 24), async (req, res) => {
    const {username, email, password} = req.body;

    // Check if username OR email already exists, if so, do not proceed.
    const foundUsername = await User.findOne({ username_lower: username.toLowerCase() });
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
        username_lower: username.toLowerCase(),
        password: hash,
        active: false,
        email: email
    });
 
    const token = signAccessToken(username, email);

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
        await mailHelper.sendVerification(email, verificationID);
        await incrementRateAttempts(req.headers['x-forwarded-for'] || req.socket.remoteAddress, '/auth/register');
        return res.send(verificationID);
    }
    catch(err) {
        console.log('ERR [POST auth/register]:', err);
        return res.status(500).send({error: 'Something went wrong.'});
    }
});

// Resend the email, limited to once, since we're using a servide to send emails.
router.get('/resend/:id', validate(verificationRules), async (req, res) => {
    const id = req.params.id;

    const entry = await Verification.findOne({ urlID: id });
    if(!entry)
        return res.status(404).send({error: 'Could not find this ID pending for verification, try registering again.'});

    if(entry.hasResentEmail) 
        return res.status(429).send({error: 'You have already resent an email.'});

    let email;
    try {
        // Verify jwt and store the payload of our token in the request
        const body = jwt.verify(entry.token, JWT_SECRET);
        email = body.email;
    }
    catch(err) {
        console.log('ERR [GET auth/resend/:id]:', err);
        return res.status(500).send({error: err});
    }

    try {
        const response = await mailHelper.sendVerification(email, entry.urlID);
        await Verification.updateOne({urlID: id}, { $set: { hasResentEmail: true } })
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

    if(!(await User.findOne({username_lower: decoded.username.toLowerCase()})))
        return res.status(404).send('User not found, please try registering again.')

    try {
        await User.updateOne({username_lower: decoded.username.toLowerCase()}, {active: true});
        await Verification.deleteOne({urlID: id});
    }
    catch(err) {
        console.log('ERR [GET auth/verify/:id]:', err);
        return res.status(500).send({error: err.message});
    }

    res.cookie("jwt", entry.token, token_cookie);

    res.send(entry.token);
});

router.get('/ping', (req, res) => {
    // I don't want an error to show up in the browser console if the user isn't authed on the ping route, so instead
    // of sending back a 401, if they aren't authed we're just sending back false.

    const token = req.cookies['jwt'];
    if(!token)
        return res.send({auth: false})

    try {
        const body = jwt.verify(token, JWT_SECRET);
        return res.send({auth: true, username: body.username});
    }
    catch(err) {
        if(err.message)
            return res.send({auth: false});
        return res.status(500).send({error: err});
    };
});

router.post('/logout', (req, res) => {

    // Clear access token and refresh token
    res.cookie("jwt", '', {...token_cookie, maxAge: 0});
    return res.send('Logged out');
});

module.exports = router;