const { body } = require("express-validator");

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
