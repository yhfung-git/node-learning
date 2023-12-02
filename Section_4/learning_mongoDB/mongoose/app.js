const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");
const { mongoConnect } = require("./utils/database");
const User = require("./models/user");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("656a0d5c62af0fb7a3e25fff");
    req.user = new User(user._id, user.username, user.email, user.cart);
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
    await mongoConnect();
    app.listen(3000, () => {
      console.log("Server is running on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
})();
