const { ENV } = require('./config.js');

// ALlows us to submit cookies from different hosts on dev, not on prod though.
module.exports = (ENV !== 'development')?
    {
        sameSite: true,
        httpOnly: true,
        maxAge: 1800 * 1000 //ms
    }
    :
    { 
        sameSite: 'None',
        secure: true,
        maxAge: 1800 * 1000
    };