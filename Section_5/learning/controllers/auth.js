const bcrypt = require("bcrypt");

const User = require("../models/user");
const { sendEmail } = require("../utils/email-service");

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
    });
  } catch (err) {
    console.log("Error getting login page:", err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      req.flash("error", "Invalid Email or Password");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      req.flash("error", "Invalid Email or Password");
      return res.redirect("/login");
    }

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
    });
  } catch (err) {
    console.log("Error getting signup page:", err);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password, confirmPassword } =
      req.body;

    const isInvalidInput =
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      password !== confirmPassword;

    if (isInvalidInput) {
      req.flash("error", "Invalid input");
      return res.redirect("/signup");
    }

    const user = await User.findOne({ email: email });
    if (user) {
      req.flash(
        "error",
        "Email already registered, please enter a different email"
      );
      return res.redirect("/signup");
    }

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      req.flash(
        "error",
        "Username already taken, please enter a different username"
      );
      return res.redirect("/signup");
    }

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
