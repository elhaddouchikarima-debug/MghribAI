/**
 * Kay-qleb 3la tswira dyal PLAT mn Wikimedia Commons.
 *
 *  Chouf chnou mazal:  node db/find-dish.js --todo
 *  1) Qleb:            node db/find-dish.js "Pastilla Fassi"
 *     (b mots-clés:    node db/find-dish.js "Khlea" "khlii dried meat")
 *  2) Chouf l-liens o khtar WA7ED:   node db/find-dish.js "Pastilla Fassi" --pick 3
 *  3) node db/seed.js
 *  (smit l-plat kif ma kayn f l-site, 7ta l-majuscules makhassch)
 */
const fs = require('fs');
const path = require('path');

const API = process.env.COMMONS_API || 'https://commons.wikimedia.org/w/api.php';
const UA = 'MaghribAI-student-project/1.0 (https://github.com/elhaddouchikarima-debug/MghribAI)';
const ROOT = path.join(__dirname, '..');
const DEST_FILE = path.join(__dirname, 'destinations.json');
const DISHES_FILE = path.join(__dirname, 'Dishes.json');
const CACHE_FILE = path.join(__dirname, '.last-search.json');
const CREDITS_FILE = path.join(ROOT, 'CREDITS.md');

const clean = s => (s || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const toCaption = t => t.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' ').trim();
const slug = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const readJson = (f, fallback) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : fallback);

async function search(query) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', generator: 'search',
    gsrsearch: `${query} filemime:image/jpeg`, gsrnamespace: '6', gsrlimit: '25',
    prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1000'
  });
  const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('Commons a répondu HTTP ' + res.status);
  const json = await res.json();
  const pages = Object.values((json.query && json.query.pages) || {}).sort((a, b) => a.index - b.index);
  return pages.map(p => {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii) return null;
    const m = ii.extmetadata || {};
    return {
      title: p.title, width: ii.width, height: ii.height,
      thumb: ii.thumburl || ii.url, page: ii.descriptionurl,
      license: clean(m.LicenseShortName && m.LicenseShortName.value) || 'licence inconnue',
      author: clean(m.Artist && m.Artist.value) || 'auteur inconnu'
    };
  }).filter(c => c && c.width >= 600);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('Téléchargement impossible (HTTP ' + res.status + ')');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

(async () => {
  const args = process.argv.slice(2);
  const dests = readJson(DEST_FILE, []);
  const dishes = readJson(DISHES_FILE, {});
  const all = [];                       // { name, city }
  dests.forEach(d => d.food.forEach(f => all.push({ name: f.name, city: d.id })));

  // ---- --todo : progression
  if (args.includes('--todo')) {
    let done = 0;
    all.forEach(f => {
      const has = dishes[f.name] && dishes[f.name].img;
      if (has) done++;
      console.log(`${has ? '✅' : '⬜'} ${f.city.padEnd(12)} ${f.name}`);
    });
    console.log(`\n${done}/${all.length} plats ont une photo.`);
    return;
  }

  const pickIdx = args.indexOf('--pick');
  const pick = pickIdx >= 0 ? parseInt(args[pickIdx + 1], 10) : null;
  const rest = pickIdx >= 0 ? args.filter((a, i) => i !== pickIdx && i !== pickIdx + 1) : args;
  const wanted = (rest[0] || '').trim().toLowerCase();
  const dish = all.find(f => f.name.toLowerCase() === wanted);

  if (!dish) {
    console.log('Usage: node db/find-dish.js "<smit l-plat>" ["mots-clés"] [--pick N]   |   --todo\n');
    const near = wanted ? all.filter(f => f.name.toLowerCase().includes(wanted)) : [];
    if (wanted) console.log(near.length ? 'Wach bghiti wa7ed mn:' : `Plat ma lqitouhch: "${rest[0]}"`);
    (near.length ? near : all).forEach(f => console.log(`  - ${f.name}  (${f.city})`));
    process.exit(1);
  }

  // ---- Mode 2: telechargement
  if (pick) {
    const cache = readJson(CACHE_FILE, null);
    if (!cache || cache.dish !== dish.name) { console.log('Lance d\'abord la recherche (sans --pick).'); process.exit(1); }
    const c = cache.results[pick - 1];
    if (!c) { console.log(`#${pick}: n'existe pas`); process.exit(1); }
    const rel = `assets/dishes/${slug(dish.name)}.jpg`;
    await download(c.thumb, path.join(ROOT, 'public', rel));
    dishes[dish.name] = { img: rel, caption: toCaption(c.title), credit: `${c.author} — ${c.license} — ${c.page}` };
    fs.writeFileSync(DISHES_FILE, JSON.stringify(dishes, null, 2), 'utf8');
    fs.appendFileSync(CREDITS_FILE, `- Plat "${dish.name}": "${toCaption(c.title)}" — ${c.author}, ${c.license}, ${c.page}\n`);
    console.log(`OK  ${dish.name}  ->  ${rel}\nEnsuite: node db/seed.js`);
    return;
  }

  // ---- Mode 1: recherche
  const query = rest[1] || dish.name.replace(/\s*\(.*?\)/g, '');
  console.log(`Plat: ${dish.name}  (${dish.city})\nRecherche sur Wikimedia Commons: "${query}" ...\n`);
  const results = await search(query);
  if (!results.length) { console.log('Aucun résultat. Essaie d\'autres mots-clés (en anglais ou en français).'); return; }
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ dish: dish.name, query, results }), 'utf8');
  results.forEach((c, i) => {
    console.log(`${String(i + 1).padStart(2)}. ${toCaption(c.title)}`);
    console.log(`    ${c.width}x${c.height} | ${c.license} | ${c.author}`);
    console.log(`    ${c.page}`);
  });
  console.log(`\nOuvre les liens, puis:  node db/find-dish.js "${dish.name}" --pick N`);
})().catch(err => { console.error('Erreur:', err.message); process.exit(1); });
