import { Response } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middleware/authMiddleware';

export const processDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, source } = req.body;
    
    // Mocking Stripe/PayPal validation delay
    const reference = `MOCK_${source.toUpperCase()}_${Date.now()}`;
    
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount,
      status: 'completed',
      reference
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const processWithdrawal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, destination } = req.body;
    
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      reference: `MOCK_WD_${Date.now()}`
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
