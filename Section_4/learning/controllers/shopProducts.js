const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop",
        products: products,
        path: "/",
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "Your Products",
        products: products,
        path: "/products",
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        productCSS: true,
      });
    })
    .catch((err) => console.log(err));
  // An alternative way to get one of the products
  // Product.findAll({ where: { id: productId } });
};
