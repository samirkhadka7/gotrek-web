import { Router } from 'express';
import { saveSteps, getTotalStepsForUser } from '../controllers/step.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, saveSteps);
router.get('/total/:userId', protect, getTotalStepsForUser);

export default router;
