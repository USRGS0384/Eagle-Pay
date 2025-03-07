// institutionRoutes.js
import express from 'express';
const router = express.Router();

// Define your institution-related routes here
router.get('/', (req, res) => {
  res.send('Institution home page');
});

export default router;

