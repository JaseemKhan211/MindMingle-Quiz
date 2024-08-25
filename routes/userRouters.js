const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(authController.protect, userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser);
module.exports = router;

