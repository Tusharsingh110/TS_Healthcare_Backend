const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
    policyId: {
        type: Schema.Types.ObjectId,
        ref: 'Policy'
    },
    claimableAmount: {
        type: Number,
        required: true
    },
    expiresOn: {
        type: Date,
        required: true
    }
});

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true,'Please provide your email'],
        unique: true,
        validate: {
            validator: function(value) {
                // Custom validation logic for email
                return /\S+@\S+\.\S+/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: [true,'Provide a password'],
        minlength: 8,
        // select: false dont set to false as it cant match when authenticating     
    },
    dob: {
        type: Date,
        required: [true,'Please provide your DOB']
    },
    policies: {
        type: [PolicySchema],
        default: [] // Default to an empty array
    },
    totalClaimAmount: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false // Default to false for regular users
    }
});

module.exports = mongoose.model('User', UserSchema);
