import express from "express";
import { Submission } from "../models/Submission.js";
import { Task } from "../models/Task.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/:taskId", upload.single("sampleFile"), async (req, res) => {
  const { taskId } = req.params;
  const { 
    name, 
    email, 
    phone, 
    portfolioUrl, 
    experienceLevel, 
    skills, 
    rateExpectation, 
    message, 
    sampleLink 
  } = req.body;

  if (!name || !email || !phone || !experienceLevel) {
    return res.status(400).json({ message: "Name, email, phone, and experience level are required" });
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const submission = await Submission.create({
    taskId,
    name,
    email,
    phone,
    portfolioUrl: portfolioUrl || "",
    experienceLevel,
    skills: skills || "",
    rateExpectation: rateExpectation || "",
    message: message || "",
    sampleLink: sampleLink || "",
    sampleFilePath: req.file ? `/uploads/${req.file.filename}` : ""
  });

  return res.status(201).json(submission);
});

router.get("/", requireAdmin, async (req, res) => {
  const submissions = await Submission.find()
    .populate("taskId", "title")
    .sort({ createdAt: -1 });

  return res.json(submissions);
});

export default router;
