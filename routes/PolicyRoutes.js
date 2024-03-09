const express = require("express");
const router = express.Router();
const PolicyController = require("../controllers/PolicyController");
const authenticateJWT = require("../middlewares/authenticateJWT");
const authenticateAdminJWT = require("../middlewares/authenticateAdminJWT");

// Policy CRUD operations
router.get("/allPolicies", PolicyController.getAllPolicies);
router.post("/createPolicy", authenticateAdminJWT, PolicyController.createPolicy);
router.post("/buyPolicy", authenticateJWT, PolicyController.buyPolicy);
router.post("/policiesByUserId/", authenticateJWT, PolicyController.getAllPoliciesByUserId);
router.get("/getPolicyById/:policyId", authenticateJWT, PolicyController.getPolicyById);
router.put("/updatePolicyById/:policyId", authenticateAdminJWT, PolicyController.updatePolicyById);
router.post("/deletePolicyById/", authenticateAdminJWT, PolicyController.deletePolicyById);
router.post("/deletePolicyForUser/", authenticateJWT, PolicyController.deletePolicyForUser);

module.exports = router;
