-- Tourism data upgrade. Existing descriptive demo content is preserved.
CREATE TABLE IF NOT EXISTS data_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  homepage_url TEXT NOT NULL,
  license TEXT,
  attribution TEXT NOT NULL,
  terms_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE destinations ADD COLUMN latitude REAL;
ALTER TABLE destinations ADD COLUMN longitude REAL;
ALTER TABLE destinations ADD COLUMN wikidata_id TEXT;
ALTER TABLE destinations ADD COLUMN wikidata_description TEXT;
ALTER TABLE destinations ADD COLUMN osm_type TEXT;
ALTER TABLE destinations ADD COLUMN osm_id TEXT;
ALTER TABLE destinations ADD COLUMN data_status TEXT NOT NULL DEFAULT 'demo';
ALTER TABLE destinations ADD COLUMN source_id INTEGER REFERENCES data_sources(id);
ALTER TABLE destinations ADD COLUMN source_record_id TEXT;
ALTER TABLE destinations ADD COLUMN source_url TEXT;
ALTER TABLE destinations ADD COLUMN collected_at TEXT;
ALTER TABLE destinations ADD COLUMN verified_at TEXT;

ALTER TABLE destination_landmarks ADD COLUMN category TEXT;
ALTER TABLE destination_landmarks ADD COLUMN latitude REAL;
ALTER TABLE destination_landmarks ADD COLUMN longitude REAL;
ALTER TABLE destination_landmarks ADD COLUMN duration_minutes INTEGER;
ALTER TABLE destination_landmarks ADD COLUMN estimated_price REAL;
ALTER TABLE destination_landmarks ADD COLUMN price_currency TEXT;
ALTER TABLE destination_landmarks ADD COLUMN price_status TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE destination_landmarks ADD COLUMN season TEXT;
ALTER TABLE destination_landmarks ADD COLUMN restrictions TEXT;
ALTER TABLE destination_landmarks ADD COLUMN osm_type TEXT;
ALTER TABLE destination_landmarks ADD COLUMN osm_id TEXT;
ALTER TABLE destination_landmarks ADD COLUMN data_status TEXT NOT NULL DEFAULT 'demo';
ALTER TABLE destination_landmarks ADD COLUMN source_id INTEGER REFERENCES data_sources(id);
ALTER TABLE destination_landmarks ADD COLUMN source_record_id TEXT;
ALTER TABLE destination_landmarks ADD COLUMN source_url TEXT;
ALTER TABLE destination_landmarks ADD COLUMN collected_at TEXT;
ALTER TABLE destination_landmarks ADD COLUMN verified_at TEXT;

ALTER TABLE destination_food ADD COLUMN data_status TEXT NOT NULL DEFAULT 'demo';
ALTER TABLE destination_food ADD COLUMN source_id INTEGER REFERENCES data_sources(id);
ALTER TABLE destination_food ADD COLUMN source_record_id TEXT;
ALTER TABLE destination_food ADD COLUMN source_url TEXT;
ALTER TABLE destination_food ADD COLUMN collected_at TEXT;
ALTER TABLE destination_food ADD COLUMN verified_at TEXT;

CREATE TABLE IF NOT EXISTS accommodations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  osm_type TEXT,
  osm_id TEXT,
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  services_json TEXT NOT NULL DEFAULT '[]',
  price_min REAL,
  price_max REAL,
  price_currency TEXT,
  price_status TEXT NOT NULL DEFAULT 'unknown' CHECK(price_status IN ('unknown','estimate','confirmed','demo')),
  website_url TEXT,
  booking_url TEXT,
  data_status TEXT NOT NULL DEFAULT 'imported' CHECK(data_status IN ('demo','imported','verified')),
  source_id INTEGER NOT NULL REFERENCES data_sources(id),
  source_record_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  verified_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(source_id, source_record_id)
);

CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  osm_type TEXT,
  osm_id TEXT,
  name TEXT NOT NULL,
  address TEXT,
  latitude REAL,
  longitude REAL,
  cuisine TEXT,
  specialties TEXT,
  budget_min REAL,
  budget_max REAL,
  budget_currency TEXT,
  budget_status TEXT NOT NULL DEFAULT 'unknown' CHECK(budget_status IN ('unknown','estimate','confirmed','demo')),
  opening_hours TEXT,
  rating REAL CHECK(rating IS NULL OR rating BETWEEN 0 AND 5),
  website_url TEXT,
  data_status TEXT NOT NULL DEFAULT 'imported' CHECK(data_status IN ('demo','imported','verified')),
  source_id INTEGER NOT NULL REFERENCES data_sources(id),
  source_record_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  verified_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(source_id, source_record_id)
);

