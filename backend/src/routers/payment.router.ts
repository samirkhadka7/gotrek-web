import { Router } from 'express';
import {
  initiateEsewaPayment,
  verifyEsewaPayment,
  getTransactionHistory,
  getAllTransactionHistory,
} from '../controllers/payment.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/initiate', protect, initiateEsewaPayment);
router.get('/history', protect, getTransactionHistory);
router.get('/verify', verifyEsewaPayment);
router.get('/all-history', protect, admin, getAllTransactionHistory);

export default router;
