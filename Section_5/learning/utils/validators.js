const bcrypt = require("bcrypt");

const { body } = require("express-validator");
const User = require("../models/user");

exports.checkSignup = [
  body("firstName")
    .exists({ checkFalsy: true })
    .withMessage("You must enter your first name"),
  body("lastName")
    .exists({ checkFalsy: true })
    .withMessage("You must enter your last name"),
  body("username")
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
    }),
  body("password")
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
    }),
  body("password")
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
