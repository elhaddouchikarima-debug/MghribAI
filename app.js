const DESTINATIONS = [
    {
        id: 'marrakech',
        name: 'Marrakech',
        region: 'Marrakech-Safi',
        cats: ['imperial'],
        label: 'Imperial City',
        emoji: '🕌',
        img: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=900&auto=format&fit=crop',
        text: 'Bustling red medina, vibrant souks, historic palaces, and lively evenings at Jemaa el-Fna.',
        season: 'October – April',
        weather: 'Sunny & Warm (22°C - 28°C)',
        duration: '3 - 5 Days',
        gallery: [
            'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop'
        ],
        landmarks: ['Jemaa el-Fna Square', 'Bahia Palace', 'Koutoubia Mosque', 'Majorelle Garden']
    },
    {
        id: 'fes',
        name: 'Fes',
        region: 'Fès-Meknès',
        cats: ['imperial'],
        label: 'Imperial City',
        emoji: '🏛',
        img: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=900&auto=format&fit=crop',
        text: 'The spiritual capital with ancient tanneries, medieval universities, and artisanal crafts.',
        season: 'September – May',
        weather: 'Mild & Pleasant (20°C - 25°C)',
        duration: '2 - 3 Days',
        gallery: [
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=800&auto=format&fit=crop'
        ],
        landmarks: ['Chouara Tannery', 'Al Quaraouiyine University', 'Bab Bou Jeloud']
    },
    {
        id: 'chefchaouen',
        name: 'Chefchaouen',
        region: 'Tanger-Tétouan-Al Hoceïma',
        cats: ['mountains', 'hidden'],
        label: 'Blue Pearl',
        emoji: '💙',
        img: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=900&auto=format&fit=crop',
        text: 'Blue-painted alleyways nestled in the Rif mountains, relaxing cafes, and mountain air.',
        season: 'Year-round',
        weather: 'Fresh Mountain Breeze (18°C - 24°C)',
        duration: '2 - 3 Days',
        gallery: [
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop'
        ],
        landmarks: ['Spanish Mosque', 'Kasbah Museum', 'Ras El Maa Waterfall']
    },
    {
        id: 'imlil',
        name: 'Imlil & Toubkal',
        region: 'Marrakech-Safi',
        cats: ['mountains'],
        label: 'Atlas Peaks',
        emoji: '🏔',
        img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=900&auto=format&fit=crop',
        text: 'Gateway to Mount Toubkal, traditional Berber villages, and breathtaking mountain trekking.',
        season: 'April – October',
        weather: 'Cool Mountain Climate (15°C - 22°C)',
        duration: '2 - 4 Days',
        gallery: [
            'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop'
        ],
        landmarks: ['Mount Toubkal Peak', 'Aroumd Village', 'Tizi n’Test Pass']
    },
    {
        id: 'essaouira',
        name: 'Essaouira',
        region: 'Marrakech-Safi',
        cats: ['coast'],
        label: 'Atlantic Fort',
        emoji: '🌬',
        img: 'https://images.unsplash.com/photo-1572252821143-2075f6174be6?q=80&w=900&auto=format&fit=crop',
        text: 'Historic Atlantic sea ramparts, fresh fish markets, windsurfing, and Gnaoua music heritage.',
        season: 'May – October',
        weather: 'Breezy & Coastal (20°C - 24°C)',
        duration: '2 - 3 Days',
        gallery: [
            'https://images.unsplash.com/photo-1572252821143-2075f6174be6?q=80&w=800&auto=format&fit=crop'
        ],
        landmarks: ['Skala de la Ville', 'Essaouira Medina Port', 'Mogador Island']
    },
    {
        id: 'merzouga',
        name: 'Merzouga (Sahara)',
        region: 'Drâa-Tafilalet',
        cats: ['desert'],
        label: 'Saharan Dunes',
        emoji: '🏜',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=900&auto=format&fit=crop',
        text: 'Erg Chebbi sand dunes, camel caravans at sunset, starlit luxury desert camps.',
        season: 'October – April',
        weather: 'Warm Days, Cool Desert Nights',
        duration: '2 - 3 Days',
        gallery: [
            'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop'
        ],
        landmarks: ['Erg Chebbi Dunes', 'Khamlia Gnawa Village', 'Dayet Srji Lake']
    }
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let currentSlide = 0;
const slides = $$('.hero-slide');
const dots = $$('#heroDots .dot');

function showSlide(index) {
    currentSlide = index;
    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === index));
    dots.forEach((dot, idx) => {
        dot.classList.toggle('bg-morocco-saffron', idx === index);
        dot.classList.toggle('bg-white/30', idx !== index);
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => showSlide(Number(dot.dataset.dot)));
});

setInterval(() => {
    showSlide((currentSlide + 1) % slides.length);
}, 5000);

const grid = $('#destinationsGrid');
let currentFilter = 'all';
let searchQuery = '';

