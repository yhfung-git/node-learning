const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.getLogin = async (req, res, next) => {
  try {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      formCSS: true,
      authCSS: true,
      isLoggedIn: false,
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
      console.log("No user found!");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Error comparing password!");
      return res.redirect("/login");
    }

    req.session.user = { isLoggedIn: true, user: user };

    // Save the session and wait for it to complete
    await req.session.save();

    console.log("Login successful!");
    res.redirect("/");
  } catch (err) {
    console.log("Error posting login:", err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    const sessionDeleted = await req.session.destroy();
    const clearedCookie = await res.clearCookie("connect.sid");

    if (!sessionDeleted) {
      console.log("Error destroying session:", err);
      return;
    }

    if (!clearedCookie) {
      console.log("Error clearing cookie:", err);
      return;
    }

    res.redirect("/");
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
      isLoggedIn: false,
    });
  } catch (err) {
    console.log("Error getting signup page:", err);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || password !== confirmPassword) {
      console.log("Invalid input data!");
      return res.redirect("/signup");
    }

    const user = await User.findOne({ email: email });
    if (user) {
      console.log("Email existed!");
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
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await newUser.save();
    console.log("User created!");
    res.redirect("/login");
  } catch (err) {
    console.log("Error posting signup:", err);
  }
};
