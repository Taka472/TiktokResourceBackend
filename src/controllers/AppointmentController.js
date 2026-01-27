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

            const today = await Appointment.find({
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            }).populate("reviewerId", "nickTiktok");

            const weekCount = await Appointment.countDocuments({
                appointmentDate: { $gte: startOfWeek },
            });

            const paidThisMonthAgg = await Appointment.aggregate([
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
                        "payment.paymentStatus": "verified",
                    },
                },
                {
                    $count: "count",
                },
            ]);

            const paidThisMonth = paidThisMonthAgg[0]?.count || 0;

            res.json({
                today: today.map((a) => ({
                    id: a._id,
                    reviewer: a.reviewerId.nickTiktok,
                    datetime: a.appointmentDate
                })),
                weekCount,
                paidThisMonth,
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

            const appointments = await Appointment.find({
                appointmentDate: { $gte: start, $lt: end }
            }).populate("reviewerId", "nickTiktok");

            res.status(200).json(appointments);
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