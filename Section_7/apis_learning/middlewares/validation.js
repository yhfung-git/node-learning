const { validationResult } = require("express-validator");
const { errorHandler } = require("../utils/errorHandler");

exports.handleValidationErrors = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errorHandler(422, errors.array()[0].msg);
      error.data = errors.mapped();
      throw error;
    }

    return true;
  } catch (err) {
    err.statusCode = err?.statusCode ?? 500;
    next(err);
  }
};
