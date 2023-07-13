const cron = require('node-cron');
const expireVerifications = require('./ExpireVerifications');
const unlockAndNotifyCapsules = require('./UnlockAndNotifyCapsules');

module.exports.beginCrons = () => {
    cron.schedule('* * * * *', expireVerifications);
    cron.schedule('* * * * *', unlockAndNotifyCapsules);
}