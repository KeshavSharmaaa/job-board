const Job = require("../models/Job");

// ============================
// CREATE JOB (Employer Only)
// ============================
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
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
    console.log("Create job error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET ALL JOBS
// ============================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET SINGLE JOB
// ============================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// DELETE JOB (Employer Only)
// ============================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
};