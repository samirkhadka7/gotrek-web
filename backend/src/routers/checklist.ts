import { Router } from 'express';
import { generateChecklist, saveUserChecklist, getUserChecklist, updateChecklistItem } from '../controllers/checklist_generator.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/generate', generateChecklist);
router.post('/save', protect, saveUserChecklist);
router.get('/my', protect, getUserChecklist);
router.put('/item/:itemId', protect, updateChecklistItem);

export default router;
