#!/usr/bin/env python3
"""Read-only quality report for the SQLite tourism database."""
import json
import sqlite3
import sys

from import_tourism import load_db_path, normalize_name


def audit_connection(conn: sqlite3.Connection) -> dict:
    conn.row_factory = sqlite3.Row
    report = {"counts": {}, "errors": [], "warnings": []}
    violations = conn.execute("PRAGMA foreign_key_check").fetchall()
    for violation in violations:
        report["errors"].append({"check": "foreign_key", "row": list(violation)})

    for table in ("destinations", "destination_landmarks", "destination_food", "accommodations", "restaurants", "transport_routes", "weather_observations"):
        report["counts"][table] = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]

    name_tables = {
        "destination_landmarks": "destination_id",
        "accommodations": "destination_id",
        "restaurants": "destination_id",
    }
    for table, city_col in name_tables.items():
        rows = conn.execute(f"SELECT id,{city_col} AS city,name FROM {table} WHERE name IS NOT NULL").fetchall()
        seen = {}
        for row in rows:
            key = (row["city"], normalize_name(row["name"]))
            if not key[1]:
                report["errors"].append({"check": "required_name", "table": table, "id": row["id"]})
                continue
            if key in seen:
                report["warnings"].append({"check": "possible_duplicate_name", "table": table,
                    "city": row["city"], "name": row["name"], "ids": [seen[key], row["id"]]})
            else:
                seen[key] = row["id"]

    coordinate_queries = {
        "destinations": "SELECT id,latitude,longitude FROM destinations WHERE latitude IS NOT NULL OR longitude IS NOT NULL",
        "destination_landmarks": "SELECT id,latitude,longitude FROM destination_landmarks WHERE latitude IS NOT NULL OR longitude IS NOT NULL",
        "accommodations": "SELECT id,latitude,longitude FROM accommodations WHERE latitude IS NOT NULL OR longitude IS NOT NULL",
        "restaurants": "SELECT id,latitude,longitude FROM restaurants WHERE latitude IS NOT NULL OR longitude IS NOT NULL",
    }
    for table, query in coordinate_queries.items():
        for row in conn.execute(query):
            lat, lon = row["latitude"], row["longitude"]
            if lat is None or lon is None or not (-90 <= lat <= 90 and -180 <= lon <= 180):
                report["errors"].append({"check": "coordinates", "table": table, "id": row["id"], "latitude": lat, "longitude": lon})

    price_checks = [
        ("destination_landmarks", "estimated_price", "price_status"),
        ("accommodations", "price_min", "price_status"),
        ("restaurants", "budget_min", "budget_status"),
        ("transport_routes", "price_min", "price_status"),
    ]
    for table, amount_col, status_col in price_checks:
        for row in conn.execute(f"SELECT id,{amount_col} AS amount,{status_col} AS status,verified_at,source_url FROM {table} WHERE {status_col}='confirmed'"):
            if row["amount"] is None or not row["verified_at"] or not row["source_url"]:
                report["errors"].append({"check": "confirmed_price_provenance", "table": table, "id": row["id"]})

    for table in ("accommodations", "restaurants"):
        for row in conn.execute(f"SELECT id,data_status,source_id,source_record_id,source_url,collected_at FROM {table} WHERE data_status<>'demo'"):
            if any(row[key] is None for key in ("source_id", "source_record_id", "source_url", "collected_at")):
                report["errors"].append({"check": "source_provenance", "table": table, "id": row["id"]})
    return report


def main() -> int:
    conn = sqlite3.connect(f"file:{load_db_path().as_posix()}?mode=ro", uri=True)
    try:
        report = audit_connection(conn)
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 1 if report["errors"] else 0
    except sqlite3.Error as exc:
        print(f"Audit impossible: {exc}", file=sys.stderr)
        return 2
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
