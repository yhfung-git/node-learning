const express = require("express");

const router = express.Router();

router.get("/users", (req, res, next) => {
  res.send(
    "<form action='/users' method='POST'><input type='text' name='username'><button type='submit'>Add</button></form>"
  );
});

router.post("/users", (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
