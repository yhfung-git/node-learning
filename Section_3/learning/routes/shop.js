const express = require("express");

const router = express.Router();

const shopProductsController = require("../controllers/shopProducts");
const cartsController = require("../controllers/carts");

router.get("/cart", cartsController.getCart);

router.get("/checkout", cartsController.getCheckout);

router.get("/products", shopProductsController.getProducts);

router.get("/", shopProductsController.getIndex);

module.exports = router;
