exports.postCreateOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    // create an order
    const order = await req.user.createOrder();

    // Add products to the order
    await order.addProducts(
      // Map over the products array and create an array of objects with quantity
      products.map((product) => {
        // Set an object with quantity based on the cartItem associated with each product to the orderItem
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    res.redirect("/orders");
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

// res.render("shop/checkout", {
//   pageTitle: "Checkout",
//   path: "/checkout",
//   products: products,
//   productCSS: true,
// });
