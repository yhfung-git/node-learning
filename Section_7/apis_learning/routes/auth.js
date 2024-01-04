const express = require("express");

const authController = require("../controllers/auth");
const { checkSignupInput } = require("../helpers/validators");

const router = express.Router();

router.post("/signup", checkSignupInput, authController.signup);

router.post("/login", authController.login);

module.exports = router;
