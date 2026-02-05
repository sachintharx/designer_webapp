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

  // after creating, ensure we keep only the most recent 90 submissions
  try {
    const total = await Submission.countDocuments();
    const maxKeep = 90;
    if (total > maxKeep) {
      const toRemove = await Submission.find()
        .sort({ createdAt: 1 })
        .limit(total - maxKeep)
        .select("_id");
      const ids = toRemove.map((d) => d._id);
      if (ids.length) {
        await Submission.deleteMany({ _id: { $in: ids } });
      }
    }
  } catch (err) {
    // don't fail the submission if cleanup fails; log and continue
    console.error("Submission cleanup failed:", err);
  }

  return res.status(201).json(submission);
});

router.get("/", requireAdmin, async (req, res) => {
  const submissions = await Submission.find()
    .populate("taskId", "title")
    .sort({ createdAt: -1 });

  return res.json(submissions);
});

// delete a single submission
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Submission.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// delete multiple submissions or all
router.delete('/', requireAdmin, async (req, res) => {
  try {
    // support ?all=true to remove all submissions
    if (req.query.all === 'true') {
      await Submission.deleteMany({});
      return res.json({ message: 'All submissions removed' });
    }

    // otherwise expect body.ids = [id1,id2,...]
    const ids = req.body && req.body.ids ? req.body.ids : [];
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No ids provided' });
    }

    await Submission.deleteMany({ _id: { $in: ids } });
    return res.json({ message: 'Deleted selected' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
