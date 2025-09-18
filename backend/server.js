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

// CORS Configuration - Apply BEFORE other middlewares
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    const allowedOrigins = [
      'https://prescropto-frontend.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173', // for Vite
      'https://prescropto-asmin.onrender.com', // update with actual domain
      // Add your actual frontend domains here
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Apply CORS before other middlewares
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware - Apply AFTER CORS
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
    timestamp: new Date().toISOString()
  });
});

// CORS error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      origin: req.get('origin')
    });
  }
  
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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});