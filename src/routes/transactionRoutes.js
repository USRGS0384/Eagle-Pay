import express from 'express';
import { deposit } from '../controllers/transactionController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { transfer } from "../controllers/transactionController.js"; // ✅ Correct
import { withdraw } from '../controllers/transactionController.js';
import { checkBalance } from '../controllers/transactionController.js';
import { cancelTransfer } from '../controllers/transactionController.js';
import { getTransactionsHistory } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/deposit', authenticateUser, deposit);
router.post('/withdraw', authenticateUser, withdraw);
router.post('/transfer', authenticateUser, transfer);
router.get('/balance', authenticateUser, checkBalance);
router.post('/cancel-transfer', authenticateUser, cancelTransfer);
router.get('/transactions', authenticateUser, getTransactionsHistory);


export default router;

