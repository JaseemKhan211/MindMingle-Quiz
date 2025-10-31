const express = require("express");
const multer = require("multer");
const qaController = require("../controllers/qaController");
const authController = require('../controllers/authController');

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
    "/upload", 
    upload.single("qaFile"), 
    qaController.uploadQA
);

router.get(
    '/report', 
    authController.protect,
    qaController.getReport
);


module.exports = router;
