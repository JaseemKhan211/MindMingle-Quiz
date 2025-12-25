const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Only allow admin users to access the routes below
// router.use(authController.restrictTo('admin'));

router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
