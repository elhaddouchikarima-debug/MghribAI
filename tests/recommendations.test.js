const test = require('node:test');
const assert = require('node:assert/strict');
const destinationsRouter = require('../routes/destinations');
const { validatePreferences } = require('../services/validatePreferences');
const { buildRecommendationCandidates } = require('../services/recommendationCandidates');
const { validateModelRecommendations, mapRecommendationError } = require('../routes/recommendations');
const { parseJsonObject } = require('../services/apertusClient');

const destinations = destinationsRouter.loadDestinations();

test('planner preferences reject unsupported values and accept real form values', () => {
  const valid = validatePreferences({ experience: ['beach', 'nature'], budget: 'low', duration: '3-4', budgetCurrency: 'MAD' });
  assert.deepEqual(valid.errors, []);
  assert.deepEqual(valid.value.experience, ['beach', 'nature']);
  const invalid = validatePreferences({ experience: ['moon'], budget: 'free' });
  assert.ok(invalid.errors.length > 0);
});

test('beach preferences rank coastal destinations and all candidates use known database IDs', () => {
  const preferences = validatePreferences({ experience: ['beach', 'relaxation'], budget: 'moderate' }).value;
  const candidates = buildRecommendationCandidates(destinations, preferences);
  assert.ok(candidates.length > 0);
  assert.ok(['agadir', 'essaouira', 'al-hoceima', 'tangier'].includes(candidates[0].id));
  assert.ok(candidates.every(candidate => destinations.some(destination => destination.id === candidate.id)));
});

test('mountain and nature preferences rank matching destinations', () => {
  const preferences = validatePreferences({ experience: ['mountains', 'nature', 'adventure'] }).value;
  const candidates = buildRecommendationCandidates(destinations, preferences);
  assert.ok(['chefchaouen', 'ifrane', 'al-hoceima', 'high-atlas'].includes(candidates[0].id));
});

test('limited budget is carried in a validated preference profile without fabricated prices', () => {
  const result = validatePreferences({ experience: ['culture'], budget: 'low', budgetAmount: '500', budgetCurrency: 'MAD' });
  assert.deepEqual(result.errors, []);
  assert.equal(result.value.budgetAmount, '500');
  const candidates = buildRecommendationCandidates(destinations, result.value);
  const resultPayload = validateModelRecommendations({ summary: 'A close match.', recommendations: [{ city_id: candidates[0].id, match_reason: 'Matches the selected heritage interests.', suggested_activity_indices: [0], practical_note_indices: [0] }] }, candidates);
  assert.ok(resultPayload.destinations[0].budget_note.includes('existing site estimate'));
});

test('malformed output and unknown city IDs are rejected; valid IDs are allowlisted', () => {
  const candidates = buildRecommendationCandidates(destinations, {});
  assert.throws(() => parseJsonObject('not a JSON recommendation'), /invalid_response/);
  assert.throws(() => validateModelRecommendations({}, candidates), /invalid_response/);
  assert.throws(() => validateModelRecommendations({ recommendations: [{ city_id: 'atlantis', match_reason: 'Great.' }] }, candidates), /invalid_response/);
  const output = validateModelRecommendations({ summary: 'A match.', recommendations: [
    { city_id: 'atlantis', match_reason: 'Invented city.' },
    { city_id: candidates[0].id, match_reason: 'Uses existing city data.', suggested_activity_indices: [0, 999] }
  ] }, candidates);
  assert.deepEqual(output.destinations.map(item => item.city.id), [candidates[0].id]);
});

test('provider failures map to safe actionable API statuses', () => {
  assert.equal(mapRecommendationError({ status: 429 }).status, 429);
  assert.equal(mapRecommendationError({ name: 'AbortError' }).status, 504);
  assert.equal(mapRecommendationError({ status: 401 }).status, 503);
  assert.equal(mapRecommendationError({ status: 402 }).status, 402);
  assert.equal(mapRecommendationError({ message: 'invalid_response' }).status, 502);
  assert.doesNotMatch(mapRecommendationError({ status: 401 }).message, /Bearer|hf_/i);
});
