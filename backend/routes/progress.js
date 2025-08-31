const express = require('express');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit solution
router.post('/submit', auth, async (req, res) => {
  try {
    const { problemId, solution, language, isCorrect, executionTime } = req.body;
    const user = req.user;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if already completed
    const existingCompletion = user.completedProblems.find(
      completed => completed.problemId.toString() === problemId
    );

    let levelUp = false;
    let newLevel = user.level;
    let oldLevel = user.level;

    if (isCorrect) {
      if (!existingCompletion) {
        // First time solving
        const xpGain = problem.points;
        const result = user.addXP(xpGain);
        levelUp = result.levelUp;
        newLevel = result.newLevel;
        oldLevel = result.oldLevel;

        user.completedProblems.push({
          problemId: problem._id,
          points: problem.points,
          attempts: 1
        });
      } else {
        // Already solved, just increment attempts
        existingCompletion.attempts += 1;
      }

      // Update problem statistics
      problem.updateAcceptanceRate(true);
      await problem.save();
    } else {
      if (existingCompletion) {
        existingCompletion.attempts += 1;
      } else {
        // First attempt, wrong answer
        user.completedProblems.push({
          problemId: problem._id,
          points: 0,
          attempts: 1
        });
      }

      // Update problem statistics
      problem.updateAcceptanceRate(false);
      await problem.save();
    }

    // Check for achievements
    const achievements = await Achievement.find({ isActive: true });
    const newAchievements = [];

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const hasAchievement = user.achievements.some(
        userAchievement => userAchievement.achievementId.toString() === achievement._id.toString()
      );

      if (!hasAchievement && achievement.checkEligibility(user)) {
        user.achievements.push({
          achievementId: achievement._id
        });
        
        // Add achievement XP
        const achievementResult = user.addXP(achievement.xpReward);
        if (achievementResult.levelUp) {
          levelUp = true;
          newLevel = achievementResult.newLevel;
          oldLevel = achievementResult.oldLevel;
        }

        newAchievements.push(achievement);
      }
    }

    await user.save();

    res.json({
      message: isCorrect ? 'Solution accepted!' : 'Solution incorrect, try again!',
      isCorrect,
      levelUp,
      newLevel,
      oldLevel,
      newAchievements,
      userStats: {
        xp: user.xp,
        totalPoints: user.totalPoints,
        level: user.level,
        currentStreak: user.currentStreak
      }
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('completedProblems.problemId')
      .populate('achievements.achievementId');

    const progress = {
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        xp: user.xp,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      },
      stats: {
        totalProblemsSolved: user.completedProblems.length,
        totalAttempts: user.completedProblems.reduce((sum, problem) => sum + problem.attempts, 0),
        averageAttempts: user.completedProblems.length > 0 
          ? user.completedProblems.reduce((sum, problem) => sum + problem.attempts, 0) / user.completedProblems.length 
          : 0
      },
      achievements: user.achievements,
      recentActivity: user.completedProblems
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 10)
    };

    res.json(progress);
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category progress
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const user = req.user;

    const categoryProblems = user.completedProblems.filter(completed =>
      completed.problemId && completed.problemId.category === category
    );

    const totalProblemsInCategory = await Problem.countDocuments({ 
      category, 
      isActive: true 
    });

    const progress = {
      category,
      totalProblems: totalProblemsInCategory,
      solvedProblems: categoryProblems.length,
      progressPercentage: totalProblemsInCategory > 0 
        ? (categoryProblems.length / totalProblemsInCategory) * 100 
        : 0,
      problems: categoryProblems
    };

    res.json(progress);
  } catch (error) {
    console.error('Get category progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;