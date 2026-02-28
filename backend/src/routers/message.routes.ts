import { Router } from 'express';
import { getMessageForGroup } from '../controllers/message.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:groupId', protect, getMessageForGroup);

export default router;
