const { validationResult } = require("express-validator");

exports.handleValidationErrors = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      throw error;
    }

    return true;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
