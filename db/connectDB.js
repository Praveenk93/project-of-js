import mongoose from "mongoose";

async function connectDB() {
    const connectionString = process.env.MONGODB_URI;

    if (!connectionString) {
        throw new Error("MONGODB_URI is missing. Add your MongoDB connection string to the root .env file.");
    }

    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
}

export default connectDB;
