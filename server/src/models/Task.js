import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    brief: { type: String, required: true },
    budget: { type: String, default: "" },
    deadline: { type: String, default: "" },
    status: { type: String, enum: ["open", "closed"], default: "open" }
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