CREATE TABLE IF NOT EXISTS transport_routes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  origin_destination_id TEXT NOT NULL REFERENCES destinations(id),
  destination_destination_id TEXT NOT NULL REFERENCES destinations(id),
  transport_type TEXT NOT NULL,
  operator TEXT,
  distance_km REAL,
  duration_minutes INTEGER,
  price_min REAL,
  price_max REAL,
  price_currency TEXT,
  price_status TEXT NOT NULL DEFAULT 'unknown' CHECK(price_status IN ('unknown','estimate','confirmed','demo')),
  official_url TEXT,
  data_status TEXT NOT NULL DEFAULT 'demo' CHECK(data_status IN ('demo','imported','verified')),
  source_id INTEGER REFERENCES data_sources(id),
  source_record_id TEXT,
  source_url TEXT,
  collected_at TEXT,
  verified_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK(origin_destination_id <> destination_destination_id),
  UNIQUE(origin_destination_id, destination_destination_id, transport_type, operator)
);

CREATE TABLE IF NOT EXISTS weather_observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  data_kind TEXT NOT NULL CHECK(data_kind IN ('forecast','observation','climate_normal')),
  valid_at TEXT NOT NULL,
  temperature_min_c REAL,
  temperature_max_c REAL,
  precipitation_mm REAL,
  wind_speed_kmh REAL,
  source_id INTEGER NOT NULL REFERENCES data_sources(id),
  source_record_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(destination_id, data_kind, valid_at, source_id, collected_at)
);

CREATE TABLE IF NOT EXISTS tourism_field_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('destination','landmark','accommodation','restaurant','route','weather')),
  entity_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  source_id INTEGER NOT NULL REFERENCES data_sources(id),
  source_record_id TEXT,
  source_url TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  verified_at TEXT,
  UNIQUE(entity_type, entity_id, field_name)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_landmark_osm ON destination_landmarks(source_id, source_record_id)
  WHERE source_id IS NOT NULL AND source_record_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_food_source ON destination_food(source_id, source_record_id)
  WHERE source_id IS NOT NULL AND source_record_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);
CREATE INDEX IF NOT EXISTS idx_destinations_coords ON destinations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_landmarks_city_category ON destination_landmarks(destination_id, category);
CREATE INDEX IF NOT EXISTS idx_landmarks_price ON destination_landmarks(estimated_price);
CREATE INDEX IF NOT EXISTS idx_accommodations_city_category ON accommodations(destination_id, category);
CREATE INDEX IF NOT EXISTS idx_accommodations_price ON accommodations(price_min, price_max);
CREATE INDEX IF NOT EXISTS idx_restaurants_city_cuisine ON restaurants(destination_id, cuisine);
CREATE INDEX IF NOT EXISTS idx_restaurants_budget ON restaurants(budget_min, budget_max);
CREATE INDEX IF NOT EXISTS idx_routes_origin_destination ON transport_routes(origin_destination_id, destination_destination_id);
CREATE INDEX IF NOT EXISTS idx_routes_type_price ON transport_routes(transport_type, price_min, price_max);
CREATE INDEX IF NOT EXISTS idx_weather_city_valid ON weather_observations(destination_id, valid_at);
CREATE INDEX IF NOT EXISTS idx_field_source_lookup ON tourism_field_sources(entity_type, entity_id);

INSERT OR IGNORE INTO data_sources(source_key,name,homepage_url,license,attribution,terms_url) VALUES
 ('osm','OpenStreetMap','https://www.openstreetmap.org/','ODbL-1.0','© OpenStreetMap contributors','https://www.openstreetmap.org/copyright'),
 ('wikidata','Wikidata','https://www.wikidata.org/','CC0-1.0','Wikidata (CC0)','https://www.wikidata.org/wiki/Wikidata:Licensing'),
 ('data-gov-ma','Portail National des Données Ouvertes du Maroc','https://data.gov.ma/','ODbL','Portail National des Données Ouvertes du Maroc','https://data.gov.ma/'),
 ('open-meteo','Open-Meteo','https://open-meteo.com/','CC-BY-4.0','Weather data by Open-Meteo.com','https://open-meteo.com/en/terms'),
 ('oncf','ONCF','https://www.oncf.ma/','Proprietary; link-only unless reuse terms permit','ONCF','https://www.oncf.ma/'),
 ('ctm','CTM','https://ctm.ma/','Proprietary; link-only unless reuse terms permit','CTM','https://ctm.ma/'),
 ('demo','MaghribAI synthetic test records','https://example.invalid/','Synthetic demonstration data; not factual','MaghribAI — DEMO DATA, not real establishments or prices','https://example.invalid/');
