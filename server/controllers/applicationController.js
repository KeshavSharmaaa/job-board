const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ==============================
// APPLY FOR JOB
// ==============================
exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Only candidate can apply
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply" });
    }

    const job = await Job.findById(jobId).populate("employer");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume: req.file ? req.file.path : "",
      status: "pending",
    });

    // =============================
    // SEND EMAIL TO EMPLOYER
    // =============================
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
        text: `A candidate has applied for ${job.title}.`,
      });
    } catch (err) {
      console.log("Employer email failed:", err.message);
    }

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.log("Apply Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET MY APPLICATIONS (Candidate)
// ==============================
exports.getMyApplications = async (req, res) => {
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
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only employer who posted job
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
exports.updateApplicationStatus = async (req, res) => {
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

    // Only employer who owns the job
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = status;
    await application.save();

    // =============================
    // SEND STATUS EMAIL TO CANDIDATE
    // =============================
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