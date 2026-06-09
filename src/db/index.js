import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in .env file");
        }
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("MongoDB connection error:", error.message);
        }
        else {
            console.error("Unknown MongoDB connection error:", error);
        }
        process.exit(1);
    }
};
//# sourceMappingURL=index.js.map