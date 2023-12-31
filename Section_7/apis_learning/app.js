const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { createServer } = require("http");
const { init } = require("./socket");

require("dotenv").config();
const { MONGODB_URI } = process.env;

const isAuth = require("./middlewares/isAuth");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

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

app.use("/feed", isAuth, feedRoutes);
app.use("/user", isAuth, userRoutes);
app.use("/auth", authRoutes);

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

    const server = createServer(app);
    const io = init(server);
    io.on("connection", (socket) => {
      console.log("Client connected!");
    });

    server.listen(8080, () => {
      console.log("Server is running on port 8080!");
    });
  } catch (err) {
    console.error(err);
  }
})();
