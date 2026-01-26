import mongoose from "mongoose";

const ConnectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on('connected', () => {
        console.log("Connected to MongoDB");
    });
}

export default ConnectDatabase;