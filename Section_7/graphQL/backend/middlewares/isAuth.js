const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;
const { errorHandler } = require("../utils/errorHandler");

module.exports = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") return next();

    const auth = await req.get("Authorization");
    if (!auth) throw errorHandler(401, "Not authenticated");

    const token = await auth.split(" ")[1];
    if (!token) throw errorHandler(401, "Invalid token");

    const decoded = jwt.verify(token, JWT_PRIVATE_KEY, {
      ignoreExpiration: false,
    });
    if (!decoded) throw errorHandler(401, "Not authenticated");

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp)
      throw errorHandler(401, "Token has expired");

    req.userId = decoded.userId;
    next();
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
