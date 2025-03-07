import express from 'express';
import { getTaxReport } from '../controllers/taxReportController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/report', authenticateUser, getTaxReport);

export default router;

