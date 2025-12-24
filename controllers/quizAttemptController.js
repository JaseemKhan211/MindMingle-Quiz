const Attempt = require('../models/quizAttemptModel');
const Quiz = require('../models/quizModel');
const QA = require("../models/qaModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.submitQuiz = catchAsync(async (req, res, next) => {
  // 1. Extract answers from request body
  const { answers } = req.body;

  // 2. GET active quiz
  const quiz = await Quiz.findOne({ status: 'active' });
  if (!quiz) return next(new AppError('No active quiz found', 400));

  // 3. Validate answers
  if (!answers || answers.length === 0) {
    return next(
      new AppError(
        'No answers submitted', 
        400
      )
    );
  }

  // 4. Calculate score
  const questionIds = answers.map(a => a.question);
  const questions = await QA.find({
    _id: { $in: questionIds }
  });

  // 5. Tally correct answers
  let score = 0;
  answers.forEach(ans => {
    const q = questions.find(q =>
      q._id.toString() === ans.question.toString()
    );
    if (q && q.correct === ans.selectedAnswer) {
      score++;
    }
  });

  // 6. Save attempt with score and total questions
  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers,
    score,
    totalQuestions: questions.length
  });

  // 7. Calculate percentage
  const percentage = Math.round((score / questions.length) * 100);

  // 8. Update quiz status 
  quiz.status = 'ended';
  await quiz.save();

  // 8. Response with score details
  res.status(201).json({
    status: 'success',
    score,
    totalQuestions: questions.length,
    percentage,
    message: 'Quiz submitted successfully',
    attemptId: attempt._id
  });
});

exports.getResult = catchAsync(async (req, res, next) => {
  // 1. Fetch attempt by ID
  const attempt = await Attempt.findById(req.params.id)
    .populate('quiz')
    .populate('user', 'username email');

  // 2. Handle non-existent attempt
  if (!attempt) {
    return next(
      new AppError(
        'Result not found', 
        404
      )
    );
  }

  // 3. Calculate percentage
  const percentage = Math.round(
    (attempt.score / attempt.totalQuestions) * 100
  );

  // 4. Send result response
  res.status(200).json({
    status: 'success',
    result: {
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage
    }
  });
});

