import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) return;
  let uri = "mongodb://localhost:27017/TP2-DB";
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};
