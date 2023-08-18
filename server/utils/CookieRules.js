const { ENV } = require('./config.js');
const { TOKEN_LIFESPAN } = require('./Constants.js');

const COOKIE_LIFESPAN = TOKEN_LIFESPAN * 1000; //in MS

// ALlows us to submit cookies from different hosts on dev, not on prod though.
module.exports = { 
    token_cookie: (ENV !== 'development')?
        {
            sameSite: 'lax',
            httpOnly: true,
            maxAge: COOKIE_LIFESPAN
        }
        :
        { 
            sameSite: 'none',
            secure: true,
            maxAge: COOKIE_LIFESPAN
        }
};