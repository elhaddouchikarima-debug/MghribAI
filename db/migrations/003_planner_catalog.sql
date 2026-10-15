-- Curated, reusable city-level itinerary options. Cost estimates are supplied
-- by planner_estimates.json; these rows never claim a live venue/booking price.
CREATE TABLE IF NOT EXISTS planner_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price_min REAL NOT NULL DEFAULT 0,
  price_max REAL NOT NULL DEFAULT 0,
  price_basis TEXT NOT NULL DEFAULT 'free_self_guided',
  image_hint TEXT,
  UNIQUE(destination_id, name)
);

CREATE TABLE IF NOT EXISTS planner_food_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast','lunch','dinner')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  UNIQUE(destination_id, meal_type, name)
);

CREATE TABLE IF NOT EXISTS planner_stay_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  budget_tier TEXT NOT NULL CHECK(budget_tier IN ('low','moderate','comfortable','luxury')),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location_hint TEXT NOT NULL,
  UNIQUE(destination_id, budget_tier)
);

CREATE INDEX IF NOT EXISTS idx_planner_activities_city ON planner_activities(destination_id, position);
CREATE INDEX IF NOT EXISTS idx_planner_food_city ON planner_food_options(destination_id, meal_type, position);
CREATE INDEX IF NOT EXISTS idx_planner_stays_city ON planner_stay_profiles(destination_id, budget_tier);
