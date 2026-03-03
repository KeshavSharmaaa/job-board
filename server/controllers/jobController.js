const mongoose = require("mongoose");
const Job = require("../models/Job");

// ============================
// CREATE JOB (Employer Only)
// ============================
const createJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = await Job.create({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      description: req.body.description,
      salary: req.body.salary,
      employer: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET ALL JOBS
// ============================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer", "name email");
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET SINGLE JOB
// ============================
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId before querying MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await Job.findById(id).populate(
      "employer",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (err) {
    console.error("Get job by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// DELETE JOB (Employer Only)
// ============================
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!req.user || job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
};