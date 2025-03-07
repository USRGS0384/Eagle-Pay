import Portal from "../models/portalModel.js";

export const createPortal = async (req, res, next) => {
    try {
        const { name, type, accountNumber } = req.body;

        if (!name || !type || !accountNumber) {
            return res.status(400).json({ message: "Invalid portal details" });
        }

        const portal = new Portal({ name, type, accountNumber });
        await portal.save();

        res.status(201).json({ message: "Portal created successfully", portal });

    } catch (error) {
        next(error);
    }
};

export const payPortal = async (req, res, next) => {
    try {
        const { portalId, amount } = req.body;
        const userId = req.user.userId;

        if (!portalId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid payment details" });
        }

        const user = await User.findById(userId);
        const portal = await Portal.findById(portalId);

        if (!user || !portal) {
            return res.status(404).json({ message: "User or portal not found" });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Deduct from user and add to portal
        user.balance -= amount;
        portal.balance += amount;

        await user.save();
        await portal.save();

        // Record transaction
        const transaction = new Transaction({
            userId,
            type: "portal_payment",
            amount,
            status: "completed",
            portalId
        });

        await transaction.save();

        res.status(200).json({ message: "Payment successful", transaction });

    } catch (error) {
        next(error);
    }
};

