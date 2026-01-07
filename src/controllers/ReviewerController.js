import parseFollowers from "../helper/parseFollower.js";
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
}

export default reviewerController;