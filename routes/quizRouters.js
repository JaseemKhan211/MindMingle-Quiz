const express = require("express");
const qaController = require("../controllers/qaController");

const router = express.Router();

router.post('/setQuiz', qaController.setQuiz);
router.get('/report', qaController.getAllQA);

module.exports = router;
