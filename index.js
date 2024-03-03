const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connectToMongo = require("./db");

connectToMongo();
const PORT = process.env.PORT || 8081; // Note: Changed port to 8081

const userRoutes = require("./routes/UserRoutes");
const policyRoutes = require("./routes/PolicyRoutes");
const authRoutes = require("./routes/AuthRoutes");
const claimRoutes = require("./routes/ClaimRoutes");
const purchaseRoutes = require("./routes/PurchaseRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/purchase", purchaseRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Claims Management System API");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
