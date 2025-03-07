import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);

