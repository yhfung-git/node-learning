const Product = require("../models/product");

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();

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
    const products = await req.user.getProducts();

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
    const product = await Product.findByPk(productId);

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
  // An alternative way to get one of the products
  // Product.findAll({ where: { id: productId } });
};
