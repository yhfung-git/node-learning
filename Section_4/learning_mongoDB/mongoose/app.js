const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();
const url = process.env.MONGODB_URL;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");
const User = require("./models/user");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

app.use(async (req, res, next) => {
  try {
    const user = await User.findOne();
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.error404);

(async () => {
  try {
    await mongoose.connect(url);

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
