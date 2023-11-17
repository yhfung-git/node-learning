// const path = require("path");

const express = require("express");

// const rootDir = require("../utils/path");
const userData = require("./main");

const router = express.Router();

router.get("/users", (req, res, next) => {
  const users = userData.users;
  res.render("user", {
    pageTitle: "Users",
    path: "/users",
    users: users,
    userListCSS: true,
  });
});

module.exports = router;
