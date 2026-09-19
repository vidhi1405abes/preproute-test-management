import { Router } from "express";
import { readDb, writeDb } from "../db.js";

const router = Router();

// Test objects store raw subjectId/topicId(s). The dashboard/edit UI wants
// readable names, so we resolve them here before sending a response.
function enrichTest(test, db) {
  const subjectName =
    db.subjects.find((s) => s.id === test.subject)?.name || test.subject;

  const topicNames = (test.topics || []).map(
    (topicId) => db.topics.find((t) => t.id === topicId)?.name || topicId,
  );

  return { ...test, subject: subjectName, topics: topicNames };
}

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ data: db.tests.map((t) => enrichTest(t, db)) });
});

router.get("/:id", (req, res) => {
  const db = readDb();
  const test = db.tests.find((t) => t.id === req.params.id);
  if (!test) return res.status(404).json({ message: "Test not found." });
  res.json({ data: enrichTest(test, db) });
});

router.post("/", (req, res) => {
  const db = readDb();
  const newTest = {
    id: "test_" + Date.now(),
    status: "draft",
    questionIds: [],
    ...req.body,
    created_at: new Date().toISOString(),
  };
  db.tests.push(newTest);
  writeDb(db);
  res.status(201).json({ data: enrichTest(newTest, db) });
});

router.put("/:id", (req, res) => {
  const db = readDb();
  const index = db.tests.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Test not found." });

  db.tests[index] = { ...db.tests[index], ...req.body };
  writeDb(db);
  res.json({ data: db.tests[index] });
});

export default router;
