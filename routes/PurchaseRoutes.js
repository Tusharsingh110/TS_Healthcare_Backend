const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/PurchaseController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the authenticateJWT middleware

// Route to buy a policy
router.post('/buyPolicy', authenticateJWT,PurchaseController.buyPolicy);

module.exports = router;
