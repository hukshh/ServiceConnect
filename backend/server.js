const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
console.log('Attempting to connect to MongoDB...');
connectDB();

const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

// Log incoming requests - VERY TOP
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Parse incoming JSON request bodies
app.use(express.json());

// Enable CORS for all origins (frontend dev server)
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Configure Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Map to track active user socket connections (userId -> socketId)
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Listen for user registering their ID
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Make io & connectedUsers accessible to other files via exports
module.exports = { app, io, connectedUsers };

// Mount authentication routes at /api/auth
app.use('/api/auth', require('./routes/authRoutes'));

// Mount category, service, provider, booking, review, admin routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/promo', require('./routes/promoRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint to verify API is running
app.get('/', (req, res) => {
  res.json({ message: 'ServiceConnect API is running' });
});

const PORT = process.env.PORT || 5001;

// NOTE: Don't start server immediately if this file is imported by a test file.
if (require.main === module) {
  httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

