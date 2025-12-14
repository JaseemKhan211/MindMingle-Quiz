const Quiz = require('../models/quizModel');
const QA = require("../models/qaModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.setQuiz = catchAsync(async (req, res, next) => {
  const { questionLimit, quizTime, shuffle, autoSubmit } = req.body;

  // 1. End previous active quiz
  await Quiz.updateMany(
    { status: 'active' }, 
    { status: 'ended' }
  );

  // 2. Create new quiz
  const quiz = await Quiz.create({
    questionLimit,
    quizTime,
    shuffle,
    autoSubmit
  });

  // 3. Send response
  res.status(201).json({
    status: 'success',
    quiz
  });
});

exports.startQuiz = catchAsync(async (req, res, next) => {
  // 1. Get active quiz set by Admin
  const quiz = await Quiz.findOne({ status: 'active' });

  if (!quiz) {
    return next(
        new AppError(
            'Quiz not started by admin yet', 
            400
        )
    );
  }

  const { questionLimit, quizTime, shuffle, autoSubmit } = quiz;

  // 2. Validate questions
  const totalQuestions = await QA.countDocuments();
  if (totalQuestions < questionLimit) {
    return next(
      new AppError('Not enough questions in database', 400)
    );
  }

  // 3. Fetch questions
  let questions;
  if (shuffle) {
    questions = await QA.aggregate([{ $sample: { size: questionLimit } }]);
  } else {
    questions = await QA.find().limit(questionLimit);
  }

  // 4. Hide correct answer
  const safeQuestions = questions.map(q => ({
    _id: q._id,
    question: q.question,
    options: q.options
  }));

  // 5. Send to student
  res.status(200).json({
    status: 'success',
    quizTime,
    autoSubmit,
    totalQuestions: safeQuestions.length,
    questions: safeQuestions
  });
});