exports.getLogin = async (req, res, next) => {
  try {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      formCSS: true,
      authCSS: true,
      isLoggedIn: req.isLoggedIn,
    });
  } catch (err) {
    console.log("get login error:", err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    req.isLoggedIn = true;
    res.redirect("/");
  } catch (err) {
    console.log("post login error:", err);
  }
};
