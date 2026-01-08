import parseFollowers from "../helper/parseFollower.js";
import formatFollowers from "../helper/reverseFollower.js";
import Reviewer from "../models/Reviewer.js";

const reviewerController = {
    addReviewer: async (req, res) => {
        try {
            const { nickTiktok, followers, contact, name } = req.body;

            if (!nickTiktok) {
                return res.status(400).json({ message: "Thiếu nick tiktok" });
            }

            const reviewer = await Reviewer.create({
                nickTiktok,
                followers: parseFollowers(followers),
                contact,
                name,
            });

            res.status(201).json(reviewer);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },

    getTiktokerName: async (req, res) => {
        try {
            const reviewers = await Reviewer.find(
                {},
                { nickTiktok: 1 }
            ).sort({ createdAt: -1 });

            res.json(reviewers);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },

    getAllReviewer: async (req, res) => {
        try {
            const reviewers = await Reviewer.aggregate([
                {
                    $lookup: {
                        from: "appointments",
                        localField: "_id",
                        foreignField: "reviewerId",
                        as: "appointments",
                    },
                },
                {
                    $addFields: {
                        hasAppointment: { $gt: [{ $size: "$appointments" }, 0] },
                        latestAppointmentDate: {
                            $max: "$appointments.appointmentDate",
                        },
                    },
                },
                {
                    $sort: {
                        hasAppointment: 1,              
                        latestAppointmentDate: -1,         
                    },
                },
                {
                    $project: {
                        _id: 1,
                        nickTiktok: 1,
                        followers: 1,
                        contact: 1,
                        name: 1,
                        hasAppointment: 1,
                        latestAppointmentDate: 1,          
                    },
                },
            ]);

            const formatted = reviewers.map(r => ({
                ...r,
                followers: formatFollowers(r.followers),
            }));

            res.status(200).json(formatted);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },

    getReviewerById: async (req, res) => {
        try {
            const reviewer = await Reviewer.findById(req.params.id);
            if (!reviewer) {
                return res.status(404).json({ message: "Reviewer not found" });
            }
            res.json(reviewer);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },

    updateReviewer: async (req, res) => {
        try {
            const { nickTiktok, followers, contact, name } = req.body;
            const reviewer = await Reviewer.findByIdAndUpdate(
                req.params.id,
                { nickTiktok, followers: parseFollowers(followers), contact, name },
                { new: true },
            )
            res.status(200).json(reviewer);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },

    deleteReviewer: async (req, res) => {
        try {
            const { id } = req.params;
            const reviewer = await Reviewer.findByIdAndDelete(id);

            if (!reviewer) {
                return res.status(404).json({ message: "No reviewer to delete" });
            }

            res.json({ message: "Delete successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },
}

export default reviewerController;