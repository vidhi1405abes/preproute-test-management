import { Router } from "express";
import { readDb, writeDb } from "../db.js";

const router = Router();

router.post("/bulk", (req, res) => {
  const { questions } = req.body || {};
  if (!Array.isArray(questions)) {
    return res.status(400).json({ message: "questions must be an array." });
  }

  const db = readDb();
  const created = questions.map((q, i) => ({
    id: "q_" + Date.now() + "_" + i,
    ...q,
  }));

  db.questions.push(...created);
  writeDb(db);
  res.status(201).json({ data: created });
});

router.post("/fetchBulk", (req, res) => {
  const { question_ids } = req.body || {};
  if (!Array.isArray(question_ids)) {
    return res.status(400).json({ message: "question_ids must be an array." });
  }

  const db = readDb();
  const matched = db.questions.filter((q) => question_ids.includes(q.id));
  res.json({ data: matched });
});

export default router;
