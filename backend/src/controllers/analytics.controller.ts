import { Request, Response } from 'express';
import User from '../models/user.model';
import Payment from '../models/payment.model';
import Cancellation from '../models/cancellation.model';

const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

export const getAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfCurrentMonth = new Date(currentYear, now.getMonth(), 1);
    const startOfPreviousMonth = new Date(currentYear, now.getMonth() - 1, 1);

    const totalCompletedHikesResult = await User.aggregate([
      { $project: { numCompleted: { $size: '$completedTrails' } } },
      { $group: { _id: null, total: { $sum: '$numCompleted' } } },
    ]);
    const totalCompletedHikes = totalCompletedHikesResult[0]?.total || 0;

    const scheduledHikesThisMonthResult = await User.aggregate([
      { $unwind: '$joinedTrails' },
      { $match: { 'joinedTrails.scheduledDate': { $gte: startOfCurrentMonth } } },
      { $count: 'count' },
    ]);
    const scheduledHikesThisMonth = scheduledHikesThisMonthResult[0]?.count || 0;

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(currentYear, 0, 1) } } },
      { $group: { _id: { $month: '$createdAt' }, users: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const completedHikesByMonth = await User.aggregate([
      { $unwind: '$completedTrails' },
      {
        $match: {
          'completedTrails.completedAt': {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      { $group: { _id: { $month: '$completedTrails.completedAt' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const cancelledHikesByMonth = await Cancellation.aggregate([
      {
        $match: {
          cancelledAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      { $group: { _id: { $month: '$cancelledAt' }, count: { $sum: 1 } } },
    ]);

    const hikeData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const completedData = completedHikesByMonth.find((item: any) => item._id === month);
      const cancelledData = cancelledHikesByMonth.find((item: any) => item._id === month);
      return {
        _id: month,
        completed: completedData?.count || 0,
        cancelled: cancelledData?.count || 0,
      };
    });

    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfCurrentMonth } });
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth },
    });

    const allTimeRevenueResult = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = allTimeRevenueResult[0]?.total || 0;

    const revenueThisMonthResult = await Payment.aggregate([
      { $match: { status: 'success', createdAt: { $gte: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const revenueLastMonthResult = await Payment.aggregate([
      { $match: { status: 'success', createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenueThisMonth = revenueThisMonthResult[0]?.total || 0;
    const totalRevenueLastMonth = revenueLastMonthResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        userGrowth,
        hikeData,
        summary: {
          totalUsers: {
            total: totalUsers,
            percentageChange: calculatePercentageChange(newUsersThisMonth, newUsersLastMonth),
          },
          totalRevenue: {
            total: totalRevenue,
            percentageChange: calculatePercentageChange(totalRevenueThisMonth, totalRevenueLastMonth),
          },
          completedHikes: {
            total: totalCompletedHikes,
            scheduledThisMonth: scheduledHikesThisMonth,
          },
        },
      },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
