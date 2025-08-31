const express = require('express');
const Level = require('../models/Level');
const Problem = require('../models/Problem');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all levels
router.get('/', async (req, res) => {
  try {
    const levels = await Level.find({ isActive: true })
      .populate('problems')
      .sort({ levelNumber: 1 });

    res.json(levels);
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get level by ID
router.get('/:id', async (req, res) => {
  try {
    const level = await Level.findById(req.params.id)
      .populate('problems')
      .populate('prerequisites');

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.json(level);
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's unlocked levels
router.get('/user/unlocked', auth, async (req, res) => {
  try {
    const user = req.user;
    const levels = await Level.find({ isActive: true })
      .populate('problems')
      .sort({ levelNumber: 1 });

    const unlockedLevels = levels.map(level => ({
      ...level.toObject(),
      isUnlocked: level.isUnlockedForUser(user)
    }));

    res.json(unlockedLevels);
  } catch (error) {
    console.error('Get unlocked levels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlock next level
router.post('/:id/unlock', auth, async (req, res) => {
  try {
    const user = req.user;
    const level = await Level.findById(req.params.id);

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Check if level is already unlocked
    if (user.unlockedLevels.includes(level._id)) {
      return res.status(400).json({ message: 'Level already unlocked' });
    }

    // Check if user can unlock this level
    if (!level.isUnlockedForUser(user)) {
      return res.status(403).json({ message: 'Prerequisites not met' });
    }

    // Unlock the level
    user.unlockedLevels.push(level._id);
    await user.save();

    res.json({
      message: 'Level unlocked successfully',
      level: level
    });
  } catch (error) {
    console.error('Unlock level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get level progress
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const user = req.user;
    const level = await Level.findById(req.params.id).populate('problems');

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    const completedProblems = user.completedProblems.filter(completed =>
      level.problems.some(problem => 
        problem._id.toString() === completed.problemId.toString()
      )
    );

    const progress = {
      levelId: level._id,
      levelNumber: level.levelNumber,
      totalProblems: level.problems.length,
      completedProblems: completedProblems.length,
      progressPercentage: level.problems.length > 0 
        ? (completedProblems.length / level.problems.length) * 100 
        : 0,
      isCompleted: completedProblems.length === level.problems.length,
      completedProblemsList: completedProblems
    };

    res.json(progress);
  } catch (error) {
    console.error('Get level progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;