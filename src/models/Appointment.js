import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviewer",
        require: true,
    },
    appointmentDate: { type: Date, require: true },
    tiktokPost: String,
    fbIgPost: String,
    createdAt: { type: Date, default: Date.now() },
});

appointmentSchema.index({ appointmentDate: 1 });

export default mongoose.model("Appointment", appointmentSchema);