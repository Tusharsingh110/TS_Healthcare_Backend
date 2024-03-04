const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch all users');
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    const { password, ...userDetails } = user.toObject();
    return userDetails;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user by ID');
  }
};

const updateUserById = async (userId, userData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user by ID:', error);
    throw new Error('Failed to update user by ID');
  }
};

const deleteUserById = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    throw new Error('Failed to delete user by ID');
  }
};

const signup = async (userData) => {
  try {
    const { username, email, password, dob, isAdmin } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username, 
      email,
      dob,
      isAdmin,
      password: hashedPassword
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return { message: 'User created successfully', token , newUser };
  } catch (error) {
    console.error('Error signing up:', error);
    throw new Error(error.message);
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return { message: 'Login successful', token ,isAdmin: user.isAdmin };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  signup,
  login
};
