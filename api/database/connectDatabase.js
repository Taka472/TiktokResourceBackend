import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on('connected', () => {
        console.log("Connected to MongoDB");
    });
}

export default ConnectDatabase;