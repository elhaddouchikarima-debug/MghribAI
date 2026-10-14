#!/usr/bin/env python3
"""Import named Moroccan tourism POIs from OSM (ODbL).

Without --apply, fetched records are printed as a preview and no DB rows change.
Only one city is accepted per run. Public Nominatim/Overpass services are best-effort.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
import subprocess
import sys
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DB_DIR = ROOT / "db"
DESTINATIONS = DB_DIR / "destinations.json"
USER_AGENT = "MaghribAI-TourismImporter/1.0 (+https://github.com/elhaddouchikarima-debug/MghribAI)"
NOMINATIM = "https://nominatim.openstreetmap.org/search"
OVERPASS_ENDPOINTS = (
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
)
OSM_SOURCE_KEY = "osm"
GEOCODE_ALIASES = {
    "agadir": "Agadir, Morocco",
    "ouarzazate": "Ouarzazate, Morocco",
    "high-atlas": "Imlil, Morocco",
}


class ImportErrorWithContext(Exception):
    pass


def normalize_name(value: str) -> str:
    value = unicodedata.normalize("NFKD", value.casefold())
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return " ".join("".join(ch if ch.isalnum() else " " for ch in value).split())


def valid_coordinates(lat: object, lon: object) -> bool:
    try:
        return -90 <= float(lat) <= 90 and -180 <= float(lon) <= 180
    except (TypeError, ValueError):
        return False


def classify(tags: dict) -> str | None:
    tourism = tags.get("tourism", "")
    amenity = tags.get("amenity", "")
    historic = tags.get("historic", "")
    if amenity in {"restaurant", "cafe", "fast_food", "food_court"}:
        return "restaurant"
    if tourism in {"hotel", "guest_house", "hostel", "apartment", "motel", "chalet"}:
        return "accommodation"
    if tourism in {"attraction", "museum", "viewpoint", "artwork", "theme_park", "zoo"} or historic:
        return "landmark"
    return None


def request_json(url: str, *, data: bytes | None = None, user_agent: str = USER_AGENT) -> object:
    request = Request(url, data=data, headers={
        "User-Agent": user_agent,
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded" if data else "application/json",
    })
    try:
        with urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise ImportErrorWithContext(f"Échec de la source {url}: {exc}") from exc


def geocode(city: dict, user_agent: str) -> dict:
    query = GEOCODE_ALIASES.get(city["id"], f"{city['name']}, Morocco")
    url = NOMINATIM + "?" + urlencode({"q": query, "format": "jsonv2", "limit": 1, "countrycodes": "ma"})
    rows = request_json(url, user_agent=user_agent)
    if not rows:
        raise ImportErrorWithContext(f"Aucun résultat Nominatim pour {query!r}")
    hit = rows[0]
    if not valid_coordinates(hit.get("lat"), hit.get("lon")):
        raise ImportErrorWithContext(f"Coordonnées Nominatim invalides pour {query!r}")
    osm_type = {"N": "node", "W": "way", "R": "relation"}.get(str(hit.get("osm_type", "")).upper(), str(hit.get("osm_type", "")))
    return {
        "latitude": float(hit["lat"]), "longitude": float(hit["lon"]),
        "osm_type": osm_type, "osm_id": str(hit.get("osm_id", "")),
        "source_url": f"https://www.openstreetmap.org/{osm_type}/{hit.get('osm_id')}",
        "query": query,
    }


def fetch_city_pois(city: dict, center: dict, user_agent: str) -> list[dict]:
    query = f"""[out:json][timeout:45];
