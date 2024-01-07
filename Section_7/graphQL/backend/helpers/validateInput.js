const validator = require("validator");

exports.validateSignupInput = (email, password, name) => {
  const errors = [];

  if (validator.isEmpty(email) || !validator.isEmail(email))
    errors.push({ message: "Email is invalid" });

  if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 }))
    errors.push({
      message: "Password is required and at least 5 characters long",
    });

  if (validator.isEmpty(name))
    errors.push({
      message: "You must enter a name",
    });

  return errors;
};
