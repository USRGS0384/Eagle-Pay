import Institution from "../models/institutionModel.js";
import User from "../models/userModel.js";

// Create Institution Account (e.g., School, University)
export const createInstitutionAccount = async (req, res, next) => {
    const { name, location, type, accountId } = req.body;

    try {
        const institution = new Institution({
            name,
            location,
            type,  // Type: e.g., 'school', 'university', etc.
            accountId
        });

        await institution.save();
        res.status(201).json({ message: "Institution account created", institution });
    } catch (error) {
        next(error);
    }
};

// Deposit Fees to Institution Account
export const depositFees = async (req, res, next) => {
    const { institutionId, amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ message: "Invalid fee amount" });
    }

    try {
        const institution = await Institution.findById(institutionId);

        if (!institution) return res.status(404).json({ message: "Institution not found" });

        institution.balance += amount;

        await institution.save();
        res.status(200).json({ message: "Fees deposited", institution });
    } catch (error) {
        next(error);
    }
};

