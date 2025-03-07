import axios from "axios";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

// Simulated bank gateway API
const BANK_GATEWAY_API = "https://api.bankgateway.com/transactions";

// Deposit from Bank
export const depositFromBank = async (req, res, next) => {
    try {
        const { bankName, accountNumber, amount } = req.body;
        const userId = req.user.userId;

        if (!bankName || !accountNumber || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit details" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Simulate bank transaction
        const response = await axios.post(BANK_GATEWAY_API, {
            bankName,
            accountNumber,
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
            type: "bank_deposit",
            amount,
            status: "completed",
            bankName
        });

        await transaction.save();

        res.status(200).json({ message: "Bank deposit successful", transaction });

    } catch (error) {
        next(error);
    }
};

// Withdraw to Bank
export const withdrawToBank = async (req, res, next) => {
    try {
        const { bankName, accountNumber, amount } = req.body;
        const userId = req.user.userId;

        if (!bankName || !accountNumber || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal details" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Simulate bank transaction
        const response = await axios.post(BANK_GATEWAY_API, {
            bankName,
            accountNumber,
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
            type: "bank_withdrawal",
            amount,
            status: "completed",
            bankName
        });

        await transaction.save();

        res.status(200).json({ message: "Bank withdrawal successful", transaction });

    } catch (error) {
        next(error);
    }
};

