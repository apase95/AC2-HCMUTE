import { connect } from 'http2';
import mongoose from 'mongoose';

export const connectDB = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
