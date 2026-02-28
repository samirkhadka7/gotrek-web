import { Router } from 'express';
import { getRecentActivities } from '../controllers/activity.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, admin, getRecentActivities);

export default router;
