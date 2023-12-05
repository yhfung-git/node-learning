const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
  try {
    const cartProductIndex = await this.cart.items.findIndex((cp) =>
      cp.productId.equals(product._id)
    );

    const updatedCartItems = [...this.cart.items];

    cartProductIndex >= 0
      ? updatedCartItems[cartProductIndex].quantity++
      : updatedCartItems.push({ productId: product._id, quantity: 1 });

    this.cart = { items: updatedCartItems };

    return await this.save();
  } catch (err) {
    console.error("Error adding product to cart:", err);
  }
};

userSchema.methods.destroy = async function (id) {
  try {
    // Check if the product with the specified ID exists in the cart
    const productIndex = this.cart.items.findIndex((item) =>
      item.productId.equals(id)
    );

    if (productIndex === -1) {
      // Product not found, handle accordingly (return, throw an error, or log)
      console.warn(`Product with ID ${id} not found in the cart.`);
      return this;
    }

    // Remove the product from the cart by filtering
    this.cart.items = this.cart.items.filter(
      (item) => !item.productId.equals(id)
    );

    return await this.save();
  } catch (err) {
    console.error("Error destroying product to cart:", err);
  }
};

userSchema.methods.clearCart = async function () {
  try {
    this.cart = { items: [] };
    return await this.save();
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
};

module.exports = mongoose.model("User", userSchema);
