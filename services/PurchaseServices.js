const User = require('../models/User');
const Policy = require('../models/Policy');

exports.buyPolicy = async (userId, policyId) => {
    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if the policy exists
        const policy = await Policy.findById(policyId);
        if (!policy) {
            throw new Error('Policy not found');
        }

        // Calculate expiration date based on policy duration
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + policy.duration);

        // Add the policy to the user's policy list with expiration date
        user.policies.push({ 
            policyId, 
            claimableAmount: policy.totalAmount, 
            expiresOn: expirationDate 
        });

        // Save the updated user data
        await user.save();

        return { user, policy };
    } catch (error) {
        throw new Error('Could not buy policy: ' + error.message);
    }
};
