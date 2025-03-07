import express from 'express';
import { depositFromBank, withdrawToBank } from '../controllers/bankController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/deposit', authenticateUser, depositFromBank);
router.post('/withdraw', authenticateUser, withdrawToBank);

export default router;

