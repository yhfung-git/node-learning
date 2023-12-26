const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");
const Order = require("../models/order");
const errorHandler = require("../utils/error-handler");
const generateInvoice = require("../utils/invoice-generator");

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
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
    });

    await order.save();

    if (!order) {
      req.flash(
        "error",
        "Order not sent. Please contact us if you encounter any problems"
      );
      return res.redirect("/cart");
    }

    req.user.clearCart();

    req.flash("success", "Order sent!");
    res.redirect("/orders");
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });

    const orderPrices = orders.map((order) => {
      return order.products.map((p) => {
        return p.product.price * p.quantity;
      });
    });

    const totalPrice = orderPrices.map((order) =>
      order.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    );

    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orders,
      productCSS: true,
      orderCSS: true,
      totalPrice: totalPrice,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) return next(new Error("No order found"));

    if (!order.user.userId.equals(req.user._id)) {
      req.flash("error", "You are not authorized to download this invoice");
      return res.redirect("/orders");
    }

    const productPrices = order.products.map(
      (p) => p.product.price * p.quantity
    );
    const totalPrice = productPrices.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join(rootDir, "data", "invoices", invoiceName);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${invoiceName}`);

    const invoiceConfig = { order, orderId, totalPrice };
    const doc = await generateInvoice(invoiceConfig);

    doc.pipe(res);
    doc.pipe(fs.createWriteStream(invoicePath));

    doc.end();
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};
