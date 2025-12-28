const mongoose = require('mongoose');

const Attempt = require('../models/quizAttemptModel');

const catchAsync = require("../utils/catchAsync");

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  // 1. Get student ID from authenticated user
  const studentId = req.user.id;

  // 2. Fetch quiz attempt statistics
  const totalAttempts = await Attempt.countDocuments({
    user: studentId
  });

  // 3. Fetch all attempts for further calculations
  const studentAttempts = await Attempt.find({ user: studentId })
    .populate('quiz', 'title')
    .sort('-submittedAt');

  // 4. Calculate best score
  const bestScore = studentAttempts.length
    ? Math.max(...studentAttempts.map(a => a.score))
    : 0;

  // 5. Calculate average score
  const avgResult = await Attempt.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$score' }
      }
    }
  ]);

  const avgScore = avgResult.length
    ? Number(avgResult[0].avgScore.toFixed(1))
    : 0;

  // 6. Attempts per quiz
  const attemptsPerQuiz = await Attempt.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(studentId) } },
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

  // 7. Recent attempts (Last 5) 
  const recentAttempts = await Attempt.find({ user: studentId })
    .populate('quiz', 'title')
    .sort('-submittedAt')
    .limit(5)
    .select('score quiz submittedAt');

  // 8. Send response   
  res.status(200).json({
    status: 'success',
    data: {
      totalAttempts,
      bestScore,
      avgScore,
      attemptsPerQuiz,
      recentAttempts
    }
  });
});

