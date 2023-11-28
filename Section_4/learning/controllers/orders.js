exports.postCreateOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
      products: products,
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};
