import mongoose from "mongoose"

const reviewerSchema = mongoose.Schema({
    nickTiktok: { type: String, require: true },
    followers: { type: Number, default: 0 },
    contact: {
        type: {
            type: String,
        },
        value: String, 
    },
    name: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Reviewer", reviewerSchema)