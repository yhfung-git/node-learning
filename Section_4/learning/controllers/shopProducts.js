const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("shop/index", {
        pageTitle: "Shop",
        products: products,
        path: "/",
        productCSS: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("shop/product-list", {
        pageTitle: "Your Products",
        products: products,
        path: "/products",
        productCSS: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
