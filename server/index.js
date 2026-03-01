const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// =====================
// Import Routes
// =====================
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// =====================
// Create App
// =====================
const app = express();

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());

// Serve uploaded resumes
app.use("/uploads", express.static("uploads"));

// =====================
// Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// =====================
// Default Route
// =====================
app.get("/", (req, res) => {
  res.send("Job Board API Running...");
});

// =====================
// MongoDB Connection
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
