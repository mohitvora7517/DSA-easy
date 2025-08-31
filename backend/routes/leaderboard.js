const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { limit = 50, sortBy = 'totalPoints' } = req.query;

    const sortOptions = {
      totalPoints: { totalPoints: -1, xp: -1 },
      xp: { xp: -1, totalPoints: -1 },
      level: { level: -1, xp: -1 },
      streak: { currentStreak: -1, longestStreak: -1 }
    };

    const users = await User.find({ isActive: true })
      .select('username level xp totalPoints currentStreak longestStreak avatar')
      .sort(sortOptions[sortBy] || sortOptions.totalPoints)
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      avatar: user.avatar
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Get global leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category leaderboard
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;

    const users = await User.find({ isActive: true })
      .populate({
        path: 'completedProblems.problemId',
        match: { category }
      })
      .select('username level xp totalPoints avatar completedProblems')
      .limit(parseInt(limit));

    const categoryUsers = users
      .map(user => {
        const categoryProblems = user.completedProblems.filter(
          completed => completed.problemId && completed.problemId.category === category
        );
        
        return {
          username: user.username,
          level: user.level,
          xp: user.xp,
          totalPoints: user.totalPoints,
          avatar: user.avatar,
          categoryProblemsSolved: categoryProblems.length,
          categoryPoints: categoryProblems.reduce((sum, problem) => sum + problem.points, 0)
        };
      })
      .filter(user => user.categoryProblemsSolved > 0)
      .sort((a, b) => b.categoryPoints - a.categoryPoints)
      .slice(0, parseInt(limit));

    const leaderboard = categoryUsers.map((user, index) => ({
      rank: index + 1,
      ...user
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Get category leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's rank
router.get('/user/rank', async (req, res) => {
  try {
    const { userId, sortBy = 'totalPoints' } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const sortOptions = {
      totalPoints: { totalPoints: -1, xp: -1 },
      xp: { xp: -1, totalPoints: -1 },
      level: { level: -1, xp: -1 },
      streak: { currentStreak: -1, longestStreak: -1 }
    };

    const user = await User.findById(userId).select('username level xp totalPoints currentStreak longestStreak avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count users with better stats
    const betterUsers = await User.countDocuments({
      isActive: true,
      $or: [
        { [sortBy]: { $gt: user[sortBy] } },
        { 
          [sortBy]: user[sortBy],
          xp: { $gt: user.xp }
        }
      ]
    });

    const rank = betterUsers + 1;

    res.json({
      rank,
      user: {
        username: user.username,
        level: user.level,
        xp: user.xp,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly leaderboard
router.get('/weekly', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const users = await User.find({
      isActive: true,
      'completedProblems.completedAt': { $gte: oneWeekAgo }
    })
      .populate('completedProblems.problemId')
      .select('username level xp totalPoints avatar completedProblems')
      .limit(parseInt(limit));

    const weeklyUsers = users
      .map(user => {
        const weeklyProblems = user.completedProblems.filter(
          completed => new Date(completed.completedAt) >= oneWeekAgo
        );
        
        return {
          username: user.username,
          level: user.level,
          xp: user.xp,
          totalPoints: user.totalPoints,
          avatar: user.avatar,
          weeklyProblemsSolved: weeklyProblems.length,
          weeklyPoints: weeklyProblems.reduce((sum, problem) => sum + problem.points, 0)
        };
      })
      .filter(user => user.weeklyProblemsSolved > 0)
      .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
      .slice(0, parseInt(limit));

    const leaderboard = weeklyUsers.map((user, index) => ({
      rank: index + 1,
      ...user
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Get weekly leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;