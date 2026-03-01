const express = require("express");
const router = express.Router();

const {
  applyJob,
  getMyApplications,
  getApplicantsForEmployer,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Candidate apply with resume upload
router.post("/", protect, upload.single("resume"), applyJob);

// Candidate view own applications
router.get("/my", protect, getMyApplications);

// Employer view applicants
router.get("/employer", protect, getApplicantsForEmployer);

// Employer update status
router.put("/:id/status", protect, updateApplicationStatus);

module.exports = router;
