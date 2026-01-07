import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        require: true
    },
    deposit: { type: Number, default: 0 },
    finalPayment: { type: Number, default: 0 },
    paymentStatus: { type: Boolean, default: false },
    paymentDate: Date,
});

export default mongoose.model("Payment", paymentSchema);