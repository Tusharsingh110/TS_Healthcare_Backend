const PurchaseServices = require('../services/PurchaseServices');

exports.buyPolicy = async (req, res) => {
  try {
    const { userId, policyId } = req.body;

    // Call the service to buy the policy
    const result = await PurchaseServices.buyPolicy(userId, policyId);

    res.json({ message: 'Policy purchased successfully', result });
  } catch (error) {
    console.error('Error buying policy:', error);
    res.status(400).json({ error: error.message });
  }
};
