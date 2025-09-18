const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/mongodb");

dotenv.config();

const connectCloudinary = require("./config/cloudinary");
const adminRoute = require("./routes/AdminRoute");
const doctorRoute = require("./routes/DoctorRoute");
const userRoute = require("./routes/userRoute");

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to the database
connectDB();

// Configure Cloudinary
connectCloudinary();

// CORS - Allow all origins
app.use(cors({
  origin: true,
  credentials: true
}));

// Manual CORS headers as backup for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Endpoints
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);
app.use('/api/user', userRoute);

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API working great",
    timestamp: new Date().toISOString(),
    cors: "enabled"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// CRITICAL: Export for Vercel
module.exports = app;