(
  nwr(around:5000,{center['latitude']},{center['longitude']})[tourism~"^(attraction|museum|viewpoint|artwork|theme_park|zoo)$"];
  nwr(around:5000,{center['latitude']},{center['longitude']})[historic];
  nwr(around:5000,{center['latitude']},{center['longitude']})[tourism~"^(hotel|guest_house|hostel|apartment|motel|chalet)$"];
  nwr(around:5000,{center['latitude']},{center['longitude']})[amenity~"^(restaurant|cafe|fast_food|food_court)$"];
);out center tags;"""
    payload = urlencode({"data": query}).encode("utf-8")
    result = None
    errors = []
    for endpoint in OVERPASS_ENDPOINTS:
        try:
            result = request_json(endpoint, data=payload, user_agent=user_agent)
            break
        except ImportErrorWithContext as exc:
            errors.append(str(exc))
            time.sleep(2)
    if result is None:
        raise ImportErrorWithContext("Aucun endpoint Overpass n'a répondu: " + " | ".join(errors))
    collected = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    items = []
    seen_places = set()
    for element in result.get("elements", []):
        tags = element.get("tags") or {}
        kind = classify(tags)
        if not kind or not tags.get("name"):
            continue
        point = element if "lat" in element else element.get("center", {})
        if not valid_coordinates(point.get("lat"), point.get("lon")):
            continue
        osm_type = str(element.get("type", ""))
        osm_id = str(element.get("id", ""))
        duplicate_key = (kind, normalize_name(tags["name"]), round(float(point["lat"]), 4), round(float(point["lon"]), 4))
        if duplicate_key in seen_places:
            continue
        seen_places.add(duplicate_key)
        addr = " ".join(filter(None, [tags.get("addr:housenumber"), tags.get("addr:street"), tags.get("addr:postcode"), tags.get("addr:city")]))
        items.append({
            "kind": kind,
            "destination_id": city["id"],
            "name": tags["name"].strip(),
            "description": tags.get("description"),
            "category": (tags.get("amenity") if kind == "restaurant" else
                         tags.get("tourism") if kind == "accommodation" else
                         tags.get("tourism") or tags.get("historic") or tags.get("leisure")),
            "cuisine": tags.get("cuisine"),
            "opening_hours": tags.get("opening_hours"),
            "website_url": tags.get("contact:website") or tags.get("website"),
            "address": addr or None,
            "latitude": float(point["lat"]), "longitude": float(point["lon"]),
            "services": sorted(key for key in ("wifi", "internet_access", "parking", "wheelchair", "air_conditioning", "swimming_pool", "breakfast") if tags.get(key) in {"yes", "free"}),
            "osm_type": osm_type, "osm_id": osm_id,
            "source_record_id": f"{osm_type}/{osm_id}",
            "source_url": f"https://www.openstreetmap.org/{osm_type}/{osm_id}",
            "source_key": OSM_SOURCE_KEY,
            "collected_at": collected,
            # No price, rating, travel time or duration is invented from missing OSM tags.
            "price_status": "unknown",
        })
    return items


def load_db_path() -> Path:
    env_file = ROOT / ".env"
    values = {}
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                key, value = line.split("=", 1)
                values[key.strip()] = value.strip().strip('"\'')
    configured = os.environ.get("DATABASE_FILE") or values.get("DATABASE_FILE", "maghribai.db")
    path = Path(configured)
    return path if path.is_absolute() else ROOT / path


def ensure_migrated() -> None:
    subprocess.run(["node", "-e", "require('./db/database')"], cwd=ROOT, check=True)


def get_source_id(conn: sqlite3.Connection, key: str) -> int:
    row = conn.execute("SELECT id FROM data_sources WHERE source_key=?", (key,)).fetchone()
    if not row:
        raise ImportErrorWithContext(f"Source {key!r} absente; lance d'abord les migrations.")
    return row[0]


def save_provenance(conn: sqlite3.Connection, entity_type: str, entity_id: int, field_names: list[str], source_id: int, source_record_id: str, source_url: str, collected_at: str) -> None:
    for field_name in field_names:
        conn.execute("""INSERT INTO tourism_field_sources
          (entity_type,entity_id,field_name,source_id,source_record_id,source_url,collected_at)
          VALUES (?,?,?,?,?,?,?)
          ON CONFLICT(entity_type,entity_id,field_name) DO UPDATE SET
            source_id=excluded.source_id,source_record_id=excluded.source_record_id,
            source_url=excluded.source_url,collected_at=excluded.collected_at""",
          (entity_type, entity_id, field_name, source_id, source_record_id, source_url, collected_at))


def apply_import(city: dict, center: dict, items: list[dict], db_path: Path) -> dict:
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys=ON")
    conn.row_factory = sqlite3.Row
    try:
        source_id = get_source_id(conn, OSM_SOURCE_KEY)
        collected = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
        conn.execute("BEGIN")
        conn.execute("""UPDATE destinations SET latitude=?,longitude=?,osm_type=?,osm_id=?,source_id=?,
          source_record_id=?,source_url=?,collected_at=? WHERE id=?""",
          (center["latitude"], center["longitude"], center["osm_type"], center["osm_id"], source_id,
           f"{center['osm_type']}/{center['osm_id']}", center["source_url"], collected, city["id"]))
        destination_id = conn.execute("SELECT rowid FROM destinations WHERE id=?", (city["id"],)).fetchone()[0]
        save_provenance(conn, "destination", destination_id, ["latitude", "longitude"], source_id,
                        f"{center['osm_type']}/{center['osm_id']}", center["source_url"], collected)

        counts = {"landmark": 0, "accommodation": 0, "restaurant": 0}
        for item in items:
            common = (item["destination_id"], item["osm_type"], item["osm_id"], item["name"], item["address"], item["latitude"], item["longitude"])
            record = item["source_record_id"]
            if item["kind"] == "landmark":
                found = conn.execute("SELECT id FROM destination_landmarks WHERE source_id=? AND source_record_id=?", (source_id, record)).fetchone()
                if found:
                    entity_id = found[0]
                    conn.execute("""UPDATE destination_landmarks SET name=?,description=COALESCE(?,description),category=?,
                      latitude=?,longitude=?,osm_type=?,osm_id=?,data_status='imported',source_url=?,collected_at=? WHERE id=?""",
                      (item["name"], item["description"], item["category"], item["latitude"], item["longitude"], item["osm_type"], item["osm_id"], item["source_url"], collected, entity_id))
                else:
                    match = next((row for row in conn.execute("SELECT id,name FROM destination_landmarks WHERE destination_id=? ORDER BY id", (city["id"],))
                                  if normalize_name(row["name"]) == normalize_name(item["name"])), None)
                    if match:
                        entity_id = match[0]
                        conn.execute("""UPDATE destination_landmarks SET name=?,description=COALESCE(?,description),category=COALESCE(category,?),latitude=?,longitude=?,osm_type=?,osm_id=?,
                          data_status='mixed',source_id=?,source_record_id=?,source_url=?,collected_at=? WHERE id=?""",
                          (item["name"], item["description"], item["category"], item["latitude"], item["longitude"], item["osm_type"], item["osm_id"], source_id, record, item["source_url"], collected, entity_id))
                    else:
                        pos = conn.execute("SELECT COALESCE(MAX(position),-1)+1 FROM destination_landmarks WHERE destination_id=?", (city["id"],)).fetchone()[0]
                        cursor = conn.execute("""INSERT INTO destination_landmarks
                          (destination_id,position,name,description,category,latitude,longitude,osm_type,osm_id,data_status,source_id,source_record_id,source_url,collected_at)
                          VALUES (?,?,?,?,?,?,?,?,?,'imported',?,?,?,?)""",
                          (city["id"], pos, item["name"], item["description"], item["category"], item["latitude"], item["longitude"], item["osm_type"], item["osm_id"], source_id, record, item["source_url"], collected))
                        entity_id = cursor.lastrowid
                source_fields = ["name", "category", "latitude", "longitude"]
                if item["description"] is not None:
                    source_fields.append("description")
                save_provenance(conn, "landmark", entity_id, source_fields, source_id, record, item["source_url"], collected)
            elif item["kind"] == "accommodation":
                cursor = conn.execute("""INSERT INTO accommodations
                  (destination_id,osm_type,osm_id,name,category,address,latitude,longitude,services_json,website_url,data_status,source_id,source_record_id,source_url,collected_at)
                  VALUES (?,?,?,?,?,?,?,?,?,?,'imported',?,?,?,?)
                  ON CONFLICT(source_id,source_record_id) DO UPDATE SET name=excluded.name,category=excluded.category,
                  address=excluded.address,latitude=excluded.latitude,longitude=excluded.longitude,services_json=excluded.services_json,
                  website_url=excluded.website_url,source_url=excluded.source_url,collected_at=excluded.collected_at,updated_at=datetime('now')""",
                  (item["destination_id"], item["osm_type"], item["osm_id"], item["name"], item["category"], item["address"], item["latitude"], item["longitude"], json.dumps(item["services"], ensure_ascii=False), item["website_url"], source_id, record, item["source_url"], collected))
                row = conn.execute("SELECT id FROM accommodations WHERE source_id=? AND source_record_id=?", (source_id, record)).fetchone()
                entity_id = row[0]
                save_provenance(conn, "accommodation", entity_id, ["name", "category", "address", "latitude", "longitude", "services_json", "website_url"], source_id, record, item["source_url"], collected)
            else:
                conn.execute("""INSERT INTO restaurants
                  (destination_id,osm_type,osm_id,name,address,latitude,longitude,cuisine,opening_hours,website_url,data_status,source_id,source_record_id,source_url,collected_at)
                  VALUES (?,?,?,?,?,?,?,?,?,?,'imported',?,?,?,?)
                  ON CONFLICT(source_id,source_record_id) DO UPDATE SET name=excluded.name,address=excluded.address,
                  latitude=excluded.latitude,longitude=excluded.longitude,cuisine=excluded.cuisine,opening_hours=excluded.opening_hours,
                  website_url=excluded.website_url,source_url=excluded.source_url,collected_at=excluded.collected_at,updated_at=datetime('now')""",
                  (item["destination_id"], item["osm_type"], item["osm_id"], item["name"], item["address"], item["latitude"], item["longitude"], item["cuisine"], item["opening_hours"], item["website_url"], source_id, record, item["source_url"], collected))
                row = conn.execute("SELECT id FROM restaurants WHERE source_id=? AND source_record_id=?", (source_id, record)).fetchone()
                entity_id = row[0]
                save_provenance(conn, "restaurant", entity_id, ["name", "address", "latitude", "longitude", "cuisine", "opening_hours", "website_url"], source_id, record, item["source_url"], collected)
            counts[item["kind"]] += 1
        conn.commit()
        return counts
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--city", help="Identifiant destination (p. ex. marrakech); un seul par exécution.")
    parser.add_argument("--center-only", action="store_true", help="Importe uniquement le centre géocodé, même si Overpass est indisponible.")
    parser.add_argument("--apply", action="store_true", help="Enregistre les données après l'aperçu.")
    parser.add_argument("--user-agent", default=USER_AGENT, help="User-Agent identifiable exigé par les services OSM.")
    args = parser.parse_args()
    destinations = json.loads(DESTINATIONS.read_text(encoding="utf-8"))
    if not args.city:
        parser.error("--city est obligatoire pour limiter la charge sur les services publics.")
    city = next((d for d in destinations if d["id"] == args.city), None)
    if not city:
        parser.error(f"Destination inconnue: {args.city}")
    try:
        # Nominatim's public endpoint allows at most one request/second.
        time.sleep(1.1)
        center = geocode(city, args.user_agent)
        time.sleep(1.1)
        items = [] if args.center_only else fetch_city_pois(city, center, args.user_agent)
        kind_counts = {kind: sum(1 for item in items if item["kind"] == kind)
                       for kind in ("landmark", "accommodation", "restaurant")}
        preview = [{key: item[key] for key in ("kind", "name", "category", "latitude", "longitude", "source_record_id")}
                   for item in items[:20]]
        print(json.dumps({"city": city["id"], "center": center, "count": len(items),
                          "counts_by_kind": kind_counts, "preview": preview,
                          "omitted_from_preview": max(0, len(items) - len(preview))}, indent=2))
        if not args.apply:
            print("\nAperçu uniquement. Relance avec --apply pour enregistrer les données.")
            return 0
        ensure_migrated()
        counts = apply_import(city, center, items, load_db_path())
        print("\nImport terminé:", json.dumps(counts, ensure_ascii=False))
        return 0
    except (ImportErrorWithContext, sqlite3.Error, subprocess.CalledProcessError) as exc:
        print(f"Import interrompu: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
