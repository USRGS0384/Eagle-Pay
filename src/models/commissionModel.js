import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true,
  },
  percentageRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  fixedAmount: {
    type: Number,
    required: false, // Some commissions might be percentage-based only
    default: 0,
  },
  minAmount: {
    type: Number,
    required: false,
    default: 0, // Minimum transaction amount for commission application
  },
  maxAmount: {
    type: Number,
    required: false,
    default: 0, // Maximum transaction amount before commission changes
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` field on every update
commissionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Commission = mongoose.model('Commission', commissionSchema);

export default Commission;

