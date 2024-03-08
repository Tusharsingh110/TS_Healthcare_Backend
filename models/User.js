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
        required: [true, 'Provide a password'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
          validator: function(value) {
            // Custom validation logic for password
            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(value);
          },
          message: props => `${props.value} is not a valid password! Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`
        }
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
