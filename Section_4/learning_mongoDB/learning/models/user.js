const { getDb } = require("../utils/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(id, username, email, cart) {
    this._id = id;
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
  }

  async save() {
    try {
      const db = await getDb();
      const user = await db.collection("users").insertOne(this);

      if (user.acknowledged && user.insertedId) {
        return user;
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }

  async addToCart(product) {
    try {
      const cartProductIndex = await this.cart.items.findIndex((cp) => {
        // Reference types: Objects, like MongoDB ObjectId instances, may have the same values but not the same address in memory.
        // To compare their values, use the .equals() method provided by the MongoDB Node.js driver ("mongodb" package).
        return cp.productId.equals(product._id);
      });

      const updatedCartItems = [...this.cart.items];

      if (cartProductIndex >= 0) {
        updatedCartItems[cartProductIndex].quantity += 1;
      } else {
        updatedCartItems.push({
          productId: new ObjectId(product._id),
          quantity: 1,
        });
      }

      const updatedCart = {
        items: updatedCartItems,
      };

      const db = await getDb();
      const objectId = new ObjectId(this._id);

      return await db
        .collection("users")
        .updateOne({ _id: objectId }, { $set: { cart: updatedCart } });
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  }

  static async findById(id) {
    try {
      const db = await getDb();
      const objectId = new ObjectId(id);

      const user = db.collection("users").findOne({ _id: objectId });

      if (user) {
        return user;
      }
    } catch (err) {
      console.error("Error finding user:", err);
    }
  }
}

module.exports = User;
