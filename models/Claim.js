const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;
