const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
    policyName: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    premiumAmount: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // Assuming the duration is in years
        required: true
    }
});

module.exports = mongoose.model('Policy', PolicySchema);
