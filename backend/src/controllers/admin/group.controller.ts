import { Request, Response } from 'express';
import Group from '../../models/group.model';
import { createAndEmitNotification } from '../../utils/notificationHelper';

export const createGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received body:', req.body);
    console.log('Received files:', req.files);
    
    const filepaths = req.files ? (req.files as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`) : [];
    const { title, trail, date, description, maxSize, leader, participants, status, meetingPoint, requirements, difficulty, comments } = req.body;

    const group = new Group({
      title,
      trail,
      date,
      description,
      maxSize: maxSize ? parseInt(maxSize, 10) : undefined,
      leader,
      participants,
      status,
      meetingPoint,
      requirements: requirements || [],
      difficulty,
      photos: filepaths,
      comments,
    });

    await group.save();

    res.status(200).json({
      success: true,
      message: 'Group created successfully',
      data: group,
    });
  } catch (e) {
    console.error('Group creation error:', e);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (e as Error).message,
    });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    let filters: Record<string, unknown> = {};
    if (search) {
      filters.$or = [{ title: { $regex: search, $options: 'i' } }];
    }
    const skips = (Number(page) - 1) * Number(limit);

    const groups = await Group.find(filters)
      .populate('trail', 'name location distance elevation duration difficult leader participants')
      .populate('participants.user', 'name email')
      .populate('leader', 'name profileImage')
      .skip(skips)
      .limit(Number(limit));

    const total = await Group.countDocuments(filters);

    res.status(200).json({
      success: true,
      message: 'Data fetched',
      data: groups,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('leader', 'name email')
      .populate({
        path: 'participants.user',
        select: 'name profileImage hikerType',
      })
      .populate('trail');

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: group,
      message: 'One Group',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('[Update Group] Body:', req.body);
    console.log('[Update Group] Files:', req.files);
    
    // Handle new photo uploads
    const newPhotos = req.files ? (req.files as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`) : [];
    
    // Get existing photos to keep (sent from frontend)
    let existingPhotos: string[] = [];
    if (req.body.existingPhotos) {
      try {
        existingPhotos = JSON.parse(req.body.existingPhotos);
      } catch {
        existingPhotos = [];
      }
    }
    
    // Combine existing photos with new uploads
    const allPhotos = [...existingPhotos, ...newPhotos];
    
    // Update body with combined photos
    const updateData = {
      ...req.body,
      photos: allPhotos
    };
    
    // Remove existingPhotos from update data as it's not a schema field
    delete updateData.existingPhotos;
    
    const group = await Group.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group Not Found',
      });
      return;
    }

    res.json({
      success: true,
      data: group,
      message: 'updated',
    });
  } catch (e) {
    console.error('[Update Group] Error:', e);
    res.status(500).json({
      Error: 'server error',
      message: (e as Error).message,
    });
  }
};

export const deletegroup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('[Delete Group] Attempting to delete group:', req.params.id);
    const result = await Group.findByIdAndDelete(req.params.id);
    if (!result) {
      console.log('[Delete Group] Group not found:', req.params.id);
      res.status(404).json({
        success: false,
        message: 'Group Not Found',
      });
      return;
    }

    console.log('[Delete Group] Successfully deleted group:', req.params.id);
    res.json({
      success: true,
      message: 'Deleted',
    });
  } catch (err) {
    console.error('[Delete Group] Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (err as Error).message,
    });
  }
};

export const requestToJoinGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupId = req.params.id;
    const userId = req.user!._id;
    const { message } = req.body as { message?: string };

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
      return;
    }

    const existingParticipant = group.participants.find((p: any) => p.user.toString() === String(userId));

    if (existingParticipant) {
      res.status(400).json({
        success: false,
        message: 'You have already requested to join or are already a member of this group.',
      });
      return;
    }

    group.participants.push({
      user: userId,
      status: 'pending',
      message,
    } as any);

    await group.save();
    const newParticipantRequest = group.participants[group.participants.length - 1];

    res.status(200).json({
      success: true,
      message: 'Join request submitted successfully. Waiting for approval.',
      data: { groupId: group._id, requestId: newParticipantRequest._id },
    });
  } catch (e) {
    console.error('Request to join group error:', e);
    res.status(500).json({
      success: false,
      message: 'Server error during join request.',
      error: (e as Error).message,
    });
  }
};

