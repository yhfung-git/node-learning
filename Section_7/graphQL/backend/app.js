const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { createHandler } = require("graphql-http/lib/use/express");
const expressPlayground =
  require("graphql-playground-middleware-express").default;

require("dotenv").config();
const { MONGODB_URI } = process.env;

const schema = require("./graphql/schema");
const rootValue = require("./graphql/resolvers");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const acceptedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
  acceptedImageTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const upload = multer({ storage, fileFilter });

app.use(express.json());
app.use(upload.single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.all("/graphql", createHandler({ schema, rootValue }));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.use((error, req, res, next) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data;
  res.status(statusCode).json({ message, data });
});

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
