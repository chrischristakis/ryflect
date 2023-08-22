const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    username_lower: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    encryptedGeneratedKey: {
        type: String,
        required: true
    },
    encryptedGeneratedKeyIV: {
        type: String,
        required: true
    },
    derivedKeySalt : {
        type: String,
        required: true
    },
    recentJournals: {
        type: [String],
        default: []
    },
    active: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);