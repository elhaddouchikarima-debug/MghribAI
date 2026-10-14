/**
 * Kaykhleq db/dish-picker.html: safha fin tchouf l-plats kamlin b tsawer dyalhom
 * mn Wikimedia Commons, o tkhtar b click. Lanci:  node db/make-picker.js
 */
const fs = require('fs');
const path = require('path');

const dests = JSON.parse(fs.readFileSync(path.join(__dirname, 'destinations.json'), 'utf8'));

// Mots-clés mzyanin l kol plat (t9der tbddelhom f s-safha nafsha)
const QUERIES = {
  'Tanjia Marrakchia': 'tanjia',
  'Pastilla': 'pastilla',
  'Mint Tea with Sheeba': 'Moroccan mint tea',
  'Jben (Fresh Goat Cheese)': 'jben cheese Morocco',
  'Bissara Soup': 'bissara',
  'Mountain Honey & Figs': 'honey figs Morocco',
  'Pastilla Fassi': 'pastilla',
  'Lamb Tagine with Prunes': 'tagine lamb prunes',
  'Khlea': 'khlea',
  'Fresh Mediterranean Fish Tagine': 'fish tagine Morocco',
  'Bocadillo Tanjawi': 'Tangier sandwich',
  'Mint Tea with Pine Nuts': 'Moroccan tea glass',
  'Fresh Grilled Sardines': 'grilled sardines Essaouira',
  'Fish Tagine with Argan Oil': 'fish tagine',
  'Argan Oil & Amlou': 'amlou',
  'Medfouna (Berber Pizza)': 'medfouna',
  'Desert Camp Tagine': 'tagine Merzouga',
  'Dates of Tafilalet': 'dates Tafilalet',
  'Argan Tagine of the Souss': 'tagine argan',
  'Grilled Sea Bream & Calamari': 'grilled calamari Morocco',
  'Amlou on Warm Msemmen': 'msemmen',
  'Couscous Bidawi with Seven Vegetables': 'couscous seven vegetables',
  'Kaab el Ghazal (Gazelle Horns)': 'kaab el ghazal',
  'Harira Soup with Dates': 'harira',
  'Atlas Mountain Trout': 'trout Morocco',
  'Middle Atlas Wild Mushroom Tagine': 'tagine mushrooms',
  'Hot Spiced Mint Tea with Mountain Thyme': 'Moroccan mint tea',
  'Mediterranean Espeto de Sardinas': 'espeto sardinas',
  'Rifian Paella & Seafood Platter': 'seafood paella Morocco',
  'Fresh Fig & Cactus Fruit': 'prickly pear Morocco',
  'Tagine of Camel Meat & Figs': 'camel tagine',
  'Ouarzazate Saffron Couscous': 'couscous Morocco',
  'Berber Bread with Olive Oil': 'Moroccan bread khobz',
  'Berber Tagine on Open Fire': 'tagine cooking Morocco',
  'Fresh Walnuts & Mountain Honey': 'walnuts honey',
  'High Atlas Herb Tea': 'Moroccan herbal tea'
};

const dishes = [];
dests.forEach(d => d.food.forEach(f => dishes.push({
  name: f.name, city: d.id, query: QUERIES[f.name] || f.name.replace(/\s*\(.*?\)/g, '')
})));

