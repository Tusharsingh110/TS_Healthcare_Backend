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
router.get('/getUserById/', authenticateJWT ,UserController.getUserById);
router.put('/updateUser/', authenticateJWT ,UserController.updateUser);
router.delete('/deleteUser/', authenticateJWT ,UserController.deleteUserById);

module.exports = router;
