const { getQuestion, getAnswer } = require('./dataController');
const xlsx = require("xlsx");
const fs = require("fs");

const User = require('../models/userModel');
const QA = require("../models/qaModel");

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const questions = getQuestion();

exports.getWellcome = catchAsync( async (req, res) => {
    const user = await User.findOne();

    if (!user) {
        return next(new AppError('There is no page with that name.', 404));
    }
    
    res.status(200).render('welcome', {
        title: 'Well-Come',
        isLoggedIn: !!res.locals.user
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login'
    });
};

exports.getSignForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Adding User'
    });
};

exports.getAccount = async (req, res) => {
    res.status(200).render('account', {
      title: 'Your account',
      user: res.locals.user
    });
};

exports.getselectQuestion = (req, res) => {
  res.status(200).render('selectQuestion', {
    title: 'Select Question Here',
    questions
  });
};

exports.getstartQuiz = async (req, res) => {
  try {
    res.status(200).render('startQuiz', {
      title: 'Concentrate on Quiz 😊',
      question: null, 
      answers: []     
    });
  } catch (err) {
    console.error('Error in getstartQuiz:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        username: req.body.username,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    );
  
    res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser
    });
});

exports.getqaForm = (req, res) => {
  res.status(200).render('qaForm', {
    title: "QA Form",
  });
}; 

exports.uploadQA = catchAsync(async (req, res, next) => {
  // Step 1: Read uploaded file
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Step 2: Insert each row into MongoDB
  for (const row of data) {
    await QA.create({
      question: row.question,
      options: [row.optionA, row.optionB, row.optionC, row.optionD],
      correct: row.correct,
    });
  }

  // Step 3: Delete uploaded file after processing
  fs.unlinkSync(req.file.path);

  // Step 4: Send success message
  res.render("qaForm", {
    title: "QA Upload",
    message: "✅ Questions uploaded successfully!",
  });
});

exports.getReport = async (req, res) => {
  try {
    const QAS = await QA.find();
  
    res.status(200).render('report', { 
      title: 'QA Report',
      QAS 
    });
  } catch(error) {
      res.status(500).send(
        "Error fetching Q/A data", 
        error.message
      );
  }
};

exports.getUserReport = async (req, res) => {
  try {
    const users = await User.find();
  
    res.status(200).render('userReport', { 
      title: 'Users Report',
      users
    });
  } catch(error) {
      res.status(500).send(
        "Error fetching users data", 
        error.message
      );
  }
};
