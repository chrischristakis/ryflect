const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true 
    },
    date: { 
        type: Date,
        required: true
    },
    richtext: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        default: '📕'
    },
    iv: {
        type: String,
        required: true
    },

    // Below are only for time capsule entries.
    is_time_capsule: {
        type: Boolean,
        default: false
    },
    created_date: {
        type: Date,
        required: false,
    },
    locked: {
        type: Boolean,
        required: false
    }
});

module.exports = mongoose.model('Journal', journalSchema);