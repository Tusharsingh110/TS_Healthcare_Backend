const PolicyServices = require('../services/PolicyServices');

exports.createPolicy = async (req, res) => {
  try {
    const policyData = req.body;
    const policy = await PolicyServices.createPolicy(policyData);
    res.status(201).json(policy);
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await PolicyServices.getAllPolicies();
    res.json(policies);
  } catch (error) {
    console.error('Error getting policies:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPolicyById = async (req, res) => {
  try {
    const policyId = req.params.policyId;
    const policy = await PolicyServices.getPolicyById(policyId);
    res.json(policy);
  } catch (error) {
    console.error('Error getting policy by ID:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updatePolicyById = async (req, res) => {
  try {
    const policyId = req.params.policyId;
    const updatedPolicyData = req.body;
    const policy = await PolicyServices.updatePolicyById(policyId, updatedPolicyData);
    res.json(policy);
  } catch (error) {
    console.error('Error updating policy:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deletePolicyById = async (req, res) => {
  try {
    const policyId = req.params.policyId;
    const response = await PolicyServices.deletePolicyById(policyId);
    res.json(response);
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPoliciesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const policies = await PolicyServices.getAllPoliciesByUserId(userId);
    res.json(policies);
  } catch (error) {
    console.error('Error getting policies by user ID:', error);
    res.status(400).json({ error: error.message });
  }
};
