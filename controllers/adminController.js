const Quiz = require('../models/quizModel');
const Attempt = require('../models/quizAttemptModel');
const User = require('../models/userModel');

const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  // 1. Total number of users, quizzes, attempts
  const totalQuizzes = await Quiz.countDocuments();
  const activeQuizzes = await Quiz.countDocuments({ status: 'active' });
  const totalAttempts = await Attempt.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'user' });

  // 2. Number of attempts per quiz
  const attemptsPerQuiz = await Attempt.aggregate([
    {
      $group: {
        _id: '$quiz',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'quizzes',
        localField: '_id',
        foreignField: '_id',
        as: 'quiz'
      }
    },
    { $unwind: '$quiz' },
    {
      $project: {
        quiz: '$quiz.title',
        count: 1
      }
    }
  ]);
  
  // 3. Average score across all attempts
  const avgScoreAgg = await Attempt.aggregate([
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$score' }
      }
    }
  ]);

  const avgScore = avgScoreAgg[0]?.avgScore || 0;

  // 4. Recent attempts (last 5)
  const recentAttempts = await Attempt.find()
    .populate('user', 'username')
    .populate('quiz')
    .sort({ createdAt: -1 })
    .limit(5);

  // 5. Send response
  res.status(200).json({
    status: 'success',
    stats: {
      totalQuizzes,
      activeQuizzes,
      totalAttempts,
      totalStudents,
      avgScore: avgScore.toFixed(2),
      attemptsPerQuiz,
      recentAttempts
    }
  });
});