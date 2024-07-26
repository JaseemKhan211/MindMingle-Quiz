const path = require('path');
const express = require('express');
const app = express();

// const homeRouter = require('./routes/homeRouter');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ROUTES
app.get('/', (req, res) => {
    res.status(200).render('base');
});

// app.use('/api/v1/homeScreen', homeRouter);

module.exports = app;
