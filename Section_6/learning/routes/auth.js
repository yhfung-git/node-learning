const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const {
  checkSignup,
  checkLogin,
  checkResetPassword,
  checkGetNewPassword,
  checkPostNewPassword,
} = require("../utils/validators");

router.get("/login", authController.getLogin);

router.post("/login", checkLogin, authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", checkSignup, authController.postSignup);

router.get("/reset-password", authController.getResetPassword);

router.post(
  "/reset-password",
  checkResetPassword,
  authController.postResetPassword
);

router.get(
  "/new-password/:resetToken",
  checkGetNewPassword,
  authController.getNewPassword
);

router.post(
  "/new-password",
  checkPostNewPassword,
  authController.postNewPassword
);

module.exports = router;
