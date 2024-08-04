const express = require('express');
const viewController = require('../controllers/viewController');
// const authController = require('../controllers/authController');

const router = express.Router();

// router.post('/authlogin', authController.login);
// router.get('/logout', authController.logout);

router.get('/', viewController.getWellcome);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignForm);

module.exports = router;

