import express from 'express';
import { getStoresForUser } from '../controllers/storeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getStoresForUser);

export default router;
