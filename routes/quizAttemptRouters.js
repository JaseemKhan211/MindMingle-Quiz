const express = require("express");

const authController = require('../controllers/authController');
const quizAttemptController = require("../controllers/quizAttemptController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/submit', quizAttemptController.submitQuiz);
router.get('/result/:id', quizAttemptController.getResult);

module.exports = router;