function renderDestinations() {
    grid.innerHTML = DESTINATIONS.map((d, i) => `
        <article class="dest-card group relative rounded-3xl overflow-hidden glass-card transition-all duration-500 flex flex-col"
                 data-cats="${d.cats.join(' ')}" data-search="${(d.name + ' ' + d.region + ' ' + d.cats.join(' ')).toLowerCase()}">
            <div class="relative h-72 overflow-hidden">
                <img src="${d.img}" alt="${d.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-morocco-obsidian via-morocco-obsidian/25 to-transparent"></div>
                <span class="absolute top-4 left-4 bg-morocco-obsidian/80 backdrop-blur-md border border-morocco-saffron/40 text-morocco-saffron text-[11px] font-bold px-3 py-1.5 rounded-full">${d.label}</span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="font-heading text-2xl font-bold text-white group-hover:text-morocco-saffron transition-colors">${d.name}</h3>
                    <p class="text-[11px] uppercase tracking-widest text-morocco-terracotta font-semibold mt-1 mb-3">${d.region}</p>
                    <p class="text-sm text-morocco-sand/75 leading-relaxed mb-6">${d.text}</p>
                </div>
                <button data-explore-id="${d.id}" class="w-full py-3 rounded-xl bg-white/10 hover:bg-morocco-terracotta text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <span>Explore City</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
            </div>
        </article>
    `).join('');
}

function filterDestinations() {
    let visibleCount = 0;
    $$('.dest-card').forEach(card => {
        const matchesCategory = currentFilter === 'all' || card.dataset.cats.includes(currentFilter);
        const matchesSearch = !searchQuery || card.dataset.search.includes(searchQuery);
        const isVisible = matchesCategory && matchesSearch;
        card.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) visibleCount++;
    });
    $('#emptyMsg').classList.toggle('hidden', visibleCount > 0);
}

// Filter Tabs
$$('#filterTabs button').forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        $$('#filterTabs button').forEach(x => {
            x.classList.toggle('tab-on', x === btn);
            x.classList.toggle('tab-off', x !== btn);
        });
        filterDestinations();
    });
});

// Search input
$('#searchToggle').addEventListener('click', () => {
    $('#searchBar').classList.toggle('hidden');
    if (!$('#searchBar').classList.contains('hidden')) $('#searchInput').focus();
});
$('#searchClear').addEventListener('click', () => {
    $('#searchInput').value = '';
    searchQuery = '';
    filterDestinations();
    $('#searchBar').classList.add('hidden');
});
$('#searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    filterDestinations();
});

const voiceModal = $('#voiceModal');
let selectedVoiceLang = null;

$('#voiceTranslateBtn').addEventListener('click', () => voiceModal.classList.remove('hidden'));
$('#closeVoiceModal').addEventListener('click', () => voiceModal.classList.add('hidden'));

$$('.voice-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.voice-lang-btn').forEach(b => b.classList.remove('border-morocco-saffron', 'bg-morocco-terracotta/20'));
        btn.classList.add('border-morocco-saffron', 'bg-morocco-terracotta/20');
        selectedVoiceLang = btn.dataset.voiceLang;
        $('#startRecordingBtn').disabled = false;
    });
});

$('#startRecordingBtn').addEventListener('click', () => {
    $('#voiceLangStep').classList.add('hidden');
    $('#voiceRecordStep').classList.remove('hidden');
});

$('#stopRecordingBtn').addEventListener('click', () => {
    $('#voiceRecordStep').classList.add('hidden');
    $('#voiceLangStep').classList.remove('hidden');
    voiceModal.classList.add('hidden');
});

const cityModal = $('#cityDetailModal');

function openCityDetail(cityId) {
    const city = DESTINATIONS.find(d => d.id === cityId);
    if (!city) return;

    $('#cityModalHeroImg').src = city.img;
    $('#cityModalTitle').textContent = city.name;
    $('#cityModalRegion').textContent = city.region;
    $('#cityModalCategory').textContent = city.label;
    $('#cityModalDescription').textContent = city.text;
    $('#cityModalSeason').textContent = city.season;
    $('#cityModalWeather').textContent = city.weather;
    $('#cityModalDuration').textContent = city.duration;
    $('#cityModalBtnName').textContent = city.name;

    // Gallery
    $('#cityGalleryGrid').innerHTML = city.gallery.map(img => `
        <div class="h-48 rounded-2xl overflow-hidden"><img src="${img}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"></div>
    `).join('');

    // Landmarks
    $('#cityLandmarksList').innerHTML = city.landmarks.map(l => `
        <div class="glass-card p-4 rounded-xl flex items-center gap-3"><i class="fa-solid fa-location-dot text-morocco-saffron"></i> <span class="text-sm font-semibold">${l}</span></div>
    `).join('');

    cityModal.classList.remove('hidden');
}

grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-explore-id]');
    if (btn) openCityDetail(btn.dataset.exploreId);
});

$('#closeCityModal').addEventListener('click', () => cityModal.classList.add('hidden'));
$('#cityModalCloseBottom').addEventListener('click', () => cityModal.classList.add('hidden'));

// Modal Tabs
$$('.city-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.city-tab-btn').forEach(t => t.classList.remove('active', 'border-b-2', 'border-morocco-saffron', 'text-morocco-saffron'));
        tab.classList.add('active', 'border-b-2', 'border-morocco-saffron', 'text-morocco-saffron');
        
        const target = tab.dataset.cityTab;
        $$('.city-tab-content').forEach(c => c.classList.add('hidden'));
        if (target === 'overview') $('#cityTabOverview').classList.remove('hidden');
        if (target === 'gallery') $('#cityTabGallery').classList.remove('hidden');
        if (target === 'landmarks') $('#cityTabLandmarks').classList.remove('hidden');
    });
});

const planner = $('#planner');
$('[data-open-planner]').addEventListener('click', () => planner.classList.remove('hidden-planner'));
$('#plannerClose').addEventListener('click', () => planner.classList.add('hidden-planner'));

window.onload = function() {
    renderDestinations();
};