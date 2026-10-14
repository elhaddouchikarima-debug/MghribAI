#!/usr/bin/env python3
"""Preview or import a single unambiguous Wikidata city match (CC0)."""
import argparse
import json
import re
import sqlite3
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone

from import_tourism import ensure_migrated, load_db_path

ENDPOINT = "https://query.wikidata.org/sparql"
USER_AGENT = "MaghribAI-WikidataImporter/1.0 (+https://github.com/elhaddouchikarima-debug/MghribAI)"
ENGLISH_LABELS = {
    "marrakech": "Marrakesh", "chefchaouen": "Chefchaouen", "fes": "Fez",
    "tangier": "Tangier", "essaouira": "Essaouira", "merzouga": "Merzouga",
    "agadir": "Agadir", "rabat": "Rabat", "ifrane": "Ifrane",
    "al-hoceima": "Al Hoceima", "ouarzazate": "Ouarzazate", "high-atlas": "Imlil",
}


def parse_coordinate(value: str) -> tuple[float, float]:
    match = re.fullmatch(r"Point\((-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)\)", value)
    if not match:
        raise ValueError(f"Coordonnée Wikidata inattendue: {value}")
    longitude, latitude = float(match.group(1)), float(match.group(2))
    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        raise ValueError(f"Coordonnée hors limites: {value}")
    return latitude, longitude


def fetch_candidates(city_id: str) -> list[dict]:
    label = ENGLISH_LABELS[city_id].replace('"', '\\"')
    query = f'''PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX schema: <http://schema.org/>
    SELECT ?item ?coord ?description WHERE {{
      ?item rdfs:label "{label}"@en ; wdt:P17 wd:Q1028 ; wdt:P625 ?coord .
      OPTIONAL {{ ?item schema:description ?description . FILTER(lang(?description) = "en") }}
    }} LIMIT 5'''
    url = ENDPOINT + "?" + urllib.parse.urlencode({"query": query, "format": "json"})
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"})
    with urllib.request.urlopen(request, timeout=45) as response:
        payload = json.loads(response.read().decode("utf-8"))
    candidates = []
    for row in payload["results"]["bindings"]:
        qid = row["item"]["value"].rsplit("/", 1)[-1]
        latitude, longitude = parse_coordinate(row["coord"]["value"])
        candidates.append({
            "wikidata_id": qid,
            "wikidata_url": row["item"]["value"],
            "latitude": latitude,
            "longitude": longitude,
            "description": row.get("description", {}).get("value"),
            "source_record_id": qid,
        })
    return candidates


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--city", required=True, choices=sorted(ENGLISH_LABELS))
    parser.add_argument("--apply", action="store_true", help="Enregistre seulement si un seul résultat est retourné.")
    args = parser.parse_args()
    try:
        candidates = fetch_candidates(args.city)
    except Exception as exc:
        print(f"Lecture Wikidata interrompue: {exc}", file=sys.stderr)
        return 2
    print(json.dumps({"destination_id": args.city, "candidate_count": len(candidates), "candidates": candidates}, ensure_ascii=False, indent=2))
    if len(candidates) != 1:
        print("Correspondance absente ou ambiguë; aucune écriture. Vérifier l'entité manuellement.")
        return 0 if not args.apply else 2
    if not args.apply:
        print("Aperçu uniquement. Relance avec --apply pour enregistrer l'identifiant, la description source et ses coordonnées.")
        return 0

    ensure_migrated()
    conn = sqlite3.connect(load_db_path())
    conn.row_factory = sqlite3.Row
    try:
        city = conn.execute("SELECT rowid,latitude,longitude FROM destinations WHERE id=?", (args.city,)).fetchone()
        source = conn.execute("SELECT id FROM data_sources WHERE source_key='wikidata'").fetchone()
        if not city or not source:
            raise RuntimeError("Destination ou source Wikidata introuvable dans la base.")
        candidate = candidates[0]
        collected = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
        conn.execute("BEGIN")
        conn.execute("""UPDATE destinations SET wikidata_id=?,wikidata_description=?,
          latitude=COALESCE(latitude,?),longitude=COALESCE(longitude,?) WHERE id=?""",
          (candidate["wikidata_id"], candidate["description"], candidate["latitude"], candidate["longitude"], args.city))
        provenance_fields = ["wikidata_id", "wikidata_description"]
        if city["latitude"] is None:
            provenance_fields.append("latitude")
        if city["longitude"] is None:
            provenance_fields.append("longitude")
        for field in provenance_fields:
            conn.execute("""INSERT INTO tourism_field_sources
              (entity_type,entity_id,field_name,source_id,source_record_id,source_url,collected_at)
              VALUES ('destination',?,?,?,?,?,?)
              ON CONFLICT(entity_type,entity_id,field_name) DO UPDATE SET source_id=excluded.source_id,
              source_record_id=excluded.source_record_id,source_url=excluded.source_url,
              collected_at=excluded.collected_at""",
              (city[0],field,source[0],candidate["source_record_id"],candidate["wikidata_url"],collected))
        conn.commit()
        print("Entité Wikidata enregistrée; le texte overview existant est conservé.")
        return 0
    except Exception as exc:
        conn.rollback()
        print(f"Import Wikidata interrompu: {exc}", file=sys.stderr)
        return 2
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
