// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";
// import { connectDb } from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import taskRoutes from "./routes/tasks.js";
// import submissionRoutes from "./routes/submissions.js";
// import { ensureAdmin } from "./utils/ensureAdmin.js";

// const app = express();
// const port = process.env.PORT || 5000;
// const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // CORS: allow multiple origins (production + local dev)
// const allowedOrigins = clientOrigin.split(',').map(o => o.trim());
// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (mobile apps, Postman, etc.)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));
// app.use(express.json({ limit: "1mb" }));
// app.use(morgan("dev"));

// app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/submissions", submissionRoutes);


// app.get("/", (req, res) => {
//   res.send("Server is running successfully 🚀");
// });

// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// const start = async () => {
//   await connectDb(process.env.MONGO_URI);
//   await ensureAdmin();
//   app.listen(port, () => {
//     console.log(`Server listening on ${port}`);
//   });
// };

// start();


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
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173,http://51.21.200.224:5173"; // Add public IP here
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS: allow multiple origins (local + public)
const allowedOrigins = clientOrigin.split(",").map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / mobile apps
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "5mb" })); // increased limit for safety
app.use(morgan("dev"));

// Static uploads
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);

// Health & root routes
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "..", "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "client", "dist", "index.html"));
  });
}

// Start server
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    await ensureAdmin();
    app.listen(port, "0.0.0.0", () => { // listen on all interfaces for public IP
      console.log(`Server listening on port ${port} 🚀`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
};

start();
