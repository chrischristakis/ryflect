const express = require('express');

module.exports = function() {
    return [express.json({limit: '1mb'}), (err, req, res, next) => {
        // To avoid getting an annoying console.log in the server if the input is badly formatted.
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err)
            return res.status(400).send({ error: err.message }); // Bad request
        next();
    }]
}