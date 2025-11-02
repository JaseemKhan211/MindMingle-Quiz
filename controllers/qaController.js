const QA = require("../models/qaModel");

const catchAsync = require("../utils/catchAsync");

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


