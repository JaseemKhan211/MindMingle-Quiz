const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  questionLimit: {
    type: Number,
    required: true
  },
  quizTime: {
    type: Number,
    required: true
  },
  shuffle: {
    type: Boolean,
    default: false
  },
  autoSubmit: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);