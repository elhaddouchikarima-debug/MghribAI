const estimates = require('../db/planner_estimates.json');
const fs = require('node:fs');
const path = require('node:path');
const PLANNER_IMAGES_FILE = path.join(__dirname, '..', 'db', 'planner_images.json');
let plannerImageOverrides = {};
let plannerImageOverridesMtime = -1;

const DAYS_BY_DURATION = { '1-2': 2, '3-4': 4, '5-7': 7, '8+': 8 };
const FX_AS_OF = estimates.checkedAt;
const DEFAULT_BUDGET = 'moderate';
const paidPlace = /palace|museum|garden|medersa|madrasa|tomb|museum|monument|kasbah museum/i;
const freePlace = /square|gate|mosque|beach|waterfall|lake|port|rampart|viewpoint|village|forest|valley|dune|market|souk|medina|kasbah &|coast/i;
const EXPERIENCE_TERMS = {
  mountains: ['mountain', 'atlas', 'rif', 'hiking', 'hike', 'trail', 'forest', 'valley'],
  beach: ['beach', 'coast', 'coastal', 'sea', 'surf', 'ocean'],
  desert: ['desert', 'sahara', 'dune', 'camel', 'oasis'],
  culture: ['culture', 'cultural', 'historic', 'heritage', 'medina', 'craft', 'kasbah', 'museum', 'palace'],
  food: ['food', 'cooking', 'meal', 'restaurant', 'dish', 'culinary'],
  adventure: ['adventure', 'hiking', 'hike', 'surf', 'outdoor', 'camel', 'dune'],
  relaxation: ['relax', 'quiet', 'beach', 'spa', 'wellness', 'coast'],
  shopping: ['shopping', 'souk', 'market', 'craft', 'artisan'],
  nature: ['nature', 'wildlife', 'forest', 'mountain', 'coast', 'park', 'valley']
};

const EXPERIENCE_IDEAS = {
  marrakech: { name: 'Moroccan cooking class with a market visit', description: 'A suggested hands-on cooking experience; provider, availability and meal inclusion must be checked.', category: 'cultural_experience', durationMinutes: 240, priceRange: [250, 600], priceSource: 'cook', imageIndex: 3 },
  chefchaouen: { name: 'Ras El Maa and Spanish Mosque walking loop', description: 'A self-guided walk between existing scenic spots; check trail conditions and daylight.', category: 'hiking', durationMinutes: 150, priceRange: [0, 0], priceSource: 'free', imageIndex: 2 },
  fes: { name: 'Self-guided craft and medina discovery', description: 'Explore the historic streets and artisan quarters independently; workshop participation is not included.', category: 'cultural_experience', durationMinutes: 150, priceRange: [0, 0], priceSource: 'free', imageIndex: 1 },
  tangier: { name: 'Kasbah and waterfront culture walk', description: 'A self-guided city walk; verify museum opening and access before departure.', category: 'sightseeing', durationMinutes: 150, priceRange: [0, 0], priceSource: 'free', imageIndex: 2 },
  essaouira: { name: 'Skala, port and artisan-quarter walk', description: 'Self-guided coastal heritage walk; boat trips and workshops are not assumed or included.', category: 'sightseeing', durationMinutes: 150, priceRange: [0, 0], priceSource: 'free', imageIndex: 1 },
  merzouga: { name: 'Optional short camel ride near Erg Chebbi', description: 'Optional local-provider suggestion; confirm animal-welfare standards, route, inclusions and current quote.', category: 'desert_experience', durationMinutes: 90, priceRange: [150, 450], priceSource: 'camel', imageIndex: 0 },
  agadir: { name: 'Optional group surf lesson in Taghazout', description: 'Optional lesson suggestion; confirm conditions, equipment, instructor and live price with a local school.', category: 'water_sport', durationMinutes: 150, priceRange: [300, 550], priceSource: 'surf', imageIndex: 1 },
  rabat: { name: 'Kasbah of the Udayas and medina walk', description: 'Self-guided heritage walk; confirm access to indoor sites separately.', category: 'sightseeing', durationMinutes: 150, priceRange: [0, 0], priceSource: 'free', imageIndex: 1 },
  ifrane: { name: 'Self-guided town and forest walk', description: 'A low-cost outdoor suggestion; check weather, trail access and seasonal conditions.', category: 'nature', durationMinutes: 150, priceRange: [0, 0], priceSource: 'free', imageIndex: 2 },
  'al-hoceima': { name: 'Coastal viewpoint and beach time', description: 'A self-guided coastal outing; check beach access and sea conditions.', category: 'coastal_activity', durationMinutes: 180, priceRange: [0, 0], priceSource: 'free', imageIndex: 1 },
  ouarzazate: { name: 'Old-town and kasbah-area discovery', description: 'Self-guided visit suggestion; site admission, local guide and transport are not included.', category: 'sightseeing', durationMinutes: 150, priceRange: [0, 0], priceSource: 'free', imageIndex: 1 },
  'high-atlas': { name: 'Self-guided village and valley walk', description: 'Only choose a suitable marked route; ask locally about weather, access and whether a licensed guide is needed.', category: 'hiking', durationMinutes: 180, priceRange: [0, 0], priceSource: 'free', imageIndex: 2 }
};

