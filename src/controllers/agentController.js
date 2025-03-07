import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import Agent from "../models/agentModel.js";

export const agentTransfer = async (req, res, next) => {
    try {
        const { receiverId, amount } = req.body;
        const agentId = req.user.userId; // Extracted from auth middleware

        // Ensure valid input
        if (!receiverId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid transfer details" });
        }

        // Find agent and receiver
        const agent = await User.findById(agentId);
        const receiver = await User.findById(receiverId);

        if (!agent || !receiver) {
            return res.status(404).json({ message: "Agent or receiver not found" });
        }

        // Ensure agent has sufficient balance
        if (agent.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Deduct amount from agent and add to receiver
        agent.balance -= amount;
        receiver.balance += amount;

        await agent.save();
        await receiver.save();

        // Record transaction
        const transaction = new Transaction({
            userId: agentId,
            type: "agent_transfer",
            amount,
            status: "completed",
            receiverId
        });

        await transaction.save();

        res.status(200).json({ message: "Agent transfer successful", transaction });

    } catch (error) {
        next(error);
    }
};
// Create an Agent
export const createAgent = async (req, res, next) => {
    const { name, location, userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const agent = new Agent({
            name,
            location,
            userId,
        });

        await agent.save();
        res.status(201).json({ message: "Agent created successfully", agent });
    } catch (error) {
        next(error);
    }
};

// Transfer Money Between Users (Agent)
export const agentTransfer = async (req, res, next) => {
    const { senderId, recipientId, amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ message: "Invalid transfer amount" });
    }

    try {
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        if (!sender || !recipient) return res.status(404).json({ message: "User(s) not found" });

        if (sender.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Deduct from sender's balance and add to recipient's balance
        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save();
        await recipient.save();

        // Log transaction
        const transaction = new Transaction({
            userId: senderId,
            recipientId,
            amount,
            type: 'transfer',
            status: 'completed'
        });

        await transaction.save();

        res.status(200).json({ message: "Transfer successful", transaction });
    } catch (error) {
        next(error);
    }
};
