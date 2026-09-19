import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import testsRoutes from "./src/routes/tests.routes.js";
import questionsRoutes from "./src/routes/questions.routes.js";
import subjectsRoutes from "./src/routes/subjects.routes.js";
import { verifyToken } from "./src/middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Everything below requires a valid Bearer token
app.use("/api/tests", verifyToken, testsRoutes);
app.use("/api/questions", verifyToken, questionsRoutes);
app.use("/api", verifyToken, subjectsRoutes); // /api/subjects, /api/topics/subject/:id, /api/sub-topics/topic/:id

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PrepRoute backend running on http://localhost:${PORT}`);
});
