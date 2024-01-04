const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;
const { errorHandler } = require("../utils/errorHandler");

module.exports = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") next();

    const auth = await req.get("Authorization");
    if (!auth) {
      const error = errorHandler(401, "Not authenticated");
      throw error;
    }

    const token = await auth.split(" ")[1];
    if (!token) {
      const error = errorHandler(401, "Invalid token");
      throw error;
    }

    const decoded = jwt.verify(token, JWT_PRIVATE_KEY, {
      ignoreExpiration: false,
    });
    if (!decoded) {
      const error = errorHandler(401, "Not authenticated");
      throw error;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      const error = errorHandler(401, "Token has expired");
      throw error;
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
