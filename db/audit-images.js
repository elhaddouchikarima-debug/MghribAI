// Kay3mel audit l-s-tsawer dyal les destinations: doublons + fichiers mfa9ouda.
// Lanci: node db/audit-images.js
const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'destinations.json'), 'utf8'));
const imagesFile = path.join(__dirname, 'images.json');
const overrides = fs.existsSync(imagesFile) ? JSON.parse(fs.readFileSync(imagesFile, 'utf8')) : {};

const used = {};        // url -> [ "ville (slot)" ]
const problems = [];

for (const d of data) {
  const o = overrides[d.id] || {};
  const slots = [['img', o.img || d.img], ...(o.gallery || d.gallery).map((g, i) => ['gallery ' + (i + 1), g.url])];
  for (const [slot, url] of slots) {
    (used[url] ||= []).push(`${d.id} (${slot})`);
    if (!/^https?:/.test(url)) {
      const file = path.join(__dirname, '..', 'public', url);
      if (!fs.existsSync(file)) problems.push(`MANQUANT  ${d.id} (${slot}): ${url}`);
    }
  }
  if (!overrides[d.id]) problems.push(`PAS ENCORE VERIFIEE  ${d.id}: photos d'origine`);
}

for (const [url, where] of Object.entries(used)) {
  const cities = new Set(where.map(w => w.split(' ')[0]));
  if (cities.size > 1) problems.push(`DOUBLON  ${url}\n           -> ${where.join(', ')}`);
}

console.log(problems.length ? problems.join('\n') : 'OK: aucune photo dupliquee ou manquante');
console.log(`\n${Object.keys(used).length} photos uniques, ${problems.length} probleme(s)`);