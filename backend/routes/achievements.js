const express = require('express');
const Achievement = require('../models/Achievement');
const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    console.log('Achievements route hit!');
    const achievements = await Achievement.find({ isActive: true })
      .sort({ rarity: 1, xpReward: 1 });

    console.log(`Found ${achievements.length} achievements`);
    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get achievement by ID
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    console.error('Get achievement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;