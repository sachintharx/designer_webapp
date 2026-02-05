import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import submissionRoutes from "./routes/submissions.js";
import { ensureAdmin } from "./utils/ensureAdmin.js";

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const start = async () => {
  await connectDb(process.env.MONGO_URI);
  await ensureAdmin();
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
};

start();
