import express from 'express';
import { createPortal, payPortal } from '../controllers/portalController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateUser, createPortal);
router.post('/pay', authenticateUser, payPortal);

export default router;

