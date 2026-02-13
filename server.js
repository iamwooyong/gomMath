import fs from "node:fs";
import path from "node:path";
import express from "express";
import Database from "better-sqlite3";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "tarotmate.db");

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    external_key TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_readings_user_created
    ON readings(user_id, created_at DESC);
`);

const upsertReadingStmt = db.prepare(`
  INSERT INTO readings (user_id, type, date, title, summary, external_key)
  VALUES (@user_id, @type, @date, @title, @summary, @external_key)
  ON CONFLICT(external_key)
  DO UPDATE SET
    title = excluded.title,
    summary = excluded.summary,
    updated_at = datetime('now')
`);

const listReadingsStmt = db.prepare(`
  SELECT user_id AS userId, type, date, title, summary, external_key AS externalKey, created_at AS createdAt
  FROM readings
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT ?
`);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/readings", (req, res) => {
  const userId = String(req.query.userId || "").trim();
  const limit = Math.min(Number(req.query.limit || 200), 500);

  if (!userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }

  const rows = listReadingsStmt.all(userId, limit);
  res.json({ items: rows });
});

app.post("/api/readings", (req, res) => {
  const { userId, type, date, title, summary, externalKey } = req.body || {};

  if (!userId || !type || !date || !title || !summary || !externalKey) {
    res.status(400).json({ error: "userId, type, date, title, summary, externalKey are required" });
    return;
  }

  upsertReadingStmt.run({
    user_id: String(userId),
    type: String(type),
    date: String(date),
    title: String(title),
    summary: String(summary),
    external_key: String(externalKey)
  });

  res.status(201).json({ ok: true });
});

app.use(express.static(ROOT));

app.get("*", (_req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Tarot-Mate running on http://localhost:${PORT}`);
});
