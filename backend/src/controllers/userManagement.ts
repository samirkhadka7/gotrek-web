import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendPasswordResetOTP } from '../utils/emailService';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone } = req.body as {
    name: string;
    email: string;
    password: string;
    phone: string;
  };

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
    });

    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse,
    });
  } catch (e) {
    console.error('Registration Error:', e);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
    return;
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    const payLoad = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payLoad, process.env.SECRET!, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: payLoad,
      token,
    });
  } catch (e) {
    console.error('Login Error:', e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: 'Please provide both current and new password',
    });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters',
    });
    return;
  }

  try {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    const user = await User.findById(userId).select('+password');

    if (!user || !user.password) {
      res.status(404).json({
        success: false,
        message: 'User not found or using OAuth login',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (e) {
    console.error('Change Password Error:', e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: 'Please provide your email',
    });
    return;
  }

  try {
    const user = await User.findOne({ email }).select('+passwordResetOTP +passwordResetOTPExpires');

    if (!user) {
      // For security, don't reveal if email exists or not
      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset OTP has been sent.',
      });
      return;
    }

    if (user.googleId) {
      res.status(400).json({
        success: false,
        message: 'This account uses Google sign-in. Password reset is not available.',
      });
      return;
    }

    // Generate 6-digit OTP
    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    // Send OTP via email
    try {
      await sendPasswordResetOTP(email, otp);
      console.log(`Password reset OTP sent to ${email}`);

      res.status(200).json({
        success: true,
        message: 'Password reset OTP has been sent to your email. Please check your inbox.',
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);

      // Clear OTP from database if email fails
      user.passwordResetOTP = undefined;
      user.passwordResetOTPExpires = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again later.',
      });
    }
  } catch (e) {
    console.error('Forgot Password Error:', e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400).json({
      success: false,
      message: 'Please provide email, OTP, and new password',
    });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });
    return;
  }

  try {
    const user = await User.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetOTPExpires: { $gt: Date.now() },
    }).select('+passwordResetOTP +passwordResetOTPExpires');

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new password reset.',
      });
      return;
    }

    // Update password and clear OTP fields
    user.password = newPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (e) {
    console.error('Reset Password Error:', e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
