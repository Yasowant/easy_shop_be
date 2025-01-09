// const jwt = require('jsonwebtoken');

// module.exports.authMiddleware = async (req, res, next) => {
//   const { accessToken } = req.cookies;

//   if (!accessToken) {
//     return res.status(409).json({ error: 'Please Login First' });
//   } else {
//     try {
//       const deCodeToken = await jwt.verify(accessToken, process.env.SECRET);
//       req.role = deCodeToken.role;
//       req.id = deCodeToken.id;
//       next();
//     } catch (error) {
//       return res.status(409).json({ error: 'Please Login' });
//     }
//   }
// };

const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
  // Access token from the cookies
  const { accessToken } = req.cookies;
  console.log('AccessToken:', accessToken);

  // Check if the access token exists
  if (!accessToken) {
    return res.status(401).json({ error: 'Please Login First' }); // Use 401 Unauthorized
  } else {
    try {
      // Verify the token with the secret key
      const decodedToken = await jwt.verify(accessToken, process.env.SECRET);
      
      // Attach user info (id, role) to the request object
      req.role = decodedToken.role;
      req.id = decodedToken.id;
      
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Handle invalid or expired token
      return res.status(401).json({ error: 'Invalid or expired token. Please Login again.' });
    }
  }
};


