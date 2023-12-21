const Product = require("../models/product");
const errorHandler = require("../utils/error-handler");

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("shop/index", {
      pageTitle: "Shop",
      products: products,
      path: "/",
      productCSS: true,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("shop/product-list", {
      pageTitle: "Your Products",
      products: products,
      path: "/products",
      productCSS: true,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      req.flash("error", "Unable to fetch the product details");
      return res.redirect("/");
    }

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      productCSS: true,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};
