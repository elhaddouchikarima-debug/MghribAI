#!/usr/bin/env python3
"""Store a dated seven-day Open-Meteo forecast for a destination with coordinates."""
from datetime import datetime, timezone
import argparse
import json
import sqlite3
import sys
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from import_tourism import ensure_migrated, load_db_path

API = "https://api.open-meteo.com/v1/forecast"
USER_AGENT = "MaghribAI-TourismWeatherImporter/1.0 (+https://github.com/elhaddouchikarima-debug/MghribAI)"


def build_url(latitude: float, longitude: float) -> str:
    params = urlencode({
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_min,temperature_2m_max,precipitation_sum,wind_speed_10m_max",
        "forecast_days": 7,
        "timezone": "auto",
    })
    return f"{API}?{params}"


def parse_forecast(payload: dict) -> list[dict]:
    daily = payload.get("daily") or {}
    dates = daily.get("time") or []
    rows = []
    for i, date in enumerate(dates):
        def value(key):
            values = daily.get(key) or []
            return values[i] if i < len(values) else None
        rows.append({
            "valid_at": date,
            "temperature_min_c": value("temperature_2m_min"),
            "temperature_max_c": value("temperature_2m_max"),
            "precipitation_mm": value("precipitation_sum"),
            "wind_speed_kmh": value("wind_speed_10m_max"),
        })
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--city", required=True, help="Destination identifiant présent dans la base.")
    args = parser.parse_args()
    ensure_migrated()
    conn = sqlite3.connect(load_db_path())
    conn.row_factory = sqlite3.Row
    try:
        city = conn.execute("SELECT id,name,latitude,longitude FROM destinations WHERE id=?", (args.city,)).fetchone()
        if not city:
            parser.error(f"Destination inconnue: {args.city}")
        if city["latitude"] is None or city["longitude"] is None:
            print("Coordonnées absentes; importer et vérifier la ville avant la météo.", file=sys.stderr)
            return 2
        url = build_url(city["latitude"], city["longitude"])
        request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
        with urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
        rows = parse_forecast(payload)
        if not rows:
            raise ValueError("La source n'a retourné aucune journée de prévision.")
        source = conn.execute("SELECT id FROM data_sources WHERE source_key='open-meteo'").fetchone()
        if not source:
            raise RuntimeError("Source Open-Meteo absente; lancer les migrations.")
        collected = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute("BEGIN")
        for row in rows:
            record_id = f"{args.city}/{row['valid_at']}"
            conn.execute("""INSERT INTO weather_observations
              (destination_id,data_kind,valid_at,temperature_min_c,temperature_max_c,precipitation_mm,wind_speed_kmh,
               source_id,source_record_id,source_url,collected_at)
              VALUES (?,'forecast',?,?,?,?,?,?,?,?,?)
              ON CONFLICT(destination_id,data_kind,valid_at,source_id,collected_at) DO UPDATE SET
               temperature_min_c=excluded.temperature_min_c,temperature_max_c=excluded.temperature_max_c,
               precipitation_mm=excluded.precipitation_mm,wind_speed_kmh=excluded.wind_speed_kmh,
              source_record_id=excluded.source_record_id,source_url=excluded.source_url,
              updated_at=datetime('now')""",
              (args.city,row["valid_at"],row["temperature_min_c"],row["temperature_max_c"],row["precipitation_mm"],row["wind_speed_kmh"],source[0],record_id,url,collected))
        conn.commit()
        print(f"{len(rows)} journées de prévision enregistrées pour {city['name']}.")
        print("Open-Meteo gratuit est réservé à un usage non commercial; attribution CC BY 4.0 requise.")
        return 0
    except Exception as exc:
        conn.rollback()
        print(f"Import météo interrompu: {exc}", file=sys.stderr)
        return 2
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
