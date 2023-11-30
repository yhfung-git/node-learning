const express = require("express");

const router = express.Router();

const shopProductsController = require("../controllers/shopProducts");
const cartsController = require("../controllers/carts");
const ordersController = require("../controllers/orders");

// router.get("/cart", cartsController.getCart);

// router.post("/cart", cartsController.postCart);

// router.post("/cart-delete-product", cartsController.postCartDeleteProduct);

// router.post("/create-order", ordersController.postCreateOrder);

// router.get("/orders", ordersController.getOrders);

router.get("/products", shopProductsController.getProducts);

router.get("/products/:productId", shopProductsController.getProduct);

router.get("/", shopProductsController.getIndex);

module.exports = router;
