import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";

const env = await load();
const mongodbUri = env["MONGODB_URI"];

let db: Database;

export const connectDb = async () => {
  try {
    const client = new MongoClient();
    await client.connect(mongodbUri);

    db = client.database("todos");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export const getDb = () => {
  return db;
};
