#!/usr/bin/env python3
"""Load clearly marked synthetic accommodation, restaurant and route fixtures."""
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

from import_tourism import DB_DIR, ROOT, ensure_migrated, load_db_path


def main() -> int:
    ensure_migrated()
    sample = json.loads((DB_DIR / "demo_tourism.json").read_text(encoding="utf-8"))
    if sample.get("data_status") != "demo":
        raise ValueError("Refus du jeu de données: data_status doit être demo")
    conn = sqlite3.connect(load_db_path())
    conn.execute("PRAGMA foreign_keys=ON")
    conn.row_factory = sqlite3.Row
    try:
        source = conn.execute("SELECT id FROM data_sources WHERE source_key='demo'").fetchone()
        if not source:
            raise RuntimeError("Source demo manquante après migration")
        source_id = source[0]
        now = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
        conn.execute("BEGIN")
        for item in sample["accommodations"]:
            conn.execute("""INSERT INTO accommodations
              (destination_id,name,category,address,services_json,price_min,price_max,price_currency,price_status,website_url,booking_url,data_status,source_id,source_record_id,source_url,collected_at)
              VALUES (?,?,?,?,?,?,?,?,?,NULL,?,'demo',?,?,?,?)
              ON CONFLICT(source_id,source_record_id) DO UPDATE SET destination_id=excluded.destination_id,
              name=excluded.name,category=excluded.category,address=excluded.address,services_json=excluded.services_json,
              price_min=excluded.price_min,price_max=excluded.price_max,price_currency=excluded.price_currency,
              price_status='demo',booking_url=excluded.booking_url,data_status='demo',collected_at=excluded.collected_at,updated_at=datetime('now')""",
              (item["destination_id"], item["name"], item["category"], item["address"], json.dumps(item["services"], ensure_ascii=False), item["price_min"], item["price_max"], item["price_currency"], item["price_status"], item["booking_url"], source_id, item["source_record_id"], "https://example.invalid/", now))
        for item in sample["restaurants"]:
            conn.execute("""INSERT INTO restaurants
              (destination_id,name,cuisine,specialties,budget_min,budget_max,budget_currency,budget_status,opening_hours,rating,website_url,data_status,source_id,source_record_id,source_url,collected_at)
              VALUES (?,?,?,?,?,?,?, ?,NULL,NULL,?,'demo',?,?,?,?)
              ON CONFLICT(source_id,source_record_id) DO UPDATE SET destination_id=excluded.destination_id,
              name=excluded.name,cuisine=excluded.cuisine,specialties=excluded.specialties,budget_min=excluded.budget_min,
              budget_max=excluded.budget_max,budget_currency=excluded.budget_currency,budget_status='demo',
              website_url=excluded.website_url,data_status='demo',collected_at=excluded.collected_at,updated_at=datetime('now')""",
              (item["destination_id"], item["name"], item["cuisine"], item["specialties"], item["budget_min"], item["budget_max"], item["budget_currency"], item["budget_status"], item["website_url"], source_id, item["source_record_id"], "https://example.invalid/", now))
        for item in sample["transport_routes"]:
            conn.execute("""INSERT INTO transport_routes
              (origin_destination_id,destination_destination_id,transport_type,operator,distance_km,duration_minutes,price_min,price_max,price_currency,price_status,official_url,data_status,source_id,source_record_id,source_url,collected_at)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,'demo',?,?,?,?)
              ON CONFLICT(origin_destination_id,destination_destination_id,transport_type,operator) DO UPDATE SET
              distance_km=excluded.distance_km,duration_minutes=excluded.duration_minutes,price_min=excluded.price_min,
              price_max=excluded.price_max,price_currency=excluded.price_currency,price_status='demo',official_url=excluded.official_url,
              data_status='demo',source_id=excluded.source_id,source_record_id=excluded.source_record_id,
              source_url=excluded.source_url,collected_at=excluded.collected_at,updated_at=datetime('now')""",
              (item["origin_destination_id"], item["destination_destination_id"], item["transport_type"], item["operator"], item["distance_km"], item["duration_minutes"], item["price_min"], item["price_max"], item["price_currency"], item["price_status"], item["official_url"], source_id, item["source_record_id"], "https://example.invalid/", now))
        conn.commit()
        print("Jeu de démonstration chargé (données synthétiques, non factuelles).")
        return 0
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
