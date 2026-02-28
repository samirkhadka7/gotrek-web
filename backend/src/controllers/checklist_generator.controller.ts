import { Request, Response } from 'express';
import checklistData, { ChecklistBase, ChecklistItem } from '../data/checklistData';
import UserChecklist from '../models/userChecklist.model';

export const generateChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { experience, duration, weather } = req.query as {
      experience?: string;
      duration?: string;
      weather?: string;
    };

    if (!experience || !duration || !weather) {
      res.status(400).json({ success: false, message: 'Missing required query parameters.' });
      return;
    }

    const finalChecklist: ChecklistBase = JSON.parse(JSON.stringify(checklistData.base));

    const addItem = (category: string, newItem: ChecklistItem) => {
      if (!finalChecklist[category]) {
        finalChecklist[category] = [];
      }
      if (!finalChecklist[category].some((item) => item.id === newItem.id)) {
        finalChecklist[category].push(newItem);
      }
    };

    if (checklistData.experience[experience]) {
      checklistData.experience[experience].forEach((addon) => addItem(addon.category, addon.item));
    }
    if (checklistData.duration[duration]) {
      checklistData.duration[duration].forEach((addon) => addItem(addon.category, addon.item));
    }
    if (checklistData.weather[weather]) {
      checklistData.weather[weather].forEach((addon) => addItem(addon.category, addon.item));
    }

    res.status(200).json({ success: true, data: finalChecklist });
  } catch (error) {
    console.error('Generate checklist error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Save user's checklist to MongoDB
export const saveUserChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { items, config } = req.body;

    // Use upsert to create or update
    await UserChecklist.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        items: items || [],
        config: config || { experience: 'beginner', duration: 'day', weather: 'sunny' },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Checklist saved to database' });
  } catch (error) {
    console.error('Save checklist error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get user's saved checklist from MongoDB
export const getUserChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const savedChecklist = await UserChecklist.findOne({ user: userId });

    if (!savedChecklist) {
      res.status(200).json({ success: true, data: null });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        items: savedChecklist.items,
        config: savedChecklist.config,
        updatedAt: savedChecklist.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get checklist error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update single item checked status
export const updateChecklistItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { itemId } = req.params;
    const { checked } = req.body;

    const result = await UserChecklist.findOneAndUpdate(
      { user: userId, 'items._id': itemId },
      { $set: { 'items.$.checked': checked } },
      { new: true }
    );

    if (!result) {
      res.status(404).json({ success: false, message: 'Checklist or item not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Item updated' });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
