const Policy = require("../models/Policy");
const User = require("../models/User");
const Claim = require("../models/Claim");

exports.createPolicy = async (req, res) => {
  try {
    const policyData = req.body;
    const newPolicy = new Policy(policyData);
    const savedPolicy = await newPolicy.save();
    res.status(201).json(savedPolicy);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.policyName) {
      // If the error is due to a duplicate policyName, handle it here
      res.status(400).json({ error: 'Policy name already exists' });
    } else {
      console.error("Error creating policy:", error);
      res.status(400).json({ error: error.message });
    }
  }
};


exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (error) {
    console.error("Error getting policies:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPolicyById = async (req, res) => {
  try {
    const policyId = req.params.policyId;
    const policy = await Policy.findById(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    res.json(policy);
  } catch (error) {
    console.error("Error getting policy by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updatePolicyById = async (req, res) => {
  try {
    const policyId = req.params.policyId;
    const updatedPolicyData = req.body;
    const policy = await Policy.findByIdAndUpdate(policyId, updatedPolicyData, {
      new: true,
    });
    if (!policy) {
      throw new Error("Policy not found");
    }
    res.json(policy);
  } catch (error) {
    console.error("Error updating policy:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deletePolicyById = async (req, res) => {
  try {
    const policyId = req.body.policyId;
    if (policyId === undefined) {
      throw new Error("Provide Policy ID.");
    }
    
    // Check if any user has bought the policy
    const userWithPolicy = await User.findOne({ policies: { $elemMatch: { policyId: policyId } } });
    if (userWithPolicy) {
      throw new Error("Policy has been bought by a user. Cannot delete.");
    }

    // Delete the policy from the Policy collection
    const policy = await Policy.findByIdAndDelete(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }

    res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    console.error("Error deleting policy:", error);
    res.status(400).json({ error: error.message });
  }
};



exports.getAllPoliciesByUserId = async (req, res) => {
  try {
    const userId = req.body.userId;
    const allPolicies = await Policy.find({});
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const policies = user.policies;
    const modifiedPolicies = allPolicies.map((policy) => ({
      ...policy.toObject(),
      bought: policies.some((userPolicy) => userPolicy.policyId.toString() === policy._id.toString())
    }));
    res.json(modifiedPolicies);
  } catch (error) {
    console.error("Error getting policies by user ID:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.buyPolicy = async (req, res) => {
  try {
    const { userId, policyId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const policy = await Policy.findById(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    const isAlreadyBought = user.policies.some((userPolicy) => userPolicy.policyId.toString() === policyId);
    if (isAlreadyBought) {
      throw new Error(`Policy already bought by ${user.username}.`);
    }
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + policy.duration);
    user.policies.push({
      policyId,
      claimableAmount: policy.totalAmount,
      expiresOn: expirationDate,
    });
    await user.save();
    res.json({ message: 'Policy purchased successfully', user, policy });
  } catch (error) {
    console.error("Error buying policy:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deletePolicyForUser = async (req, res) => {
    try {
      const { userId, policyId } = req.body;

      // Find the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the index of the policy to delete
      const policyIndex = user.policies.findIndex(policy => policy.policyId.toString() === policyId);

      if (policyIndex === -1) {
        return res.status(404).json({ error: 'Policy not found for the user' });
      }

      // Remove the policy from the user's policies array
      user.policies.splice(policyIndex, 1);

      // Save the updated user
      await user.save();

      // Delete claims related to this policy with status 'pending'
      await Claim.deleteMany({ policyId:policyId, userId: userId });

      return res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (error) {
      console.error('Error deleting policy:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };