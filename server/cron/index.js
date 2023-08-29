const cron = require('node-cron');
const expireVerifications = require('./ExpireVerifications');
const unlockAndNotifyCapsules = require('./UnlockAndNotifyCapsules');
const rotateServerKey = require('./RotateServerKey');

module.exports.beginCrons = () => {
    cron.schedule('* * * * *', expireVerifications); // Per minute
    cron.schedule('0 * * * *', unlockAndNotifyCapsules); // Once an hour
    cron.schedule('0 0 * * 0', rotateServerKey); // Once a week, 12am Sunday
}