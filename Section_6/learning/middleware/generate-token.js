const { doubleCsrf } = require("csrf-csrf");
const { options } = require("../configs/csrf-csrfOptions");
const { generateToken } = doubleCsrf(options);

module.exports = async (req, res, next) => {
  try {
    const token = generateToken(req, res);
    res.locals.csrfToken = token;

    next();
  } catch (err) {
    next(new Error(err));
  }
};
