const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getWellcome);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/select', authController.protect, viewController.getselectQuestion);
router.get('/quiz', authController.protect, viewController.getstartQuiz);
router.get('/signup', viewController.getSignForm);

router.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;

