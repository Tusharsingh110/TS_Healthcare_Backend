const Policy = require("../models/Policy");
const User = require("../models/User");

exports.createPolicy = async (policyData) => {
  try {
    const newPolicy = new Policy(policyData);
    const savedPolicy = await newPolicy.save();
    return savedPolicy;
  } catch (error) {
    throw new Error("Could not create policy: " + error.message);
  }
};

exports.getAllPolicies = async () => {
  try {
    const policies = await Policy.find();
    return policies;
  } catch (error) {
    throw new Error("Could not fetch policies: " + error.message);
  }
};  

exports.getPolicyById = async (policyId) => {
  try {
    const policy = await Policy.findById(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    return policy;
  } catch (error) {
    throw new Error("Could not get policy by ID: " + error.message);
  }
};

exports.updatePolicyById = async (policyId, updatedPolicyData) => {
  try {
    const policy = await Policy.findByIdAndUpdate(policyId, updatedPolicyData, {
      new: true,
    });
    if (!policy) {
      throw new Error("Policy not found");
    }
    return policy;
  } catch (error) {
    throw new Error("Could not update policy: " + error.message);
  }
};

exports.deletePolicyById = async (policyId) => {
  try {
    const policy = await Policy.findByIdAndDelete(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    return { message: "Policy deleted successfully" };
  } catch (error) {
    throw new Error("Could not delete policy: " + error.message);
  }
};

exports.getAllPoliciesByUserId = async (userId) => {
  try {
    // Fetch all policies from the Policy model
    const allPolicies = await Policy.find({});

    // Fetch the user's policies array from the User model
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const userPolicies = user.policies;

    // Add a new key-value pair to each policy indicating if it's bought by the user
    const modifiedPolicies = allPolicies.map((policy) => ({
      ...policy.toObject(),
      bought: userPolicies.some((userPolicy) => userPolicy.policyId.toString() === policy._id.toString())
    }));

    // Return the modified policies array
    return modifiedPolicies;
  } catch (error) {
    throw new Error("Error getting policies by user ID: " + error.message);
  }
};

exports.buyPolicy = async (userId, policyId) => {
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the policy exists
    const policy = await Policy.findById(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    
    // Check if the user has already bought the policy
    const isAlreadyBought = user.policies.some((userPolicy) => userPolicy.policyId.toString() === policyId);
    if (isAlreadyBought) {
      throw new Error(`Policy already bought by ${user.username}.`);
    }

    // Calculate expiration date based on policy duration
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + policy.duration);

    // Add the policy to the user's policy list with expiration date
    user.policies.push({
      policyId,
      claimableAmount: policy.totalAmount,
      expiresOn: expirationDate,
    });

    // Save the updated user data
    await user.save();

    return { user, policy };
  } catch (error) {
    throw new Error("Could not buy policy: " + error.message);
  }
};
