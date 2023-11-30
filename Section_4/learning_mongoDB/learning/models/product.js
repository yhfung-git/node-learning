const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");
class Product {
  constructor(title, imageUrl, description, price, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
  }

  async save() {
    try {
      const db = await getDb();
      const product = await db.collection("products").insertOne(this);

      if (product.acknowledged && product.insertedId) {
        return product;
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  }

  static async fetchAll() {
    try {
      const db = await getDb();
      const products = await db.collection("products").find().toArray();

      if (!products) {
        console.log("No products found!");
        return null;
      }

      return products;
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  static async findById(id) {
    try {
      const db = await getDb();
      // the id passed will be a string, we need to convert it into an object id so it can be compared with _id, which is an object id provided by MongoDB
      const objectId = new ObjectId(id);
      const product = await db
        .collection("products")
        .findOne({ _id: objectId });

      if (product) {
        return product;
      }
    } catch (err) {
      console.error("Error finding product by ID:", err);
    }
  }

  async update(id) {
    try {
      const db = await getDb();
      const objectId = new ObjectId(id);

      const updatedProduct = await db
        .collection("products")
        .updateOne({ _id: objectId }, { $set: this });

      if (updatedProduct) {
        return updatedProduct;
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  }

  static async destroy(id) {
    try {
      const db = await getDb();
      const objectId = new ObjectId(id);
      const deletedProduct = await db
        .collection("products")
        .deleteOne({ _id: objectId });

      if (deletedProduct) {
        return deletedProduct;
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Product;
