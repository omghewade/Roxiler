import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  addUser,
  getAllStores,
  addStore,
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeRole('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users', addUser);
router.get('/stores', getAllStores);
router.post('/stores', addStore);

export default router;
