const express = require('express');
const router = express.Router();
const ClaimsController = require('../controllers/ClaimController');
const authenticateJWT = require('../middlewares/authenticateJWT');

/**
 * @swagger
 * components:
 *   schemas:
 *     Claim:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *         policyId:
 *           type: string
 *         userId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       required:
 *         - amount
 *         - policyId
 *         - userId
 */

/**
 * @swagger
 * tags:
 *   name: Claims
 *   description: API endpoints for managing claims
 */

/**
 * @swagger
 * securitySchemes:
 *   BearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

/**
 * @swagger
 * /api/claims/createClaim:
 *   post:
 *     summary: Create a new claim
 *     description: Creates a new claim with the provided data.
 *     tags: [Claims]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Claim'
 *     responses:
 *       '201':
 *         description: A new claim created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Claim'
 *       '400':
 *         description: Error creating claim
 */


/**
 * @swagger
 * /api/claims/updateClaim/{claimId}:
 *   put:
 *     summary: Update a claim by ID
 *     description: Updates the claim with the provided ID.
 *     tags: [Claims]
 *     parameters:
 *       - in: path
 *         name: claimId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the claim to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Claim'
 *     responses:
 *       '200':
 *         description: Claim updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Claim'
 *       '400':
 *         description: Error updating claim
 *       '404':
 *         description: Claim not found
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/claims/updateClaimStatusById/{claimId}:
 *   put:
 *     summary: Update the status of a claim by ID
 *     description: Updates the status of the claim with the provided ID.
 *     tags: [Claims]
 *     parameters:
 *       - in: path
 *         name: claimId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the claim to update status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       '200':
 *         description: Claim status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Claim'
 *       '400':
 *         description: Error updating claim status
 *       '404':
 *         description: Claim not found
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/claims/deleteClaimById/{claimId}:
 *   delete:
 *     summary: Delete a claim by ID
 *     description: Deletes the claim with the provided ID.
 *     tags: [Claims]
 *     parameters:
 *       - in: path
 *         name: claimId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the claim to delete
 *     responses:
 *       '200':
 *         description: Claim deleted successfully
 *       '400':
 *         description: Error deleting claim
 *       '404':
 *         description: Claim not found
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/claims/getClaimsByUserId/{userId}:
 *   get:
 *     summary: Get all claims of a user by ID
 *     description: Retrieves all claims of the user with the provided ID.
 *     tags: [Claims]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve claims
 *     responses:
 *       '200':
 *         description: Claims retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Claim'
 *       '400':
 *         description: Error fetching claims
 *       '500':
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */

/**
 * @swagger
 * /api/claims/allClaims:
 *   post:
 *     summary: Get all claims
 *     description: Retrieves all claims in the system.
 *     tags: [Claims]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Claims retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Claim'
 *       '400':
 *         description: User ID is required
 *       '403':
 *         description: Unauthorized access
 *       '500':
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */



// Claims CRUD operations
router.post('/createClaim', authenticateJWT, ClaimsController.createClaim);
router.get('/getClaimById/:claimId', authenticateJWT, ClaimsController.getClaimById);
router.get('/claimsByUserId/:userId', authenticateJWT, ClaimsController.getClaimsByUserId);
router.put('/updateClaim/:claimId', authenticateJWT, ClaimsController.updateClaimById);
router.put('/updateClaimStatusById/:claimId', authenticateJWT, ClaimsController.updateClaimStatusById);
router.delete('/deleteClaimById/:claimId', authenticateJWT, ClaimsController.deleteClaimById);

// Route to fetch all claims
router.post('/allClaims', authenticateJWT, ClaimsController.getAllClaims);

module.exports = router;
