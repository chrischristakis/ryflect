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
    recentJournals: [{
        type: String,
        default: []
    }],
    email: {
        type: String,
        unique: true,
        required: true
    },
    journalIDs: {
        type: Map,
        required: true,
        of: {
            _id: false,  // Removes _id field for schemas (This is implicitly a sub-schema)
            ids: [{
                _id: false,
                dayIndex: {
                    type: Number,
                    required: true
                },
                id: {
                    type: String,
                    required: true
                }
            }],
            totalDaysInYear: {
                type: Number,
                required: true
            }
        }
    }
});

module.exports = mongoose.model('User', userSchema);