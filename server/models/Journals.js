const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    date: { 
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Journal', journalSchema);