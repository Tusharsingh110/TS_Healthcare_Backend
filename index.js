const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");
const { rateLimit } = require('express-rate-limit');
require("dotenv").config();
const app = express();
connectToMongo();
const PORT = process.env.PORT || 8081;

const userRoutes = require("./routes/UserRoutes");
const policyRoutes = require("./routes/PolicyRoutes");
const claimRoutes = require("./routes/ClaimRoutes");



// Define the rate limit middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs (here, per 15 minutes)
  standardHeaders: 'draft-7', // Use draft-7 standard headers
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers
  // You can configure other options here as needed
});

// Apply the rate limiting middleware to all routes
// app.use(limiter);
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/claims", claimRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Claims Management System API");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
