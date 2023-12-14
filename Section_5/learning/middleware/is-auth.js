module.exports = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash("error", "Please log in before accessing the page");
      return res.redirect("/login");
    }

    if (
      req.session.user &&
      req.user.role === "user" &&
      req.originalUrl.startsWith("/admin")
    ) {
      req.flash(
        "error",
        "Oops! It looks like you need admin privileges to access this page"
      );
      return res.redirect("/");
    }

    if (req.session.user && roles.includes(req.user.role)) {
      return next();
    }
  };
};
