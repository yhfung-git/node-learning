const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");
const cartsController = require("../controllers/carts");
const ordersController = require("../controllers/orders");

const isAuth = require("../middleware/is-auth");
const isAuths = isAuth(["admin", "user"]);

router.get("/cart", isAuths, cartsController.getCart);

router.post("/cart", isAuths, cartsController.postCart);

router.post(
  "/cart-delete-product",
  isAuths,
  cartsController.postCartDeleteProduct
);

router.get("/checkout", isAuths, cartsController.getCheckout);

router.post("/checkout", isAuths, cartsController.postCheckout);

router.get("/checkout/cancel", isAuths, cartsController.getCheckout);

router.get("/checkout/success", isAuths, ordersController.getCheckoutSuccess);

router.get("/orders", isAuths, ordersController.getOrders);

router.get("/orders/:orderId", isAuths, ordersController.getInvoice);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/", shopController.getIndex);

module.exports = router;
