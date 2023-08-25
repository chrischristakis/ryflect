const dotenv = require('dotenv').config();
const crypto = require('crypto');

module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ryflect?directConnection=true',
    JWT_SECRET: process.env.JWT_SECRET,
    WEBAPP_URL: process.env.WEBAPP_URL,
    TEST_EMAIL: process.env.TEST_EMAIL,
    SERVER_SECRET_KEY: crypto.randomBytes(32) // Used to encrypt derived keys that are stored in cookies. Should cycle once a week.
}