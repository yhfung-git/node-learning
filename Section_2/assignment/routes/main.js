// const path = require("path");

const express = require("express");

// const rootDir = require("../utils/path");

const router = express.Router();

const users = [];

router.get("/", (req, res, next) => {
  res.render("main", { pageTitle: "Home", path: "/", formCSS: true });
});

router.post("/", (req, res, next) => {
  users.push({ username: req.body.username });
  res.redirect("/users");
});

exports.routes = router;
exports.users = users;
