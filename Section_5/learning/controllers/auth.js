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
    console.log("get login error:", err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne();

    req.session.user = { isLoggedIn: true, user: user };

    res.redirect("/");
  } catch (err) {
    console.log("post login error:", err);
  }
};
