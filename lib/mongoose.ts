import "@/database";
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((res) => {
        console.log("Connected to MongoDB");
        return res;
      })
      .catch((err: Error) => {
        console.log("Error connecting to MongoDB:", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
