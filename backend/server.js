const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/mongodb");
dotenv.config();
const connectCloudinary = require("./config/cloudinary");
const adminRoute = require("./routes/AdminRoute");
const doctorRoute = require("./routes/DoctorRoute");
const userRoute = require("./routes/userRoute");


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRoute)
app.use("/api/admin", adminRoute)
app.use("/api/doctor", doctorRoute)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))