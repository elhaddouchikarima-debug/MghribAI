import json
import os
import sqlite3
import subprocess
import tempfile
import unittest
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "db"))
import import_tourism
import import_weather
import import_wikidata
import audit_tourism
import load_demo
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]


class ImportValidationTests(unittest.TestCase):
    def test_name_normalization_ignores_accents_and_punctuation(self):
        self.assertEqual(import_tourism.normalize_name("  Fès — Médina! "), "fes medina")

    def test_coordinate_bounds_and_missing_values(self):
        self.assertTrue(import_tourism.valid_coordinates(31.63, -7.99))
        self.assertFalse(import_tourism.valid_coordinates(91, 0))
        self.assertFalse(import_tourism.valid_coordinates(None, 0))

    def test_source_tags_are_classified_without_inventing_types(self):
        self.assertEqual(import_tourism.classify({"amenity": "restaurant"}), "restaurant")
        self.assertEqual(import_tourism.classify({"tourism": "guest_house"}), "accommodation")
        self.assertEqual(import_tourism.classify({"historic": "monument"}), "landmark")
        self.assertIsNone(import_tourism.classify({"shop": "clothes"}))

    def test_demo_fixture_is_explicitly_synthetic(self):
        sample = json.loads((ROOT / "db" / "demo_tourism.json").read_text(encoding="utf-8"))
        self.assertEqual(sample["data_status"], "demo")
        self.assertIn("not real", sample["notice"])
        self.assertTrue(all(row["price_status"] == "demo" for row in sample["accommodations"]))

    def test_weather_parser_preserves_source_values_and_dates(self):
        rows = import_weather.parse_forecast({"daily": {
            "time": ["2026-10-13"], "temperature_2m_min": [12], "temperature_2m_max": [24],
            "precipitation_sum": [0.2], "wind_speed_10m_max": [16]
        }})
        self.assertEqual(rows[0]["valid_at"], "2026-10-13")
        self.assertEqual(rows[0]["temperature_max_c"], 24)

    def test_wikidata_coordinate_parser_uses_longitude_latitude_order(self):
        self.assertEqual(import_wikidata.parse_coordinate("Point(-7.9898 31.6295)"), (31.6295, -7.9898))
        with self.assertRaises(ValueError):
            import_wikidata.parse_coordinate("Point(190 10)")


