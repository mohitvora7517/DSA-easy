const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'sorting', 'searching']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  xpReward: {
    type: Number,
    required: true
  },
  pointsReward: {
    type: Number,
    required: true
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level'
  }],
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  isUnlocked: {
    type: Boolean,
    default: false
  },
  completionRate: {
    type: Number,
    default: 0
  },
  averageTime: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: '🎯'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for total problems count
levelSchema.virtual('totalProblems').get(function() {
  return this.problems.length;
});

// Method to check if level is unlocked for user
levelSchema.methods.isUnlockedForUser = function(user) {
  if (this.levelNumber === 1) return true;
  
  // Check if all prerequisites are completed
  return this.prerequisites.every(prereqId => 
    user.completedProblems.some(completed => 
      completed.problemId.toString() === prereqId.toString()
    )
  );
};

module.exports = mongoose.model('Level', levelSchema);