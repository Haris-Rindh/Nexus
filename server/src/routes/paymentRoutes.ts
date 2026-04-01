import express from 'express';
import { processDeposit, processWithdrawal, getTransactionHistory } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/deposit', protect, processDeposit);
router.post('/withdraw', protect, processWithdrawal);
router.get('/history', protect, getTransactionHistory);

export default router;
