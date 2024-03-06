const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connectToMongo = require("./db");
const { startMetricsServer } = require('./utils/metrics');
const responseTime = require('response-time');
const client = require('prom-client');

connectToMongo();
const PORT = process.env.PORT || 8081;

const { Request, Response } = express; 

const userRoutes = require("./routes/UserRoutes");
const policyRoutes = require("./routes/PolicyRoutes");
const claimRoutes = require("./routes/ClaimRoutes");

// Check if the histogram has already been registered
let restResponseTimeHistogram;
if (!client.register.getSingleMetric('rest_response_time_duration_seconds')) {
    // If not registered, create the histogram
    restResponseTimeHistogram = new client.Histogram({
        name: 'rest_response_time_duration_seconds',
        help: 'REST API RESPONSE TIME IN SECONDS',
        labelNames: ['method', 'route', 'status_Code']
    });
} else {
    // If already registered, retrieve it from the registry
    restResponseTimeHistogram = client.register.getSingleMetric('rest_response_time_duration_seconds');
}

// Middleware to log response time
const logResponseTime = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (restResponseTimeHistogram) {
            restResponseTimeHistogram.observe({
                method: req.method,
                route: req.originalUrl,
                status_Code: res.statusCode
            }, duration / 1000);
        }
    });
    next();
};

app.use(cors());
app.use(logResponseTime); // Add middleware to log response time
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

startMetricsServer();
