const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    date: { 
        type: String,
        required: true
    },
    plaintext: {
        type: String,
        default: ''
    },
    richtext: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Journal', journalSchema);