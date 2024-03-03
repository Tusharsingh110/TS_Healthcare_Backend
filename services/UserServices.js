// UserServices.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Service functions
const getAllUsers = async () => {
  try {
    // Placeholder logic to fetch all users
    const users = await User.find();
    return users;
  } catch (error) {
    // Handle errors
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch all users');
  }
};

const getUserById = async (userId) => {
  try {
    // Placeholder logic to fetch a user by ID
    const user = await User.findById(userId);
    const { password, ...userDetails } = user.toObject();
    return userDetails;
  } catch (error) {
    // Handle errors
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user by ID');
  }
};

const updateUserById = async (userId, userData) => {
  try {
    // Placeholder logic to update a user by ID
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    return updatedUser;
  } catch (error) {
    // Handle errors
    console.error('Error updating user by ID:', error);
    throw new Error('Failed to update user by ID');
  }
};

const deleteUserById = async (userId) => {
  try {
    // Placeholder logic to delete a user by ID
    await User.findByIdAndDelete(userId);
  } catch (error) {
    // Handle errors
    console.error('Error deleting user by ID:', error);
    throw new Error('Failed to delete user by ID');
  }
};

const signup = async (userData) => {
  try {
    const { username, email, password } = userData;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username, 
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Generate the token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return { message: 'User created successfully', token , newUser };
  } catch (error) {
    console.error('Error signing up:', error);
    throw new Error(error.message);
  }
};

const login = async (email, password) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return { message: 'Login successful', token };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Export service functions
module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  signup,
  login
};
