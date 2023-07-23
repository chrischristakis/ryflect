const Journals = require('../models/Journals.js');
const { sendCapsuleNotification } = require('../utils/Mailhelper.js');
const { getDate } = require('../utils/utils.js');

module.exports = async () => {
    const date = new Date();
    try {
        const toUnlock = await Journals.find({date: {$lte: date}, locked: true, is_time_capsule: true}); 
        const idsToUnlock = toUnlock.map((e) => e.id);

        const updateResult = await Journals.updateMany({id: {$in: idsToUnlock}}, {$set: {locked: false}});

        /* Gather emails based on username, resulting in an object like this:
            [
                {date: '...', email: '...'},
                {date: '...', email: '...'}
            ]
        */
        const dateEmailPairs = await Journals.aggregate([
            {
                $match: {
                    id: {$in: idsToUnlock } 
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'username',
                    foreignField: 'username',
                    as: 'user'
                }
            },
            {
                $project: {
                          _id: 0,
                          created_date: 1,
                          email: { $arrayElemAt: ['$user.email', 0] }
                }
            }
        ]);
        
        let successfulEmails = 0;
        await Promise.all(dateEmailPairs.map(async ({created_date, email}) => {
            try {
                await sendCapsuleNotification(email, getDate(created_date));
                console.log('[CRON UnlockAndNotify.js]: Successfuly sent time capsule email to: "' + email + '"!');
                successfulEmails++;
            }
            catch(err) {
                console.log('[ERR UnlockAndNotify.js]: Could not send email to "' + email + '": ', err);
            }
        }));

        if(updateResult.modifiedCount > 0 || successfulEmails > 0)
            console.log("[CRON]: "+ updateResult.modifiedCount + " capsules have been unlocked, and " + successfulEmails + " emails have been sent.");
    } catch(err) {
        console.log('[ERR in UnlockAndNotify.js]: ', err);
    }
};