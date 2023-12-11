module.exports = (req, res, next) => {
  if (req.user) {
    res.locals.alerts = {
      error: req.flash("error"),
      success: req.flash("success"),
      warning: req.flash("warning"),
      info: req.flash("info"),
    };
  }
  next();
};
