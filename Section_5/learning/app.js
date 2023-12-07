const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();
const mongoDbUri = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorsController = require("./controllers/errors");
const User = require("./models/user");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

const store = new MongoDBStore({
  uri: mongoDbUri,
  collection: "mySessions",
});

// Catch errors
store.on("MongoDBStore error:", (err) => console.log(err));

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store,
    // cookie: { httpOnly: true, secure: true },
  })
);

app.use(async (req, res, next) => {
  try {
    const userSession = req.session.user ?? {};

    const user = userSession.user
      ? await User.findById(userSession.user._id)
      : null;

    req.user = user;
    res.locals.isLoggedIn = !!userSession.isLoggedIn;

    next();
  } catch (err) {
    console.error("Error in user session middleware:", err);
    next(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.error404);

(async () => {
  try {
    await mongoose.connect(mongoDbUri);

    const existingUser = await User.findOne();
    if (!existingUser) {
      const newUser = new User({
        username: "Howard",
        email: "howard@gmail.com",
        cart: { items: [] },
      });
      await newUser.save();
    }

    app.listen(3000, () => {
      console.log("Server is running on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
})();
