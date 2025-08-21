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

// Middlewares
app.use(express.json());

// Configure CORS - Fix this part
const corsOptions = {
  origin: [
    'https://prescropto-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173', // for Vite
    'https://your-admin-domain.vercel.app' // if you have admin panel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// API Endpoints
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);
app.use('/api/user', userRoute);

// Test route
app.get('/', (req, res) => {
  res.send("API working great");
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
    message: 'Route not found'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});