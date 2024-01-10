const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");
const { checkProductInput, checkImage } = require("../utils/validators");

router.get("/product-list", adminController.getProducts);

router.get("/add-product", adminController.getAddProduct);

router.post(
  "/add-product",
  checkProductInput,
  checkImage,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  checkProductInput,
  adminController.postEditProduct
);

router.delete("/product/:productId", adminController.deleteProduct);

module.exports = router;
