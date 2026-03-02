const Application = require("../models/Application");
const Job = require("../models/Job");
const nodemailer = require("nodemailer");

// ==============================
// APPLY FOR JOB (Candidate Only)
// ==============================
const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply" });
    }

    const job = await Job.findById(jobId).populate("employer");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume: req.file ? req.file.path : "",
      status: "pending",
    });

    // EMAIL TO EMPLOYER
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: job.employer.email,
        subject: "New Job Application",
        text: `A candidate applied for ${job.title}.`,
      });
    } catch (err) {
      console.log("Employer email failed:", err.message);
    }

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.log("Apply error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET MY APPLICATIONS (Candidate)
// ==============================
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    }).populate("job");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET JOB APPLICATIONS (Employer)
// ==============================
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({
      job: req.params.jobId,
    }).populate("candidate");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// UPDATE STATUS (Employer Only)
// ==============================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id)
      .populate("candidate")
      .populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = status;
    await application.save();

    // EMAIL TO CANDIDATE
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: application.candidate.email,
        subject: `Application ${status}`,
        text: `Your application for ${application.job.title} has been ${status}.`,
      });
    } catch (err) {
      console.log("Status email failed:", err.message);
    }

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.log("Update error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};