const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Registration route
router.post('/register', AuthController.register);
// Sign-in route
router.post('/signin', AuthController.signIn);

module.exports = router;
