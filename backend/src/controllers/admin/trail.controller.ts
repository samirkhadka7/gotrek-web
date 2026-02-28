import { Request, Response } from 'express';
import Trail from '../../models/trail.model';
import User from '../../models/user.model';
import Cancellation from '../../models/cancellation.model';
import Activity from '../../models/activity.model';

export const createTrails = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received body:', req.body);
    console.log('Received files:', req.files);
    
    const filepaths = req.files ? (req.files as Express.Multer.File[]).map((file) => file.path) : [];
    
    // Parse numeric fields from form-data
    const trailData: any = {
      name: req.body.name,
      location: req.body.location,
      distance: Number(req.body.distance),
      elevation: Number(req.body.elevation),
      difficulty: req.body.difficulty,
      description: req.body.description,
      images: filepaths,
    };
    
    // Handle duration if provided
    if (req.body['duration[min]'] || req.body['duration[max]']) {
      trailData.duration = {
        min: req.body['duration[min]'] ? Number(req.body['duration[min]']) : undefined,
        max: req.body['duration[max]'] ? Number(req.body['duration[max]']) : undefined,
      };
    }
    
    const trail = new Trail(trailData);
    await trail.save();
    res.status(201).json({
      success: true,
      message: 'Trail created successfully',
      data: trail,
    });
  } catch (e) {
    console.error('Trail creation error:', e);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating trail.',
      error: (e as Error).message 
    });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '', maxDistance, maxElevation, maxDuration, difficulty } = req.query;
    const filter: Record<string, unknown> = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (maxDistance) filter.distance = { $lte: Number(maxDistance) };
    if (maxElevation) filter.elevation = { $lte: Number(maxElevation) };
    if (maxDuration) filter['duration.max'] = { $lte: Number(maxDuration) };
    if (difficulty && difficulty !== 'All') filter.difficult = difficulty;

    const skip = (Number(page) - 1) * Number(limit);
    const trails = await Trail.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Trail.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Trail data fetched successfully',
      data: trails,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error while fetching trails.' });
  }
};

export const getOneTrail = async (req: Request, res: Response): Promise<void> => {
  try {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
      res.status(404).json({ success: false, message: 'Trail not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Trail fetched successfully', data: trail });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error while fetching trail.' });
  }
};

export const updateTrails = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedData: Record<string, unknown> = { ...req.body };
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      updatedData.images = (req.files as Express.Multer.File[]).map((file) => file.path);
    }
    const trail = await Trail.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    if (!trail) {
      res.status(404).json({ success: false, message: 'Trail not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Trail updated successfully', data: trail });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error while updating trail.' });
  }
};

export const deleteTrails = async (req: Request, res: Response): Promise<void> => {
  try {
    const trail = await Trail.findByIdAndDelete(req.params.id);
    if (!trail) {
      res.status(404).json({ success: false, message: 'Trail not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Trail deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error while deleting trail.' });
  }
};

export const joinTrailWithDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheduledDate } = req.body as { scheduledDate: string };
    if (!scheduledDate) {
      res.status(400).json({ success: false, message: 'A scheduled date is required to join a trek.' });
      return;
    }

    const user = await User.findById(req.user!.id);
    const trail = await Trail.findById(req.params.id);

    if (!trail) {
      res.status(404).json({ success: false, message: 'Trail not found.' });
      return;
    }

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const alreadyJoined = user.joinedTrails.some((t: any) => t.trail.equals(trail._id));
    if (alreadyJoined) {
      res.status(400).json({ success: false, message: 'You have already scheduled this trek.' });
      return;
    }

    user.joinedTrails.push({ trail: trail._id, scheduledDate } as any);
    await user.save();

    await Activity.create({
      type: 'hike_joined',
      user: user._id,
      trail: trail._id,
    });

    res.status(200).json({
      success: true,
      message: `Successfully scheduled '${trail.name}' for your upcoming treks!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error while scheduling trek.' });
  }
};

export const completeTrail = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).populate('joinedTrails.trail');
    const { joinedTrailId } = req.params;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const trailToComplete = user.joinedTrails.find((t: any) => t._id.equals(joinedTrailId));

    if (!trailToComplete) {
      res.status(404).json({ success: false, message: 'Scheduled trek not found in your list.' });
      return;
    }

    const trailDetails: any = trailToComplete.trail;

    user.stats.totalHikes += 1;
    user.stats.totalDistance += trailDetails.distance || 0;
    user.stats.totalElevation += trailDetails.elevation || 0;
    const durationHours = trailDetails.duration?.max || trailDetails.distance / 4;
    user.stats.totalHours += durationHours;

    user.completedTrails.push({ trail: trailDetails._id, completedAt: new Date() } as any);
    user.joinedTrails = user.joinedTrails.filter((t: any) => !t._id.equals(joinedTrailId)) as any;

    await user.save();

    await Activity.create({
      type: 'hike_completed',
      user: user._id,
      trail: trailDetails._id,
    });

    res.status(200).json({
      success: true,
      message: `Congratulations on completing '${trailDetails.name}'! Your stats have been updated.`,
      data: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error while completing trek.' });
  }
};

export const cancelJoinedTrail = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    const { joinedTrailId } = req.params;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const trailToCancel = user.joinedTrails.find((t: any) => t._id.equals(joinedTrailId));

    if (!trailToCancel) {
      res.status(404).json({ success: false, message: 'Scheduled trek not found in your list.' });
      return;
    }

    await Cancellation.create({
      user: user._id,
      trail: trailToCancel.trail,
      scheduledDate: trailToCancel.scheduledDate,
    });

    user.joinedTrails.pull({ _id: joinedTrailId });
    await user.save();

    await Activity.create({
      type: 'hike_cancelled',
      user: user._id,
      trail: trailToCancel.trail,
    });

    res.status(200).json({
      success: true,
      message: 'Your scheduled trek has been cancelled.',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error while cancelling trek.' });
  }
};
