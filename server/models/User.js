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
    },
    capsuleIDs: { // Deliberately seperate from JournalIDs for easier parsing.
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