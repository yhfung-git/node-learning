const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");
const cartsController = require("../controllers/carts");
const ordersController = require("../controllers/orders");

router.get("/cart", cartsController.getCart);

router.post("/cart", cartsController.postCart);

router.post("/cart-delete-product", cartsController.postCartDeleteProduct);

router.post("/create-order", ordersController.postCreateOrder);

router.get("/orders", ordersController.getOrders);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/", shopController.getIndex);

module.exports = router;
