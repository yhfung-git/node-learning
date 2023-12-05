exports.getLogin = async (req, res, next) => {
  try {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      formCSS: true,
      authCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
};
