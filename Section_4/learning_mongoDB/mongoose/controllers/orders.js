exports.postCreateOrder = async (req, res, next) => {
  try {
    const addedToOrder = await req.user.addOrder();

    if (!addedToOrder) {
      console.log("Create Order Failed!");
      res.redirect("/cart");
    }

    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();

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
