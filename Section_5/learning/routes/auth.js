const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const { checkSignup, checkLogin } = require("../utils/validators");

router.get("/login", authController.getLogin);

router.post("/login", checkLogin, authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", checkSignup, authController.postSignup);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/new-password/:resetToken", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
