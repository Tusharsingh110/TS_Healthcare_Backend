const express = require('express');
const router = express.Router();
const PolicyController = require('../controllers/PolicyController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the authenticateJWT middleware

// Policy CRUD operations
router.post('/createPolicy', PolicyController.createPolicy);
router.get('/showAllPolicies', PolicyController.getAllPolicies);
router.get('/showPoliciesByUserId/:userId', authenticateJWT, PolicyController.getAllPoliciesByUserId);
router.get('/getPolicyById/:policyId', authenticateJWT, PolicyController.getPolicyById);
router.put('/policies/:policyId', authenticateJWT, PolicyController.updatePolicyById);
router.delete('/policies/:policyId', authenticateJWT, PolicyController.deletePolicyById);

module.exports = router;
