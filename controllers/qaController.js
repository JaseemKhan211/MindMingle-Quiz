const xlsx = require("xlsx");
const fs = require("fs");

const QA = require("../models/qaModel");
const catchAsync = require("../utils/catchAsync");

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
    message: "✅ Questions uploaded successfully!",
  });
});