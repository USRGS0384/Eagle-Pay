import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

// Create User Account
export const createUserAccount = async (req, res, next) => {
    const { name, email, password, pin, role } = req.body;

    if (!name || !email || !password || !pin) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const user = new User({
            name,
            email,
            password, // You should hash the password before saving
            pin,
            role: role || 'user',  // Default to 'user' if no role provided
            balance: 0  // Starting balance
        });
        
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        next(error);
    }
};

// Profile User (View User Information)
export const profileUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

// Get User's Transaction History
export const getUserTransactions = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const transactions = await Transaction.find({ userId });

        if (!transactions) return res.status(404).json({ message: "No transactions found" });

        res.status(200).json({ transactions });
    } catch (error) {
        next(error);
    }
};

