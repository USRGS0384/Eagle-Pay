import Transaction from "../models/transactionModel.js";
import moment from "moment";

// Transaction Summary by Date Range (e.g., Daily, Weekly, Monthly)
export const getTransactionSummary = async (req, res, next) => {
    const { period } = req.params;  // Period could be 'daily', 'weekly', 'monthly', 'annually'

    let startDate;
    let endDate = moment().toDate();

    switch (period) {
        case 'daily':
            startDate = moment().startOf('day').toDate();
            break;
        case 'weekly':
            startDate = moment().startOf('week').toDate();
            break;
        case 'monthly':
            startDate = moment().startOf('month').toDate();
            break;
        case 'annually':
            startDate = moment().startOf('year').toDate();
            break;
        default:
            return res.status(400).json({ message: "Invalid period" });
    }

    try {
        const summary = await Transaction.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" }, transactionCount: { $sum: 1 } } }
        ]);

        res.status(200).json({ summary });
    } catch (error) {
        next(error);
    }
};

