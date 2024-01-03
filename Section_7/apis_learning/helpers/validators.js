const { body } = require("express-validator");
const User = require("../models/user");

exports.checkUpdatePostInput = [
  body("title")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter a title")
    .matches(/^[a-zA-Z0-9\s]+$/) // letters, numbers and whitespace
    .withMessage("Title must only contain letters and numbers")
    .isLength({ min: 5 })
    .withMessage("You must enter at least 5 characters"),
  body("content")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter a content")
    .isLength({ min: 5 })
    .withMessage("You must enter at least 5 characters"),
];

exports.checkCreatePostInput = [
  ...this.checkUpdatePostInput,
  body("image").custom((value, { req }) => {
    if (!req.file || !req.file.mimetype.startsWith("image")) {
      throw new Error("No image provided or uploaded file is not an image");
    }
    return true;
  }),
];

exports.checkSignupInput = [
  body("email")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter an email")
    .isEmail()
    .withMessage("You must enter a valid email")
    .normalizeEmail()
    .custom(async (value) => {
      const email = await User.findOne({ email: value });
      if (email) {
        throw new Error(
          "Email entered already in use, please enter a different email"
        );
      }
      return true;
    }),
  body("name")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter a name")
    .custom(async (value) => {
      const name = await User.findOne({ name: value });
      if (name) {
        throw new Error(
          "Name entered already in use, please enter a different name"
        );
      }
      return true;
    }),

  body("password")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("You must enter a password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];
