import { Router } from 'express';
import * as groupController from '../controllers/admin/group.controller';
import { protect, admin, guideOrAdmin } from '../middlewares/auth.middleware';
import upload from '../middlewares/fileUpload';

const router = Router();

router.post('/create', protect, guideOrAdmin, upload.array('photo', 10), groupController.createGroups);
router.get('/', groupController.getAll);
router.get('/:id', groupController.getGroupById);
router.put('/:id', protect, upload.array('photo', 10), groupController.updateGroup);
router.delete('/:id', protect, admin, groupController.deletegroup);
router.post('/:id/request-join', protect, groupController.requestToJoinGroup);
router.post('/:id/leave', protect, groupController.leaveGroup);
router.post('/:id/photos', protect, upload.array('photo', 10), groupController.uploadGroupPhotos);
router.patch('/:groupId/requests/:requestId/approve', protect, admin, groupController.approveJoinRequest);
router.patch('/:groupId/requests/:requestId/deny', protect, admin, groupController.denyJoinRequest);
router.get('/requests/pending', protect, admin, groupController.getAllPendingRequests);

export default router;