export const approveJoinRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupId = req.params.groupId as string;
    const requestId = req.params.requestId as string;

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
      return;
    }

    const participant = group.participants.id(requestId);
    console.log(participant);

    if (!participant) {
      res.status(404).json({
        success: false,
        message: 'Join request not found',
      });
      return;
    }

    if (participant.status === 'confirmed') {
      res.status(400).json({
        success: false,
        message: 'This request has already been approved.',
      });
      return;
    }

    participant.status = 'confirmed';
    await group.save();

    await createAndEmitNotification({
      recipientId: participant.user.toString(),
      type: 'join_request_approved',
      title: 'Join Request Approved',
      message: `Your request to join "${group.title}" has been approved!`,
      data: { groupId: group._id, groupTitle: group.title },
    });

    res.status(200).json({
      success: true,
      message: 'Join request approved successfully.',
      data: group,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Server error during approval.',
    });
  }
};

export const denyJoinRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupId = req.params.groupId as string;
    const requestId = req.params.requestId as string;

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'Group not found',
      });
      return;
    }

    const participant = group.participants.id(requestId);

    if (!participant) {
      res.status(404).json({
        success: false,
        message: 'Join request not found',
      });
      return;
    }

    if (participant.status === 'declined') {
      res.status(400).json({
        success: false,
        message: 'This request has already been denied.',
      });
      return;
    }

    participant.status = 'declined';
    await group.save();

    await createAndEmitNotification({
      recipientId: participant.user.toString(),
      type: 'join_request_declined',
      title: 'Join Request Declined',
      message: `Your request to join "${group.title}" has been declined.`,
      data: { groupId: group._id, groupTitle: group.title },
    });

    res.status(200).json({
      success: true,
      message: 'Join request denied successfully.',
      data: group,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Server error during denial.',
    });
  }
};

export const leaveGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupId = req.params.id;
    const userId = req.user!._id;

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: 'Group not found' });
      return;
    }

    // Leader cannot leave their own group
    if (group.leader.toString() === String(userId)) {
      res.status(400).json({ success: false, message: 'Group leader cannot leave the group. Delete the group instead.' });
      return;
    }

    const participantIndex = group.participants.findIndex(
      (p: any) => p.user.toString() === String(userId) && p.status === 'confirmed'
    );

    if (participantIndex === -1) {
      res.status(400).json({ success: false, message: 'You are not a member of this group' });
      return;
    }

    group.participants.splice(participantIndex, 1);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'You have left the group successfully',
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error', error: (e as Error).message });
  }
};

export const uploadGroupPhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupId = req.params.id;
    const userId = req.user!._id;

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: 'Group not found' });
      return;
    }

    const isLeader = group.leader.toString() === String(userId);
    const isConfirmedMember = group.participants.some(
      (p: any) => p.user.toString() === String(userId) && p.status === 'confirmed'
    );

    if (!isLeader && !isConfirmedMember) {
      res.status(403).json({ success: false, message: 'Only confirmed members can upload photos' });
      return;
    }

    const newPhotos = req.files
      ? (req.files as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`)
      : [];

    if (newPhotos.length === 0) {
      res.status(400).json({ success: false, message: 'No photos provided' });
      return;
    }

    group.photos.push(...newPhotos);
    await group.save();

    res.status(200).json({
      success: true,
      message: `${newPhotos.length} photo(s) uploaded successfully`,
      data: { photos: group.photos },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error', error: (e as Error).message });
  }
};

export const getAllPendingRequests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pendingRequests = await Group.aggregate([
      { $unwind: '$participants' },
      { $match: { 'participants.status': 'pending' } },
      {
        $lookup: {
          from: 'users',
          localField: 'participants.user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $lookup: {
          from: 'trails',
          localField: 'trail',
          foreignField: '_id',
          as: 'trailDetails',
        },
      },
      { $unwind: '$userDetails' },
      { $unwind: { path: '$trailDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: '$participants._id',
          message: '$participants.message',
          user: {
            _id: '$userDetails._id',
            name: '$userDetails.name',
            profileImage: '$userDetails.profileImage',
          },
          group: {
            _id: '$_id',
            title: '$title',
            date: '$date',
            trail: {
              _id: '$trailDetails._id',
              name: '$trailDetails.name',
              difficult: '$trailDetails.difficult',
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Fetched all pending join requests.',
      data: pendingRequests,
    });
  } catch (e) {
    console.error('Error fetching pending requests:', e);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending requests.',
    });
  }
};
