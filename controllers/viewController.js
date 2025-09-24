const { getQuestion, getAnswer } = require('./dataController');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const questions = getQuestion();
// const answers = getAnswer();

// ERROR FIND LOG 💥
// console.log('CHECK QUESTION', questions);
// console.log('CHECK ANSWER', answers);

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
        title: 'Sign Up'
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

