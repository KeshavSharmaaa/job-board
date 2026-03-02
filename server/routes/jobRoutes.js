const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
} = require("../controllers/jobController");

// Create job (Employer only)
router.post("/", authMiddleware, createJob);

// Get all jobs
router.get("/", getJobs);

// Get single job
router.get("/:id", getJobById);

// Delete job (Employer only)
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;