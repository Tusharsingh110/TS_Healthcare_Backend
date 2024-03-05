const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connectToMongo = require("./db");
// const YAML = require('yamljs');
connectToMongo();
const PORT = process.env.PORT || 8081;

const userRoutes = require("./routes/UserRoutes");
const policyRoutes = require("./routes/PolicyRoutes");
const claimRoutes = require("./routes/ClaimRoutes");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/claims", claimRoutes);

// Load Swagger YAML file
// const swaggerDocument = YAML.load('./swagger.yaml');


// Define Swagger options
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Claims Management System API",
      version: "1.0.0",
      description: "API documentation for the Claims Management System",
    },
    servers: [ 
      {
        url: "http://localhost:3000"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ["./routes/*.js"], // Change this path as per your directory structure
};


// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

// Serve Swagger documentation using swagger-ui-express
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Claims Management System API");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
