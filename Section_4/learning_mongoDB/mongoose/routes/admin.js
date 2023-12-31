const express = require("express");

const router = express.Router();

const adminProductsController = require("../controllers/adminProducts");

router.get("/product-list", adminProductsController.getProducts);

router.get("/add-product", adminProductsController.getAddProduct);

router.post("/add-product", adminProductsController.postAddProduct);

router.get("/edit-product/:productId", adminProductsController.getEditProduct);

router.post("/edit-product", adminProductsController.postEditProduct);

router.post("/delete-product", adminProductsController.postDeleteProduct);

module.exports = router;
