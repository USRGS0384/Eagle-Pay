import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';
import Commission from '../models/commissionModel.js';
import { calculateFees } from '../utils/transactionUtils.js';
import { calculateTax } from '../utils/taxCalculator.js';
import { sendNotification } from '../services/notificationService.js';

export const deposit = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const userId = req.user.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit amount" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance += amount;
        await user.save();

        const transaction = new Transaction({ userId, type: "deposit", amount, status: "successful" });
        await transaction.save();

        res.status(200).json({ message: "Deposit successful", balance: user.balance, transaction });
    } catch (error) {
        next(error);
    }
};

export const withdraw = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const userId = req.user.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        user.balance -= amount;
        await user.save();

        const transaction = new Transaction({ userId, type: "withdraw", amount, status: "successful" });
        await transaction.save();

        res.status(200).json({ message: "Withdrawal successful", balance: user.balance, transaction });
    } catch (error) {
        next(error);
    }
};

export const transfer = async (req, res, next) => {
    try {
        const { recipientId, amount } = req.body;
        const senderId = req.user.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid transfer amount" });
        }

        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save();
        await recipient.save();

        const senderTransaction = new Transaction({ userId: senderId, type: "transfer", amount, status: "successful", recipientId });
        const recipientTransaction = new Transaction({ userId: recipientId, type: "receive", amount, status: "successful", senderId });

        await senderTransaction.save();
        await recipientTransaction.save();

        res.status(200).json({ message: "Transfer successful", senderBalance: sender.balance, recipientBalance: recipient.balance, senderTransaction, recipientTransaction });
    } catch (error) {
        next(error);
    }
};

export const checkBalance = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Balance retrieved successfully", balance: user.balance });
    } catch (error) {
        next(error);
    }
};

export const cancelTransfer = async (req, res, next) => {
    try {
        const { transactionId } = req.body;
        const userId = req.user.userId;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (transaction.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        if (transaction.status !== "pending") {
            return res.status(400).json({ message: "Transaction cannot be canceled" });
        }

        const sender = await User.findById(userId);
        sender.balance += transaction.amount;
        await sender.save();

        transaction.status = "cancelled";
        await transaction.save();

        res.status(200).json({ message: "Transfer cancelled successfully", balance: sender.balance, transaction });
    } catch (error) {
        next(error);
    }
};

export const getTransactionsHistory = async (req, res) => { // ✅ Correct function name
    try {
        const userId = req.user.id;

        // Fetch transactions for the user
        const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Transaction history retrieved successfully',
            transactions
        });

    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const NATIONAL_REVENUE_ACCOUNT = { accountId: "national_tax_account", balance: 0 };

export const processTransaction = async (req, res, next) => {
    try {
        const { transactionType, amount, recipientId } = req.body;
        const senderId = req.user.userId;

        if (!transactionType || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid transaction details" });
        }

        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);
        if (!sender) return res.status(404).json({ message: "Sender not found" });
        if (!recipient) return res.status(404).json({ message: "Recipient not found" });
     
	// Calculate tax
        let result = calculateTax(amount, transactionType);

        // Example response structure
        return res.status(200).json({
            message: `Transaction processed successfully for ${transactionType}`,
            originalAmount: amount,
            taxAmount: result.taxAmount,
            netAmount: result.netAmount
        });

        const { taxAmount, netAmount } = calculateTax(amount, transactionType);
        if (sender.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        sender.balance -= amount;
        recipient.balance += parseFloat(netAmount);
        NATIONAL_REVENUE_ACCOUNT.balance += parseFloat(taxAmount);

        await sender.save();
        await recipient.save();

        const transaction = new Transaction({ userId: senderId, recipientId, type: transactionType, amount, status: "successful" });
        await transaction.save();
        res.status(200).json({ message: "Transaction processed successfully", transaction });
    } catch (error) {
        next(error);
    }
};
// Function to calculate commission
async function calculateCommission(transactionType, amount) {
 const commission = await Commission.findOne({ transactionType, status: 'active' });

  if (!commission) return 0; // No commission found

  let commissionFee = 0;

  if (commission.percentageRate > 0) {
    commissionFee = (commission.percentageRate / 100) * amount;
  }
  
  if (commission.fixedAmount > 0) {
    commissionFee += commission.fixedAmount;
  }

  return commissionFee;
}
