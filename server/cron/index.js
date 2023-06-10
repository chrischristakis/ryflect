const cron = require('node-cron');
const { expireVerifications } = require('./ExpireVerifications');

module.exports.beginCrons = () => {
    cron.schedule('* * * * *', expireVerifications);
}