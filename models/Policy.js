const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
    policyName: {
        type: String,
        required: [true, "Please provide a policy name."],
        unique: true
    },
    totalAmount: {
        type: Number,
        required: [true, "Please enter the total sum assured."]
    },
    premiumAmount: {
        type: Number,
        required: [true, "Please enter the premium amount"]
    },
    duration: {
        type: Number, // Assuming the duration is in years
        required: [true, "Please enter the duration."],
        validate: {
            validator: function(value) {
                return value <= 100;
            },
            message: "Duration cannot exceed 100 years."
        }
    }
});

// Custom validator to check if total and premium amounts exceed 1000000
PolicySchema.path('totalAmount').validate(function(value) {
    return value <= 1000000;
}, 'Total amount cannot exceed 1000000.');

PolicySchema.path('premiumAmount').validate(function(value) {
    return value <= 1000000;
}, 'Premium amount cannot exceed 1000000.');

module.exports = mongoose.model('Policy', PolicySchema);
