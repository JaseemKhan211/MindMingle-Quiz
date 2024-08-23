const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('.././utils/catchAsync');
const AppError = require('../utils/appError');

// Function to sign a JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Function to create and send a token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // Remove the password the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async(req, res, next) => {
  const newUser = await User.create({
    user_id: req.body.user_id,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { user_id, password } = req.body;

  // 1) Check if email and password exist
  if (!user_id || !password) {
    return next(new AppError('Please provide user id and password!', 400));
  }
  
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ user_id }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect user id or password', 401));
  }
  
  // ERROR FIND
  console.log('current User 03', res.locals.user);

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// exports.logout = (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true
//   });
//   res.status(200).json({ status: 'success' });
// };

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      // ERROR FIND
      console.log('Current User 01', currentUser);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      // ERROR FIND
      console.log('current User 02', res.locals.user);
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
