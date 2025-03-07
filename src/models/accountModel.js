import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 0 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  isAgent: { type: Boolean, default: false }, // Identify agent accounts
  agentCommissionBalance: { type: Number, default: 0 } // Separate balance for agents
});

const Account = mongoose.model('Account', accountSchema);
export default Account;

