const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      pageTitle: "Shop",
      products: products,
      path: "/",
      productCSS: true,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Your Products",
      products: products,
      path: "/products",
      productCSS: true,
    });
  });
};