const PAGE = String.raw`<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>MaghribAI — Choisir les photos des plats</title>
<style>
  body{font-family:system-ui,sans-serif;margin:0;background:#faf6ee;color:#2b2118}
  #bar{position:sticky;top:0;z-index:5;background:#7a1f2b;color:#fff;padding:10px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  #bar button{padding:6px 12px;border:0;border-radius:6px;cursor:pointer;font-weight:600}
  main{padding:16px;max-width:1300px;margin:auto}
  section{background:#fff;border:1px solid #e3d9c5;border-radius:12px;padding:14px;margin-bottom:18px}
  section.done{border-color:#2e8b57;box-shadow:0 0 0 2px #2e8b5733}
  h2{margin:0 0 8px;font-size:18px} h2 small{color:#8a7a60;font-weight:400}
  form{display:flex;gap:8px;margin-bottom:10px} form input{flex:1;padding:6px 8px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
  figure{margin:0;border:3px solid transparent;border-radius:10px;overflow:hidden;background:#f1ebdd;cursor:pointer;position:relative}
  figure img{width:100%;height:130px;object-fit:cover;display:block}
  figure.sel{border-color:#2e8b57}
  figure.sel::after{content:"✓ choisie";position:absolute;top:6px;left:6px;background:#2e8b57;color:#fff;padding:2px 8px;border-radius:99px;font-size:12px}
  figcaption{font-size:11px;padding:5px 6px;line-height:1.3}
  figcaption a{color:#7a1f2b}
  .empty{color:#8a7a60;font-size:13px}
  textarea{width:100%;height:110px;font-family:monospace;font-size:12px}
</style></head>
<body>
<div id="bar">
  <b id="count">0/0 plats choisis</b>
  <button id="copy">Copier la sélection</button>
  <button id="dl">Télécharger selection.json</button>
  <span id="msg"></span>
</div>
<main>
  <p>Pour chaque plat, <b>clique sur la photo qui montre vraiment ce plat</b> (clique sur « voir » pour vérifier sur Commons). Si rien ne convient, change les mots-clés et clique « Chercher », ou laisse le plat sans photo.</p>
  <div id="list"></div>
  <h3>Sélection (JSON)</h3>
  <textarea id="out" readonly></textarea>
</main>
<script>
var API = window.COMMONS_API || 'https://commons.wikimedia.org/w/api.php';
var DISHES = __DISHES__;
var KEY = 'maghribai-dish-selection';
var selection = {};
try { selection = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}

function clean(s) { return (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
function caption(t) { return t.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' '); }
function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(selection)); } catch (e) {}
  var n = Object.keys(selection).length;
  document.getElementById('count').textContent = n + '/' + DISHES.length + ' plats choisis';
  document.getElementById('out').value = JSON.stringify(selection, null, 2);
  DISHES.forEach(function (d) {
    var s = document.querySelector('section[data-dish="' + CSS.escape(d.name) + '"]');
    if (s) s.classList.toggle('done', !!selection[d.name]);
  });
}

function search(query) {
  var params = new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', origin: '*',
    gsrsearch: query + ' filemime:image/jpeg', gsrnamespace: '6', gsrlimit: '20',
    prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '400'
  });
  return fetch(API + '?' + params).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(function (j) {
    var pages = Object.values((j.query && j.query.pages) || {}).sort(function (a, b) { return a.index - b.index; });
    return pages.map(function (p) {
      var ii = p.imageinfo && p.imageinfo[0];
      if (!ii || ii.width < 600) return null;
      var m = ii.extmetadata || {};
      return { title: p.title, thumb: ii.thumburl || ii.url, page: ii.descriptionurl,
               license: clean(m.LicenseShortName && m.LicenseShortName.value) };
    }).filter(Boolean).slice(0, 12);
  });
}

function runSearch(d, grid, query) {
  grid.textContent = '';
  grid.appendChild(el('p', 'empty', 'Recherche…'));
  return search(query).then(function (results) {
    grid.textContent = '';
    if (!results.length) { grid.appendChild(el('p', 'empty', 'Aucun résultat — change les mots-clés.')); return; }
    results.forEach(function (c) {
      var fig = el('figure');
      if (selection[d.name] === c.title) fig.className = 'sel';
      var img = el('img'); img.src = c.thumb; img.loading = 'lazy'; img.alt = caption(c.title);
      var cap = el('figcaption');
      cap.appendChild(document.createTextNode(caption(c.title) + ' · ' + (c.license || '?') + ' · '));
      var a = el('a', '', 'voir'); a.href = c.page; a.target = '_blank'; a.rel = 'noopener';
      a.addEventListener('click', function (ev) { ev.stopPropagation(); });
      cap.appendChild(a);
      fig.appendChild(img); fig.appendChild(cap);
      fig.addEventListener('click', function () {
        var was = selection[d.name] === c.title;
        grid.querySelectorAll('figure').forEach(function (f) { f.classList.remove('sel'); });
        if (was) delete selection[d.name]; else { selection[d.name] = c.title; fig.classList.add('sel'); }
        save();
      });
      grid.appendChild(fig);
    });
  }).catch(function (err) {
    grid.textContent = '';
    grid.appendChild(el('p', 'empty', 'Erreur: ' + err.message));
  });
}

function build() {
  var list = document.getElementById('list');
  var jobs = [];
  DISHES.forEach(function (d) {
    var s = el('section'); s.setAttribute('data-dish', d.name);
    var h = el('h2', '', '🍲 ' + d.name + ' '); h.appendChild(el('small', '', '(' + d.city + ')'));
    var form = el('form'); var input = el('input'); input.value = d.query;
    var btn = el('button', '', 'Chercher'); btn.type = 'submit';
    form.appendChild(input); form.appendChild(btn);
    var grid = el('div', 'grid');
    form.addEventListener('submit', function (ev) { ev.preventDefault(); runSearch(d, grid, input.value); });
    s.appendChild(h); s.appendChild(form); s.appendChild(grid); list.appendChild(s);
    jobs.push(function () { return runSearch(d, grid, d.query); });
  });
  save();
  // Recherches l-wa7da ba3d l-wa7da (mn ghir ma n-3mmro Commons)
  jobs.reduce(function (p, job) {
    return p.then(job).then(function () { return new Promise(function (r) { setTimeout(r, window.SEARCH_DELAY || 250); }); });
  }, Promise.resolve());
}

document.getElementById('copy').addEventListener('click', function () {
  var out = document.getElementById('out'); out.select();
  var ok = false;
  try { ok = document.execCommand('copy'); } catch (e) {}
  document.getElementById('msg').textContent = ok ? 'Copié! Colle-le f db/selection.json' : 'Copie manuelle: Ctrl+C';
});
document.getElementById('dl').addEventListener('click', function () {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(selection, null, 2)], { type: 'application/json' }));
  a.download = 'selection.json'; a.click();
});
build();
</script>
</body></html>
`;

const html = PAGE.replace('__DISHES__', JSON.stringify(dishes).replace(/</g, '\\u003c'));
const out = path.join(__dirname, 'dish-picker.html');
fs.writeFileSync(out, html, 'utf8');
console.log(`OK: ${dishes.length} plats  ->  ${out}`);
console.log('Fte7 had l-lien f browser:  file:///' + out.replace(/\\/g, '/').replace(/^\//, ''));