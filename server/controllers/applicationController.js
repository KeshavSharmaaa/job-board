const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendEmail } = require("../utils/emailService");

/* =========================================
   APPLY FOR JOB (Candidate Only)
========================================= */
exports.applyJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply" });
    }

    const { jobId } = req.body;

    const job = await Job.findById(jobId).populate("employer");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      resume: req.file ? req.file.path : "",
      status: "Pending",
    });

    await application.save();

    // Email Candidate
    try {
      await sendEmail(
        req.user.email,
        "Application Submitted",
        `You have successfully applied for "${job.title}". Status: Pending`
      );
    } catch (err) {
      console.log("Candidate email failed:", err.message);
    }

    // Email Employer
    try {
      await sendEmail(
        job.employer.email,
        "New Job Application",
        `A candidate applied for your job: "${job.title}".`
      );
    } catch (err) {
      console.log("Employer email failed:", err.message);
    }

    res.status(201).json({ message: "Application submitted successfully" });

  } catch (error) {
    console.log("APPLY ERROR:", error);
    res.status(500).json({ message: "Error applying for job" });
  }
};

/* =========================================
   CANDIDATE - View My Applications
========================================= */
exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      candidate: req.user._id,
    }).populate("job");

    res.json(applications);

  } catch (error) {
    console.log("MY APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

/* =========================================
   EMPLOYER - View Applicants
========================================= */
exports.getApplicantsForEmployer = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers allowed" });
    }

    const applications = await Application.find()
      .populate({
        path: "job",
        match: { employer: req.user._id },
      })
      .populate("candidate", "name email");

    // Remove null jobs (other employer jobs)
    const filtered = applications.filter(app => app.job !== null);

    res.json(filtered);

  } catch (error) {
    console.log("EMPLOYER VIEW ERROR:", error);
    res.status(500).json({ message: "Error fetching applicants" });
  }
};

/* =========================================
   EMPLOYER - Accept / Reject Application
========================================= */
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers allowed" });
    }

    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id)
      .populate({
        path: "job",
        populate: { path: "employer" },
      })
      .populate("candidate");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Ensure employer owns this job
    if (
      application.job.employer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    // Email candidate (safe block)
    try {
      await sendEmail(
        application.candidate.email,
        `Application ${status}`,
        `Your application for "${application.job.title}" has been ${status}.`
      );
    } catch (err) {
      console.log("Status email failed:", err.message);
    }

    res.json({ message: `Application ${status}` });

  } catch (error) {
    console.log("STATUS UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};
