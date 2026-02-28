import { Router } from 'express';
import { cancelSubscription } from '../controllers/subscription.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.put('/cancel', protect, cancelSubscription);

export default router;
