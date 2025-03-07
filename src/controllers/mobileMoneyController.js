import axios from "axios";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

// Mobile Money APIs (These should be obtained from providers)
const MOBILE_MONEY_APIS = {
    mtn_momo: "https://api.mtn.com/momo/v1/transactions",
    mpesa: "https://api.safaricom.co.ke/mpesa/v1/transactions",
    digicash: "https://api.digicash.com/transactions"
};

// Deposit from Mobile Money
export const depositFromMobileMoney = async (req, res, next) => {
    try {
        const { provider, phoneNumber, amount } = req.body;
        const userId = req.user.userId;

        if (!provider || !phoneNumber || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit details" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure provider exists
        if (!MOBILE_MONEY_APIS[provider]) {
            return res.status(400).json({ message: "Invalid provider" });
        }

        // Simulate API request to mobile money provider
        const response = await axios.post(MOBILE_MONEY_APIS[provider], {
            phoneNumber,
            amount,
            transactionType: "deposit"
        });

        if (response.data.status !== "success") {
            return res.status(400).json({ message: "Deposit failed" });
        }

        // Update user balance
        user.balance += amount;
        await user.save();

        // Record transaction
        const transaction = new Transaction({
            userId,
            type: "mobile_money_deposit",
            amount,
            status: "completed",
            provider
        });

        await transaction.save();

        res.status(200).json({ message: "Deposit successful", transaction });

    } catch (error) {
        next(error);
    }
};

// Withdraw to Mobile Money
export const withdrawToMobileMoney = async (req, res, next) => {
    try {
        const { provider, phoneNumber, amount } = req.body;
        const userId = req.user.userId;

        if (!provider || !phoneNumber || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal details" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Ensure provider exists
        if (!MOBILE_MONEY_APIS[provider]) {
            return res.status(400).json({ message: "Invalid provider" });
        }

        // Simulate API request to mobile money provider
        const response = await axios.post(MOBILE_MONEY_APIS[provider], {
            phoneNumber,
            amount,
            transactionType: "withdraw"
        });

        if (response.data.status !== "success") {
            return res.status(400).json({ message: "Withdrawal failed" });
        }

        // Deduct amount from user
        user.balance -= amount;
        await user.save();

        // Record transaction
        const transaction = new Transaction({
            userId,
            type: "mobile_money_withdrawal",
            amount,
            status: "completed",
            provider
        });

        await transaction.save();

        res.status(200).json({ message: "Withdrawal successful", transaction });

    } catch (error) {
        next(error);
    }
};

