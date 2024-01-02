const { validationResult } = require("express-validator");

exports.handleValidationErrors = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array()[0].msg,
        errors: errors.mapped(),
      });
    }

    return true;
  } catch (err) {
    console.error(err);
  }
};
