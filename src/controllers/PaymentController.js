import getStartOfTomorrowVN from "../helper/getTomorrow";
import Appointment from "../models/Appointment";
import Payment from "../models/Payment";

const paymentController = {
    getCanPayAppointment: async (req, res) => {
        try {
            const startOfTomorrow = getStartOfTomorrowVN();

            const appointments = await Appointment.agregate([
                {
                    $match: {
                        appointmentDate: { $gte: startOfTomorrow },
                    },
                },
                {
                    $lookup: {
                        from: "payments",
                        localField: "_id",
                        foreignField: "appointment",
                        as: "payment"
                    },
                },
                {
                    $addFields: {
                        isPaid: {
                            $cond: [
                                { $gt: [{ $size: "$payment" }, 0] },
                                { $arrayElemAt: ["$payment.paymentStatus", 0] },
                                false,
                            ],
                        },
                    },
                },
                {
                    $match: {
                        isPaid: false,
                    },
                },
                {
                    $lookup: {
                        from: "reviewers",
                        localField: "reviewerId",
                        foreignField: "_id",
                        as: "reviewer",
                    },
                },
                { $unwind: "$reviewer" },
                {
                    $project: {
                        appointmentDate: 1,
                        reviewer: {
                            nickTiktok: "$reviewer.nickTiktok",
                            followers: "$reviewer.followers",
                        },
                    },
                },
                { $sort: { appointmentDate: 1 } } 
            ])

            res.status(200).json(appointments);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    createPayment: async (req, res) => {
        try {
            const { appointmentId, deposit, finalPayment, accountNumber, bankId } = req.body;

            const exist = await Payment.findOne({ appointment: appointmentId });
            if (exist) {
                return res.status(400).json({ message: "Payment đã tồn tại" });
            }

            const payment = await Payment.create({
                appointment: appointmentId,
                deposit,
                finalPayment,
                accountNumber,
                bankId
            });

            res.status(200).json(payment);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    uploadPaymentImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Thiếu ảnh thanh toán" });
            }

            const payment = await Payment.findById(req.params.id);

            if (!payment) {
                return res.status(404).json({ message: "KHông tìm thấy payment" });
            }

            payment.paymentImage = req.file.path;
            payment.paymentStatus = true;
            payment.paymentDate = new Date();

            await payment.save();
            res.status(200).json({
                message: "Upload xác thực thanh toán thàng công",
                payment,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
}

export default paymentController;