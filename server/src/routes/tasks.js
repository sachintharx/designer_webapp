import express from "express";
import { Task } from "../models/Task.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return res.json(tasks);
});

router.post("/", requireAdmin, async (req, res) => {
  const { title, brief, budget, deadline, status } = req.body;
  if (!title || !brief) {
    return res.status(400).json({ message: "Title and brief are required" });
  }

  const task = await Task.create({
    title,
    brief,
    budget: budget || "",
    deadline: deadline || "",
    status: status || "open"
  });

  return res.status(201).json(task);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const updates = req.body || {};
  const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json(task);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json({ message: "Task deleted" });
});

export default router;
