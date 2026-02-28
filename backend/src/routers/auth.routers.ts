import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, changePassword, forgotPassword, resetPassword } from '../controllers/userManagement';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Temporary alias for common typo in client requests
router.post('/logi', loginUser);

// Password management routes
router.post('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google-auth-failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET!, { expiresIn: '1d' });

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

export default router;
