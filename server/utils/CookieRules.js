const { ENV } = require('./config.js');
const { TOKEN_LIFESPAN } = require('./Constants.js');

const COOKIE_LIFESPAN = TOKEN_LIFESPAN * 1000; //in MS
const token_cookie = (ENV !== 'development')?
    {
        sameSite: 'strict',
        httpOnly: true,
        maxAge: COOKIE_LIFESPAN
    }
    :
    { 
        sameSite: 'none',
        secure: false,
        maxAge: COOKIE_LIFESPAN
    }

// Allows us to submit cookies from different hosts on dev, not on prod though.
module.exports = { 
    token_cookie
};