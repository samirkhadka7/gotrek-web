import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Step from '../models/step.model';

export const saveSteps = async (req: Request, res: Response): Promise<void> => {
  const { userId, trailId, steps } = req.body as {
    userId: string;
    trailId: string;
    steps: number;
  };

  if (!userId || !trailId || steps === undefined) {
    res.status(400).json({
      success: false,
      message: 'Missing Field',
    });
    return;
  }

  try {
    const step = new Step({ userId, trail: trailId, steps });
    await step.save();
    res.status(200).json({
      success: true,
      message: 'Step save successfully',
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: ' Server error ',
    });
  }
};

export const getTotalStepsForUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as string;

  try {
    const result = await Step.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalSteps: { $sum: '$steps' } } },
    ]);

    res.status(200).json({
      success: true,
      totalSteps: result[0]?.totalSteps || 0,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
