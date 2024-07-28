const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getWellcome);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignForm);

module.exports = router;

