const path = require("path");

const express = require("express");
const expressLayout = require("express-ejs-layouts");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.error404);

// constraints: true = Ensures the product has a userId, onDelete: "CASCADE" = if the user deleted, products with its userId will be deleted as well
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
// constraints: true = Ensures the cart has a userId, onDelete: "CASCADE" = if the user deleted, products with its userId will be deleted as well
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// A cart can have multiple products, cartId will be store in CartItem
Cart.belongsToMany(Product, { through: CartItem });
// A product can be in multiple carts, productId will be store in CartItem
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    return User.findByPk(1);
  })
  .then((user) => {
    return !user
      ? User.create({ username: "Howard", email: "howard@gmail.com" })
      : user;
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