class MigrationTests(unittest.TestCase):
    def test_fresh_database_has_tourism_tables_indexes_and_valid_foreign_keys(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            db_path = Path(tmp) / "tourism.sqlite"
            env = os.environ.copy()
            env["DATABASE_FILE"] = str(db_path)
            subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            try:
                tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
                self.assertTrue({"data_sources", "accommodations", "restaurants", "transport_routes", "weather_observations", "tourism_field_sources"} <= tables)
                self.assertEqual(conn.execute("PRAGMA foreign_key_check").fetchall(), [])
                cols = {r[1] for r in conn.execute("PRAGMA table_info(destinations)")}
                self.assertTrue({"latitude", "longitude", "data_status", "source_id"} <= cols)
                indexes = {r[1] for r in conn.execute("PRAGMA index_list(restaurants)")}
                self.assertIn("idx_restaurants_city_cuisine", indexes)
            finally:
                conn.close()

    def test_upgrade_keeps_existing_destination_rows(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            db_path = Path(tmp) / "legacy.sqlite"
            conn = sqlite3.connect(db_path)
            conn.executescript((ROOT / "db" / "schema.sql").read_text(encoding="utf-8"))
            conn.execute("INSERT INTO destinations(id,name,region,overview) VALUES ('legacy-city','Ville existante','Région','Texte conservé')")
            conn.commit()
            conn.close()
            env = os.environ.copy()
            env["DATABASE_FILE"] = str(db_path)
            subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            try:
                self.assertEqual(conn.execute("SELECT name,overview,data_status FROM destinations WHERE id='legacy-city'").fetchone(), ("Ville existante", "Texte conservé", "demo"))
                self.assertEqual(conn.execute("PRAGMA foreign_key_check").fetchall(), [])
            finally:
                conn.close()

    def test_followup_migration_renames_legacy_accommodation_url_without_data_loss(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            db_path = Path(tmp) / "url-upgrade.sqlite"
            env = os.environ.copy()
            env["DATABASE_FILE"] = str(db_path)
            subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            source_id = conn.execute("SELECT id FROM data_sources WHERE source_key='osm'").fetchone()[0]
            conn.execute("INSERT INTO destinations(id,name) VALUES ('legacy-city','Ville legacy')")
            conn.execute("""INSERT INTO accommodations(destination_id,name,price_status,website_url,source_id,source_record_id,source_url,collected_at)
              VALUES ('legacy-city','Riad legacy','unknown','https://example.invalid/site',?,'node/1','https://www.openstreetmap.org/node/1','2026-10-13T00:00:00Z')""", (source_id,))
            conn.execute("ALTER TABLE accommodations RENAME COLUMN website_url TO official_url")
            conn.execute("DELETE FROM schema_migrations WHERE version='002_accommodation_website_url'")
            conn.commit()
            conn.close()
            subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            try:
                cols = {row[1] for row in conn.execute("PRAGMA table_info(accommodations)")}
                self.assertIn("website_url", cols)
                self.assertNotIn("official_url", cols)
                self.assertEqual(conn.execute("SELECT website_url FROM accommodations WHERE name='Riad legacy'").fetchone()[0], "https://example.invalid/site")
            finally:
                conn.close()

    def test_demo_loader_is_repeatable_and_keeps_fixtures_marked_demo(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            db_path = Path(tmp) / "demo.sqlite"
            env = os.environ.copy()
            env["DATABASE_FILE"] = str(db_path)
            subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            conn.executemany("INSERT INTO destinations(id,name) VALUES (?,?)", [(x, x) for x in ("marrakech", "chefchaouen", "fes", "essaouira", "rabat")])
            conn.commit()
            conn.close()
            with patch.dict(os.environ, {"DATABASE_FILE": str(db_path)}):
                load_demo.main()
                load_demo.main()
            conn = sqlite3.connect(db_path)
            try:
                self.assertEqual(conn.execute("SELECT COUNT(*) FROM accommodations").fetchone()[0], 2)
                self.assertEqual(conn.execute("SELECT COUNT(*) FROM restaurants").fetchone()[0], 2)
                self.assertEqual(conn.execute("SELECT COUNT(*) FROM transport_routes").fetchone()[0], 2)
                self.assertEqual(conn.execute("SELECT COUNT(*) FROM accommodations WHERE data_status<>'demo' OR price_status<>'demo'").fetchone()[0], 0)
                self.assertEqual(conn.execute("PRAGMA foreign_key_check").fetchall(), [])
                report = audit_tourism.audit_connection(conn)
                self.assertEqual(report["errors"], [])
            finally:
                conn.close()

    def test_osm_import_upserts_by_source_id_and_preserves_unknown_price(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            db_path = Path(tmp) / "osm.sqlite"
            env = os.environ.copy()
            env["DATABASE_FILE"] = str(db_path)
            subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            conn.execute("INSERT INTO destinations(id,name) VALUES ('marrakech','Marrakech')")
            conn.commit()
            conn.close()
            city = {"id": "marrakech"}
            center = {"latitude": 31.63, "longitude": -7.99, "osm_type": "relation", "osm_id": "123", "source_url": "https://www.openstreetmap.org/relation/123"}
            item = {"kind": "restaurant", "destination_id": "marrakech", "osm_type": "node", "osm_id": "987", "source_record_id": "node/987", "name": "Test place", "address": None, "latitude": 31.63, "longitude": -7.99, "cuisine": "moroccan", "opening_hours": None, "website_url": None, "source_url": "https://www.openstreetmap.org/node/987"}
            self.assertEqual(import_tourism.apply_import(city, center, [item], db_path)["restaurant"], 1)
            self.assertEqual(import_tourism.apply_import(city, center, [item], db_path)["restaurant"], 1)
            conn = sqlite3.connect(db_path)
            try:
                self.assertEqual(conn.execute("SELECT COUNT(*) FROM restaurants").fetchone()[0], 1)
                row = conn.execute("SELECT budget_min,budget_status,data_status FROM restaurants").fetchone()
                self.assertEqual(row, (None, "unknown", "imported"))
                self.assertGreater(conn.execute("SELECT COUNT(*) FROM tourism_field_sources WHERE entity_type='restaurant'").fetchone()[0], 0)
                self.assertEqual(conn.execute("PRAGMA foreign_key_check").fetchall(), [])
            finally:
                conn.close()

    def test_seed_preserves_imported_coordinates_and_source_records(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            db_path = Path(tmp) / "seed.sqlite"
            env = os.environ.copy()
            env["DATABASE_FILE"] = str(db_path)
            subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            osm = conn.execute("SELECT id FROM data_sources WHERE source_key='osm'").fetchone()[0]
            conn.execute("INSERT INTO destinations(id,name,latitude,longitude) VALUES ('marrakech','Marrakech',31.63,-7.99)")
            conn.execute("""INSERT INTO destination_landmarks(destination_id,position,name,description,data_status,source_id,source_record_id,source_url,collected_at)
              VALUES ('marrakech',0,'Jemaa el-Fna Square','Source checked','imported',?,'node/41','https://www.openstreetmap.org/node/41','2026-10-13T00:00:00Z')""", (osm,))
            conn.execute("""INSERT INTO destination_food(destination_id,position,name,description,data_status,source_id,source_record_id,source_url,collected_at)
              VALUES ('marrakech',0,'Sourced demo dish','source text','imported',?,'food/1','https://example.invalid/food/1','2026-10-13T00:00:00Z')""", (osm,))
            conn.commit()
            conn.close()
            subprocess.run(["node", "db/seed.js"], cwd=ROOT, env=env, check=True, capture_output=True, text=True)
            conn = sqlite3.connect(db_path)
            try:
                self.assertEqual(conn.execute("SELECT latitude,longitude FROM destinations WHERE id='marrakech'").fetchone(), (31.63,-7.99))
                self.assertEqual(conn.execute("SELECT COUNT(*) FROM destination_landmarks WHERE destination_id='marrakech' AND name='Jemaa el-Fna Square'").fetchone()[0], 1)
                self.assertEqual(conn.execute("SELECT data_status FROM destination_landmarks WHERE source_record_id='node/41'").fetchone()[0], "imported")
                self.assertEqual(conn.execute("SELECT data_status FROM destination_food WHERE source_record_id='food/1'").fetchone()[0], "imported")
                self.assertEqual(conn.execute("PRAGMA foreign_key_check").fetchall(), [])
            finally:
                conn.close()


if __name__ == "__main__":
    unittest.main()
