const mongoose = require('mongoose');

const limitTableSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default : 0
    },
    expires: {
        type: Date,
        required: true
    }
    
}, { collection: 'LimitTable' });

// Index will expire a document once its expiry date is hit.
limitTableSchema.index({ "expires": 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('LimitTable', limitTableSchema);