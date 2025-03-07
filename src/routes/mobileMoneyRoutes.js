import express from 'express';
import { depositFromMobileMoney, withdrawToMobileMoney } from '../controllers/mobileMoneyController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/deposit', authenticateUser, depositFromMobileMoney);
router.post('/withdraw', authenticateUser, withdrawToMobileMoney);

export default router;

