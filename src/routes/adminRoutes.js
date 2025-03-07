import express from 'express';
import { createUserAccount, profileUser } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-user', protect, createUserAccount);
router.get('/user', protect, profileUser);

export default router;

