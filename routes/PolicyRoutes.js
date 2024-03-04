const express = require("express");
const router = express.Router();
const PolicyController = require("../controllers/PolicyController");
const authenticateJWT = require("../middlewares/authenticateJWT");

// Policy CRUD operations
router.get("/showAllPolicies", PolicyController.getAllPolicies);
router.post("/createPolicy", authenticateJWT, PolicyController.createPolicy);
router.post("/buyPolicy", authenticateJWT, PolicyController.buyPolicy);
router.get("/policiesByUserId/:userId", authenticateJWT, PolicyController.getAllPoliciesByUserId);
router.get("/getPolicyById/:policyId", authenticateJWT, PolicyController.getPolicyById);
router.put("/updatePolicyById/:policyId", authenticateJWT, PolicyController.updatePolicyById);
router.delete("/deletePolicyById/:policyId", authenticateJWT, PolicyController.deletePolicyById);

module.exports = router;
