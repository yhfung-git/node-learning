module.exports = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  } catch (err) {
    console.log("Error Authenticating:", err);
  }
};
