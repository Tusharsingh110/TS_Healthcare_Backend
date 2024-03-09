const Claim = require("../models/Claim");
const User = require("../models/User");

exports.createClaim = async (req, res) => {
  try {
    const claimData = req.body;

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

    res.status(201).json(savedClaim);
  } catch (error) {
    console.error("Error creating claim:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getClaimById = async (req, res) => {
  try {
    const claimId = req.params.claimId;
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new Error("Claim does not exist");
    }
    res.json(claim);
  } catch (error) {
    console.error("Error getting claim by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateClaimById = async (req, res) => {
  try {
    const claimId = req.params.claimId;
    const updatedClaimData = req.body;

    // Check if the claim exists
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new Error("Claim does not exist");
    }

    // Extract amount from updatedClaimData
    const { amount } = updatedClaimData;

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
    } else if (amount <= userPolicy.claimableAmount) {
      claim.status = "pending";
    }

    const updatedClaim = await claim.save();
    res.json(updatedClaim);
  } catch (error) {
    console.error("Error updating claim:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateClaimStatusById = async (req, res) => {
  try {
    const claimId = req.params.claimId;
    const updatedClaimData = req.body;

    // Check if the claim exists
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new Error("Claim does not exist");
    }

    // Extract the status field from updatedClaimData
    const { status } = updatedClaimData;

    // Validate the status field
    const allowedStatusValues = ["pending", "approved", "rejected"];
    if (!allowedStatusValues.includes(status)) {
      throw new Error("Invalid status value");
    }

    // Update the claim status
    claim.status = status;
    let savedClaim =claim;
    // If the status is approved, update the user's policies array
    if (status === "approved") {
      const policyId = claim.policyId;
      const user = await User.findById(claim.userId);
      if (!user) {
        throw new Error("User does not exist");
      }

      const policyIndex = user.policies.findIndex(
        (p) => p.policyId.toString() === policyId.toString()
      );

      if (policyIndex === -1) {
        throw new Error("Policy not found in user's policies");
      }
      const claimAmount = claim.amount;
      if(user.policies[policyIndex].claimableAmount - claimAmount < 0) {
        claim.status="rejected";
        savedClaim = await claim.save()
        // throw new Error("Can't deduct amount greater than the balance.")
      }
      else {
      // Deduct the claim amount from the policy's claimable amount
      user.policies[policyIndex].claimableAmount -= claimAmount;
      // Save the updated user data
      await user.save();
    }
  }
  
    savedClaim = await claim.save();
    res.json(savedClaim);
  } catch (error) {
    console.error("Error updating claim status:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClaimById = async (req, res) => {
  try {
    const claimId = req.body.claimId;
    await Claim.findByIdAndDelete(claimId);
    res.json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Error deleting claim:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getClaimsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const claims = await Claim.find({ userId });
    res.json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllClaims = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const claims = await Claim.find();
    res.json(claims);
  } catch (error) {
    console.error("Error fetching all claims:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
