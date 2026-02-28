import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, admin, getAnalytics);

export default router;
