const express = require('express');
const multer = require("multer");
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get('/', authController.isLoggedIn, viewController.getWellcome);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/select', authController.protect, viewController.getselectQuestion);
router.get('/quiz', authController.protect, viewController.getstartQuiz);
router.get('/qaform', authController.protect, viewController.getqaForm);
router.get('/report', authController.protect, viewController.getReport);
router.get('/signup', viewController.getSignForm);

router.post(
    "/upload", 
    upload.single("qaFile"), 
    authController.protect,
    viewController.uploadQA
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;

