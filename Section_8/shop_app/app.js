const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const dotenvPath =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

require("dotenv").config({ path: dotenvPath });
const { MONGODB_URI, SESSION_SECRET, COOKIE_PARSER_SECRET, PORT } = process.env;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorRoutes = require("./routes/error");

const userSession = require("./middleware/user-session");
const isAuth = require("./middleware/is-auth");

const { options } = require("./configs/csrf-csrfOptions");
const { doubleCsrfProtection } = doubleCsrf(options);
const generateToken = require("./middleware/generate-token");

const alerts = require("./middleware/alerts");
const handleOldInput = require("./middleware/handle-old-input");
const { customFormat, accessLogStream } = require("./configs/loggingConfig");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "mySessions",
});

// Catch errors
store.on("MongoDBStore error:", (err) => console.error(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const acceptedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
  acceptedImageTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "js.stripe.com"],
      "frame-src": ["'self'", "js.stripe.com"],
      "form-action": ["'self'", "checkout.stripe.com"],
    },
  })
);
app.use(compression());
app.use(morgan(customFormat, { stream: accessLogStream }));
app.use(express.urlencoded({ extended: false }));
app.use(upload.single("image"));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      //   secure: true,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(cookieParser(COOKIE_PARSER_SECRET));
app.use(doubleCsrfProtection);

app.use(flash());
app.use(alerts);

app.use(generateToken);
app.use(userSession);
app.use(handleOldInput);

app.use("/admin", isAuth(["admin"]), adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  // res.redirect(500);
  res.status(500).render("errors/500", {
    pageTitle: "Internal Server Error",
    path: "/500",
  });
});

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    app.listen(PORT || 3000, () => {
      console.log(`Server is running!`);
    });
  } catch (err) {
    console.error(err);
  }
})();
