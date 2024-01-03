const express = require("express");

const authController = require("../controllers/auth");
const { checkSignupInput } = require("../helpers/validators");

const router = express.Router();

router.put("/signup", checkSignupInput, authController.signup);

module.exports = router;
