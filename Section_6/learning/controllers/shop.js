const Product = require("../models/product");
const errorHandler = require("../utils/error-handler");
const { getPaginationInfo } = require("../utils/pagination-info");

exports.getIndex = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const itemsPerPage = 3;

    // page, itemPerPage, model
    const paginationInfo = await getPaginationInfo(page, itemsPerPage, Product);

    const products = await Product.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.render("shop/index", {
      pageTitle: "Shop",
      products: products,
      path: "/",
      productCSS: true,
      pagination: paginationInfo,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const itemsPerPage = 3;

    // page, itemPerPage, model
    const paginationInfo = await getPaginationInfo(page, itemsPerPage, Product);

    const products = await Product.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.render("shop/product-list", {
      pageTitle: "Your Products",
      products: products,
      path: "/products",
      productCSS: true,
      pagination: paginationInfo,
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
