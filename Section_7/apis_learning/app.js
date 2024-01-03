const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

require("dotenv").config();
const { MONGODB_URI } = process.env;

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

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

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
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
