// UserController.js
const UserService = require('../services/UserServices');

// Controller functions
const getAllUsers = async (req, res) => {
  try {
    // Call the corresponding service function to get all users
    const users = await UserService.getAllUsers();
    // Send the response
    res.status(200).json(users);
  } catch (error) {
    // Handle errors
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // Call the corresponding service function to get a user by ID
    const user = await UserService.getUserById(userId);
    // Send the response
    res.status(200).json(user);
  } catch (error) {
    // Handle errors
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    // Call the corresponding service function to update a user by ID
    const updatedUser = await UserService.updateUserById(userId, userData);
    // Send the response
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle errors
    console.error('Error updating user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // Call the corresponding service function to delete a user by ID
    await UserService.deleteUserById(userId);
    // Send the response
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export controller functions
module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
