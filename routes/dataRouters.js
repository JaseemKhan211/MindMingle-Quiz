module.exports = (io) => {
    const express = require('express');
    const router = express.Router();

    // ERROR FIND LOG 💥
    // console.log('dataRouter file', io);

    const AdminController = require('../controllers/adminController')(io); 

    router.post('/raiseQuestion', AdminController.raiseQuestion);

    return router;
};