// userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the authenticateJWT middleware

/**
 * @swagger
 * components:
 *   schemas:
 *     Policy:
 *       type: object
 *       properties:
 *         policyId:
 *           type: string
 *           description: The ID of the policy.
 *         claimableAmount:
 *           type: number
 *           description: The claimable amount of the policy.
 *         expiresOn:
 *           type: string
 *           format: date-time
 *           description: The expiration date of the policy.
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         dob:
 *           type: string
 *           format: date
 *           description: The date of birth of the user.
 *         policies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Policy'
 *           description: The policies associated with the user.
 *         totalClaimAmount:
 *           type: number
 *           description: The total claim amount of the user.
 *         isAdmin:
 *           type: boolean
 *           description: Indicates whether the user is an admin or not.
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided data.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: A new user account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request, validation error or user already exists
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in to user account
 *     description: Logs in to a user account with the provided credentials.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized, email or password is incorrect
 */

/**
 * @swagger
 * /api/users/getUserById/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by user ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized, JWT token is missing or invalid
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/deleteUserById/{userId}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Deletes a user account by user ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized, JWT token is missing or invalid
 *       '404':
 *         description: User not found
 */




// User CRUD operations
// Sign-up route
router.post('/signup', UserController.signup);
// Log-in route
router.post('/login', UserController.login);
router.get('/allUsers', UserController.getAllUsers);
router.get('/getUserById/:userId', authenticateJWT ,UserController.getUserById);
// router.put('/updateUserById/:userId', authenticateJWT ,UserController.updateUserById);
router.delete('/deleteUserById/:userId', authenticateJWT ,UserController.deleteUserById);

module.exports = router;
