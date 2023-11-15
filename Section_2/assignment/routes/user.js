const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router();

router.get("/users", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "user.html"));
});

router.post("/users", (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
