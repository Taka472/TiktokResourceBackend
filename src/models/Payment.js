import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
        unique: true,
    },

    deposit: { type: Number, default: 0 },
    depositImage: { type: String, default: "" },
    depositDate: Date,

    finalPayment: { type: Number, default: 0 },
    finalPaymentImage: { type: String, default: "" },
    finalPaymentDate: Date,

    paymentStatus: { type: String, enum: ["pending", "verified"], default: "pending"},
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);