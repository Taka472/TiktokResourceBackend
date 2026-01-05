import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviewer",
        require: true,
    },
    appointmentDate: { type: Date, require: true },
    deposit: { type: Number, default: 0 },
    finalPayment: { type: Number, default: 0 },
    paymentStatus: { type: Boolean, default: false },
    paymentDate: Date,
    tiktokPost: String,
    fbIgPost: String,
    createdAt: { type: Date, default: Date.now() },
});

appointmentSchema.index({ appointmentDate: 1 });

export default mongoose.model("Appointment", appointmentSchema)