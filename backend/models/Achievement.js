const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['streak', 'level', 'problem', 'category', 'special']
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: ['problems_solved', 'streak_days', 'level_reached', 'category_mastery', 'perfect_solve', 'speed_solve']
    },
    value: {
      type: Number,
      required: true
    },
    category: String // for category-specific achievements
  },
  xpReward: {
    type: Number,
    required: true
  },
  pointsReward: {
    type: Number,
    required: true
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  color: {
    type: String,
    default: '#FFD700'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to check if user qualifies for achievement
achievementSchema.methods.checkEligibility = function(user) {
  switch (this.criteria.type) {
    case 'problems_solved':
      return user.completedProblems.length >= this.criteria.value;
    
    case 'streak_days':
      return user.currentStreak >= this.criteria.value;
    
    case 'level_reached':
      return user.level >= this.criteria.value;
    
    case 'category_mastery':
      const categoryProblems = user.completedProblems.filter(problem => 
        problem.problemId && problem.problemId.category === this.criteria.category
      );
      return categoryProblems.length >= this.criteria.value;
    
    case 'perfect_solve':
      return user.completedProblems.some(problem => 
        problem.attempts === 1 && problem.points > 0
      );
    
    case 'speed_solve':
      // This would need additional tracking of solve times
      return false;
    
    default:
      return false;
  }
};

module.exports = mongoose.model('Achievement', achievementSchema);