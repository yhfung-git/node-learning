const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const { sendEmail } = require("../utils/email-service");
const { handleValidationErrors } = require("../middleware/validation");

exports.getLogin = async (req, res, next) => {
  try {
    let message = "";
    if (req.cookies.loggedOut) {
      message = "You are successfully logged out!";
      await res.clearCookie("loggedOut");
    }
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      formCSS: true,
      authCSS: true,
      loggedOutMessage: message,
      errorMessages: [],
    });
  } catch (err) {
    console.log("Error getting login page:", err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    // req, res, next, view, pageTitle, path, additionalOptions
    const validationPassed = await handleValidationErrors(
      req,
      res,
      next,
      "auth/login",
      "Login",
      "/login"
    );

    if (!validationPassed) return;

    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return;

    req.session.user = { isLoggedIn: true, user: user };

    // Save the session and wait for it to complete
    await req.session.save();

    req.flash("success", "You are successfully logged in!");
    res.redirect("/");
  } catch (err) {
    console.log("Error posting login:", err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    // remove session id from database
    const sessionDeleted = await req.session.destroy();
    // remove the session cookie from client's browser
    const clearedCookie = await res.clearCookie("connect.sid");
    // remove the CSRF token from the client's browser
    const clearedCsrfToken = await res.clearCookie("csrf-token");

    if (!sessionDeleted) {
      console.log("Error destroying session:", err);
      return;
    }

    if (!clearedCookie) {
      console.log("Error clearing cookie:", err);
      return;
    }

    if (!clearedCsrfToken) {
      console.log("Error clearing cookie:", err);
      return;
    }

    res.cookie("loggedOut", true);
    res.redirect("/login");
  } catch (err) {
    console.log("Error posting logout:", err);
  }
};

exports.getSignup = async (req, res, next) => {
  try {
    res.render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      formCSS: true,
      authCSS: true,
      validationCSS: true,
      errorMessages: [],
    });
  } catch (err) {
    console.log("Error getting signup page:", err);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    // req, res, next, view, pageTitle, path, additionalOptions
    const validationPassed = await handleValidationErrors(
      req,
      res,
      next,
      "auth/signup",
      "Signup",
      "/signup"
    );

    if (!validationPassed) return;

    const { firstName, lastName, username, email, password } = req.body;

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!hashedPassword) {
      console.log("Error hashing password");
      return res.status(500).send({ error: "Internal server error" });
    }

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await newUser.save();
    req.flash(
      "success",
      "You have successfully signed up, you can now log in!"
    );

    // Send email (to, subject, template, data)
    const data = { username: username };
    sendEmail(
      email,
      "Thank you for registering with our SHOP!",
      "email-content",
      data
    );

    res.redirect("/login");
  } catch (err) {
    console.log("Error posting signup:", err);
  }
};

exports.getResetPassword = async (req, res, next) => {
  try {
    res.render("auth/reset-password", {
      pageTitle: "Reset Password",
      path: "/reset-password",
      formCSS: true,
      authCSS: true,
      errorMessages: [],
    });
  } catch (err) {
    console.log("Error getting reset password page:", err);
  }
};

exports.postResetPassword = async (req, res, next) => {
  try {
    // req, res, next, view, pageTitle, path, additionalOptions
    const validationPassed = await handleValidationErrors(
      req,
      res,
      next,
      "auth/reset-password",
      "Reset Password",
      "/reset-password"
    );

    if (!validationPassed) return;

    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).render("auth/reset-password", {
        pageTitle: "Reset Password",
        path: "/reset-password",
        formCSS: true,
        authCSS: true,
        validationCSS: true,
        alerts: {
          success:
            "Password reset initiated. Check your email for further instructions.",
        },
        errorMessages: [],
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    // Expires in 5 minutes
    user.resetTokenExpiration = Date.now() + 300000;
    const resetTokenUpdated = await user.save();

    if (resetTokenUpdated) {
      // Send email (to, subject, template, data)
      const data = {
        username: user.username,
        linkPath: `http://localhost:3000/new-password/${resetToken}`,
      };
      sendEmail(email, "Password Reset", "email-reset-password", data);
    }

    req.flash(
      "success",
      "Password reset initiated. Check your email for further instructions."
    );
    res.redirect("/reset-password");
  } catch (err) {
    console.log("Error resetting password:", err);
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    // req, res, next, view, pageTitle, path, additionalOptions
    const validationPassed = await handleValidationErrors(
      req,
      res,
      next,
      "auth/reset-password",
      "Reset Password",
      "/reset-password"
    );

    if (!validationPassed) return;

    const resetToken = req.params.resetToken;
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: new Date() },
    });
    if (!user) return;

    res.render("auth/new-password", {
      pageTitle: "New Password",
      path: "/new-password",
      formCSS: true,
      authCSS: true,
      validationCSS: true,
      userId: user._id,
      resetToken: resetToken,
      errorMessages: [],
    });
  } catch (err) {
    console.log("Error getting new password page:", err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const { newPassword, userId, resetToken } = req.body;

    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: new Date() },
      _id: userId,
    });

    if (!user) {
      req.flash(
        "error",
        "The password reset link is either invalid or has expired. Please ensure you're using the latest password reset link or request a new one."
      );
      return res.redirect("/reset-password");
    }

    // req, res, next, view, pageTitle, path, additionalOptions
    const validationPassed = await handleValidationErrors(
      req,
      res,
      next,
      "auth/new-password",
      "New Password",
      "/new-password",
      { userId: user._id, resetToken: resetToken }
    );

    if (!validationPassed) return;

    if (!user || !errors.isEmpty()) return;
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    req.flash("success", "Your new password has been successfully updated!");
    res.redirect("/login");
  } catch (err) {
    console.log("Error setting new password:", err);
  }
};
