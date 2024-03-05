const express = require("express");
const router = express.Router();
const PolicyController = require("../controllers/PolicyController");
const authenticateJWT = require("../middlewares/authenticateJWT");

/**
 * @swagger
 * components:
 *   schemas:
 *     Policy:
 *       type: object
 *       properties:
 *         policyName:
 *           type: string
 *         totalAmount:
 *           type: number
 *         premiumAmount:
 *           type: number
 *         duration:
 *           type: number
 *       required:
 *         - policyName
 *         - totalAmount
 *         - premiumAmount
 *         - duration
 */

/**
 * @swagger
 * tags:
 *   name: Policies
 *   description: API endpoints for managing policies
 * security:
 *   - BearerAuth: []
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/policies/showAllPolicies:
 *   get:
 *     summary: Get all policies
 *     description: Retrieve a list of all policies
 *     tags: [Policies]
 *     responses:
 *       '200':
 *         description: A list of policies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Policy'
 */

/**
 * @swagger
 * /api/policies/createPolicy:
 *   post:
 *     summary: Create a new policy
 *     description: Creates a new policy with the provided data.
 *     tags: [Policies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyInput'
 *     responses:
 *       '201':
 *         description: A new policy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Policy'
 *       '400':
 *         description: Error creating policy
 */

/**
 * @swagger
 * /api/policies/buyPolicy:
 *   post:
 *     summary: Buy a policy
 *     description: Allows a user to buy a policy.
 *     tags: [Policies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               policyId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Policy bought successfully
 *       '400':
 *         description: Error buying policy
 */

/**
 * @swagger
 * /api/policies/policiesByUserId/{userId}:
 *   get:
 *     summary: Get policies by user ID
 *     description: Retrieve a list of policies associated with a user.
 *     tags: [Policies]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of policies associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Policy'
 *       '400':
 *         description: Error fetching policies by user ID
 */

/**
 * @swagger
 * /api/policies/getPolicyById/{policyId}:
 *   get:
 *     summary: Get policy by ID
 *     description: Retrieve a policy by its ID.
 *     tags: [Policies]
 *     parameters:
 *       - in: path
 *         name: policyId
 *         required: true
 *         description: ID of the policy
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The policy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Policy'
 *       '404':
 *         description: Policy not found
 */

/**
 * @swagger
 * /api/policies/updatePolicyById/{policyId}:
 *   put:
 *     summary: Update policy by ID
 *     description: Update a policy's information.
 *     tags: [Policies]
 *     parameters:
 *       - in: path
 *         name: policyId
 *         required: true
 *         description: ID of the policy
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyInput'
 *     responses:
 *       '200':
 *         description: Policy updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Policy'
 *       '404':
 *         description: Policy not found
 *       '400':
 *         description: Error updating policy
 */

/**
 * @swagger
 * /api/policies/deletePolicyById/{policyId}:
 *   delete:
 *     summary: Delete policy by ID
 *     description: Delete a policy by its ID.
 *     tags: [Policies]
 *     parameters:
 *       - in: path
 *         name: policyId
 *         required: true
 *         description: ID of the policy
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Policy deleted successfully
 *       '404':
 *         description: Policy not found
 */




// Policy CRUD operations
router.get("/showAllPolicies", PolicyController.getAllPolicies);
router.post("/createPolicy", authenticateJWT, PolicyController.createPolicy);
router.post("/buyPolicy", authenticateJWT, PolicyController.buyPolicy);
router.get("/policiesByUserId/:userId", authenticateJWT, PolicyController.getAllPoliciesByUserId);
router.get("/getPolicyById/:policyId", authenticateJWT, PolicyController.getPolicyById);
router.put("/updatePolicyById/:policyId", authenticateJWT, PolicyController.updatePolicyById);
router.delete("/deletePolicyById/:policyId", authenticateJWT, PolicyController.deletePolicyById);

module.exports = router;
