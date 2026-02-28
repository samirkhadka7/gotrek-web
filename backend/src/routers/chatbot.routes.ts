import { Router } from 'express';
import handleChatQuery from '../controllers/chatbot.controller';
import { protect, proOrPremium } from '../middlewares/auth.middleware';

const router = Router();

router.post('/query', protect, proOrPremium, handleChatQuery);

export default router;
