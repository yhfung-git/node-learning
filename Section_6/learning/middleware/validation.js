const { validationResult } = require("express-validator");

exports.handleValidationErrors = async (
  req,
  res,
  next,
  view,
  pageTitle,
  path,
  additionalOptions = {}
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;

      return res.status(422).render(view, {
        pageTitle: pageTitle,
        path: path,
        formCSS: true,
        authCSS: true,
        validationCSS: true,
        alerts: { error: errorMsg },
        errorMessages: errors.mapped(),
        ...additionalOptions,
      });
    }
    return true;
  } catch (err) {
    next(new Error(err));
  }
};
