const Product = require("../models/product");
const User = require("../models/user");

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
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const addedProductToCart = await req.user.addToCart(product);

    if (!addedProductToCart) {
      console.log("Product adding to cart Failed!");
      return res.redirect("/");
    }

    console.log("Product added to the cart!");
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const deletedProductFromCart = await req.user.destroy(productId);

    if (!deletedProductFromCart) {
      console.log("Delete Cart Item Failed!");
      return res.redirect("/cart");
    }

    console.log("Product Removed From Cart!");
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};
