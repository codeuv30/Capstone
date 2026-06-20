import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.error("MongoDB Connected");
    } catch(err) {
        console.error("MongoDB connection error: ", err);
        process.exit(1);
    }
}

export default connectToDB;