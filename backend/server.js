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
connectDB();

// Middlewares
app.use(express.json());

// Configure CORS to allow requests from your frontend origin
app.use(cors({
  origin: 'https://prescropto-frontend-c55xb9zyu-atharv1191s-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Alternatively, set headers directly
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://prescropto-frontend-c55xb9zyu-atharv1191s-projects.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Handle preflight requests for all routes
app.options('*', cors({
  origin: 'https://prescropto-frontend-c55xb9zyu-atharv1191s-projects.vercel.app'
}));

// Connect Cloudinary
connectCloudinary();

// API Endpoints
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);
app.use('/api/user', userRoute);

// Test route
app.get('/', (req, res) => {
  res.send("API working great");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
