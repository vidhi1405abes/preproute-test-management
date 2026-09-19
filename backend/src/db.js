import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function seedDefault() {
  const defaultPasswordHash = bcrypt.hashSync("admin123", 10);

  return {
    users: [
      {
        id: "u1",
        userId: "admin",
        password: defaultPasswordHash,
        name: "Admin",
      },
    ],
    subjects: [
      { id: "s1", name: "Quantitative Aptitude" },
      { id: "s2", name: "Logical Reasoning" },
      { id: "s3", name: "Verbal Ability" },
    ],
    topics: [
      { id: "t1", subjectId: "s1", name: "Number System" },
      { id: "t2", subjectId: "s1", name: "Percentages & Profit-Loss" },
      { id: "t3", subjectId: "s2", name: "Puzzles" },
      { id: "t4", subjectId: "s2", name: "Blood Relations" },
      { id: "t5", subjectId: "s3", name: "Reading Comprehension" },
    ],
    subTopics: [
      { id: "st1", topicId: "t1", name: "HCF & LCM" },
      { id: "st2", topicId: "t1", name: "Divisibility Rules" },
      { id: "st3", topicId: "t2", name: "Simple & Compound Interest" },
    ],
    tests: [],
    questions: [],
  };
}

function ensureDb() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(seedDefault(), null, 2));
    console.log("Seeded fresh database at", DB_PATH);
    console.log("Default login -> userId: admin | password: admin123");
  }
}

export function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
