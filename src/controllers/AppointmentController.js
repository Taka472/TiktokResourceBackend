import Appointment from "../models/Appointment.js";

const appointmentController = {
    getDashboard: async (req, res) => {
        try {
            const now = new Date();

            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + 1);
            startOfWeek.setHours(0, 0, 0, 0);

            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const today = await Appointment.find({
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            }).populate("reviewer", "nickTiktok");

            const weekCount = await Appointment.countDocuments({
                appointmentDate: { $gte: startOfWeek },
            });

            const paidThisMonth = await Appointment.countDocuments({
                paymentStatus: true,
                appointmentDate: { $gte: startOfMonth }
            });

            res.json({
                today: today.map((a) => ({
                    id: a._id,
                    reviewer: a.reviewer.nickTiktok,
                    datetime: a.appointmentDate
                })),
                weekCount,
                paidThisMonth,
            });
        } catch (err) {
            res.status(err.status).json({ message: err });
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
            }).populate("reviewer", "nickTiktok");

            res.json({
                today: today.map((a) => ({
                    id: a._id,
                    reviewer: a.reviewer.nickTiktok,
                    datetime: a.appointmentDate
                })),
            });
        } catch (err) {
            res.status(err.status).message({ message: err });
        }
    }
};

export default appointmentController;