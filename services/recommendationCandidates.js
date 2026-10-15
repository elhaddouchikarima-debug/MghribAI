const EXPERIENCE_TERMS = {
  mountains: ['mountain', 'mountains', 'atlas', 'rif', 'hiking', 'hike', 'trail', 'valley'],
  beach: ['coast', 'coastal', 'beach', 'sea', 'atlantic', 'mediterranean', 'surf'],
  desert: ['desert', 'sahara', 'dune', 'dunes', 'oasis'],
  culture: ['imperial', 'culture', 'cultural', 'heritage', 'historic', 'history', 'medina', 'architecture', 'monument'],
  food: ['food', 'cuisine', 'culinary', 'restaurant', 'dish', 'market'],
  adventure: ['adventure', 'hiking', 'trek', 'surf', 'outdoor', 'dune'],
  relaxation: ['relax', 'relaxing', 'quiet', 'beach', 'spa', 'wellness', 'coast'],
  shopping: ['shopping', 'souks', 'souk', 'craft', 'crafts', 'artisan'],
  nature: ['nature', 'wildlife', 'forest', 'mountain', 'mountains', 'coast', 'park', 'valley'],
  mix: []
};

function textOf(value) {
  return String(value || '').toLowerCase();
}

function scoreDestination(destination, preferences) {
  const searchable = textOf([
    destination.name, destination.region, destination.shortDesc, destination.overview,
    destination.culture, ...(destination.cats || []), ...(destination.tags || []),
    ...(destination.landmarks || []).flatMap(item => [item.name, item.desc])
  ].join(' '));
  let score = 0;
  for (const experience of preferences.experience || []) {
    const terms = EXPERIENCE_TERMS[experience] || [];
    if (experience === 'mix') continue;
    const matches = terms.filter(term => searchable.includes(term)).length;
    score += Math.min(matches, 3) * 3;
  }
  if (preferences.startCity && preferences.startCity !== 'anywhere' && destination.id === preferences.startCity) score += 2;
  if (preferences.atmosphere === 'traditional' && /traditional|historic|heritage|medina|culture|imperial/.test(searchable)) score += 2;
  if (preferences.atmosphere === 'adventurous' && /adventure|hiking|trek|surf|desert|mountain/.test(searchable)) score += 2;
  if (preferences.atmosphere === 'quiet' && /nature|forest|mountain|coast|quiet|relax/.test(searchable)) score += 1;
  return score;
}

function buildRecommendationCandidates(destinations, preferences, limit = 12) {
  return destinations
    .map((destination, order) => ({ destination, order, score: scoreDestination(destination, preferences) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map(({ destination }) => {
      const activities = [
        ...(destination.landmarks || []).map(item => item.name),
        ...(destination.tags || []).slice(0, 6)
      ].filter((item, index, all) => typeof item === 'string' && item.trim() && all.indexOf(item) === index).slice(0, 12);
      return {
        id: destination.id,
        name: destination.name,
        region: destination.region || 'Morocco',
        image: destination.img || destination.gallery?.[0]?.url || '',
        categories: destination.cats || [],
        tags: destination.tags || [],
        description: (destination.shortDesc || destination.overview || '').slice(0, 700),
        attractions: (destination.landmarks || []).slice(0, 8).map(item => ({ name: item.name, description: item.desc || '' })),
        activities,
        practicalNotes: (destination.tips || []).map(item => typeof item === 'string' ? item : item?.tip).filter(Boolean).slice(0, 6),
        budgetEstimate: destination.budgetEst || null,
        suggestedDuration: destination.duration || null
      };
    });
}

module.exports = { buildRecommendationCandidates };
