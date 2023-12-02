const { MongoClient } = require("mongodb");

require("dotenv").config();

let _db;

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

const mongoConnect = async () => {
  try {
    await client.connect();
    // console.log(client);
    console.log("Successfully connected to Atlas!");
    _db = client.db();
  } catch (err) {
    console.log("Error connecting to MongoDB:", err.stack);
    throw err;
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error("Database not connected!");
  }
  return _db;
};

module.exports = { mongoConnect, getDb };
