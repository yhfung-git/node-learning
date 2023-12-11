module.exports = async (req, res, next) => {
  try {
    res.locals.alerts = {
      error: req.flash("error"),
      success: req.flash("success"),
      warning: req.flash("warning"),
      info: req.flash("info"),
    };

    res.locals.loggedOutMessage = req.cookies.loggedOut;
    next();
  } catch (err) {
    console.log("Error from alerts middleware:", err);
  }
};
