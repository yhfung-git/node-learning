const express = require("express");

const router = express.Router();

const adminProductsController = require("../controllers/adminProducts");

router.get("/products", adminProductsController.getProducts);

router.get("/add-product", adminProductsController.getAddProducts);

router.post("/add-product", adminProductsController.postAddProducts);

module.exports = router;
