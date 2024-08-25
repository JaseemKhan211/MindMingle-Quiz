const factory = require('./handlerFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

