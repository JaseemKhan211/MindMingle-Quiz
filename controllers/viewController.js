const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getWellcome = catchAsync( async (req, res) => {
    res.status(200).render('welcome', {
        title: 'Well-Come'
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

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
      title: 'Your account',
      user: req.user
    })
};