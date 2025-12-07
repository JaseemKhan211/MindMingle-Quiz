const QA = require("../models/qaModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.getAllQA = catchAsync(async (req, res, next) => {
    const QAS = await QA.find();
  
    res.status(200).json({
      status: 'success',
      results: QAS.length,
      data: {
        QAS
      }
    });
});

exports.setQuiz = catchAsync(async (req, res, next) => {
  // 1. Get quiz settings
  const { questionLimit, quizTime, shuffle, autoSubmit } = req.body;

  // 2. Convert limit to number
  const limit = Number(questionLimit);

  // 3. Validate limit
  if (!limit || limit <= 0) {
    return next(
      new AppError(
        'Invalid question limit', 
        400
      )
    );
  };

  // 4. Count total questions in database
  const totalQuestions = await QA.countDocuments();

  // 5. Check if enough questions exist
  if (totalQuestions < limit) {
    return next(
      new AppError(
        `Only ${totalQuestions} questions available in database`,
        400
      )
    );
  };

  // 6. Fetch questions (random or normal)
  let questions;

  if (shuffle === true) {
    questions = await QA.aggregate([
      { $sample: { size: limit } }
    ]);
  } else {
    questions = await QA.find().limit(limit);
  }

  // 7. Send final quiz to frontend
  res.status(200).json({
    status: 'success',
    totalQuestions: questions.length,
    quizTime,
    autoSubmit,
    questions
  });
});



