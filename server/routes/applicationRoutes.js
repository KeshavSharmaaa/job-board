const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const upload = multer({ dest: "uploads/" });

router.post("/:jobId", authMiddleware, upload.single("resume"), applyForJob);
router.get("/my", authMiddleware, getMyApplications);
router.get("/job/:jobId", authMiddleware, getJobApplications);
router.put("/:id/status", authMiddleware, updateApplicationStatus);

module.exports = router;