const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");
const cartsController = require("../controllers/carts");
const ordersController = require("../controllers/orders");
const isAuth = require("../middleware/is-auth");

router.get("/cart", isAuth, cartsController.getCart);

router.post("/cart", isAuth, cartsController.postCart);

router.post(
  "/cart-delete-product",
  isAuth,
  cartsController.postCartDeleteProduct
);

router.post("/create-order", isAuth, ordersController.postCreateOrder);

router.get("/orders", isAuth, ordersController.getOrders);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/", shopController.getIndex);

module.exports = router;
