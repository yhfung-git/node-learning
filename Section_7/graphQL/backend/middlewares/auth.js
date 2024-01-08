const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;

// Utility function to set req.isAuth to false
const setAuthFalse = (req, next) => {
  req.isAuth = false;
  next();
};

module.exports = async (req, res, next) => {
  try {
    // Skip authentication for OPTIONS requests
    if (req.method === "OPTIONS") return next();

    // Check for Authorization header
    const auth = await req.get("Authorization");
    if (!auth) return setAuthFalse(req, next);

    // Extract token from Authorization header
    const token = await auth.split(" ")[1];
    if (!token) return setAuthFalse(req, next);

    // Verify the token
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY, {
      ignoreExpiration: false,
    });
    if (!decoded) return setAuthFalse(req, next);

    // Check token expiration
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return setAuthFalse(req, next);
    }

    // Set userId and indicate successful authentication
    req.userId = decoded.userId;
    req.isAuth = true;
    next();
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
