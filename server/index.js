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
// CORS Configuration
// =====================
const allowedOrigins = [
  "http://localhost:3000",
  "https://job-board-kzq33sty1-keshavsharmaaas-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// =====================
// Middleware
// =====================
app.use(express.json());
app.set("trust proxy", 1);

// Serve uploaded resumes
app.use("/uploads", express.static("uploads"));

// =====================
// Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Job Board API Running 🚀");
});

// =====================
// MongoDB Connection
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});