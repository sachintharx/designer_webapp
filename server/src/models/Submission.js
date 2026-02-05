import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    portfolioUrl: { type: String, default: "" },
    experienceLevel: { type: String, enum: ["beginner", "intermediate", "expert", "senior"], required: true },
    skills: { type: String, default: "" },
    rateExpectation: { type: String, default: "" },
    message: { type: String, default: "" },
    sampleLink: { type: String, default: "" },
    sampleFilePath: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
