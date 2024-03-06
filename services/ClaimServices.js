const Claim = require("../models/Claim");
const User = require("../models/User");
const Policy = require("../models/Policy");
const { databaseResponseTimeHistogram } = require("../utils/metrics");

exports.createClaim = async (claimData) => {
  const metricsLabels = {
    operation: "Create Claim"
  }
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    // Extract userId, policyId, and amount from claimData
    const { userId, policyId, amount } = claimData;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    // Find the policy in the user's policies array
    const userPolicy = user.policies.find(
      (policy) => policy.policyId.toString() === policyId.toString()
    );
    if (!userPolicy) {
      throw new Error("Policy does not exist for the user");
    }

    // Check if the claimed amount is within the user's claimable amount
    if (amount > userPolicy.claimableAmount) {
      // If the claimed amount exceeds the claimable amount, create a claim with status "rejected"
      claimData.status = "rejected";
    }

    // Create the claim
    const newClaim = new Claim(claimData);
    const savedClaim = await newClaim.save();

    // If the claimed amount is valid, deduct the claimed amount from the policy's claimable amount
    if (claimData.status === "approved") {
      userPolicy.claimableAmount -= amount;
      await user.save();
    }
    timer({...metricsLabels,success: true})
    return savedClaim;
  } catch (error) {
    timer({...metricsLabels,success: false  })
    throw new Error("Could not create claim: " + error.message);
  }
};

exports.getClaimById = async (claimId) => {
  try {
    // Check if the claim exists
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new Error("Claim does not exist");
    }
    return claim;
  } catch (error) {
    throw new Error("Could not get claim by ID: " + error.message);
  }
};

exports.updateClaimStatusById = async (claimId, updatedClaim) => {
  try {
    // Check if the claim exists
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new Error("Claim does not exist");
    }

    // Extract the status field from updatedClaim
    const { status } = updatedClaim;

    // Validate the status field
    const allowedStatusValues = ["pending", "approved", "rejected"];
    if (!allowedStatusValues.includes(status)) {
      throw new Error("Invalid status value");
    }

    // Update the claim status
    claim.status = status;
    const savedClaim = await claim.save();
    // If the status is approved, update the user's policies array
    if (status === "approved") {
      const policyId = claim.policyId;
      // console.log('the id' + policyId)
      const user = await User.findById(claim.userId);
      if (!user) {
        throw new Error("User does not exist");
      }

      const policyIndex = user.policies.findIndex(
        (p) => p.policyId.toString() === policyId.toString()
      );
      // console.log('policyIndex ' + policyIndex)
      if (policyIndex === -1) {
        throw new Error("Policy not found in user's policies");
      }
      const claimAmount = claim.amount;
      // Deduct the claim amount from the policy's claimable amount
      user.policies[policyIndex].claimableAmount -= claimAmount;
      // Save the updated user data
      await user.save();
    }

    return savedClaim;
  } catch (error) {
    throw new Error("Could not update claim status: " + error.message);
  }
};


exports.updateClaimById = async (claimId, updatedClaimData) => {
  try {
    // Extract amount from updatedClaimData
    const { amount } = updatedClaimData;

    // Check if the claim exists
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new Error("Claim does not exist");
    }

    // Update the claim amount
    claim.amount = amount;

    // Find the corresponding user and policy
    const user = await User.findById(claim.userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const policyIndex = user.policies.findIndex(
      (p) => p.policyId.toString() === claim.policyId.toString()
    );

    if (policyIndex === -1) {
      throw new Error("Policy not found in user's policies");
    }

    // Check if the updated amount exceeds the claimable amount
    const userPolicy = user.policies[policyIndex];
    if (amount > userPolicy.claimableAmount) {
      claim.status = "rejected";
    }else if (amount <= userPolicy.claimableAmount) {
      claim.status = "pending";
    }

    const updatedClaim = await claim.save();
    // console.log(updatedClaim)
    return updatedClaim;
  } catch (error) {
    throw new Error("Could not update claim: " + error.message);
  }
};


exports.deleteClaimById = async (claimId) => {
  try {
    // Check if the claim exists
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new Error("Claim does not exist");
    }

    // Delete the claim
    await Claim.findByIdAndDelete(claimId);
  } catch (error) {
    throw new Error("Could not delete claim: " + error.message);
  }
};

// Service function to get all claims of a user by user ID
exports.getClaimsByUserId = async (userId) => {
  try {
    const claims = await Claim.find({ userId });
    return claims;
  } catch (error) {
    throw new Error("Error fetching claims");
  }
};

// Service function to get all claims
exports.getAllClaims = async () => {
  try {
    const claims = await Claim.find();
    return claims;
  } catch (error) {
    throw new Error("Error fetching all claims: " + error.message);
  }
};
