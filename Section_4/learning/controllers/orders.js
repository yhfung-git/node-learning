exports.postCreateOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    // create an order
    const order = await req.user.createOrder();

    // Add products to the order
    const orderItem = await order.addProducts(
      // Map over the products array and create an array of objects with quantity
      products.map((product) => {
        // Set an object with quantity based on the cartItem associated with each product to the orderItem
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    if (!orderItem) {
      console.log("Create Order Failed!");
      res.redirect("/cart");
    }

    // clear all the products from the cart, cart.setProducts(null) = will dissociated the products with the cart
    cart.setProducts(null);

    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    // { include: ["products"] } = Since getOrders will retrieve multiple orders, we need to use "Eager Loading" to fetch the related products for each order
    const orders = await req.user.getOrders({ include: ["products"] });

    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orders,
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
};
