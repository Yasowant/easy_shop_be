const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;

  // Check if token is provided
  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized: Please login first.' });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(accessToken, process.env.SECRET);
    req.role = decodedToken.role;
    req.id = decodedToken.id;
    next();
  } catch (error) {
    // Catch invalid token errors
    console.error('Token verification failed:', error.message);
    return res
      .status(403)
      .json({ error: 'Forbidden: Invalid or expired token.' });
  }
};
