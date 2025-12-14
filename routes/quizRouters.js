const express = require("express");

const quizController = require("../controllers/quizController");

const router = express.Router();

router.get('/startQuiz', quizController.startQuiz);
router.post('/setQuiz', quizController.setQuiz);

module.exports = router;