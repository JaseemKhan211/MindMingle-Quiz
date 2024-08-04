const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
// const session = require('express-session');

const app = express();

// Load environment variables
require('dotenv').config();

const viewRouter = require('./routes/viewRouters');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//Session middleware
// app.use(session({
//     secret: process.env.SESSION_SECRET, 
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true } 
// }));
  

// ROUTES
app.use('/', viewRouter);

module.exports = app;
