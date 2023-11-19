const express = require("express");

const router = express.Router();

const shopProductsController = require("../controllers/shopProducts");
const cartsController = require("../controllers/carts");

router.get("/cart", cartsController.getCart);

router.get("/checkout", cartsController.getCheckout);

router.get("/orders", cartsController.getOrders);

router.get("/products", shopProductsController.getProducts);

router.get("/products/:productId", shopProductsController.getProduct);

router.get("/", shopProductsController.getIndex);

module.exports = router;
