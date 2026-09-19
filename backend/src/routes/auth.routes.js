import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readDb, writeDb } from "../db.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, userId: user.userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return { id: user.id, userId: user.userId, name: user.name };
}

router.post("/login", (req, res) => {
  const { userId, password } = req.body || {};

  if (!userId || !password) {
    return res.status(400).json({ message: "userId and password are required." });
  }

  const db = readDb();
  const user = db.users.find((u) => u.userId === userId);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid userId or password." });
  }

  const token = signToken(user);
  return res.json({
    message: "Login successful.",
    data: { token, user: publicUser(user) },
  });
});

router.post("/signup", (req, res) => {
  const { userId, password, name } = req.body || {};

  if (!userId || !password) {
    return res.status(400).json({ message: "userId and password are required." });
  }

  const db = readDb();
  const exists = db.users.some((u) => u.userId === userId);

  if (exists) {
    return res.status(409).json({ message: "This User ID is already taken." });
  }

  const newUser = {
    id: "u" + (db.users.length + 1) + "_" + Date.now(),
    userId,
    password: bcrypt.hashSync(password, 10),
    name: name || userId,
  };

  db.users.push(newUser);
  writeDb(db);

  const token = signToken(newUser);
  return res.status(201).json({
    message: "Account created successfully.",
    data: { token, user: publicUser(newUser) },
  });
});

export default router;
