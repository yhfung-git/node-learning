const express = require("express");

const router = express.Router();

const productData = require("./admin");

router.get("/", (req, res, next) => {
  const products = productData.products;
  res.render("shop", {
    pageTitle: "Shop",
    products: products,
    path: "/",
    productCSS: true,
  });
});

module.exports = router;
