import { Request, Response } from 'express';
import User from '../models/user.model';
import Group from '../models/group.model';
import Activity from '../models/activity.model';

export const getRecentActivities = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching recent activities...');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt profileImage');
    console.log(`Found ${recentUsers.length} recent users.`);

    const recentGroups = await Group.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('leader', 'name profileImage')
      .populate('trail', 'name');
    console.log(`Found ${recentGroups.length} recent groups.`);

    const recentHikeActivities = await Activity.find({
      type: { $in: ['hike_joined', 'hike_completed', 'hike_cancelled'] },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name profileImage')
      .populate('trail', 'name');
    console.log(`Found ${recentHikeActivities.length} recent hike activities.`);

    const userActivities = recentUsers.map((user: any) => ({
      id: user._id,
      type: 'user_joined',
      user: user.name || 'Unknown User',
      avatar: user.profileImage || null,
      trail: null,
      time: user.createdAt,
    }));

    const groupActivities = recentGroups
      .filter((group: any) => group.leader) // Filter out groups with no leader
      .map((group: any) => ({
        id: group._id,
        type: 'group_created',
        user: group.leader?.name || 'Unknown User',
        avatar: group.leader?.profileImage || null,
        trail: group.trail?.name || null,
        time: group.createdAt,
      }));

    const hikeActivities = recentHikeActivities
      .filter((activity: any) => activity.user) // Filter out activities with no user
      .map((activity: any) => ({
        id: activity._id,
        type: activity.type,
        user: activity.user?.name || 'Unknown User',
        avatar: activity.user?.profileImage || null,
        trail: activity.trail?.name || null,
        time: activity.createdAt,
      }));

    const combinedActivities = [...userActivities, ...groupActivities, ...hikeActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);

    console.log(`Returning ${combinedActivities.length} combined activities to the frontend.`);

    res.json({ success: true, data: combinedActivities });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
