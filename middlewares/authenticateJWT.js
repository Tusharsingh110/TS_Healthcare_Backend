// middleware/authenticateJWT.js

const jwt = require('jsonwebtoken');


const authenticateJWT = (req, res, next) => {
  // Extract the JWT token from the request headers
  const authHeader = req.headers.authorization;

  // Check if token is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Extract the token without the "Bearer " prefix
  const token = authHeader.split(' ')[1];

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    } else {
      // Attach the decoded token payload to the request object for further processing
      req.user = decodedToken;
      next(); // Move to the next middleware or route handler
    }
  });
};

module.exports = authenticateJWT;
