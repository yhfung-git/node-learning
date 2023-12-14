const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const userSession = req.session.user ?? {};

    const user = userSession.user
      ? await User.findById(userSession.user._id)
      : null;

    req.user = user;
    res.locals.isLoggedIn = !!userSession.isLoggedIn;
    res.locals.isAdmin = !!user && userSession.user.role === "admin";

    next();
  } catch (err) {
    console.error("Error in user session middleware:", err);
    next(err);
  }
};
