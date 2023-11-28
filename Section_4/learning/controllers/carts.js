const Product = require("../models/product");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    res.render("shop/cart", {
      pageTitle: "Your Cart",
      path: "/cart",
      products: products,
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let product = await Product.findByPk(productId);

    const cart = await req.user.getCart();
    const [cartProduct] = await cart.getProducts({ where: { id: productId } });

    let newQuantity = 1;

    // check if the product exists in the cart, if yes, +1 quantity
    if (cartProduct) {
      const oldQuantity = cartProduct.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    }

    await cart.addProduct(product, {
      through: { quantity: newQuantity },
    });

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;

    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({ where: { id: productId } });

    const deletedCartItem = await product.cartItem.destroy();
    if (!deletedCartItem) {
      console.log("Delete Cart Item Failed!");
      return res.redirect("/cart");
    }

    console.log("Product Removed From Cart!");
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};
