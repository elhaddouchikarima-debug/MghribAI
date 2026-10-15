const test = require('node:test');
const assert = require('node:assert/strict');
const destinationsRouter = require('../routes/destinations');
const { validatePreferences } = require('../services/validatePreferences');
const { buildItinerary, validateItinerary, durationInDays } = require('../services/buildItinerary');
const { buildRecommendationCandidates } = require('../services/recommendationCandidates');
const { datasetFallback } = require('../routes/recommendations');
const recommendationsRouter = require('../routes/recommendations').router;
const plannerImages = require('../db/planner_images.json');
const { EXPERIENCE_IDEAS } = require('../services/buildItinerary');

const destinations = destinationsRouter.loadDestinations();

test('duration selections expand to the configured number of itinerary days', () => {
  assert.deepEqual(['1-2', '3-4', '5-7', '8+'].map(duration => durationInDays(duration)), [2, 4, 7, 8]);
  assert.equal(durationInDays('3-4', 3), 3);
});

test('itineraries are built for every existing destination and every selected day', () => {
  assert.equal(destinations.length, 12);
  for (const destination of destinations) {
    const { errors, value } = validatePreferences({ duration: '3-4', travelers: 3, budget: 'moderate', transport: 'public' });
    assert.deepEqual(errors, []);
    const itinerary = buildItinerary(destination, value, []);
    assert.equal(itinerary.days.length, 4);
    assert.equal(itinerary.travelers, 3);
    assert.equal(itinerary.nightsCount, 3);
    assert.equal(itinerary.days.at(-1).overnightStay, null);
    assert.equal(validateItinerary(itinerary), itinerary);
    assert.ok(itinerary.days.every(day => day.meals.length === 3 && day.activities.length > 0));
    assert.ok(itinerary.days.flatMap(day => day.activities).every(item => item.image.url && item.image.alt && item.price.currency === 'MAD'));
  }
});

test('budget totals sum itinerary items and account for group size and room nights', () => {
  const destination = destinations.find(city => city.id === 'fes');
  const itinerary = buildItinerary(destination, { duration: '1-2', travelers: 3, budget: 'low', transport: 'public' }, []);
  const totals = itinerary.pricing.totals;
  const daySums = itinerary.days.reduce((out, day) => ({ min: out.min + day.dailySubtotal.min, max: out.max + day.dailySubtotal.max }), { min: 0, max: 0 });
  assert.equal(daySums.min, totals.totalIncludingOptional.min);
  assert.equal(daySums.max, totals.totalIncludingOptional.max);
  assert.equal(totals.accommodationRoomsOrBeds, 3); // hostel estimate is priced per bed
  assert.equal(totals.perPersonIncludingOptional.min, Math.ceil(daySums.min / 3));
  assert.equal(totals.perPersonIncludingOptional.max, Math.ceil(daySums.max / 3));
  assert.ok(itinerary.accommodationSummary.total.min <= itinerary.accommodationSummary.total.max);
});

test('all cities have database-backed activities, meal ideas, and budget-specific stay profiles', () => {
  for (const city of destinations) {
    assert.ok(city.plannerActivities.length >= 3, `${city.id} activity catalog`);
    assert.ok(city.plannerFoodOptions.some(option => option.mealType === 'breakfast'), `${city.id} breakfast catalog`);
    assert.ok(['low', 'moderate', 'comfortable', 'luxury'].every(tier => city.stayProfiles[tier]), `${city.id} stay profiles`);
    const plan = buildItinerary(city, { duration: '3-4', tripDays: 4, travelers: 2, budget: 'moderate' });
    assert.ok(plan.days.every(day => day.meals.length === 3 && day.activities.some(item => item.category !== 'flexible_free_time')));
    const plannedActivities = plan.days.flatMap(day => day.activities.filter(item => item.category !== 'flexible_free_time'));
    assert.equal(new Set(plannedActivities.map(item => item.id)).size, plannedActivities.length);
    assert.ok(new Set(plan.days.map(day => day.meals.find(meal => meal.mealType === 'lunch').name)).size > 1, `${city.id} should vary lunch ideas`);
    assert.ok(plan.days.flatMap(day => day.activities).every(item => item.image?.url && item.image.alt), `${city.id} activity images`);
    assert.ok(plan.days.flatMap(day => day.meals).every(item => item.image?.url && item.image.alt), `${city.id} meal images`);
    assert.ok(plan.days.filter(day => day.overnightStay).every(day => day.overnightStay.image?.url && day.overnightStay.image.alt), `${city.id} stay illustration`);
  }
});

test('long plans spread distinct activities across days and include lodging on every night', () => {
  const city = destinations.find(item => item.id === 'al-hoceima');
  const plan = buildItinerary(city, { duration: '8+', tripDays: 8, travelers: 2, budget: 'low' });
  assert.equal(plan.days.length, 8);
  assert.ok(plan.days.every(day => day.activities.some(item => item.category !== 'flexible_free_time')));
  assert.equal(plan.days.filter(day => day.overnightStay).length, 7);
  assert.ok(plan.days.every(day => day.meals.length === 3));
});

