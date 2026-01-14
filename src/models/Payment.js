import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
        unique: true,
    },
    accountNumber: String,
    bankId: String,

    deposit: { type: Number, default: 0 },
    depositImage: String,
    depositDate: Date,

    finalPayment: { type: Number, default: 0 },
    finalPaymentImage: String,
    finalPaymentDate: Date,

    paymentStatus: { type: String, enum: ["pending", "verified"], default: "pending"},
    createdAt: { type: Date, default: Date.now }
});

paymentSchema.index({ appointment: 1 });

export default mongoose.model("Payment", paymentSchema);