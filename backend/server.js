const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
console.log('Attempting to connect to MongoDB...');
connectDB();

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Enable CORS for all origins (frontend dev server)
app.use(cors());

// Mount authentication routes at /api/auth
app.use('/api/auth', require('./routes/authRoutes'));

// Mount category, service, and provider routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));

// Health check endpoint to verify API is running
app.get('/', (req, res) => {
  res.json({ message: 'ServiceConnect API is running' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
