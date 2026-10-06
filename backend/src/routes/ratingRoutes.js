import express from 'express';
import { submitOrUpdateRating } from '../controllers/ratingController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('USER'), submitOrUpdateRating);

export default router;
