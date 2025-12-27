const express = require('express');
const multer = require("multer");
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get('/', authController.isLoggedIn, viewController.getWellcome);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/add', authController.isLoggedIn, viewController.getSignForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get('/set', authController.protect, viewController.getSetQuiz);
router.get('/quiz', authController.protect, viewController.getStudentQuiz);
router.get('/quiz/result/:id', authController.protect, viewController.getResults);

router.get('/qaform', authController.protect, viewController.getqaForm);
router.get('/report', authController.protect, viewController.getReport);

router.get('/users', authController.protect, viewController.getUserReport);
router.get('/roles', authController.protect, viewController.getRoleReport);
router.get('/admin-dashboard', authController.protect, viewController.getAdminDashboard);
router.get('/student-dashboard', authController.protect, viewController.getStudentDashboard);

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

