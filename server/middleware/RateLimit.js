const LimitTable = require('../models/LimitTable.js');

// I need manual rate limiting to only limit SUCCESSFUL registrations to a certain amount per day,
// NGinx doesn't seem to provide it, at least not intuitively. So we forward the user's address
// to temporarily store into this table to track consecutive registrations.

module.exports =  {
    RateLimit: (route, max, ttlMs) => {
        return async (req, res, next) => {
            const address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if(!address)
                return res.status(401).send({error: "Unauthorized, missing 'x-forwarded-for' or IP header"});

            try {
                const found = await LimitTable.findOne({address: address, route: route});
                if(found) {
                    if(found.attempts >= max) 
                        return res.status(429).send({error: "You've exceeded the registration limit. Please try again in 24 hours."});

                    next();
                }
                else {  // Create a new entry in the limit table if it doesn't exist
                    let expiry = new Date();
                    expiry.setUTCMilliseconds(ttlMs);
                    const entry = new LimitTable({
                        address: address,
                        attempts: 0,
                        expires: expiry,
                        route: route
                    });
                    await entry.save();
                    next();
                }
            }
            catch(err) {
                console.log('ERR [RateLimit.js]: ', err);
                return res.status(500).send({error: err});
            }
        };
    },

    incrementRateAttempts: async (address, route) => {
        try {
            await LimitTable.updateOne({address: address, route: route}, {
                            $inc: { attempts: 1 }
            });
        }
        catch(err) {
            throw err;
        }
    }

};