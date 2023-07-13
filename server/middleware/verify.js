const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config.js');
const User = require('../models/User.js');

module.exports = {

    user: async (req, res, next) => {
        
        const token = req.cookies['jwt'];
        if(!token)
            return res.status(401).send({error: "Missing auth cookie"});

        try {
            // Verify jwt and store the payload of our token in the request
            const body = jwt.verify(token, JWT_SECRET);
            req.token_info = body;

            // Make sure username is still valid (Edge case but its here.)
            const user = await User.findOne({username: body.username});
            if(!user)
                return res.status(404).send({error: "Username does not exist"});
            
            req.user = user;
        }
        catch(err) {
            if(err.message)
                return res.status(401).send({error: err.message});
            return res.status(500).send({error: err});
        };

        next();
    }

};