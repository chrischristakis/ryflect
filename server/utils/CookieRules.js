const { ENV } = require('./config.js');

// ALlows us to submit cookies from different hosts on dev, not on prod though.
module.exports = { 
    token_cookie: (ENV !== 'development')?
        {
            sameSite: 'strict',
            httpOnly: true,
            maxAge: 1800 * 1000 //ms
        }
        :
        { 
            sameSite: 'none',
            secure: true,
            maxAge: 1800 * 1000
        }
}