const { getDb } = require("../utils/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  async save() {
    try {
      const db = getDb();
      const user = await db.collection("users").insertOne(this);

      if (user.acknowledged && user.insertedId) {
        return user;
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }

  static async findById(id) {
    try {
      const db = getDb();
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
