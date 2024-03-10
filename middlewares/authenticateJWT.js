const jwt = require('jsonwebtoken');

const authenticateUserJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

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

module.exports = authenticateUserJWT;
