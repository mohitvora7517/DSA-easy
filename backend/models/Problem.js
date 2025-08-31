const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: mongoose.Schema.Types.Mixed,
  expectedOutput: mongoose.Schema.Types.Mixed,
  description: String,
  isHidden: {
    type: Boolean,
    default: false
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard', 'expert']
  },
  category: {
    type: String,
    required: true,
    enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'sorting', 'searching', 'math', 'greedy']
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  timeLimit: {
    type: Number,
    default: 2000 // milliseconds
  },
  memoryLimit: {
    type: Number,
    default: 128 // MB
  },
  testCases: [testCaseSchema],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  hints: [String],
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  solution: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  tags: [String],
  acceptanceRate: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  correctSubmissions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to calculate acceptance rate
problemSchema.methods.calculateAcceptanceRate = function() {
  if (this.totalSubmissions === 0) return 0;
  return (this.correctSubmissions / this.totalSubmissions) * 100;
};

// Method to update acceptance rate
problemSchema.methods.updateAcceptanceRate = function(isCorrect) {
  this.totalSubmissions += 1;
  if (isCorrect) {
    this.correctSubmissions += 1;
  }
  this.acceptanceRate = this.calculateAcceptanceRate();
};

module.exports = mongoose.model('Problem', problemSchema);