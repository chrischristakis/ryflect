const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
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
    recentJournals: {
        type: [String],
        default: []
    },
    journalIDs: {
        type: Map,
        of: {
            _id: false,
            ids: {
                _id: false,
                type: Map,
                of: String
            }
        },
        default: {}
    }
});

module.exports = mongoose.model('User', userSchema);