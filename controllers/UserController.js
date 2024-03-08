const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { password, ...userDetails } = user.toObject();
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password, dob, isAdmin, recaptchaValue } = req.body;

    // Verify reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.API_KEY}&response=${recaptchaValue}`);
    
    if (!response.data.success) {
      throw new Error('reCAPTCHA verification failed');
    }

    // Backend validation for username, email, and password
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    // Additional validation for password complexity
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    // Backend validation for age verification
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const ageDifference = currentDate.getFullYear() - dobDate.getFullYear();
    const isUnder18 = ageDifference < 18 || (ageDifference === 18 && currentDate.getMonth() < dobDate.getMonth()) || (ageDifference === 18 && currentDate.getMonth() === dobDate.getMonth() && currentDate.getDate() < dobDate.getDate());
    if (isUnder18) {
      throw new Error('You must be at least 18 years old to register');
    }

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

    res.json({ message: 'User created successfully', token , newUser });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(400).json({ error: error.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ message: 'Login successful',userId:user._id.toString(), token ,isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(400).json({ error: error.message });
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
