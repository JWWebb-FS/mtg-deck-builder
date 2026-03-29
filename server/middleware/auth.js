// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format is "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token - you'll need a JWT_SECRET in your .env file!
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');

      // Add the user payload to the request object so our routes can use it
      req.user = decoded;

      next(); // Move on to the actual route
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };