const Attempt = require('../models/Attempt');

const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.getStudentAttempts = catchAsync(async (req, res, next) => {
  // 1. Get student ID from request parameters
  const studentId = req.params.studentId;

  // 2. Fetch total attempts for the given student
  const totalAttempts = await Attempt.countDocuments({
    user: studentId
  });

  // 3. Fetch all attempts for the given student
  const studentAttempts = await Attempt.find({ user: studentId })
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });

  // 4. If no attempts found, return an error
  if (studentAttempts.length === 0) {
    return next(
      new AppError(
        'No attempts found for this student', 
        404
      )
    );
  };

  // 5. Determine the best score among the attempts  
  const bestAttempt = studentAttempts[0];
  const bestScore = bestAttempt ? bestAttempt.score : 0;

  // 6. Calculate average score for the student
  const avgResult = await Attempt.aggregate([
      { $match: { user: studentId } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' }
        }
      }
  ]);

  // 7. Format average score to one decimal place
  const avgScore = avgResult.length
    ? avgResult[0].avgScore.toFixed(1)
    : 0;

  // 8. Calculate number of attempts per quiz for the student
  const attemptsPerQuiz = await Attempt.aggregate([
    { $match: { user: studentId } },
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

  // 9. Fetch recent attempts for the student (limit to 5)
  const recentAttempts = await Attempt.find({ user: studentId })
    .populate('quiz', 'title')
    .sort('-createdAt')
    .limit(5)
    .select('score createdAt quiz');
  

  // 10. Send response with all gathered data  
  res.status(200).json({
    status: 'success',
    results: studentAttempts.length,
    data: {
      totalAttempts,
      bestScore,
      avgScore,
      attemptsPerQuiz,
      recentAttempts,
      allAttempts: studentAttempts
    }
  });
});
