const Journals = require('../models/Journals.js');

module.exports = async () => {
    const date = new Date();
    try {
        const toUnlock = await Journals.find({unlock_date: {$gte: date}, locked: true});
        
        const idsToUnlock = toUnlock.map((e) => e.id).filter((capsuleID) => capsuleID);

        const result = await Journals.updateMany({id: {$in: idsToUnlock}}, {$set: {locked: false}});
        if(result.modifiedCount > 0)
            console.log(result.modifiedCount + " capsules have been unlocked!");
    } catch(err) {
        console.log('[ERROR in UnlockAndNotify.js]: ', err);
    }
};
