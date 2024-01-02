const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const { MONGODB_URI } = process.env;

const feedRoutes = require("./router/feed");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    app.listen(8080, () => {
      console.log("Server is running on port 8080!");
    });
  } catch (err) {
    console.error(err);
  }
})();
