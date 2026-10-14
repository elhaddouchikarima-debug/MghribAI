// L-9iyam l-mسموha, nafs li kaynin f PLANNER_QUESTIONS dyal app.js
const ALLOWED = {
  experience: ['mountains', 'beach', 'desert', 'culture', 'food', 'adventure', 'relaxation', 'shopping', 'nature', 'mix'],
  budget: ['low', 'moderate', 'comfortable', 'luxury'],
  budgetCurrency: ['USD', 'EUR', 'MAD', 'GBP'],
  duration: ['1-2', '3-4', '5-7', '8+'],
  companions: ['alone', 'partner', 'friends', 'family', 'group'],
  atmosphere: ['quiet', 'lively', 'traditional', 'adventurous', 'romantic', 'combo'],
  season: ['spring', 'summer', 'autumn', 'winter', 'flexible'],
  transport: ['public', 'rental', 'private', 'undecided'],
  startCity: ['marrakech', 'casablanca', 'tangier', 'fes', 'agadir', 'rabat', 'anywhere']
};

const SINGLE_FIELDS = ['budget', 'budgetCurrency', 'duration', 'companions', 'atmosphere', 'season', 'transport', 'startCity'];

// Kayrja3 { errors: [...], value: {...} }  (value = preferences nqiyin)
function validatePreferences(body) {
  const errors = [];
  const value = {};

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { errors: ['Le corps de la requête doit être un objet JSON'], value };
  }

  // experience: tableau
  const exp = body.experience === undefined ? [] : body.experience;
  if (!Array.isArray(exp)) {
    errors.push('experience doit être un tableau');
  } else {
    const bad = exp.filter(e => !ALLOWED.experience.includes(e));
    if (bad.length) errors.push(`experience: valeurs invalides (${bad.join(', ')})`);
    value.experience = [...new Set(exp)];
  }

  // champs simples (optionnels, mais ila kaynin khass ykounou s7a7)
  for (const f of SINGLE_FIELDS) {
    const v = body[f];
    if (v === undefined || v === null || v === '') { value[f] = null; continue; }
    if (!ALLOWED[f].includes(v)) errors.push(`${f}: valeur invalide (${v})`);
    else value[f] = v;
  }

  // budgetAmount: ra9m (wla khawi)
  const amt = body.budgetAmount;
  if (amt === undefined || amt === null || amt === '') {
    value.budgetAmount = null;
  } else if (!/^\d{1,9}(\.\d{1,2})?$/.test(String(amt))) {
    errors.push('budgetAmount doit être un nombre positif');
  } else {
    value.budgetAmount = String(amt);
  }

  // notes: texte, max 1000 caractères
  const notes = body.notes === undefined || body.notes === null ? '' : body.notes;
  if (typeof notes !== 'string') errors.push('notes doit être du texte');
  else if (notes.length > 1000) errors.push('notes: 1000 caractères maximum');
  else value.notes = notes.trim();

  // submittedAt: optionnel
  value.submittedAt = typeof body.submittedAt === 'string' ? body.submittedAt.slice(0, 40) : null;

  return { errors, value };
}

module.exports = { validatePreferences, ALLOWED };