const csrfSecret = process.env.CSRF_CSRF_SECRET;

module.exports = {
  options: {
    getSecret: () => csrfSecret,
    cookieName: "csrf-token",
    cookieOptions: {
      sameSite: "strict",
    },
    getTokenFromRequest: (req) => req.body.csrfToken,
  },
};

// req.headers is commonly used in APIs and AJAX requests. It's a standard location for tokens in many frameworks and libraries.
// const reqHeaders = req.headers["cookie"].split("=")[1].split("%")[0];

// req.cookies for both, depending on the applications
// const reqCookies = req.cookies["csrf-token"].split("|")[0];

// req.body is common in form submissions and traditional web applications
// const reqBody = req.body.csrfToken
