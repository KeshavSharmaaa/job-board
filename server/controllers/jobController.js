const Job = require("../models/Job");
const Application = require("../models/Application");

/* =========================
   CREATE JOB
========================= */
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const { title, company, location, description, salary } = req.body;

    const job = new Job({
      title,
      company,
      location,
      description,
      salary,
      employer: req.user._id,
    });

    await job.save();

    res.status(201).json(job);

  } catch (error) {
    res.status(500).json({ message: "Error creating job" });
  }
};

/* =========================
   GET ALL JOBS
========================= */
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

/* =========================
   GET JOB BY ID
========================= */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job" });
  }
};

/* =========================
   DELETE JOB (Owner Only)
========================= */
exports.deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can delete jobs" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your job" });
    }

    // Delete related applications
    await Application.deleteMany({ job: job._id });

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
};
