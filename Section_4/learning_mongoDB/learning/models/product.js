const getDb = require("../utils/database").getDb;
class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
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
}

module.exports = Product;
