import getStartOfTomorrowVN from "../helper/getTomorrow";
import Appointment from "../models/Appointment";
import Payment from "../models/Payment";

const paymentController = {
    getPaymentDashboard: async (req, res) => {
        try {
            const startOfTomorrowVN = getStartOfTomorrowVN();

            const data = await Appointment.aggregate([
                {
                    $match: {
                        appointmentDate: { $gte: startOfTomorrowVN },
                    },
                },
                {
                    $lookup: {
                        from: "payments",
                        localField: "_id",
                        foreignField: "appointment",
                        as: "payment",
                    },
                },
                {
                    $addFields: {
                        payment: { $arrayElemAt: ["$payment", 0] },
                    },
                },
                {
                    $addFields: {
                        paymentStatus: {
                            $cond: [
                                { $eq: ["$payment", null] },
                                "unpaid",
                                "$payment.paymentStatus",
                            ],
                        },
                        paymentDate: "$payment.paymentDate",
                    },
                },
                {
                    $addFields: {
                        statusOrder: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$paymentStatus", "unpaid"] }, then: 0 },
                                    { case: { $eq: ["$paymentStatus", "pending"] }, then: 1 },
                                    { case: { $eq: ["$paymentStatus", "verified"] }, then: 2 },
                                ],
                                default: 3,
                            },
                        },
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
                        appointmentId: "$_id",
                        appointmentDate: 1,
                        paymentId: "$payment._id",
                        paymentStatus: 1,
                        paymentDate: 1,
                        statusOrder: 1,
                        reviewer: {
                            _id: "$reviewer._id",
                            nickTiktok: "$reviewer.nickTiktok",
                            followers: "$reviewer.followers",
                        },
                        deposit: "$payment.deposit",
                        finalPayment: "$payment.finalPayment",
                    },
                },
                {
                    $sort: {
                        statusOrder: 1,          
                        paymentDate: -1,         
                        appointmentDate: 1,      
                    },
                },
            ]);

            res.status(200).json(data);
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
                bankId,
                paymentStatus: "pending",
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
            payment.paymentStatus = "verified";
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
    },

    uploadDepositImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Thiếu ảnh cọc" });
            }

            const payment = await Payment.findById(req.params.id);
            if (!payment) {
                return res.status(404).json({ message: "Không tìm thấy payment" });
            }

            payment.depositImage = req.file.path;
            payment.depositDate = new Date();

            await payment.save();
            res.status(200).json({
                message: "Upload ảnh cọc thành công",
                payment,
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },
}

export default paymentController;