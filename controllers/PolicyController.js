const Policy = require("../models/Policy");
const User = require("../models/User");

exports.createPolicy = async (req, res) => {
  try {
    const policyData = req.body;
    const newPolicy = new Policy(policyData);
    const savedPolicy = await newPolicy.save();
    res.status(201).json(savedPolicy);
  } catch (error) {
    console.error("Error creating policy:", error);
    res.status(400).json({ error: error.message });
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
    const policyId = req.params.policyId;
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
    const userId = req.params.userId;
    const allPolicies = await Policy.find({});
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const userPolicies = user.policies;
    const modifiedPolicies = allPolicies.map((policy) => ({
      ...policy.toObject(),
      bought: userPolicies.some((userPolicy) => userPolicy.policyId.toString() === policy._id.toString())
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
