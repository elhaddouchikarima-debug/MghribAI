PRAGMA foreign_keys = ON;

-- The complete production schema is this baseline plus db/migrations/*.sql.
-- database.js applies versioned migrations at startup; never reset the live DB to update it.

-- ============ DESTINATIONS ============
CREATE TABLE IF NOT EXISTS destinations (
  id          TEXT PRIMARY KEY,          -- ex: 'marrakech'
  name        TEXT NOT NULL,
  name_fr     TEXT,
  name_ar     TEXT,
  region      TEXT,
  label       TEXT,
  emoji       TEXT,
  img         TEXT,
  short_desc  TEXT,
  overview    TEXT,
  season      TEXT,
  weather     TEXT,
  duration    TEXT,
  budget_est  TEXT,
  culture     TEXT
);

CREATE TABLE IF NOT EXISTS destination_categories (
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  category       TEXT NOT NULL,          -- imperial, coast, desert, mountains, hidden
  PRIMARY KEY (destination_id, category)
);

CREATE TABLE IF NOT EXISTS destination_tags (
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  position       INTEGER NOT NULL,
  tag            TEXT NOT NULL,
  PRIMARY KEY (destination_id, position)
);

CREATE TABLE IF NOT EXISTS destination_gallery (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  position       INTEGER NOT NULL,
  url            TEXT NOT NULL,
  caption        TEXT
);

CREATE TABLE IF NOT EXISTS destination_landmarks (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  position       INTEGER NOT NULL,
  name           TEXT NOT NULL,
  icon           TEXT,
  description    TEXT,
  img            TEXT
);

CREATE TABLE IF NOT EXISTS destination_food (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  position       INTEGER NOT NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  img            TEXT
);

CREATE TABLE IF NOT EXISTS destination_tips (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  position       INTEGER NOT NULL,
  tip            TEXT NOT NULL
);

-- ============ TRIP PLANNER ============
CREATE TABLE IF NOT EXISTS trip_requests (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  experience      TEXT NOT NULL DEFAULT '[]',   -- tableau JSON: ["desert","food"]
  budget          TEXT,
  budget_currency TEXT,
  budget_amount   TEXT,
  duration        TEXT,
  companions      TEXT,
  atmosphere      TEXT,
  season          TEXT,
  transport       TEXT,
  start_city      TEXT,
  notes           TEXT,
  submitted_at    TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS itineraries (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_request_id INTEGER NOT NULL REFERENCES trip_requests(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending | done | error
  result          TEXT,                              -- JSON dyal l-AI
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cat_cat ON destination_categories(category);
