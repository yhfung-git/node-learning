const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");
const { checkProductInput } = require("../utils/validators");

router.get("/product-list", adminController.getProducts);

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", checkProductInput, adminController.postAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  checkProductInput,
  adminController.postEditProduct
);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
