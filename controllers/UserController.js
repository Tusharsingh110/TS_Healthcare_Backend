const UserService = require("../services/UserServices");

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    res.json(result);
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(400).json({ error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const userData = req.body;
    const result = await UserService.signup(userData);
    res.json(result);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    const updatedUser = await UserService.updateUserById(userId, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    await UserService.deleteUserById(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signIn,
  register,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
