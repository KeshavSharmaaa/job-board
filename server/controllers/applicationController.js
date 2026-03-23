const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
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

    const candidate = await User.findById(req.user.id);
    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume: req.file ? req.file.path : "",
      status: "pending",
    });

    // EMAIL TO EMPLOYER AND CANDIDATE
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // To Employer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: job.employer.email,
        subject: `New Application for ${job.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #4f46e5;">New Application Received!</h2>
            <p>Hello <strong>${job.employer.name}</strong>,</p>
            <p>You just received a new application from <strong>${candidate.name}</strong> for the position of <strong>${job.title}</strong>.</p>
            <p>Please log in to your Employer Dashboard to review their resume and profile.</p>
          </div>
        `,
      });

      // To Candidate
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: candidate.email,
        subject: `Application Submitted: ${job.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Application Successful!</h2>
            <p>Hi <strong>${candidate.name}</strong>,</p>
            <p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been successfully submitted! We've notified the employer.</p>
            <p>They will review your profile and update your status shortly. Good luck!</p>
          </div>
        `,
      });
    } catch (err) {
      console.log("Email dispatch failed:", err.message);
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

      const isAccepted = status === "accepted";
      const subject = isAccepted ? `🎉 Good news: Application Accepted for ${application.job.title}` : `Update on your application for ${application.job.title}`;
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: application.candidate.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: ${isAccepted ? '#10b981' : '#f43f5e'};">Application ${status === 'accepted' ? 'Accepted' : 'Update'}</h2>
            <p>Hi <strong>${application.candidate.name}</strong>,</p>
            <p>Your application for the position of <strong>${application.job.title}</strong> at <strong>${application.job.company}</strong> has been <strong>${status}</strong>.</p>
            ${isAccepted ? '<p>Congratulations! The employer will likely reach out to you soon with next steps.</p>' : '<p>Thank you for applying. We wish you the best of luck in your job search!</p>'}
          </div>
        `,
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