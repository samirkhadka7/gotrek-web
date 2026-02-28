import { Router } from 'express';
import * as userController from '../../controllers/admin/user.controller';
import { protect, admin } from '../../middlewares/auth.middleware';
import upload from '../../middlewares/fileUpload';

const router = Router();

// User-specific routes
router.get('/me', protect, userController.getMyProfile);
router.put('/me', protect, userController.updateMyProfile);
router.put('/me/picture', protect, upload.single('profileImage'), userController.updateMyProfilePicture);
router.delete('/me', protect, userController.deactivateMyAccount);

// Admin-only routes
router.post('/create', protect, admin, userController.createUser);
router.get('/', protect, admin, userController.getAllUser);
router.get('/:id', protect, admin, userController.getUserById);
router.put('/:id', protect, admin, userController.updateUserByAdmin);
router.delete('/:id', protect, admin, userController.deleteUser);
router.put('/role/:userToUpdateId', protect, admin, userController.updateUserRole);

export default router;
