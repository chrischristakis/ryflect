const dotenv = require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ryflect?directConnection=true',
    JWT_SECRET: process.env.JWT_SECRET
}