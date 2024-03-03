const ClaimsServices = require("../services/ClaimServices");
const User = require("../models/User")

exports.createClaim = async (req, res) => {
  try {
    const claimData = req.body;
    const newClaim = await ClaimsServices.createClaim(claimData);
    res.status(201).json(newClaim);
  } catch (error) {
    console.error("Error creating claim:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getClaimById = async (req, res) => {
  try {
    const claimId = req.params.claimId;
    const claim = await ClaimsServices.getClaimById(claimId);
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
    const updatedClaim = await ClaimsServices.updateClaimById(
      claimId,
      updatedClaimData
    );
    res.json(updatedClaim);
  } catch (error) {
    console.error("Error updating claim:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClaimById = async (req, res) => {
  try {
    const claimId = req.params.claimId;
    await ClaimsServices.deleteClaimById(claimId);
    res.json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Error deleting claim:", error);
    res.status(400).json({ error: error.message });
  }
};

// Controller function to get all claims of a user by user ID
exports.getClaimsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const claims = await ClaimsServices.getClaimsByUserId(userId);
    res.json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all claims
exports.getAllClaims = async (req, res) => {
  try {
    // Receive userId from the request body
    const { userId } = req.body;
    console.log(userId)
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user from the database using userId
    const user = await User.findById(userId);

    // Check if the user exists and is an admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch all claims
    const claims = await ClaimsServices.getAllClaims();
    res.json(claims);
  } catch (error) {
    console.error("Error fetching all claims:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
