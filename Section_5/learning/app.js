const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const flash = require("connect-flash");

const app = express();

require("dotenv").config();
const { MONGODB_URI, SESSION_SECRET, COOKIE_PARSER_SECRET } = process.env;

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

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "mySessions",
});

// Catch errors
store.on("MongoDBStore error:", (err) => console.error(err));

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
      //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
  // const statusCode = Number(error.httpStatusCode) || 500;
  // res.redirect(`/${statusCode}`);
  res.status(500).render("errors/500", {
    pageTitle: "Internal Server Error",
    path: "/500",
  });
});

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    app.listen(3000, () => {
      console.log("Server is running on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
})();
