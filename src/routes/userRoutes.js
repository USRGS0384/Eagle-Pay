import express from 'express';
import { updateProfile, setPin, getUserTransactions, getUserProfile } from '../controllers/userController.js';
import { authMiddleware, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Profile routes
router.put('/profile', protect, updateProfile); // Ensure 'updateProfile' exists in userController.js
router.get('/profile', protect, getUserProfile); // Secure user profile access

// ✅ Set PIN
router.put('/set-pin', protect, setPin); // Only authenticated users can set PIN

// ✅ Get User Transactions
router.get('/transactions', protect, getUserTransactions); // Protect transaction history

export default router;

