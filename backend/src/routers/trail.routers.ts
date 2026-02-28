import { Router } from 'express';
import * as trailController from '../controllers/admin/trail.controller';
import { protect, admin } from '../middlewares/auth.middleware';
import upload from '../middlewares/fileUpload';

const router = Router();

// Admin Routes
router.post('/create', protect, admin, upload.array('images', 10), trailController.createTrails);
router.get('/:id', protect, trailController.getOneTrail);
router.put('/:id', protect, admin, upload.array('images', 10), trailController.updateTrails);
router.delete('/:id', protect, admin, trailController.deleteTrails);

// Public Route
router.get('/', trailController.getAll);

// User-specific Routes
router.post('/:id/join-with-date', protect, trailController.joinTrailWithDate);
router.post('/joined/:joinedTrailId/complete', protect, trailController.completeTrail);
router.delete('/joined/:joinedTrailId/cancel', protect, trailController.cancelJoinedTrail);

export default router;
