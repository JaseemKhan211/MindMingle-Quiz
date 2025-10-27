const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController'); 
const viewRouter = require('./routes/viewRouters');
const userRouters = require('./routes/userRouters');
const dataRouters = require('./routes/dataRouters');
const qaRouters = require('./routes/qaRouters');

// Start express app
const app = express();

app.set('trust proxy', 1);

// Set Pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if(process.env.NODE_ENV = 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
    keyGenerator: (req, res) => {
        return req.ip;
    }
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
  
app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    req.io = app.get('io');

    // ERROR FIND LOG 💥💥💥
    // console.log('Hearder App Js file log: ', req.headers);
    // console.log(req.cookies);
    // console.log('Response User Local Check: ', res.locals.user);
    // console.log('Response User Local Check: ', req.user);
    
    next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/data', dataRouters);
app.use('/', qaRouters);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't fint ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
