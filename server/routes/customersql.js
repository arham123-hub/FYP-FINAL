import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import connectAndQuery from "../configuration/db.js";
import archiver from "archiver";
import streamBuffers from "stream-buffers";

const router = express.Router();
const upload = multer(); // Define the upload variable here

router.post("/send-report", upload.single("file"), async (req, res) => {
  const { email } = req.body;
  const file = req.file;

  if (!email || !file) {
    return res.status(400).send("Email and file are required");
  }

  // Determine the file extension
  const fileExtension = file.originalname.split(".").pop();

  // Check if file size is greater than 9 MB
  const fileSizeInMB = file.size / (1024 * 1024);
  let fileBuffer = file.buffer;
  let fileName = `report.${fileExtension}`;

  if (fileSizeInMB > 9) {
    // Create a zip archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression level
    });

    const writableBuffer = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024, // Start with 100 kilobytes
      incrementAmount: 10 * 1024, // Grow by 10 kilobytes each time buffer overflows
    });

    archive.pipe(writableBuffer);
    archive.append(file.buffer, { name: `report.${fileExtension}` });
    await archive.finalize();

    fileBuffer = writableBuffer.getContents();
    fileName = `report.zip`;
  }

  // Create a Nodemailer transporter using your email service
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'gmail'
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true, // true for 465, false for other ports
  });

  // Verify the connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send("Error verifying email configuration: " + error.message);
    } else {
      console.log("Server is ready to take our messages");

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Report",
        text: "Please find attached report.",
        attachments: [
          {
            filename: fileName, // Dynamic filename based on file extension and compression
            content: fileBuffer,
          },
        ],
      };

      // Send email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          res.status(500).send("Error sending email: " + err.message);
        } else {
          console.log("Email sent successfully:", info.response);
          res.status(200).send("Email sent successfully");
        }
      });
    }
  });
});

// Add a report (SQL query and name) to an organization
router.post("/add-report", async (req, res) => {
  const { organizationId, name, query } = req.body;

  try {
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    organization.reports.push({ name, query });
    await organization.save();

    res
      .status(201)
      .json({ message: "Report added to organization", organization });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch reports by organization
router.post("/get-reports", async (req, res) => {
  const { orgId } = req.body;

  try {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(organization.reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/execute-report", async (req, res) => {
  const { query } = req.body;
  try {
    const result = await connectAndQuery(query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

// Schedule reports endpoint
router.post("/schedule-reports", async (req, res) => {
  const { orgId, reportIds } = req.body;

  try {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Add scheduled reports to the organization
    organization.scheduledReports = reportIds.map((id) => ({
      report: id,
      time: "00 00 00 * * *",
    })); // Run daily at midnight
    await organization.save();

    // Schedule the jobs
    reportIds.forEach((reportId) => {
      scheduleReportJob(orgId, reportId);
    });

    res.status(200).json({ message: "Reports scheduled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Function to schedule report job
const scheduleReportJob = (orgId, reportId) => {
  nodeCron.schedule("00 00 00 * * *", async () => {
    try {
      const organization = await Organization.findById(orgId).populate(
        "reports"
      );
      const report = organization.reports.id(reportId);

      const users = await User.find({ organization: orgId });
      const emails = users.map((user) => user.email);

      // Create the report file (e.g., CSV or PDF) based on report query
      const reportFile = await generateReportFile(report);

      // Send emails to all users
      await sendEmails(emails, reportFile, report.name);
    } catch (error) {
      console.error("Error in scheduled job:", error);
    }
  });
};

// Function to generate report file based on the report query
const generateReportFile = async (report) => {
  // Implement report file generation logic here
  // This can be a CSV or PDF based on your implementation
  // For demonstration purposes, returning a dummy buffer
  return Buffer.from(`Report: ${report.name}\nQuery: ${report.query}`, "utf-8");
};

// Function to send emails
const sendEmails = async (emails, file, reportName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(", "), // Join emails into a single string
    subject: `Scheduled Report: ${reportName}`,
    text: "Please find the attached report.",
    attachments: [
      {
        filename: `${reportName}.pdf`, // or .csv based on file type
        content: file,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export default router;
