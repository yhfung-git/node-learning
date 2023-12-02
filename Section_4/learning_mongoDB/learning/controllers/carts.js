const Product = require("../models/product");

exports.getCart = async (req, res, next) => {
  try {
    const products = await req.user.getCart();

    if (products.length <= 0) {
      await req.user.clearMismatches();
      console.log("cleared Mismatches!");
    }

    res.render("shop/cart", {
      pageTitle: "Your Cart",
      path: "/cart",
      products: products,
      productCSS: true,
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
