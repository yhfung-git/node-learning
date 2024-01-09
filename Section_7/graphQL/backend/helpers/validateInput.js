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

exports.validatePostInput = (title, imageUrl, content) => {
  const errors = [];

  if (
    validator.isEmpty(title) ||
    !validator.matches(title, /^[a-zA-Z0-9\s]+$/) ||
    !validator.isLength(title, { min: 5 })
  )
    errors.push({
      message:
        "The title must consist only of letters and numbers, and it should be at least 5 characters long",
    });

  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 }))
    errors.push({
      message: "You must enter content at least 5 characters long",
    });

  if (validator.isEmpty(imageUrl))
    errors.push({ message: "No image or invalid image URL provided" });

  return errors;
};
