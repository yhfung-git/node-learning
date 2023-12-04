const Order = require("../models/order");

exports.postCreateOrder = async (req, res, next) => {
  try {
    // Populate the "cart.items.productId" field to fetch details of products in the cart
    const populatedUser = await req.user.populate("cart.items.productId");

    // Extract the cart items from the populated user object and Map the cart items to a new array
    const prods = populatedUser.cart.items.map((item) => {
      // Using "._doc" retrieves the data of the product, and the spread operator "..." extracts the product data into a new object, which is then stored in the constant variable "prod".
      const prod = { ...item.productId._doc };
      return { product: prod, quantity: item.quantity };
    });

    const order = new Order({
      products: prods,
      user: {
        userId: req.user._id,
        username: req.user.username,
      },
    });

    await order.save();

    if (!order) {
      console.log("Create Order Failed!");
      res.redirect("/cart");
    }

    req.user.clearCart();
    console.log("Cart cleared!");

    console.log("Order created!");
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });

    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orders,
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
};
