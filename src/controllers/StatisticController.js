import { getMonth } from "../helper/getMonth.js";
import formatFollowers from "../helper/reverseFollower.js";
import Appointment from "../models/Appointment.js";

export const statisticController = {
    getMonthlyStatistic: async (req, res) => {
        try {
            const { time } = req.query;
            let start = null, end = null;

            if (time) {
                const [year, month] = time.split("-").map(Number);
                ({ start, end } = getMonth(year, month));
            }

            const result = await Appointment.aggregate([
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
                    $lookup: {
                        from: "reviewers",
                        localField: "reviewerId",
                        foreignField: "_id",
                        as: "reviewer",
                    }
                },
                {
                    $unwind: "$reviewer"
                },
                {
                    $match: 
                        {
                            $or:
                            [
                                {
                                    "payment.paymentStatus": "verified",
                                    "payment.finalPaymentDate": { $gte: start, $lte: end },
                                },
                                {
                                    "payment.paymentStatus": "deposit",
                                    "appointmentDate": { $gte: start, $lte: end },
                                },
                            ]
                        },
                },
                {
                    $addFields: {
                        depositAmount: {
                            $cond: [
                                {
                                    $and: [
                                        { $ifNull: ["$payment.depositImage", false] },
                                        { $gte: ["$appointmentDate", start] },
                                        { $lte: ["$appointmentDate", end] },
                                    ],
                                },
                                { $ifNull: ["$payment.deposit", 0] },
                                0,
                            ],
                        },
                        finalAmount: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$payment.paymentStatus", "verified"] },
                                        { $gte: ["$payment.finalPaymentDate", start] },
                                        { $lte: ["$payment.finalPaymentDate", end] },
                                    ]
                                },
                                { $ifNull: ["$payment.finalPayment", 0] },
                                0,
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$reviewer._id",
                        reviewerName: { $first: "$reviewer.nickTiktok" },
                        followers: { $first: "$reviewer.followers" },
                        totalDeposit: { $sum: "$depositAmount" },
                        totalFinal: { $sum: "$finalAmount" },
                    }
                },
                {
                    $addFields: {
                        totalPayment: { $add: ["$totalDeposit", "$totalFinal"] },
                        ratio: {
                            $cond: [
                                { $gt: [{ $add: ["$totalDeposit", "$totalFinal"] }, 0] },
                                { $divide: [{ $add: ["$totalDeposit", "$totalFinal"] }, "$followers"] },
                                0,
                            ],
                        },
                    }
                },
                {
                    $sort: { ratio: -1 }
                },
                {
                    $group: {
                        _id: null,
                        reviewers: {
                            $push: {
                                reviewerName: "$reviewerName",
                                followers: "$followers",
                                totalPayment: "$totalPayment",
                                ratio: "$ratio",
                            },
                        },
                        totalDeposit: { $sum: "$totalDeposit" },
                        totalFinalPayment: { $sum: "$totalFinal" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalDeposit: 1,
                        totalFinalPayment: 1,
                        totalSpent: {
                            $add: ["$totalDeposit", "$totalFinalPayment"],
                        },
                        depositPercent: {
                            $cond: [
                                { $gte: [{ $add: ["$totalDeposit", "$totalFinalPayment"] }, 0] },
                                {
                                    $multiply: [
                                        { $divide: ["$totalDeposit", { $add: ["$totalDeposit", "$totalFinalPayment"] }] },
                                        100
                                    ],
                                },
                                0
                            ],
                        },
                        finalPercent: {
                            $cond: [
                                { $gt: [{ $add: ["$totalDeposit", "$totalFinalPayment"] }, 0] },
                                {
                                    $multiply: [
                                        { $divide: ["$totalFinalPayment", {$add: ["$totalDeposit", "$totalFinalPayment"]}] },
                                        100,
                                    ]
                                },
                                0,
                            ]
                        },
                        reviewers: 1
                    },
                }
            ]);

            const raw = result[0] || {
                totalSpent: 0,
                totalDeposit: 0,
                totalFinalPayment: 0,
                depositPercent: 0,
                finalPercent: 0,
                reviewers: []
            };

            const formatted = {
                ...raw,
                reviewers: raw.reviewers.map(r => ({
                    ...r,
                    followers: formatFollowers(r.followers),
                })),
            };

            res.json(formatted);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },
}