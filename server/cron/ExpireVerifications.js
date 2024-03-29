const User = require('../models/User.js');
const Verification = require('../models/Verification.js');

// How many minutes a verification should be valid for
const LIFESPAN_MINS = 15;

// Return a date object threshold minutes in the past.
function getExpiryThresholdDate(threshold) {
    let d = new Date();
    d.setMinutes(d.getMinutes() - threshold);
    return d;
}

module.exports = async () => {
    let expired = 0;
    const expiryThreshold = getExpiryThresholdDate(LIFESPAN_MINS);

    try {
        // Return users and verifications that are inactive, and were created >= LIFESPAN_MINS ago.
        const usersToExpire = await User.deleteMany({active: false, created: {$lte: expiryThreshold}});
        const verificationsToExpire = await Verification.deleteMany({created: {$lte: expiryThreshold}});
        if(verificationsToExpire.deletedCount + verificationsToExpire.deletedCount > 0)
            console.log(`[CRON ExpireVerifications]: Num of expired Verifications: ${verificationsToExpire.deletedCount} / Users: ${usersToExpire.deletedCount}`);
    }
    catch(err) {
        console.log(err);
    }
}