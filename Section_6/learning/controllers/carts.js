const Product = require("../models/product");
const errorHandler = require("../utils/error-handler");
const { STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY);

exports.getCart = async (req, res, next) => {
  try {
    // Populate the "cart.items.productId" field to fetch details of products in the cart
    const populatedUser = await req.user.populate("cart.items.productId");
    // console.log(JSON.stringify(populatedUser, null, 2));

    // Extract the cart items from the populated user object and Map the cart items to a new array with additional details (quantity)
    const products = populatedUser.cart.items.map((item) => {
      // Using .toJSON() converts the Mongoose document to a plain JavaScript object
      const product = item.productId.toJSON();
      return { ...product, quantity: item.quantity };
    });

    const itemPrice = req.user.cart.items.map((item) => {
      return item.productId.price * item.quantity;
    });

    const totalPrice = itemPrice.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    res.render("shop/cart", {
      pageTitle: "Your Cart",
      path: "/cart",
      products: products,
      productCSS: true,
      itemPrice: itemPrice,
      totalPrice: totalPrice,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const addedProductToCart = await req.user.addToCart(product);

    if (!addedProductToCart) {
      req.flash("error", "Failed to adding product into your cart");
      return res.redirect("/");
    }

    req.flash("success", "Product added to your cart");
    res.redirect("/cart");
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const deletedProductFromCart = await req.user.destroy(productId);

    if (!deletedProductFromCart) {
      req.flash("error", "Failed to deleting product from your cart");
      return res.redirect("/cart");
    }

    req.flash("success", "Product removed from your cart!");
    res.redirect("/cart");
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.getCheckout = async (req, res, next) => {
  try {
    const populatedUser = await req.user.populate("cart.items.productId");

    const products = populatedUser.cart.items.map((item) => {
      const product = item.productId.toJSON();
      return { ...product, quantity: item.quantity };
    });

    const itemPrice = req.user.cart.items.map((item) => {
      return item.productId.price * item.quantity;
    });

    const totalPrice = itemPrice.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
      productCSS: true,
      orderCSS: true,
      products: products,
      pageRequiresStripe: true,
      itemPrice: itemPrice,
      totalPrice: totalPrice,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.postCheckout = async (req, res, next) => {
  try {
    const populatedUser = await req.user.populate("cart.items.productId");

    const products = populatedUser.cart.items.map((item) => {
      const product = item.productId.toJSON();
      return { ...product, quantity: item.quantity };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "link"],
      line_items: products.map((product) => {
        return {
          price_data: {
            currency: "usd",
            unit_amount: product.price * 100,
            product_data: {
              name: product.title,
              description: product.description,
            },
          },
          quantity: product.quantity,
        };
      }),
      success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
      automatic_tax: { enabled: true },
    });

    res.redirect(303, session.url);
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};
