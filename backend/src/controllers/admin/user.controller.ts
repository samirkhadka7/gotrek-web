import { Request, Response } from 'express';
import User from '../../models/user.model';
import Group from '../../models/group.model';

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  const { userToUpdateId } = req.params;
  const { newRoles } = req.body as { newRoles: string };

  if (!['user', 'guide', 'admin'].includes(newRoles)) {
    res.status(400).json({
      success: false,
      message: 'Invalid role specified.',
    });
    return;
  }

  try {
    const user = await User.findById(userToUpdateId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User to update not found',
      });
      return;
    }

    user.role = newRoles as 'user' | 'guide' | 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name}'s role updated to ${newRoles}.`,
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Server issue',
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query as {
      page?: number;
      limit?: number;
      search?: string;
    };

    let filters: Record<string, unknown> = {};
    if (search) {
      filters = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const skips = (Number(page) - 1) * Number(limit);
    const users = await User.find(filters)
      .populate({
        path: 'completedTrails.trail',
        select: 'name difficulty location',
      })
      .sort({ createdAt: -1 })
      .skip(skips)
      .limit(Number(limit));
    const total = await User.countDocuments(filters);

    res.status(200).json({
      success: true,
      message: 'Data fetched',
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not Found' });
      return;
    }
    res.status(200).json({ success: true, data: user, message: 'User found' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ success: false, message: 'User not Found' });
      return;
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateUserByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, hikerType, ageGroup, bio, role, active, guideProfile } = req.body;
    const updateFields: Record<string, any> = { name, email, phone, hikerType, ageGroup, bio, role, active };

    // Admin can set guideProfile.verified
    if (guideProfile && typeof guideProfile.verified === 'boolean') {
      updateFields['guideProfile.verified'] = guideProfile.verified;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user, message: 'User updated by admin' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: any = await User.findById(req.user!.id)
      .populate('completedTrails.trail')
      .populate('joinedTrails.trail')
      .lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const groupsLedCount = await Group.countDocuments({ leader: user._id });

    const groupsJoinedCount = await Group.countDocuments({
      'participants.user': user._id,
      'participants.status': 'confirmed',
      leader: { $ne: user._id },
    });

    user.stats.hikesLed = groupsLedCount;
    user.stats.hikesJoined = groupsJoinedCount;

    const userGroups = await Group.find({
      $or: [{ leader: user._id }, { 'participants.user': user._id }],
    })
      .populate('leader', 'name profileImage')
      .populate('participants.user', 'name profileImage')
      .populate('trail', 'name')
      .sort({ date: -1 })
      .lean();

    user.groups = userGroups;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, hikerType, ageGroup, emergencyContact, bio, guideProfile } = req.body;
    const fieldsToUpdate: Record<string, any> = { name, phone, hikerType, ageGroup, emergencyContact, bio };

    // Allow guides to update their guide profile fields (but not verified status)
    if (guideProfile && req.user && (req.user as any).role === 'guide') {
      fieldsToUpdate['guideProfile.experienceYears'] = guideProfile.experienceYears;
      fieldsToUpdate['guideProfile.specialization'] = guideProfile.specialization;
      fieldsToUpdate['guideProfile.languages'] = guideProfile.languages;
      fieldsToUpdate['guideProfile.certifications'] = guideProfile.certifications;
    }
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(userId, { $set: fieldsToUpdate }, { new: true, runValidators: true });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Your profile has been updated.',
    });
  } catch (e) {
    console.error('updateMyProfile error:', e);
    res.status(500).json({ success: false, message: 'Server error', error: (e as Error).message });
  }
};

export const deactivateMyAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    await User.findByIdAndUpdate(req.user!.id, { active: false });
    res.status(200).json({ success: true, message: 'Your account has been deactivated.' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMyProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select an image.',
      });
      return;
    }

    const profileImageUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { profileImage: profileImageUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully.',
      data: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// TODO: add user export to CSV functionality
