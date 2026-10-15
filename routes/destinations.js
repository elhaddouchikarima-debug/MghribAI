const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../db/database');

const router = express.Router();
const dishPhotosFile = path.join(__dirname, '..', 'db', 'Dishes.json');
let dishPhotos = {};
try {
  dishPhotos = JSON.parse(fs.readFileSync(dishPhotosFile, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// Kayjma3 les lignes dyal table fer3iya b destination_id
function groupBy(rows, map) {
  const out = {};
  for (const r of rows) (out[r.destination_id] ||= []).push(map(r));
  return out;
}

// Kayrja3 l-mdon b NAFS l-forme dyal DESTINATIONS li kant f app.js
function loadDestinations(where = '', params = []) {
  const rows = db.prepare(`SELECT rowid AS internal_id,* FROM destinations ${where} ORDER BY rowid`).all(...params);
  if (!rows.length) return [];

  const cats = groupBy(
    db.prepare('SELECT * FROM destination_categories ORDER BY rowid').all(), r => r.category);
  const tags = groupBy(
    db.prepare('SELECT * FROM destination_tags ORDER BY destination_id, position').all(), r => r.tag);
  const gallery = groupBy(
    db.prepare('SELECT * FROM destination_gallery ORDER BY destination_id, position').all(),
    r => ({ url: r.url, caption: r.caption }));
  const landmarks = groupBy(
    db.prepare(`SELECT dl.*,ds.attribution AS source_attribution,ds.license AS source_license
      FROM destination_landmarks dl LEFT JOIN data_sources ds ON ds.id=dl.source_id
      ORDER BY dl.destination_id,dl.position`).all(),
    r => ({ name: r.name, icon: r.icon, desc: r.description, img: r.img || null,
      category: r.category, latitude: r.latitude, longitude: r.longitude,
      durationMinutes: r.duration_minutes, estimatedPrice: r.estimated_price,
      priceCurrency: r.price_currency, priceStatus: r.price_status, season: r.season,
      restrictions: r.restrictions, dataStatus: r.data_status,
      sourceUrl: r.source_url, sourceAttribution: r.source_attribution, sourceLicense: r.source_license,
      collectedAt: r.collected_at, verifiedAt: r.verified_at }));
  const food = groupBy(
    db.prepare(`SELECT df.*,ds.attribution AS source_attribution,ds.license AS source_license
      FROM destination_food df LEFT JOIN data_sources ds ON ds.id=df.source_id
      ORDER BY df.destination_id,df.position`).all(),
    r => ({ name: r.name, desc: r.description, img: dishPhotos[r.name]?.img || r.img || null,
      dataStatus: r.data_status, sourceUrl: r.source_url, sourceAttribution: r.source_attribution,
      sourceLicense: r.source_license, collectedAt: r.collected_at, verifiedAt: r.verified_at }));
  const accommodations = groupBy(
    db.prepare(`SELECT a.*,ds.attribution AS source_attribution,ds.license AS source_license
      FROM accommodations a LEFT JOIN data_sources ds ON ds.id=a.source_id ORDER BY a.destination_id,a.name`).all(),
    r => ({ id: r.id, name: r.name, category: r.category, address: r.address,
      latitude: r.latitude, longitude: r.longitude, services: JSON.parse(r.services_json || '[]'),
      priceMin: r.price_min, priceMax: r.price_max, priceCurrency: r.price_currency,
      priceStatus: r.price_status, websiteUrl: r.website_url, bookingUrl: r.booking_url,
      dataStatus: r.data_status, sourceUrl: r.source_url, sourceAttribution: r.source_attribution,
      sourceLicense: r.source_license, collectedAt: r.collected_at, verifiedAt: r.verified_at }));
  const restaurants = groupBy(
    db.prepare(`SELECT a.*,ds.attribution AS source_attribution,ds.license AS source_license
      FROM restaurants a LEFT JOIN data_sources ds ON ds.id=a.source_id ORDER BY a.destination_id,a.name`).all(),
    r => ({ id: r.id, name: r.name, address: r.address, latitude: r.latitude, longitude: r.longitude,
      cuisine: r.cuisine, specialties: r.specialties, budgetMin: r.budget_min, budgetMax: r.budget_max,
      budgetCurrency: r.budget_currency, budgetStatus: r.budget_status, openingHours: r.opening_hours,
      rating: r.rating, websiteUrl: r.website_url, dataStatus: r.data_status,
      sourceUrl: r.source_url, sourceAttribution: r.source_attribution, sourceLicense: r.source_license,
      collectedAt: r.collected_at, verifiedAt: r.verified_at }));
  const transportRoutes = {};
  for (const r of db.prepare(`SELECT tr.*, origin.name AS origin_name, dest.name AS destination_name
      FROM transport_routes tr
      JOIN destinations origin ON origin.id=tr.origin_destination_id
      JOIN destinations dest ON dest.id=tr.destination_destination_id
      ORDER BY origin.name,dest.name,tr.transport_type`).all()) {
    const route = { originId: r.origin_destination_id, origin: r.origin_name,
      destinationId: r.destination_destination_id, destination: r.destination_name,
      type: r.transport_type, operator: r.operator, distanceKm: r.distance_km,
      durationMinutes: r.duration_minutes, priceMin: r.price_min, priceMax: r.price_max,
      priceCurrency: r.price_currency, priceStatus: r.price_status, officialUrl: r.official_url,
      dataStatus: r.data_status, sourceUrl: r.source_url, collectedAt: r.collected_at, verifiedAt: r.verified_at };
    (transportRoutes[r.origin_destination_id] ||= []).push(route);
    (transportRoutes[r.destination_destination_id] ||= []).push(route);
  }
  const weather = groupBy(
    db.prepare(`SELECT w.*,ds.attribution AS source_attribution,ds.license AS source_license
      FROM weather_observations w LEFT JOIN data_sources ds ON ds.id=w.source_id
      ORDER BY w.destination_id,w.valid_at,w.collected_at`).all(),
    r => ({ kind: r.data_kind, validAt: r.valid_at, minC: r.temperature_min_c,
      maxC: r.temperature_max_c, precipitationMm: r.precipitation_mm,
      windSpeedKmh: r.wind_speed_kmh, sourceUrl: r.source_url, sourceAttribution: r.source_attribution,
      sourceLicense: r.source_license, collectedAt: r.collected_at }));
  const destinationSources = {};
  for (const r of db.prepare(`SELECT fs.*,ds.name AS source_name,ds.license AS source_license,ds.attribution AS source_attribution
      FROM tourism_field_sources fs JOIN data_sources ds ON ds.id=fs.source_id
      WHERE fs.entity_type='destination' ORDER BY fs.field_name`).all()) {
    (destinationSources[r.entity_id] ||= []).push({ field: r.field_name, source: r.source_name,
      sourceRecordId: r.source_record_id, sourceUrl: r.source_url, license: r.source_license,
      attribution: r.source_attribution, collectedAt: r.collected_at, verifiedAt: r.verified_at });
  }
  const tips = groupBy(
    db.prepare('SELECT * FROM destination_tips ORDER BY destination_id, position').all(), r => r.tip);

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    nameFr: r.name_fr,
    nameAr: r.name_ar,
    region: r.region,
    latitude: r.latitude,
    longitude: r.longitude,
    wikidataId: r.wikidata_id,
    wikidataDescription: r.wikidata_description,
    dataStatus: r.data_status,
    fieldSources: destinationSources[r.internal_id] || [],
    cats: cats[r.id] || [],
    label: r.label,
    emoji: r.emoji,
    img: r.img,
    shortDesc: r.short_desc,
    overview: r.overview,
    season: r.season,
    weather: r.weather,
    duration: r.duration,
    budgetEst: r.budget_est,
    gallery: gallery[r.id] || [],
    landmarks: landmarks[r.id] || [],
    food: food[r.id] || [],
    accommodations: accommodations[r.id] || [],
    restaurants: restaurants[r.id] || [],
    transportRoutes: transportRoutes[r.id] || [],
    weatherObservations: weather[r.id] || [],
    culture: r.culture,
    tips: tips[r.id] || [],
    tags: tags[r.id] || []
  }));
}

// GET /api/destinations?category=desert&q=marrakech
router.get('/', (req, res) => {
  let list = loadDestinations();

  const category = (req.query.category || '').toString().trim().toLowerCase();
  if (category && category !== 'all') {
    list = list.filter(d => d.cats.includes(category));
  }

  const q = (req.query.q || '').toString().trim().toLowerCase();
  if (q) {
    list = list.filter(d =>
      [d.name, d.nameFr, d.region, ...d.tags, ...d.landmarks.map(l => l.name)]
        .join(' ').toLowerCase().includes(q));
  }

  res.json(list);
});

// GET /api/destinations/:id
router.get('/:id', (req, res) => {
  const [dest] = loadDestinations('WHERE id = ?', [req.params.id]);
  if (!dest) return res.status(404).json({ error: 'Destination introuvable' });
  res.json(dest);
});

module.exports = router;
// The recommendation route needs the same destination records the public API
// serves, including planner activities, meals, stays and city photo galleries.
module.exports.loadDestinations = loadDestinations;