const IMAGE_FALLBACKS = {
  marrakech: '/assets/hero/marrakech-jemaa-elfna-1600.jpg',
  chefchaouen: '/assets/hero/chefchaouen-mountain-panorama-1600.jpg',
  merzouga: '/assets/hero/sahara-merzouga-caravan-1600.jpg',
  'al-hoceima': '/assets/hero/al-hoceima-bay-view-1600.jpg'
};

function durationInDays(duration, exactDays) {
  if (Number.isInteger(exactDays) && exactDays >= 1 && exactDays <= 30) return exactDays;
  return DAYS_BY_DURATION[duration] || 4;
}
function safeRange(range) { return { min: range[0], max: range[1], currency: 'MAD', status: range[0] === 0 && range[1] === 0 ? 'free_self_guided' : 'estimate' }; }

function slugImageKey(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function imageOverride(type, destinationId, itemKey) {
  try {
    const mtime = fs.statSync(PLANNER_IMAGES_FILE).mtimeMs;
    if (mtime !== plannerImageOverridesMtime) {
      plannerImageOverrides = JSON.parse(fs.readFileSync(PLANNER_IMAGES_FILE, 'utf8'));
      plannerImageOverridesMtime = mtime;
    }
    const value = plannerImageOverrides[type]?.[`${destinationId}/${slugImageKey(itemKey)}`];
    const entry = typeof value === 'string' ? { url: value } : value;
    const url = typeof entry?.url === 'string' ? entry.url.trim() : '';
    if (!url || !(/^(https?:\/\/|\/)/i.test(url)) || url.startsWith('//')) return null;
    return { url, alt: typeof entry.alt === 'string' ? entry.alt.trim() : '' };
  } catch {
    return null;
  }
}

function chooseActivityImage(destination, item, fallbackIndex = 0) {
  const gallery = destination.gallery || [];
  const hintText = `${item.imageHint || ''} ${item.name || ''}`.toLowerCase();
  const hintWords = [...new Set(hintText.split(/[^a-z0-9]+/).filter(word => word.length > 3))];
  const galleryPhoto = gallery
    .map(photo => ({ photo, score: hintWords.reduce((score, word) => score + (photo.caption?.toLowerCase().includes(word) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score)[0]?.photo || gallery[fallbackIndex % Math.max(1, gallery.length)];
  const override = imageOverride(item.imageKind || 'activities', destination.id, item.name);
  const url = override?.url || item.img || galleryPhoto?.url || destination.img || IMAGE_FALLBACKS[destination.id] || '/assets/hero/marrakech-riad-rooftops-1600.jpg';
  const caption = gallery.find(photo => photo.url === url)?.caption;
  return { url, alt: override?.alt || item.imageAlt || (item.img ? `${item.name || destination.name} in ${destination.name}` : `${caption || destination.name} — ${destination.name}`) };
}

function activityCandidates(destination, preferences, preferredActivities = []) {
  const preferred = new Map(preferredActivities.map((name, i) => [String(name).toLowerCase(), i]));
  const landmarks = (destination.landmarks || []).map((item, index) => {
    const name = item.name || `${destination.name} attraction ${index + 1}`;
    const existsPreferred = [...preferred.keys()].find(key => key === name.toLowerCase() || key.includes(name.toLowerCase()));
    let range = [0, 0];
    let priceSource = 'free';
    if (Number.isFinite(item.estimatedPrice) && item.priceCurrency === 'MAD' && ['confirmed', 'estimate'].includes(item.priceStatus)) {
      range = [item.estimatedPrice, item.estimatedPrice];
      priceSource = item.priceStatus === 'confirmed' ? 'verified_record' : 'ticket';
    } else if (paidPlace.test(name) && !freePlace.test(name)) {
      range = estimates.activityRanges.paidAdmission;
      priceSource = 'ticket';
    }
    return {
      id: `${destination.id}-landmark-${index}`, name,
      description: item.desc || `Explore ${name} in ${destination.name}. Check current access and opening information before visiting.`,
      category: 'sightseeing', location: `${name}, ${destination.name}`,
      durationMinutes: Number.isInteger(item.durationMinutes) ? item.durationMinutes : 75,
      image: chooseActivityImage(destination, item, index),
      price: safeRange(range), priceSource,
      tip: item.restrictions || 'Check current opening, entry, and access information before departure.',
      preferenceRank: existsPreferred === undefined ? Number.MAX_SAFE_INTEGER : preferred.get(existsPreferred)
    };
  });
  (destination.plannerActivities || []).forEach((item, index) => {
    const existsPreferred = [...preferred.keys()].find(key => key === item.name.toLowerCase() || key.includes(item.name.toLowerCase()));
    const range = [Number(item.priceMin) || 0, Number(item.priceMax) || 0];
    landmarks.push({
      id: `${destination.id}-planner-activity-${index}`, name: item.name, description: item.desc,
      category: item.category, location: destination.name, durationMinutes: item.durationMinutes || 90,
      image: chooseActivityImage(destination, { name: item.name }, index + 2),
      price: safeRange(range), priceSource: item.priceBasis || 'free',
      tip: 'Suggestion from the city planner catalog; verify access, availability, and any provider price before going.',
      preferenceRank: existsPreferred === undefined ? Number.MAX_SAFE_INTEGER : preferred.get(existsPreferred)
    });
  });
  const idea = EXPERIENCE_IDEAS[destination.id];
  if (idea) {
    landmarks.push({
      id: `${destination.id}-experience`, ...idea,
      location: destination.name,
      image: chooseActivityImage(destination, { name: idea.name }, idea.imageIndex),
      price: safeRange(idea.priceRange),
      preferenceRank: Number.MAX_SAFE_INTEGER - 1
    });
    delete landmarks[landmarks.length - 1].imageIndex;
    delete landmarks[landmarks.length - 1].priceRange;
  }
  const selected = [...(preferences.experience || [])];
  return landmarks.sort((a, b) => {
    if (a.preferenceRank !== b.preferenceRank) return a.preferenceRank - b.preferenceRank;
    const aText = `${a.name} ${a.description} ${a.category}`.toLowerCase();
    const bText = `${b.name} ${b.description} ${b.category}`.toLowerCase();
    const score = text => selected.reduce((n, term) => n + ((EXPERIENCE_TERMS[term] || [term]).some(word => text.includes(word)) ? 2 : 0), 0);
    return score(bText) - score(aText);
  });
}

function makeMeals(destination, dayIndex, budget, travelers) {
  const bands = estimates.mealBands[budget] || estimates.mealBands[DEFAULT_BUDGET];
  const foods = destination.food || [];
  return ['breakfast', 'lunch', 'dinner'].map((mealType, mealIndex) => {
    const catalogMeal = (destination.plannerFoodOptions || []).filter(item => item.mealType === mealType);
    const cityDishes = mealType === 'breakfast' ? [] : foods;
    const mealChoices = [...catalogMeal, ...cityDishes].filter((item, index, all) =>
      all.findIndex(candidate => candidate.name === item.name) === index);
    const dish = mealChoices.length ? mealChoices[dayIndex % mealChoices.length] : null;
    const name = dish?.name || 'Simple local café breakfast (ask for a menu)';
    const description = dish?.desc || 'A generic café meal suggestion; the exact menu and price depend on the venue.';
    return {
      id: `${destination.id}-day-${dayIndex + 1}-${mealType}`,
      category: 'meal', mealType, name, description,
      location: `${destination.name} — choose a local café or restaurant; no specific venue is endorsed`,
      time: { breakfast: '08:00', lunch: '13:00', dinner: '19:00' }[mealType],
      durationMinutes: 60,
      image: (() => {
        const matchedFoodPhoto = dish?.img ? dish : foods.find(food => {
          const tokens = String(dish?.name || '').toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 3);
          return food.img && tokens.some(token => `${food.name} ${food.desc || ''}`.toLowerCase().includes(token));
        }) || foods.find(food => food.img);
        return chooseActivityImage(destination, {
          name: dish?.name || 'Local Moroccan food', imageHint: 'food meal dish',
          imageKind: 'food',
          img: matchedFoodPhoto?.img || null,
          imageAlt: matchedFoodPhoto
            ? `Illustrative local food photo (${matchedFoodPhoto.name}) for ${destination.name}`
            : `Local food suggestion in ${destination.name}`
        }, dayIndex + mealIndex);
      })(),
      price: safeRange(bands[mealType]), priceSource: 'meals', unit: 'per_person_per_meal', quantity: travelers,
      practicalTip: 'Ask for the current menu price and confirm dietary ingredients.'
    };
  });
}

function accommodationFor(destination, budget, travelers, nights) {
  const band = estimates.stayBands[budget] || estimates.stayBands[DEFAULT_BUDGET];
  const cityProfile = destination.stayProfiles?.[budget];
  const roomCount = band.unit === 'per_person_per_night' ? travelers : Math.ceil(travelers / 2);
  const [min, max] = band.range;
  const stayPhoto = (destination.gallery || []).find(photo => /riad|guesthouse|hotel|courtyard|room|camp|hospitality|lodge/i.test(photo.caption || ''))
    || (destination.gallery || [])[0];
  const stayImageOverride = imageOverride('accommodations', destination.id, budget);
  return {
    name: cityProfile?.name || `${band.type} suggestion in ${destination.name}`,
    type: cityProfile?.name || band.type,
    note: `Accommodation category suggestion near ${cityProfile?.locationHint || destination.name}; no named property, availability, breakfast, rating or live booking price is claimed. Price range is a broad Morocco planning estimate. Verify before booking.`,
    location: cityProfile?.locationHint || destination.name,
    image: stayImageOverride?.url
      ? { url: stayImageOverride.url, alt: stayImageOverride.alt || `Illustrative ${cityProfile?.name || band.type} image in ${destination.name}` }
      : stayPhoto ? { url: stayPhoto.url, alt: `Illustrative view of ${stayPhoto.caption} in ${destination.name}, not a specific accommodation` } : chooseActivityImage(destination, { name: destination.name, imageHint: 'accommodation' }),
    nights, roomsOrBeds: roomCount, unit: band.unit,
    pricePerUnitNight: safeRange([min, max]),
    total: safeRange([min * nights * roomCount, max * nights * roomCount]),
    priceSource: band.source,
    quantity: nights * roomCount
  };
}

function sumRanges(items, getRange = item => item.price, multiplier = item => item.quantity || 1) {
  return items.reduce((sum, item) => {
    const range = getRange(item);
    const qty = multiplier(item);
    sum.min += range.min * qty;
    sum.max += range.max * qty;
    return sum;
  }, { min: 0, max: 0, currency: 'MAD' });
}

function buildItinerary(destination, preferences = {}, preferredActivities = []) {
  if (!destination || typeof destination.id !== 'string') throw new TypeError('A known destination is required');
  const daysCount = durationInDays(preferences.duration, preferences.tripDays);
  const travelers = Number.isInteger(preferences.travelers) && preferences.travelers >= 1 && preferences.travelers <= 20 ? preferences.travelers : 1;
  const budget = ['low', 'moderate', 'comfortable', 'luxury'].includes(preferences.budget) ? preferences.budget : DEFAULT_BUDGET;
  const nightsCount = Math.max(0, daysCount - 1);
  const activityPool = activityCandidates(destination, { ...preferences, budget }, preferredActivities);
  const freeTimeNames = ['Flexible time for rest and independent discovery', 'Open time to explore a neighborhood at your own pace', 'Leisure block for a café stop or a return to a favorite place', 'Unscheduled time; choose an accessible local area after checking conditions'];
  let activityIndex = 0;
  const days = Array.from({ length: daysCount }, (_, dayIndex) => {
    const plannedActivities = [];
    const remainingDays = daysCount - dayIndex;
    const remainingActivities = activityPool.length - activityIndex;
    const activitySlots = Math.min(2, Math.ceil(remainingActivities / remainingDays));
    for (let slot = 0; slot < activitySlots && activityIndex < activityPool.length; slot++, activityIndex++) {
      const activity = activityPool[activityIndex];
      plannedActivities.push({ ...activity, time: slot === 0 ? '09:30' : '15:00', unit: 'per_person', quantity: travelers });
    }
    if (plannedActivities.length < 2) {
      const name = freeTimeNames[dayIndex % freeTimeNames.length];
      plannedActivities.push({
        id: `${destination.id}-day-${dayIndex + 1}-flex`, name,
        description: 'An intentionally unscheduled, free block rather than an invented attraction or booking.',
        category: 'flexible_free_time', location: destination.name, time: plannedActivities.length ? '15:00' : '09:30',
        durationMinutes: 120, image: chooseActivityImage(destination, { name }, dayIndex + 2),
        price: safeRange([0, 0]), priceSource: 'free', unit: 'per_person', quantity: travelers,
        tip: 'Keep this time flexible; verify weather, opening and access locally.'
      });
    }
    const meals = makeMeals(destination, dayIndex, budget, travelers);
    const hasLodging = dayIndex < nightsCount;
    const localTransport = preferences.transport === 'public' ? {
      name: 'Local public transport allowance', category: 'transport', unit: 'per_person_per_day',
      quantity: travelers, price: safeRange(estimates.activityRanges.cityTransportPerDay), priceSource: 'transport',
      note: 'Estimated local movement only; inter-city travel is excluded because the route database has no priced connections.'
    } : null;
    const optional = {
      name: 'Optional spending allowance (snacks, tips, small purchases)', category: 'optional_expenses',
      unit: 'per_person_per_day', quantity: travelers,
      price: safeRange(estimates.activityRanges.optionalPerPersonPerDay), priceSource: 'meals', optional: true
    };
    const stay = hasLodging ? accommodationFor(destination, budget, travelers, 1) : null;
    const dayPriceItems = [
      ...plannedActivities.map(item => ({ price: item.price, quantity: travelers })),
      ...meals.map(item => ({ price: item.price, quantity: travelers })),
      ...(stay ? [{ price: stay.pricePerUnitNight, quantity: stay.roomsOrBeds }] : []),
      ...(localTransport ? [localTransport] : []), optional
    ];
    return {
      dayNumber: dayIndex + 1,
      title: `Day ${dayIndex + 1} — ${destination.name}`,
      description: dayIndex === 0 ? `A preference-ranked day in ${destination.name}; verify opening times and local conditions.` : `Continue at a relaxed pace in ${destination.name}, grouping the listed places by neighborhood where practical.`,
      activities: plannedActivities,
      meals,
      overnightStay: stay ? { ...stay, nights: 1 } : null,
      localTransport,
      optionalExpenses: optional,
      dailySubtotal: sumRanges(dayPriceItems)
    };
  });

  const activitiesTotal = sumRanges(days.flatMap(day => day.activities), item => item.price, item => travelers);
  const mealTotals = Object.fromEntries(['breakfast', 'lunch', 'dinner'].map(type => [type,
    sumRanges(days.flatMap(day => day.meals.filter(meal => meal.mealType === type)), item => item.price, () => travelers)
  ]));
  const accommodation = accommodationFor(destination, budget, travelers, nightsCount);
  const accommodationTotal = { min: accommodation.total.min, max: accommodation.total.max, currency: 'MAD' };
  const transportItems = days.map(day => day.localTransport).filter(Boolean);
  const transportTotal = sumRanges(transportItems, item => item.price, () => travelers);
  const optionalItems = days.map(day => day.optionalExpenses);
  const optionalTotal = sumRanges(optionalItems, item => item.price, () => travelers);
  const baseTotal = {
    min: activitiesTotal.min + mealTotals.breakfast.min + mealTotals.lunch.min + mealTotals.dinner.min + accommodationTotal.min + transportTotal.min,
    max: activitiesTotal.max + mealTotals.breakfast.max + mealTotals.lunch.max + mealTotals.dinner.max + accommodationTotal.max + transportTotal.max,
    currency: 'MAD'
  };
  const totalWithOptional = { min: baseTotal.min + optionalTotal.min, max: baseTotal.max + optionalTotal.max, currency: 'MAD' };
  const perPerson = { min: Math.ceil(totalWithOptional.min / travelers), max: Math.ceil(totalWithOptional.max / travelers), currency: 'MAD' };
  const budgetAmount = Number(preferences.budgetAmount);
  const rate = estimates.exchangeRatesMadPerUnit[preferences.budgetCurrency] || null;
  const budgetMadPerPerson = Number.isFinite(budgetAmount) && budgetAmount > 0 && rate ? Math.round(budgetAmount * rate) : null;
  const comparison = budgetMadPerPerson === null ? null : {
    suppliedAmount: budgetAmount, suppliedCurrency: preferences.budgetCurrency, approximateMadPerPerson: budgetMadPerPerson,
    rateAsOf: FX_AS_OF,
    status: budgetMadPerPerson < perPerson.min ? 'below_estimate' : budgetMadPerPerson < perPerson.max ? 'may_be_tight' : 'above_estimate',
    explanation: budgetMadPerPerson < perPerson.min
      ? 'The entered per-person budget is below even the low end of this ground-cost estimate. Shorten the stay or choose lower-cost options; flights and inter-city transport remain excluded.'
      : budgetMadPerPerson < perPerson.max
        ? 'The entered per-person budget falls within the estimated range. Use the low-cost options and confirm quotes; flights and inter-city transport remain excluded.'
        : 'The entered per-person budget is above the priced ground-cost estimate, but this is not a booking quote; flights and inter-city transport remain excluded.'
  };

  const result = {
    destination: {
      id: destination.id, name: destination.name, region: destination.region,
      image: imageOverride('destinations', destination.id, 'default')?.url || chooseActivityImage(destination, { name: destination.name }).url,
      imageAlt: imageOverride('destinations', destination.id, 'default')?.alt || `${destination.name}, Morocco`,
      imageFallback: IMAGE_FALLBACKS[destination.id] || '/assets/hero/marrakech-riad-rooftops-1600.jpg',
      bestTimeToVisit: null,
      bestTimeNote: 'No verified best-season data is stored for this itinerary; check local weather and access conditions for your dates.'
    },
    daysCount, nightsCount, travelers, budgetTier: budget,
    pricing: {
      currency: 'MAD', rangeMethod: 'Each line retains its source min/max range; the trip total is the arithmetic sum of itinerary quantities at those two endpoints.',
      sources: estimates.sources,
      totals: {
        activitiesExperiences: activitiesTotal,
        breakfast: mealTotals.breakfast, lunch: mealTotals.lunch, dinner: mealTotals.dinner,
        accommodation: accommodationTotal, transportation: transportTotal,
        optionalExpenses: optionalTotal, baseGroundCost: baseTotal,
        totalIncludingOptional: totalWithOptional, perPersonIncludingOptional: perPerson,
        accommodationUnit: accommodation.unit,
        accommodationRoomsOrBeds: accommodation.roomsOrBeds,
        optionalExpensesIncluded: true
      },
      budgetComparison: comparison,
      exclusions: ['International flights', 'Inter-city transport and unpriced car hire/private transfers', 'City transfers where not covered by the local-public-transport estimate', 'Live venue, meal and lodging quotes']
    },
    accommodationSummary: { ...accommodation, nights: nightsCount },
    days,
    disclaimer: 'Planning estimates only, not live quotes. The source destination text is demonstration data; verify each attraction, food suggestion, route, season, admission, access, availability and price before booking.'
  };
  validateItinerary(result);
  return result;
}

function validateItinerary(itinerary) {
  if (!Array.isArray(itinerary.days) || itinerary.days.length !== itinerary.daysCount) throw new Error('invalid_itinerary_days');
  const categories = new Set(['sightseeing', 'meal', 'accommodation', 'transport', 'optional_expenses', 'flexible_free_time', 'hiking', 'cultural_experience', 'desert_experience', 'water_sport', 'nature', 'coastal_activity', 'shopping']);
  for (const day of itinerary.days) {
    if (!Number.isFinite(day.dailySubtotal.min) || !Number.isFinite(day.dailySubtotal.max) || day.dailySubtotal.min > day.dailySubtotal.max) throw new Error('invalid_itinerary_subtotal');
    for (const item of [...day.activities, ...day.meals]) {
      if (!categories.has(item.category) || !Number.isFinite(item.price.min) || !Number.isFinite(item.price.max) || item.price.min > item.price.max || item.price.currency !== 'MAD') throw new Error('invalid_itinerary_item');
    }
  }
  const expectedLow = itinerary.pricing.totals.baseGroundCost.min + itinerary.pricing.totals.optionalExpenses.min;
  const expectedHigh = itinerary.pricing.totals.baseGroundCost.max + itinerary.pricing.totals.optionalExpenses.max;
  if (expectedLow !== itinerary.pricing.totals.totalIncludingOptional.min || expectedHigh !== itinerary.pricing.totals.totalIncludingOptional.max) throw new Error('invalid_itinerary_total');
  return itinerary;
}

module.exports = { buildItinerary, validateItinerary, durationInDays, activityCandidates, IMAGE_FALLBACKS, EXPERIENCE_IDEAS };
