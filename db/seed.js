// Kaymla DB b l-mdon. T9der t3awdo mnin bghiti: kaymsah o kay3awd kayktheb.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const db = require('./database');

const JSON_FILE = path.join(__dirname, 'destinations.json');
// Keep the path casing aligned with the checked-in file for case-sensitive hosts.
const DISHES_FILE = path.join(__dirname, 'Dishes.json');
const APP_JS = path.join(__dirname, '..', 'public', 'app.js');

// 1) Jib l-data: mn destinations.json ila kayn, wla men app.js (merra lwla)
function loadDestinations() {
  if (fs.existsSync(JSON_FILE)) {
    return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  }
  const src = fs.readFileSync(APP_JS, 'utf8');
  const m = src.match(/const DESTINATIONS = (\[[\s\S]*?\n\]);/);
  if (!m) throw new Error('DESTINATIONS ma lqitouhach f public/app.js');
  const data = vm.runInNewContext('(' + m[1] + ')');
  fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log('Tsaved db/destinations.json (backup dyal data)');
  return data;
}

const destinations = loadDestinations();

// Dish photos selected with find-photos.js are keyed by dish name.
if (fs.existsSync(DISHES_FILE)) {
  const dishPhotos = JSON.parse(fs.readFileSync(DISHES_FILE, 'utf8'));
  for (const destination of destinations) {
    for (const dish of destination.food || []) {
      if (dishPhotos[dish.name]?.img) dish.img = dishPhotos[dish.name].img;
    }
  }
}

// 1b) Photos verifiees (db/images.json) kay-ghalbo 3la dyal l-data l-9dima.
//     Khassha takhdem 9bel l-insert, wla ma-twslch l-DB.
const IMAGES_FILE = path.join(__dirname, 'images.json');
if (fs.existsSync(IMAGES_FILE)) {
  const overrides = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));
  for (const d of destinations) {
    const o = overrides[d.id];
    if (!o) continue;
    // Les cases vides (url "") sont ignorees: la ville garde ses anciennes photos tant qu'elle n'a rien
    const filled = (o.gallery || []).filter(g => g.url && g.url.trim());
    if (filled.length) d.gallery = filled.map(g => ({ url: g.url.trim(), caption: g.caption }));
    if (o.img && o.img.trim()) d.img = o.img.trim();
    else if (filled.length) d.img = filled[0].url.trim();   // img vide -> 1ere photo de la galerie
  }
  const done = Object.values(overrides).filter(o => (o.gallery || []).some(g => g.url && g.url.trim())).length;
  console.log(`Photos: ${done}/${Object.keys(overrides).length} ville(s) ont leurs vraies photos`);
}

// 2) Msa7 l-data l-9dima (bach ma ykounouch doublons)
const insDest = db.prepare(`INSERT INTO destinations
  (id, name, name_fr, name_ar, region, label, emoji, img, short_desc, overview, season, weather, duration, budget_est, culture)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  ON CONFLICT(id) DO UPDATE SET name=excluded.name,name_fr=excluded.name_fr,name_ar=excluded.name_ar,
  region=excluded.region,label=excluded.label,emoji=excluded.emoji,img=excluded.img,
  short_desc=excluded.short_desc,overview=excluded.overview,season=excluded.season,
  weather=excluded.weather,duration=excluded.duration,budget_est=excluded.budget_est,culture=excluded.culture`);
const insCat  = db.prepare('INSERT INTO destination_categories (destination_id, category) VALUES (?,?)');
const insTag  = db.prepare('INSERT INTO destination_tags (destination_id, position, tag) VALUES (?,?,?)');
const insGal  = db.prepare('INSERT INTO destination_gallery (destination_id, position, url, caption) VALUES (?,?,?,?)');
const insLm   = db.prepare('INSERT INTO destination_landmarks (destination_id, position, name, icon, description, img) VALUES (?,?,?,?,?,?)');
const insFood = db.prepare('INSERT INTO destination_food (destination_id, position, name, description, img) VALUES (?,?,?,?,?)');
const insTip  = db.prepare('INSERT INTO destination_tips (destination_id, position, tip) VALUES (?,?,?)');

db.exec('BEGIN');
try {
  for (const d of destinations) {
    insDest.run(d.id, d.name, d.nameFr, d.nameAr, d.region, d.label, d.emoji, d.img,
      d.shortDesc, d.overview, d.season, d.weather, d.duration, d.budgetEst, d.culture);
    // Replace only this seed's demo rows; imported OSM records and coordinates survive reseeding.
    db.prepare('DELETE FROM destination_categories WHERE destination_id=?').run(d.id);
    db.prepare('DELETE FROM destination_tags WHERE destination_id=?').run(d.id);
    db.prepare('DELETE FROM destination_gallery WHERE destination_id=?').run(d.id);
    db.prepare("DELETE FROM destination_landmarks WHERE destination_id=? AND data_status='demo'").run(d.id);
    db.prepare("DELETE FROM destination_food WHERE destination_id=? AND data_status='demo'").run(d.id);
    db.prepare('DELETE FROM destination_tips WHERE destination_id=?').run(d.id);
    d.cats.forEach(c => insCat.run(d.id, c));
    d.tags.forEach((t, i) => insTag.run(d.id, i, t));
    d.gallery.forEach((g, i) => insGal.run(d.id, i, g.url, g.caption));
    d.landmarks.forEach((l, i) => {
      const existingImported = db.prepare(`SELECT 1 FROM destination_landmarks
        WHERE destination_id=? AND lower(trim(name))=lower(trim(?)) LIMIT 1`).get(d.id, l.name);
      if (!existingImported) insLm.run(d.id,
        db.prepare('SELECT COALESCE(MAX(position),-1)+1 AS next FROM destination_landmarks WHERE destination_id=?').get(d.id).next,
        l.name, l.icon, l.desc, l.img || null);
    });
    d.food.forEach((f, i) => insFood.run(d.id, i, f.name, f.desc, f.img || null));
    d.tips.forEach((t, i) => insTip.run(d.id, i, t));
  }
  db.exec('COMMIT');
} catch (err) {
  db.exec('ROLLBACK');
  throw err;
}

const count = (t) => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
console.log('Seed kmel:');
console.log(`  destinations: ${count('destinations')}`);
console.log(`  categories:   ${count('destination_categories')}`);
console.log(`  tags:         ${count('destination_tags')}`);
console.log(`  gallery:      ${count('destination_gallery')}`);
console.log(`  landmarks:    ${count('destination_landmarks')}`);
console.log(`  food:         ${count('destination_food')}`);
console.log(`  tips:         ${count('destination_tips')}`);
