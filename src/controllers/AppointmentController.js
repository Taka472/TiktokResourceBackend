import getStartEndOfTodayVN from "../helper/formatVNDate.js";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";

const appointmentController = {
    getDashboard: async (req, res) => {
        try {
            const now = new Date();
            const { startOfDay, endOfDay } = getStartEndOfTodayVN()

            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + 1);
            startOfWeek.setHours(0, 0, 0, 0);

            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            const today = await Appointment.find({
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            }).populate("reviewerId", "nickTiktok");

            const weekCount = await Appointment.countDocuments({
                appointmentDate: { $gte: startOfWeek },
            });

            const paidThisMonthAgg = await Appointment.aggregate([
                {
                    $lookup: {
                        from: "payments",
                        localField: "_id",
                        foreignField: "appointment",
                        as: "payment",
                    }
                },
                {
                    $addFields: {
                        payment: {
                            $arrayElemAt: ["$payment", 0]
                        }
                    }
                },
                {
                    $match: {
                        appointmentDate: { $gte: startOfMonth },
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
                    $match: {
                        "payment.paymentStatus": {$in: ["verified", "deposit"]},
                    },
                },
                {
                    $count: "count",
                },
            ]);

            const paidThisMonth = paidThisMonthAgg[0]?.count || 0;

            const paidAmountThisMonthAgg = await Appointment.aggregate([
                {
                    $lookup: {
                        from: "payments",
                        localField: "_id",
                        foreignField: "appointment",
                        as: "payment",
                    }
                },
                {
                    $addFields: {
                        payment: {
                            $arrayElemAt: ["$payment", 0]
                        }
                    }
                },
                {
                    $match: {
                        $or: [
                            {appointmentDate: { $gte: startOfMonth }},
                            {"payment.finalPaymentDate": { $gte: startOfMonth, $lte: endOfMonth }},
                        ]
                    },
                },

                // 3️⃣ Tính tiền
                {
                    $project: {
                        depositAmount: {
                            $cond: [
                                { $ne: ["$payment.depositImage", null] },
                                "$payment.deposit",
                                0,
                            ],
                        },
                        finalAmount: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$payment.paymentStatus", "verified"] },
                                        {
                                            $gte: [
                                                "$payment.finalPaymentDate",
                                                startOfMonth,
                                            ],
                                        },
                                        {
                                            $lte: [
                                                "$payment.finalPaymentDate",
                                                endOfMonth,
                                            ],
                                        },
                                    ],
                                },
                                "$payment.finalPayment",
                                0,
                            ],
                        },
                    },
                },

                // 4️⃣ Cộng tổng
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: { $add: ["$depositAmount", "$finalAmount"] },
                        },
                    },
                },
            ]);


            const totalPaid = paidAmountThisMonthAgg[0]?.total || 0;

            res.json({
                today: today.map((a) => ({
                    id: a._id,
                    reviewer: a.reviewerId.nickTiktok,
                    datetime: a.appointmentDate
                })),
                weekCount,
                paidThisMonth,
                totalPaid
            });
        } catch (err) {
            res.status(500).json({ message: err });
        }
    },

    getAppointmentToday: async(req, res) => {
        try {
            const now = new Date();

            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            const today = await Appointment.find({
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            }).populate("reviewerId", "nickTiktok");

            res.json({
                today: today.map((a) => ({
                    id: a._id,
                    reviewer: a.reviewerId.nickTiktok,
                    datetime: a.appointmentDate
                })),
            });
        } catch (err) {
            res.status(500).message({ message: err });
        }
    },

    addAppointment: async (req, res) => {
        try {
            const { reviewerId, datetime } = req.body;

            if (!reviewerId) {
                return res.status(400).json({ message: "Thiếu nick tiktok" });
            }

            const appointment = await Appointment.create({
                reviewerId,
                appointmentDate: datetime
            })
            res.status(201).json(appointment);
        } catch (err) {
            console.error(err);
            res.status(500).message({ message: err });
        }
    },

    getWeekAppointment: async (req, res) => {
        try {
            const start = new Date(req.query.start);
            const end = new Date(start);
            end.setDate(start.getDate() + 7);

            const data = await Appointment.aggregate([
                {
                    $match: {
                        appointmentDate: { $gte: start, $lt: end },
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
                        paymentStatus: 1,
                        reviewer: {
                            _id: "$reviewer._id",
                            nickTiktok: "$reviewer.nickTiktok",
                        },
                    },
                },
                {
                    $sort: { appointmentDate: 1 },
                },
            ]);

            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    updateAppointment: async (req, res) => {
        try {
            const { reviewerId, datetime } = req.body;
            const appointment = await Appointment.findByIdAndUpdate(
                req.params.id,
                { reviewerId, appointmentDate: datetime },
                { new: true }
            )
            res.json(appointment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteAppointment: async (req, res) => {
        try {
            const { id } = req.params;
            await Payment.findOneAndDelete({
                appointment: id,
            });

            const appointment = await Appointment.findByIdAndDelete(id);

            if (!appointment) {
                return res.status(404).json({ message: "No appointment to delete" });
            }

            res.json({ message: "Delete successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },
};

export default appointmentController;