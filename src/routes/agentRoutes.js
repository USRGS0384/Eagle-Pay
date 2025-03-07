import express from 'express';
import { agentTransfer } from '../controllers/agentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/transfer', authenticateUser, agentTransfer);

export default router;

