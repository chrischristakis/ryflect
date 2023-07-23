const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    urlID: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    hasResentEmail: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Verification', verificationSchema);