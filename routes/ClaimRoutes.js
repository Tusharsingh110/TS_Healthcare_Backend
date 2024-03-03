const express = require('express');
const router = express.Router();
const ClaimsController = require('../controllers/ClaimController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the authenticateJWT middleware

// Claims CRUD operations
router.post('/createClaim', authenticateJWT, ClaimsController.createClaim);
router.get('/getClaimById/:claimId', authenticateJWT, ClaimsController.getClaimById);
router.get('/claimsByUserId/:userId', authenticateJWT, ClaimsController.getClaimsByUserId);
router.put('/updateClaim/:claimId', authenticateJWT, ClaimsController.updateClaimById);
router.delete('/deleteClaimById/:claimId', authenticateJWT, ClaimsController.deleteClaimById);

// Route to fetch all claims
router.post('/allClaims', authenticateJWT, ClaimsController.getAllClaims);

module.exports = router;
