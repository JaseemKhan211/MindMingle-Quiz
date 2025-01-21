const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Create server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server);

// Middleware to pass io to app.js file
app.set('io', io); 

// Example socket connection setup
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = { server, io };

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

