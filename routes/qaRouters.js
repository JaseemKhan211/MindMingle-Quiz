const express = require("express");
const multer = require("multer");
const qaController = require("../controllers/qaController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
    "/upload", 
    upload.single("qaFile"), 
    qaController.uploadQA
);

module.exports = router;
