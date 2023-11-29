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
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main-layout");

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.error404);

// constraints: true = Ensures the product has a valid userId; onDelete: "CASCADE" = if the user deleted, products with its userId will be deleted as well
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
// constraints: true = Ensures the cart has a userId, onDelete: "CASCADE" = if the user deleted, products with its userId will be deleted as well
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// A cart can have multiple products, cartId will be store in CartItem
Cart.belongsToMany(Product, { through: CartItem });
// A product can be in multiple carts, productId will be store in CartItem
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
// A single order belongs to one single user
Order.belongsTo(User, { constraints: true });
// An order can have multiple products
Order.belongsToMany(Product, { through: OrderItem });
// A product can be in multiple orders
Product.belongsToMany(Order, { through: OrderItem });

const startApp = async () => {
  try {
    await sequelize.sync();

    // User
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({
        username: "Howard",
        email: "howard@gmail.com",
      });
    }

    // Cart
    let cart = await user.getCart();
    if (!cart) {
      cart = await user.createCart();
    }

    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};
startApp();
