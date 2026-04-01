import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/me')
  .get(protect, getMyProfile)
  .put(protect, updateMyProfile);

export default router;
