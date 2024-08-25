const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getWellcome);

// router.get('/', viewController.getWellcome);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', viewController.getSignForm);

router.get('/me', viewController.getAccount);

module.exports = router;

