const Product = require("../models/product");

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
    console.log(err);
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
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      console.log("No product found!");
      return res.redirect("/");
    }

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
};
