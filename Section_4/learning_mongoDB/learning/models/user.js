const { getDb } = require("../utils/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(id, username, email, cart) {
    this._id = id;
    this.username = username;
    this.email = email;
    this.cart = cart ? cart : (cart = { items: [] });
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

  async getCart() {
    try {
      const db = await getDb();
      // To fetch and store all the IDs from the cart.items
      const productIds = this.cart.items.map((item) => item.productId);

      const products = await db
        .collection("products")
        // Using MongoDB's $in Operator, this query searches for products whose _id matches any of the specified productIds.
        .find({ _id: { $in: productIds } })
        .toArray();

      // Map over each product in the "products"
      return products.map((product) => {
        // Find the corresponding product's quantity
        const { quantity } = this.cart.items.find((item) => {
          return item.productId.equals(product._id);
        });

        // Return a new object for each product, including its original properties and the "quantity" from the cart
        return { ...product, quantity };
      });
    } catch (err) {
      console.error("Error getting the cart:", err);
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

  // async destroy(id) {
  //   try {
  //     // filter() = keep the item only when it returns true
  //     const updatedCartItems = this.cart.items.filter((item) => {
  //       // keep the items where the productId is NOT equal to the id
  //       // if productId not equal to the id (which we want to delete), it returns true and it will be keep.
  //       // if productId is equal to the id (which we want to delete), it returns false and it will be removed.
  //       return !item.productId.equals(id);
  //     });

  //     const db = await getDb();
  //     return db
  //       .collection("users")
  //       .updateOne(
  //         { _id: new ObjectId(this._id) },
  //         { $set: { cart: { items: updatedCartItems } } }
  //       );
  //   } catch (err) {
  //     console.error("Error destroying product from cart:", err);
  //   }
  // }

  async destroy(id) {
    try {
      const db = await getDb();
      return db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $pull: { "cart.items": { productId: new ObjectId(id) } } }
        );
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = User;
