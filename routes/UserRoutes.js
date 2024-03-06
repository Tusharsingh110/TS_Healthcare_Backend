// userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the authenticateJWT middleware

// User CRUD operations
// Sign-up route
router.post('/signup', UserController.signup);
// Log-in route
router.post('/login', UserController.login);
router.get('/allUsers', UserController.getAllUsers);
router.get('/getUserById/:userId', authenticateJWT ,UserController.getUserById);
router.put('/updateUserById/:userId', authenticateJWT ,UserController.updateUserById);
router.delete('/deleteUserById/:userId', authenticateJWT ,UserController.deleteUserById);

module.exports = router;
