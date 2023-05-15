const { validationResult } = require('express-validator');

// Use express validator to run on our defined rules as middleware
module.exports = (req, res, next) => {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty())
            return res.status(400).send({error: validationErrors.array()});

        next();
    };