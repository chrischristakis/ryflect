const jwt = require('jsonwebtoken');
const { JWT_SECRET, getServerSecretKey } = require('../utils/config.js');
const { token_cookie } = require('../utils/CookieRules.js');
const User = require('../models/User.js');
const cryptoHelper = require('../utils/CryptoHelper.js');

module.exports = {

    user: async (req, res, next) => {
        
        const token = req.cookies['session']?.jwt;
        const encryptedDerivedKey = req.cookies['session']?.encryptedDerivedKey;
        if(!token || !encryptedDerivedKey) {
            res.cookie("session", '', {...token_cookie, maxAge: 0});
            return res.status(401).send({error: "Missing auth cookie"});
        }

        try {
            // Verify jwt and store the payload of our token in the request
            const body = jwt.verify(token, JWT_SECRET);
            
            // Make sure username is still valid (Edge case but its here.)
            const user = await User.findOne({username: body.username});
            if(!user) {
                res.cookie("session", '', {...token_cookie, maxAge: 0});
                return res.status(404).send({error: "Username does not exist"});
            } 

            req.token_info = body;
            req.user = user;
        }
        catch(err) {
            res.cookie("session", '', {...token_cookie, maxAge: 0});
            if(err.message)
                return res.status(401).send({error: err.message});
            return res.status(500).send({error: err});
        };

        // Try decrypted the encrypted derived key. If it changed since cookie was issued, we unauth the user and force them to re-log.
        try {
            const decryptedDerivedKey = cryptoHelper.decrypt(encryptedDerivedKey.cipher, getServerSecretKey(), encryptedDerivedKey.iv);
            req.derivedKey = decryptedDerivedKey;
        } 
        catch(err) {
            res.cookie("session", '', {...token_cookie, maxAge: 0});
            return res.status(401).send({error: 'Session invalid, please reauthenticate.'});
        }

        next();
    }
};