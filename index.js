const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connectToMongo = require("./db");
connectToMongo();
const PORT = process.env.PORT || 8081;

const userRoutes = require("./routes/UserRoutes");
const policyRoutes = require("./routes/PolicyRoutes");
const claimRoutes = require("./routes/ClaimRoutes");

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

module.exports = app;
