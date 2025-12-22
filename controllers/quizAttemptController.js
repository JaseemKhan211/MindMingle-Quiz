const Attempt = require('../models/quizAttemptModel');
const Quiz = require('../models/quizModel');
const QA = require("../models/qaModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.submitQuiz = catchAsync(async (req, res, next) => {
  const { answers } = req.body;

  // 1. GET active quiz
  const quiz = await Quiz.findOne({ status: 'active' });

  if (!quiz) {
    return next(
      new AppError(
        'No active quiz found', 
        400
    )
    );
  }

  // 2. Validate answers
  if (!answers || answers.length === 0) {
    return next(
      new AppError(
        'No answers submitted', 
        400
    )
    );
  }

  // 3. Save attempt
  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers
  });

  // 4. Response
  res.status(201).json({
    status: 'success',
    message: 'Quiz submitted successfully',
    attemptId: attempt._id
  });
});