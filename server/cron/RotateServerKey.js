let { setServerSecretKey } = require('../utils/config.js');
const crypto = require('crypto');

module.exports = () => {
    setServerSecretKey(crypto.randomBytes(32));
    console.log('[CRON RotateServerKey.js]: Server key has changed.');
}