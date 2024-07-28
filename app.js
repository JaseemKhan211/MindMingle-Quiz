const path = require('path');
const express = require('express');
const app = express();

const viewRouter = require('./routes/viewRouters');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', viewRouter);

module.exports = app;