test('editable image URL JSON has fields for every city, activity, meal, and stay tier', () => {
  const slug = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const hasEntry = (section, cityId, item) => {
    const entry = plannerImages[section][`${cityId}/${slug(item)}`];
    assert.ok(entry && Object.hasOwn(entry, 'url'), `${section}: ${cityId}/${slug(item)}`);
  };
  for (const city of destinations) {
    assert.ok(plannerImages.destinations[`${city.id}/default`]?.url !== undefined);
    for (const activity of [...city.landmarks, ...city.plannerActivities]) hasEntry('activities', city.id, activity.name);
    if (EXPERIENCE_IDEAS[city.id]) hasEntry('activities', city.id, EXPERIENCE_IDEAS[city.id].name);
    for (const food of [...city.food, ...city.plannerFoodOptions]) hasEntry('food', city.id, food.name);
    for (const tier of ['low', 'moderate', 'comfortable', 'luxury']) hasEntry('accommodations', city.id, tier);
  }
});

test('low MAD budget is compared against the high end and never reported as fitting when it is short', () => {
  const destination = destinations.find(city => city.id === 'marrakech');
  const itinerary = buildItinerary(destination, { duration: '3-4', travelers: 1, budget: 'low', budgetAmount: '100', budgetCurrency: 'MAD' }, []);
  assert.equal(itinerary.pricing.budgetComparison.status, 'below_estimate');
});

test('traveler count is validated and dataset-only recommendation fallback uses existing city IDs', () => {
  assert.ok(validatePreferences({ travelers: 0 }).errors.length);
  assert.ok(validatePreferences({ travelers: 2.5 }).errors.length);
  const candidates = buildRecommendationCandidates(destinations, { experience: ['beach'] });
  const fallback = datasetFallback(candidates);
  assert.ok(fallback.destinations.length > 0);
  assert.ok(fallback.destinations.every(item => destinations.some(city => city.id === item.city.id)));
});

test('POST recommendations route independently returns a complete dataset fallback without HF access', async () => {
  const previousToken = process.env.HF_TOKEN;
  process.env.HF_TOKEN = '';
  try {
    const response = await new Promise((resolve, reject) => {
      const req = {
        method: 'POST', url: '/', originalUrl: '/', baseUrl: '', headers: {}, ip: 'itinerary-test',
        body: { language: 'en', preferences: { experience: ['culture'], budget: 'low', budgetCurrency: 'MAD', budgetAmount: '500', duration: '1-2', tripDays: 1, travelers: 2, companions: 'partner', atmosphere: 'traditional', transport: 'public', startCity: 'marrakech' } },
        get: () => undefined
      };
      const res = {
        statusCode: 200,
        status(code) { this.statusCode = code; return this; },
        json(payload) { resolve({ status: this.statusCode, payload }); return this; },
        setHeader() { return this; }, end() { return this; }
      };
      recommendationsRouter.handle(req, res, error => error ? reject(error) : resolve({ status: res.statusCode, payload: null }));
    });
    assert.equal(response.status, 200);
    assert.equal(response.payload.modelStatus, 'dataset-fallback');
    assert.equal(response.payload.itinerary.days.length, 1);
    assert.equal(response.payload.itinerary.travelers, 2);
    assert.equal(response.payload.itinerary.destination.id, response.payload.destinations[0].city.id);
    assert.ok(response.payload.itinerary.pricing.totals.totalIncludingOptional.max > 0);
  } finally {
    if (previousToken === undefined) delete process.env.HF_TOKEN;
    else process.env.HF_TOKEN = previousToken;
  }
});

test('city planner pins the selected city and returns only its day-by-day plan', async () => {
  const previousToken = process.env.HF_TOKEN;
  process.env.HF_TOKEN = '';
  try {
    const response = await new Promise((resolve, reject) => {
      const req = {
        method: 'POST', url: '/', originalUrl: '/', baseUrl: '', headers: {}, ip: 'city-itinerary-test',
        body: { language: 'en', destinationId: 'al-hoceima', preferences: { experience: ['beach'], budget: 'low', budgetCurrency: 'MAD', duration: '3-4', tripDays: 3, travelers: 2, companions: 'partner', atmosphere: 'quiet', transport: 'public' } },
        get: () => undefined
      };
      const res = {
        statusCode: 200,
        status(code) { this.statusCode = code; return this; },
        json(payload) { resolve({ status: this.statusCode, payload }); return this; },
        setHeader() { return this; }, end() { return this; }
      };
      recommendationsRouter.handle(req, res, error => error ? reject(error) : resolve({ status: res.statusCode, payload: null }));
    });
    assert.equal(response.status, 200);
    assert.deepEqual(response.payload.destinations.map(item => item.city.id), ['al-hoceima']);
    assert.equal(response.payload.itinerary.destination.id, 'al-hoceima');
    assert.equal(response.payload.itinerary.days.length, 3);
  } finally {
    if (previousToken === undefined) delete process.env.HF_TOKEN;
    else process.env.HF_TOKEN = previousToken;
  }
});
