const bcrypt = require("bcrypt");

const { body, param } = require("express-validator");
const User = require("../models/user");

exports.checkSignup = [
  body("firstName")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your first name"),
  body("lastName")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your last name"),
  body("username")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your username")
    .custom(async (value) => {
      const existingUsername = await User.findOne({ username: value });
      if (existingUsername) {
        throw new Error("Username is taken, please enter a different username");
      }
      return true;
    }),
  body("email")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your email")
    .isEmail()
    .withMessage("You must enter a valid email")
    .custom(async (value) => {
      const existingEmail = await User.findOne({ email: value });
      if (existingEmail) {
        throw new Error("Email already in use, please enter a different email");
      }
      return true;
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your password following the requirements")
    .isStrongPassword({
      minlength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage("Your password does not meet the requirements"),
  body("confirmPassword")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must re-enter your password for confirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The confirmation password do not match");
      }
      return true;
    }),
];

exports.checkLogin = [
  body("email")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your email")
    .isEmail()
    .withMessage("You must enter a valid email")
    .custom(async (value) => {
      const existingEmail = await User.findOne({ email: value });
      if (!existingEmail) {
        throw new Error("Invalid email or password");
      }
      return true;
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your password")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      const match = await bcrypt.compare(value, user.password);
      if (!user || !match) {
        throw new Error("Invalid email or password");
      }
      return true;
    }),
];

exports.checkResetPassword = body("email")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage("You must enter your email")
  .isEmail()
  .withMessage("You must enter a valid email");

exports.checkGetNewPassword = param(
  "resetToken",
  "The password reset link is either invalid or has expired. Please ensure you're using the latest password reset link or request a new one."
)
  .trim()
  .exists({ checkFalsy: true })
  .withMessage()
  .custom(async (value) => {
    const user = await User.findOne({
      resetToken: value,
      resetTokenExpiration: { $gt: new Date() },
    });
    if (!user) {
      throw new Error();
    }
    return true;
  });

exports.checkPostNewPassword = [
  body("newPassword")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter your password following the requirements")
    .isStrongPassword({
      minlength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage("Your password does not meet the requirements"),
  body("confirmPassword")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must re-enter your password for confirmation")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("The confirmation password do not match");
      }
      return true;
    }),
];

exports.checkProductInput = [
  body("title")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter a title")
    .matches(/^[a-zA-Z0-9\s]+$/) // letters, numbers and whitespace
    .withMessage("Title must only contain letters and numbers")
    .isLength({ min: 5 })
    .withMessage("You must enter at least 5 characters"),
  body("price")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter a price")
    .isCurrency()
    .withMessage("Price must be a valid number")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be at least 0.01"),
  body("description")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter a description")
    .isLength({ min: 10 })
    .withMessage("You must enter at least 10 characters"),
];

exports.checkImage = body("image").custom((value, { req }) => {
  if (!req.file || !req.file.mimetype.startsWith("image")) {
    throw new Error("No image found or uploaded file is not an image");
  }
  return true;
});
