const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  resetToken: String,
  resetTokenExpiration: Date,
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
    next(new Error(err));
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
      return next(new Error(`Product with ID ${id} not found in the cart.`));
    }

    // Remove the product from the cart by filtering
    this.cart.items = this.cart.items.filter(
      (item) => !item.productId.equals(id)
    );

    return await this.save();
  } catch (err) {
    next(new Error(err));
  }
};

userSchema.methods.clearCart = async function () {
  try {
    this.cart = { items: [] };
    return await this.save();
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = mongoose.model("User", userSchema);
