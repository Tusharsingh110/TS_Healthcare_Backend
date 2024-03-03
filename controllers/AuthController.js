const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.signIn = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  //// console.log(email + ' ' + password)
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //// console.log(user)
    ///// console.log(password + ' ' + user.password)
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Send user ID along with the token
    res.json({ token, userId: user._id.toString() , isAdmin: user.isAdmin});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, dob } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      dob,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
