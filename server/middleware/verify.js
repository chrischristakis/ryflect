const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config.js');

module.exports = {

    user: (req, res, next) => {
        
        const token = req.headers['auth'];
        if(!token)
            return res.status(401).send({error: "Missing auth header"});

        try {
            // Verify jwt and store the payload of our token in the request
            const body = jwt.verify(token, JWT_SECRET);
            req.userinfo = body; 
        }
        catch(err) {
            if(err.message)
                return res.status(401).send({error: err.message});
            return res.status(500).send({error: err});
        };

        next();
    }

};