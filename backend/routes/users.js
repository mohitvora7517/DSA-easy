const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('completedProblems.problemId')
      .populate('achievements.achievementId')
      .select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = {
      id: user._id,
      username: user.username,
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      avatar: user.avatar,
      completedProblems: user.completedProblems,
      achievements: user.achievements,
      joinedAt: user.createdAt
    };

    res.json(profile);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = req.user;

    if (username && username !== user.username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('completedProblems.problemId')
      .select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate category statistics
    const categoryStats = {};
    user.completedProblems.forEach(completed => {
      if (completed.problemId) {
        const category = completed.problemId.category;
        if (!categoryStats[category]) {
          categoryStats[category] = {
            solved: 0,
            points: 0,
            attempts: 0
          };
        }
        categoryStats[category].solved += 1;
        categoryStats[category].points += completed.points;
        categoryStats[category].attempts += completed.attempts;
      }
    });

    // Calculate difficulty statistics
    const difficultyStats = {};
    user.completedProblems.forEach(completed => {
      if (completed.problemId) {
        const difficulty = completed.problemId.difficulty;
        if (!difficultyStats[difficulty]) {
          difficultyStats[difficulty] = {
            solved: 0,
            points: 0
          };
        }
        difficultyStats[difficulty].solved += 1;
        difficultyStats[difficulty].points += completed.points;
      }
    });

    const stats = {
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        xp: user.xp,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      },
      overall: {
        totalProblemsSolved: user.completedProblems.length,
        totalAttempts: user.completedProblems.reduce((sum, problem) => sum + problem.attempts, 0),
        averageAttempts: user.completedProblems.length > 0 
          ? user.completedProblems.reduce((sum, problem) => sum + problem.attempts, 0) / user.completedProblems.length 
          : 0,
        totalAchievements: user.achievements.length
      },
      categoryStats,
      difficultyStats,
      recentActivity: user.completedProblems
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 20)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;