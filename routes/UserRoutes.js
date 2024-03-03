// userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the authenticateJWT middleware


// User CRUD operations
router.get('/users', UserController.getAllUsers);
router.get('/users/:userId', authenticateJWT ,UserController.getUserById);
router.put('/users/:userId', authenticateJWT ,UserController.updateUserById);
router.delete('/users/:userId', authenticateJWT ,UserController.deleteUserById);

module.exports = router;
