import mongoose from "mongoose";

export const connectDb = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
};
