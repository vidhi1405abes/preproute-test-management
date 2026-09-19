import { Router } from "express";
import { readDb } from "../db.js";

const router = Router();

router.get("/subjects", (req, res) => {
  const db = readDb();
  res.json({ data: db.subjects });
});

router.get("/topics/subject/:subjectId", (req, res) => {
  const db = readDb();
  const topics = db.topics.filter((t) => t.subjectId === req.params.subjectId);
  res.json({ data: topics });
});

router.get("/sub-topics/topic/:topicId", (req, res) => {
  const db = readDb();
  const subTopics = db.subTopics.filter((s) => s.topicId === req.params.topicId);
  res.json({ data: subTopics });
});

export default router;
