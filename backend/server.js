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

// Configure CORS
app.use (cors())



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
