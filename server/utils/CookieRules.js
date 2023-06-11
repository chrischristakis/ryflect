const { ENV } = require('./config.js');

const COOKIE_LIFESPAN = 1800 * 1000; //in MS

// ALlows us to submit cookies from different hosts on dev, not on prod though.
module.exports = { 
    token_cookie: (ENV !== 'development')?
        {
            sameSite: 'strict',
            httpOnly: true,
            maxAge: COOKIE_LIFESPAN
        }
        :
        { 
            sameSite: 'none',
            secure: true,
            maxAge: COOKIE_LIFESPAN
        },
    username_cookie: (ENV !== 'development')?
        {
            sameSite: 'lax',
            httpOnly: false,
            secure: true,
            maxAge: COOKIE_LIFESPAN
        }
        :
        { 
            sameSite: 'none',
            httpOnly: false,
            secure: true,
            maxAge: COOKIE_LIFESPAN
        }
};