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
    finalPayment: { type: Number, default: 0 },
    paymentStatus: { type: Boolean, default: false },
    paymentImage: String,
    paymentDate: Date,
    createAt: { type: Date, default: Date.now() }
});

export default mongoose.model("Payment", paymentSchema);