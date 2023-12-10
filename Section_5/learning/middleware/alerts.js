module.exports = (req, res, next) => {
  res.locals.alerts = {
    error: req.flash("error"),
    success: req.flash("success"),
    warning: req.flash("warning"),
    info: req.flash("info"),
  };
  next();
};
