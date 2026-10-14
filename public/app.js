/**
 * MaghribAI — Moroccan Travel Platform
 * Authentic Moroccan Visual Identity, Destination Data, Interactive Questionnaire,
 * and Apertus AI Model Integration Placeholder.
 * 
 * NOTE FOR APERTUS AI INTEGRATION:
 * All local recommendation algorithms, scoring, and simulated itineraries have been
 * completely removed per project requirements. The questionnaire collects and preserves
 * visitor preferences, and renders a dedicated placeholder ready for Apertus AI integration.
 */

// =============================================================================
// 1. HERO SLIDESHOW: THE SAME AUTHENTIC PHOTOGRAPHS SHOWN IN THE DISCOVER SECTION
//    Originals live in assets/discover/ (untouched). The hero uses sharpened,
//    upscaled web versions of those exact photos from assets/hero/ so they stay
//    crisp at full-screen size. `fallback` is the untouched original.
//    pos / posMobile = focal point of the crop on landscape / portrait screens.
// =============================================================================
const HERO_SLIDES = [
    {
        key: 'marrakech-jemaa-elfna',
        fallback: 'assets/discover/marrakech-jemaa-elfna.png',
        alt: 'Marrakech — the Koutoubia minaret above Jemaa el-Fna square at sunset',
        title: 'Marrakech',
        subtitle: 'Jemaa el-Fna & the Koutoubia at Golden Hour',
        pos: '50% 38%',
        posMobile: '10% 50%'
    },
    {
        key: 'chefchaouen-mountain-panorama',
        fallback: 'assets/discover/chefchaouen-mountain-panorama.png',
        alt: 'Chefchaouen, the Blue City, spread across its mountainside at dusk',
        title: 'Chefchaouen',
        subtitle: 'The Blue Pearl of the Rif at Dusk',
        pos: '50% 55%',
        posMobile: '70% 50%'
    },
    {
        key: 'sahara-merzouga-caravan',
        fallback: 'assets/discover/sahara-merzouga-caravan.png',
        alt: 'Camel caravan crossing the golden Merzouga dunes in the Sahara',
        title: 'The Sahara Desert',
        subtitle: 'Merzouga Dunes & Camel Caravans',
        pos: '50% 62%',
        posMobile: '62% 50%'
    },
    {
        key: 'al-hoceima-bay-view',
        fallback: 'assets/discover/al-hoceima-bay-view.png',
        alt: 'Al Hoceima — rocky headland, harbour and turquoise Mediterranean sea',
        title: 'Al Hoceima',
        subtitle: 'Mediterranean Cliffs & Turquoise Bay',
        pos: '45% 50%',
        posMobile: '40% 50%'
    },
    {
        key: 'marrakech-riad-rooftops',
        fallback: 'assets/discover/marrakech-riad-rooftops.png',
        alt: 'Marrakech medina — rose-pink riad rooftops and a minaret above the souks',
        title: 'Marrakech Medina',
        subtitle: 'Rose-Pink Rooftops & Historic Souks',
        pos: '50% 68%',
        posMobile: '15% 50%'
    }
    // To add more photos later: export a larger original (≥ 1600px wide), place web versions in
    // assets/hero/<key>-1600.jpg and <key>-2560.jpg, then add an entry above.
];

// Fallback image in case of network issues
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=80';

// =============================================================================
// 1b. DISCOVER SECTION SLIDESHOW: USER-PROVIDED PHOTOGRAPHS OF MOROCCO
//     These are the exact images uploaded by the user to assets/discover/
// =============================================================================
const DISCOVER_SLIDES = [
    {
        src: 'assets/discover/marrakech-jemaa-elfna.png',
        caption: '📍 Marrakech — Jemaa el-Fna at Sunset'
    },
    {
        src: 'assets/discover/sahara-merzouga-caravan.png',
        caption: '📍 Sahara Desert — Merzouga Camel Caravan'
    },
    {
        src: 'assets/discover/chefchaouen-mountain-panorama.png',
        caption: '📍 Chefchaouen — Blue City at Dusk'
    },
    {
        src: 'assets/discover/chefchaouen-blue-patio.png',
        caption: '📍 Chefchaouen — Traditional Blue Patio'
    },
    {
        src: 'assets/discover/al-hoceima-bay-coast.png',
        caption: '📍 Al Hoceima — Mediterranean Bay'
    }
];

// Destination records are loaded from the SQLite-backed API.\nlet DESTINATIONS = [];

// Helper Selectors
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// =============================================================================
// 3. THEME TOGGLE: LIGHT MODE (GENUINELY WHITE) & COHERENT DARK MODE
// =============================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('maghrib_theme');
    
    // Default to Light Mode unless explicitly set to dark
    if (savedTheme === 'dark') {
        document.documentElement.classList.remove('theme-light');
        document.documentElement.classList.add('theme-dark');
    } else {
        document.documentElement.classList.remove('theme-dark');
        document.documentElement.classList.add('theme-light');
    }
    updateThemeIcon();
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('theme-dark');
    if (isDark) {
        document.documentElement.classList.remove('theme-dark');
        document.documentElement.classList.add('theme-light');
        localStorage.setItem('maghrib_theme', 'light');
    } else {
        document.documentElement.classList.remove('theme-light');
        document.documentElement.classList.add('theme-dark');
        localStorage.setItem('maghrib_theme', 'dark');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('theme-dark');
    const icons = $$('.theme-toggle-icon');
    icons.forEach(icon => {
        if (isDark) {
            icon.className = 'fa-solid fa-sun theme-toggle-icon text-[#C49A45] text-sm';
            icon.parentElement.setAttribute('title', 'Switch to Light Mode');
        } else {
            icon.className = 'fa-solid fa-moon theme-toggle-icon text-[#176B4D] text-sm';
            icon.parentElement.setAttribute('title', 'Switch to Dark Mode');
        }
    });
}

// =============================================================================
// 4. HERO SLIDESHOW: SHARP PHOTOGRAPHS & SMOOTH AUTOMATIC CROSSFADE
// =============================================================================
let currentHeroSlide = 0;
let heroSlideTimer = null;

function initHeroSlideshow() {
    const container = $('#heroSlideshow');
    const dotsContainer = $('#heroDots');
    if (!container) return;

    // Build Slide Elements: responsive sharp images (1600w / 2560w) + Moroccan overlay.
    // Portrait screens crop a narrow window, so `sizes` tells the browser to pick a larger file.
    container.innerHTML = HERO_SLIDES.map((slide, idx) => `
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-slide-index="${idx}"
             style="--pos: ${slide.pos}; --pos-m: ${slide.posMobile};">
            <img src="assets/hero/${slide.key}-1600.jpg"
                 srcset="assets/hero/${slide.key}-1600.jpg 1600w, assets/hero/${slide.key}-2560.jpg 2560w"
                 sizes="(orientation: portrait) 230vw, 100vw"
                 alt="${slide.alt}" class="w-full h-full object-cover"
                 decoding="async" ${idx === 0 ? 'fetchpriority="high"' : ''}
                 onerror="this.onerror=null; this.removeAttribute('srcset'); this.src='${slide.fallback}'">
            <div class="hero-overlay-layer"></div>
        </div>
    `).join('');

    // Build Pagination Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = `
            <span class="text-[11px] uppercase tracking-wider text-white/90 mr-2 font-bold drop-shadow">Gallery:</span>
            ${HERO_SLIDES.map((slide, idx) => `
                <button data-dot="${idx}" aria-label="Slide ${idx + 1}: ${slide.title}"
                        class="hero-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-[#C49A45] scale-125' : 'bg-white/40 hover:bg-white/80'}"
                        title="${slide.title} — ${slide.subtitle}"></button>
            `).join('')}
        `;

        $$('#heroDots .hero-dot').forEach(btn => {
            btn.addEventListener('click', () => {
                goToHeroSlide(Number(btn.dataset.dot));
                restartHeroInterval();
            });
        });
    }

    startHeroInterval();
}

function goToHeroSlide(index) {
    const slides = $$('.hero-slide');
    const dots = $$('#heroDots .hero-dot');
    if (!slides.length) return;

    currentHeroSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentHeroSlide);
    });

    dots.forEach((dot, idx) => {
        if (idx === currentHeroSlide) {
            dot.className = 'hero-dot w-2.5 h-2.5 rounded-full transition-all duration-300 bg-[#C49A45] scale-125';
        } else {
            dot.className = 'hero-dot w-2.5 h-2.5 rounded-full transition-all duration-300 bg-white/40 hover:bg-white/80';
        }
    });
}

function startHeroInterval() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    heroSlideTimer = setInterval(() => {
        goToHeroSlide(currentHeroSlide + 1);
    }, 5500);
}

function restartHeroInterval() {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    startHeroInterval();
}

// =============================================================================
// 4b. DISCOVER SECTION SLIDESHOW — USER-PROVIDED PHOTOGRAPHS
//     Crossfades between the 5 photos the user uploaded to assets/discover/
// =============================================================================
let currentDiscoverSlide = 0;
let discoverSlideTimer = null;

function initDiscoverSlideshow() {
    const panel = $('#discoverPhotoPanel');
    const dotsContainer = $('#discoverDots');
    const caption = $('#discoverCaption');
    if (!panel) return;

    // Build <img> slide elements and prepend them (overlays come after in DOM)
    const slidesFrag = document.createDocumentFragment();

    DISCOVER_SLIDES.forEach((slide, idx) => {
        const img = document.createElement('img');
        img.src = slide.src;
        img.alt = slide.caption.replace(/📍 /, '');
        img.className = 'discover-slide' + (idx === 0 ? ' active' : '');
        img.loading = idx === 0 ? 'eager' : 'lazy';
        img.onerror = function() {
            // On error, try the matching PNG fallback then hide
            this.onerror = null;
            this.style.opacity = '0';
        };
        slidesFrag.appendChild(img);
    });

    // Insert slides before the first child (overlays must stay on top)
    panel.insertBefore(slidesFrag, panel.firstChild);

    // Build dot navigation
    if (dotsContainer) {
        dotsContainer.innerHTML = DISCOVER_SLIDES.map((_, idx) => `
            <button class="discover-dot${idx === 0 ? ' active' : ''}"
                    data-ddot="${idx}"
                    role="tab"
                    aria-selected="${idx === 0}"
                    aria-label="Photo ${idx + 1}: ${DISCOVER_SLIDES[idx].caption.replace(/📍 /, '')}">
            </button>
        `).join('');

        $$('#discoverDots .discover-dot').forEach(btn => {
            btn.addEventListener('click', () => {
                goToDiscoverSlide(Number(btn.dataset.ddot));
                restartDiscoverInterval();
            });
        });
    }

    // Set initial caption
    updateDiscoverCaption();

    // Start auto-advance (respect reduced-motion preference)
    startDiscoverInterval();
}

function goToDiscoverSlide(index) {
    const slides = $$('#discoverPhotoPanel .discover-slide');
    const dots = $$('#discoverDots .discover-dot');
    if (!slides.length) return;

    currentDiscoverSlide = ((index % slides.length) + slides.length) % slides.length;

    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentDiscoverSlide);
    });

    dots.forEach((dot, idx) => {
        const isActive = idx === currentDiscoverSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive);
    });

    updateDiscoverCaption();
}

function updateDiscoverCaption() {
    const caption = $('#discoverCaption');
    if (!caption) return;
    const slide = DISCOVER_SLIDES[currentDiscoverSlide];
    // Remove emoji prefix for the displayed text, add a map pin icon via CSS ::before
    caption.textContent = slide.caption.replace(/^📍 /, '');
}

function startDiscoverInterval() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    discoverSlideTimer = setInterval(() => {
        goToDiscoverSlide(currentDiscoverSlide + 1);
    }, 4500);
}

function restartDiscoverInterval() {
    if (discoverSlideTimer) clearInterval(discoverSlideTimer);
    startDiscoverInterval();
}

// =============================================================================
let activeCategoryFilter = 'all';
let currentSearchQuery = '';

async function loadDestinations() {
    const response = await fetch('/api/destinations');
    if (!response.ok) throw new Error(`Destinations API returned ${response.status}`);

    const destinations = await response.json();
    if (!Array.isArray(destinations)) throw new Error('Destinations API returned invalid data');
    DESTINATIONS = destinations;
}

function renderDestinationsGrid() {
    const grid = $('#destinationsGrid');
    if (!grid) return;

    grid.innerHTML = DESTINATIONS.map(d => `
        <article class="dest-card surface-card group relative rounded-3xl overflow-hidden flex flex-col"
                 data-cats="${d.cats.join(' ')}"
                 data-city-id="${d.id}"
                 data-search="${(d.name + ' ' + d.nameFr + ' ' + d.region + ' ' + d.tags.join(' ')).toLowerCase()}">
            
            <!-- Card Thumbnail with Moroccan badge -->
            <div class="relative h-72 overflow-hidden cursor-pointer" onclick="openCityDetail('${d.id}')">
                <img src="${d.img}" alt="${d.name} — ${d.label}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${FALLBACK_IMG}'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div class="absolute top-4 left-4 flex items-center gap-2">
                    <span class="moroccan-badge text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <span>${d.emoji}</span>
                        <span>${d.label}</span>
                    </span>
                </div>
                <div class="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                    <div>
                        <span class="text-[10px] uppercase font-bold tracking-widest text-[#E2C485]">${d.region}</span>
                        <h3 class="font-heading text-2xl font-bold text-white group-hover:text-[#E2C485] transition-colors">${d.name}</h3>
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white/95 border border-white/15">
                        <i class="fa-regular fa-clock text-[#E2C485] mr-1"></i>${d.duration}
                    </span>
                </div>
            </div>

            <!-- Card Body Content -->
            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <p class="text-sm opacity-85 leading-relaxed mb-5 line-clamp-2">${d.shortDesc}</p>
                    
                    <!-- Quick tags -->
                    <div class="flex flex-wrap gap-1.5 mb-6">
                        ${d.tags.slice(0, 3).map(t => `
                            <span class="text-[11px] px-2.5 py-0.5 rounded-md surface-inset font-medium">#${t}</span>
                        `).join('')}
                    </div>
                </div>

                <!-- Explore Action Button -->
                <div class="pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-3">
                    <button onclick="openCityDetail('${d.id}')"
                            class="flex-1 py-3 px-4 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group/btn">
                        <span>Explore ${d.name}</span>
                        <i class="fa-solid fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                    </button>
                    <button onclick="planTripForCity('${d.id}')"
                            title="Plan a trip directly to ${d.name}"
                            class="p-3 rounded-xl border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white transition-all text-xs">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    filterDestinations();
}

function filterDestinations() {
    let visibleCount = 0;
    const cards = $$('.dest-card');
    const query = currentSearchQuery.trim().toLowerCase();

    cards.forEach(card => {
        const cats = card.dataset.cats || '';
        const searchData = card.dataset.search || '';

        const matchesCat = activeCategoryFilter === 'all' || cats.includes(activeCategoryFilter);
        const matchesSearch = !query || searchData.includes(query);

        const isVisible = matchesCat && matchesSearch;
        card.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) visibleCount++;
    });

    const emptyMsg = $('#emptyMsg');
    if (emptyMsg) {
        emptyMsg.classList.toggle('hidden', visibleCount > 0);
        if (visibleCount === 0) {
            emptyMsg.innerHTML = `
                <div class="max-w-md mx-auto py-12 text-center surface-card rounded-3xl p-8">
                    <div class="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center mx-auto mb-4 text-[var(--accent-primary)] text-2xl">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h3 class="font-heading text-xl font-bold mb-2">No Moroccan destinations found</h3>
                    <p class="text-sm opacity-75 mb-5">We couldn't find any results for "<strong>${escapeHtml(query)}</strong>".</p>
                    <div class="flex flex-wrap justify-center gap-2">
                        <span class="text-xs opacity-60 mr-1 py-1">Try:</span>
                        <button onclick="setSearchPill('Marrakech')" class="text-xs px-3 py-1 rounded-full surface-inset hover:border-[var(--accent-gold)]">Marrakech</button>
                        <button onclick="setSearchPill('Sahara')" class="text-xs px-3 py-1 rounded-full surface-inset hover:border-[var(--accent-gold)]">Sahara Desert</button>
                        <button onclick="setSearchPill('Beach')" class="text-xs px-3 py-1 rounded-full surface-inset hover:border-[var(--accent-gold)]">Beach & Coast</button>
                        <button onclick="setSearchPill('Chefchaouen')" class="text-xs px-3 py-1 rounded-full surface-inset hover:border-[var(--accent-gold)]">Chefchaouen</button>
                        <button onclick="setSearchPill('Fes')" class="text-xs px-3 py-1 rounded-full surface-inset hover:border-[var(--accent-gold)]">Fès</button>
                    </div>
                </div>
            `;
        }
    }
}

function setSearchPill(keyword) {
    const input = $('#searchInput');
    if (input) {
        input.value = keyword;
        currentSearchQuery = keyword;
        filterDestinations();
        $('#searchBar')?.classList.remove('hidden');
    }
}

// =============================================================================
// 6. FUNCTIONAL SEARCH WITH AUTOCOMPLETE & DIRECT NAVIGATION
// =============================================================================
function initSearch() {
    const toggleBtn = $('#searchToggle');
    const searchBar = $('#searchBar');
    const input = $('#searchInput');
    const clearBtn = $('#searchClear');
    const suggestionsPanel = $('#searchSuggestions');

    if (!toggleBtn || !searchBar || !input) return;

    toggleBtn.addEventListener('click', () => {
        const isClosed = searchBar.classList.contains('hidden');
        searchBar.classList.toggle('hidden');
        if (isClosed) {
            input.focus();
            renderSearchSuggestions(input.value);
        } else {
            if (suggestionsPanel) suggestionsPanel.classList.add('hidden');
        }
    });

    clearBtn?.addEventListener('click', () => {
        input.value = '';
        currentSearchQuery = '';
        filterDestinations();
        if (suggestionsPanel) suggestionsPanel.classList.add('hidden');
        input.focus();
    });

    input.addEventListener('input', (e) => {
        const q = e.target.value;
        currentSearchQuery = q;
        filterDestinations();
        renderSearchSuggestions(q);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (suggestionsPanel) suggestionsPanel.classList.add('hidden');
            $('#discover')?.scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'Escape') {
            searchBar.classList.add('hidden');
            if (suggestionsPanel) suggestionsPanel.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchBar') && !e.target.closest('#searchToggle')) {
            if (suggestionsPanel) suggestionsPanel.classList.add('hidden');
        }
    });
}

function renderSearchSuggestions(query) {
    const panel = $('#searchSuggestions');
    if (!panel) return;

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
        panel.innerHTML = `
            <div class="p-3 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)] border-b border-[var(--border-color)]">
                Popular Moroccan Searches
            </div>
            <div class="p-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button onclick="selectSuggestion('Marrakech')" class="text-left px-3 py-2 rounded-xl surface-inset text-xs flex items-center gap-2 hover:border-[var(--accent-gold)]">
                    <span>🕌</span> <span>Marrakech</span>
                </button>
                <button onclick="selectSuggestion('Merzouga')" class="text-left px-3 py-2 rounded-xl surface-inset text-xs flex items-center gap-2 hover:border-[var(--accent-gold)]">
                    <span>🏜</span> <span>Sahara Desert</span>
                </button>
                <button onclick="selectSuggestion('Chefchaouen')" class="text-left px-3 py-2 rounded-xl surface-inset text-xs flex items-center gap-2 hover:border-[var(--accent-gold)]">
                    <span>💙</span> <span>Chefchaouen</span>
                </button>
                <button onclick="selectSuggestion('Essaouira')" class="text-left px-3 py-2 rounded-xl surface-inset text-xs flex items-center gap-2 hover:border-[var(--accent-gold)]">
                    <span>🌊</span> <span>Essaouira Coast</span>
                </button>
                <button onclick="selectSuggestion('Fes')" class="text-left px-3 py-2 rounded-xl surface-inset text-xs flex items-center gap-2 hover:border-[var(--accent-gold)]">
                    <span>🏛</span> <span>Fès Medina</span>
                </button>
                <button onclick="selectSuggestion('High Atlas')" class="text-left px-3 py-2 rounded-xl surface-inset text-xs flex items-center gap-2 hover:border-[var(--accent-gold)]">
                    <span>🏔</span> <span>Atlas Hiking</span>
                </button>
            </div>
        `;
        panel.classList.remove('hidden');
        return;
    }

    const matches = DESTINATIONS.filter(d => {
        const fullString = (d.name + ' ' + d.nameFr + ' ' + d.region + ' ' + d.tags.join(' ') + ' ' + d.landmarks.map(l => l.name).join(' ')).toLowerCase();
        return fullString.includes(trimmed);
    });

    if (matches.length === 0) {
        panel.innerHTML = `
            <div class="p-4 text-center text-xs opacity-75">
                No matching Moroccan destinations. Try "Desert", "Beach", "Marrakech", or "Fes".
            </div>
        `;
        panel.classList.remove('hidden');
        return;
    }

    panel.innerHTML = `
        <div class="p-2.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)] border-b border-[var(--border-color)] flex justify-between">
            <span>Matching Destinations (${matches.length})</span>
            <span class="text-[10px] opacity-60">Click to explore</span>
        </div>
        <div class="divide-y divide-[var(--border-color)]">
            ${matches.map(m => `
                <div onclick="selectSearchDestination('${m.id}')"
                     class="search-item p-3 flex items-center gap-3.5 cursor-pointer">
                    <img src="${m.img}" alt="${m.name}" class="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]" onerror="this.onerror=null; this.src='${FALLBACK_IMG}'">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="font-heading font-bold text-sm truncate">${m.name}</span>
                            <span class="text-xs text-[var(--accent-gold)]">${m.nameAr}</span>
                            <span class="text-[10px] px-2 py-0.5 rounded-full surface-inset">${m.label}</span>
                        </div>
                        <p class="text-[11px] opacity-65 truncate mt-0.5">${m.region} · ${m.shortDesc}</p>
                    </div>
                    <i class="fa-solid fa-arrow-right text-xs text-[var(--accent-gold)] opacity-70"></i>
                </div>
            `).join('')}
        </div>
    `;
    panel.classList.remove('hidden');
}

function selectSuggestion(keyword) {
    const input = $('#searchInput');
    if (input) {
        input.value = keyword;
        currentSearchQuery = keyword;
        filterDestinations();
        $('#searchSuggestions')?.classList.add('hidden');
        $('#discover')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function selectSearchDestination(cityId) {
    $('#searchSuggestions')?.classList.add('hidden');
    $('#searchBar')?.classList.add('hidden');
    openCityDetail(cityId);
}

// =============================================================================
// 7. DETAILED CITY EXPLORATION PAGES & LIGHTBOX
// =============================================================================
let currentOpenCity = null;

function openCityDetail(cityId) {
    const city = DESTINATIONS.find(d => d.id === cityId);
    if (!city) return;

    currentOpenCity = city;
    const modal = $('#cityDetailModal');
    if (!modal) return;

    // Header Content
    $('#cityModalHeroImg').src = city.img;
    $('#cityModalHeroImg').onerror = function() { this.src = FALLBACK_IMG; };
    $('#cityModalTitle').textContent = city.name;
    $('#cityModalArabic').textContent = city.nameAr;
    $('#cityModalRegion').textContent = city.region;
    $('#cityModalCategory').textContent = city.label;
    $('#cityModalBtnName').textContent = city.name;

    // Overview Tab
    $('#cityModalOverviewText').innerHTML = `
        <h4 class="font-heading text-xl font-bold mb-3 text-[var(--accent-primary)]">Why Visit ${city.name}</h4>
        <p class="text-sm md:text-base opacity-85 leading-relaxed mb-6">${city.overview}</p>
        
        <h4 class="font-heading text-lg font-bold text-[var(--accent-burgundy)] mb-2">Cultural Identity & Atmosphere</h4>
        <p class="text-sm opacity-80 leading-relaxed">${city.culture}</p>
    `;
    $('#cityModalSeason').textContent = city.season;
    $('#cityModalWeather').textContent = city.weather;
    $('#cityModalDuration').textContent = city.duration;
    $('#cityModalBudget').textContent = city.budgetEst;

    // Gallery Tab (at least 6 photos)
    const galleryGrid = $('#cityGalleryGrid');
    if (galleryGrid) {
        galleryGrid.innerHTML = city.gallery.map((item, index) => `
            <div class="group relative h-52 rounded-2xl overflow-hidden cursor-pointer shadow-md border border-[var(--border-color)]"
                 onclick="openLightbox('${city.id}', ${index})">
                <img src="${item.url}" alt="${item.caption}"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${FALLBACK_IMG}'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p class="text-xs text-white font-medium flex items-center gap-1.5">
                        <i class="fa-solid fa-expand text-[var(--accent-gold)] text-[10px]"></i>
                        <span>${item.caption}</span>
                    </p>
                </div>
            </div>
        `).join('');
    }

    // Landmarks Tab
    const landmarksList = $('#cityLandmarksList');
    if (landmarksList) {
        landmarksList.innerHTML = city.landmarks.map((lm, index) => `
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lm.name} ${city.name}`)}"
               target="_blank" rel="noopener noreferrer"
               aria-label="Find ${lm.name} in ${city.name} on Google Maps"
               class="surface-card rounded-2xl overflow-hidden block group hover:-translate-y-1 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]">
                <img src="${lm.img || city.gallery[index % city.gallery.length]?.url || city.img}"
                     alt="${lm.name}" class="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform"
                     loading="lazy" onerror="this.src='${city.img}'">
                <div class="p-5 flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] text-base shrink-0">
                        <i class="fa-solid ${lm.icon}"></i>
                    </div>
                    <div>
                        <h5 class="font-bold text-sm mb-1">${lm.name}</h5>
                        <p class="text-xs opacity-75 leading-relaxed">${lm.desc}</p>
                        <span class="inline-flex items-center gap-2 mt-4 text-xs font-bold text-[var(--accent-primary)]">
                            <i class="fa-solid fa-map-location-dot"></i> Find in ${city.name}
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        </span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    // Food Tab
    const foodList = $('#cityFoodList');
    if (foodList) {
        foodList.innerHTML = city.food.map(f => `
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.name} ${city.name}`)}"
               target="_blank" rel="noopener noreferrer"
               aria-label="Find ${f.name} in ${city.name} on Google Maps"
               class="surface-card rounded-2xl overflow-hidden block group hover:-translate-y-1 transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]">
                ${f.img ? `<img src="${f.img}" alt="${f.name}"
                class="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform" loading="lazy"
                onerror="this.remove()">` : ''}
                <div class="p-5">
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="text-[var(--accent-gold)] font-bold text-sm">🍲 ${f.name}</span>
                    </div>
                    <p class="text-xs opacity-80 leading-relaxed">${f.desc}</p>
                    <span class="inline-flex items-center gap-2 mt-4 text-xs font-bold text-[var(--accent-primary)]">
                        <i class="fa-solid fa-map-location-dot"></i> Find it in ${city.name}
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </span>
                </div>
            </a>
        `).join('');
    }

    // Practical Tips Tab
    const tipsList = $('#cityTipsList');
    if (tipsList) {
        tipsList.innerHTML = city.tips.map(tip => `
            <li class="flex items-start gap-2.5 text-xs opacity-85 leading-relaxed">
                <i class="fa-solid fa-check text-[var(--accent-primary)] mt-0.5 shrink-0"></i>
                <span>${tip}</span>
            </li>
        `).join('');
    }

    switchCityTab('overview');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCityDetail() {
    const modal = $('#cityDetailModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function switchCityTab(tabName) {
    $$('.city-tab-btn').forEach(btn => {
        const isTarget = btn.dataset.cityTab === tabName;
        btn.classList.toggle('active', isTarget);
        btn.classList.toggle('border-b-2', isTarget);
        btn.classList.toggle('border-[var(--accent-primary)]', isTarget);
        btn.classList.toggle('text-[var(--accent-primary)]', isTarget);
        btn.classList.toggle('opacity-70', !isTarget);
    });

    $$('.city-tab-content').forEach(c => c.classList.add('hidden'));
    const targetContent = $(`#cityTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (targetContent) targetContent.classList.remove('hidden');
}

function planTripForCity(cityId) {
    closeCityDetail();
    openTripPlanner({ startCity: cityId });
}

// Lightbox Controls
let currentLightboxCity = null;
let currentLightboxIndex = 0;

function openLightbox(cityId, imageIndex) {
    const city = DESTINATIONS.find(d => d.id === cityId);
    if (!city || !city.gallery[imageIndex]) return;

    currentLightboxCity = city;
    currentLightboxIndex = imageIndex;

    const modal = $('#lightboxModal');
    if (!modal) return;

    updateLightboxContent();
    modal.classList.remove('hidden-lightbox');
}

function updateLightboxContent() {
    if (!currentLightboxCity) return;
    const item = currentLightboxCity.gallery[currentLightboxIndex];
    if (!item) return;

    const img = $('#lightboxImg');
    const caption = $('#lightboxCaption');
    const count = $('#lightboxCounter');

    if (img) {
        img.src = item.url;
        img.onerror = function() { this.src = FALLBACK_IMG; };
    }
    if (caption) caption.textContent = `${currentLightboxCity.name} — ${item.caption}`;
    if (count) count.textContent = `${currentLightboxIndex + 1} / ${currentLightboxCity.gallery.length}`;
}

function nextLightboxImage() {
    if (!currentLightboxCity) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxCity.gallery.length;
    updateLightboxContent();
}

function prevLightboxImage() {
    if (!currentLightboxCity) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxCity.gallery.length) % currentLightboxCity.gallery.length;
    updateLightboxContent();
}

function closeLightbox() {
    $('#lightboxModal')?.classList.add('hidden-lightbox');
}

// =============================================================================
// 8. TRIP PLANNER QUESTIONNAIRE & SUBMISSION PREFERENCES STORE
// =============================================================================
const PLANNER_QUESTIONS = [
    {
        id: 'experience',
        title: 'What kind of experience are you looking for?',
        subtitle: 'Select one or more experiences that inspire your journey in Morocco.',
        type: 'multi',
        options: [
            { id: 'mountains', label: 'Mountains & Hiking', emoji: '🏔' },
            { id: 'beach', label: 'Beaches & The Sea', emoji: '🏖' },
            { id: 'desert', label: 'Sahara Desert & Dunes', emoji: '🏜' },
            { id: 'culture', label: 'Culture, History & Monuments', emoji: '🏛' },
            { id: 'food', label: 'Traditional Moroccan Food', emoji: '🍲' },
            { id: 'adventure', label: 'Adventure & Outdoor Activities', emoji: '🧗' },
            { id: 'relaxation', label: 'Relaxation & Wellness / Hammam', emoji: '🧖' },
            { id: 'shopping', label: 'Shopping & Traditional Souks', emoji: '🛍' },
            { id: 'nature', label: 'Nature & Wildlife', emoji: '🌿' },
            { id: 'mix', label: 'A Mix of Different Experiences', emoji: '✨' }
        ]
    },
    {
        id: 'budget',
        title: 'What is your approximate total budget?',
        subtitle: 'Estimates are calculated per person for the duration of your stay.',
        type: 'single',
        hasCurrencySelector: true,
        options: [
            { id: 'low', label: 'Low Budget', sub: 'Backpacker / Hostels & Street Eats', emoji: '🎒' },
            { id: 'moderate', label: 'Moderate Budget', sub: 'Charming Riads & Local Dining', emoji: '🌿' },
            { id: 'comfortable', label: 'Comfortable Budget', sub: 'Boutique Riads & Guided Tours', emoji: '✨' },
            { id: 'luxury', label: 'Luxury Travel', sub: '5-Star Palaces & Private Chauffeur', emoji: '👑' }
        ]
    },
    {
        id: 'duration',
        title: 'How long will you stay?',
        subtitle: 'Choose your ideal Moroccan travel timeframe.',
        type: 'single',
        options: [
            { id: '1-2', label: '1–2 Days', sub: 'Weekend Getaway or City Break', emoji: '⚡' },
            { id: '3-4', label: '3–4 Days', sub: 'Essential Highlights Discovery', emoji: '🗓' },
            { id: '5-7', label: '5–7 Days', sub: 'Comprehensive Regional Experience', emoji: '🧭' },
            { id: '8+', label: 'More than a Week', sub: 'The Grand Circuit & Deep Immersion', emoji: '🗺' }
        ]
    },
    {
        id: 'companions',
        title: 'Who are you travelling with?',
        subtitle: 'Tailors the pace, accommodation, and recommended activities.',
        type: 'single',
        options: [
            { id: 'alone', label: 'Alone', sub: 'Solo Exploration & Freedom', emoji: '🚶' },
            { id: 'partner', label: 'With a Partner', sub: 'Romantic Getaways & Intimacy', emoji: '💑' },
            { id: 'friends', label: 'With Friends', sub: 'Fun, Adventure & Social Vibes', emoji: '👥' },
            { id: 'family', label: 'With Family', sub: 'Child-friendly & Relaxed Rhythm', emoji: '👨‍👩‍👧‍👦' },
            { id: 'group', label: 'In a Group', sub: 'Shared Activities & Group Dining', emoji: '🚌' }
        ]
    },
    {
        id: 'atmosphere',
        title: 'What is your preferred atmosphere?',
        subtitle: 'Every Moroccan region carries its own unique rhythm.',
        type: 'single',
        options: [
            { id: 'quiet', label: 'Quiet and Relaxing', sub: 'Peaceful riad courtyards & sound of water', emoji: '🕊' },
            { id: 'lively', label: 'Lively and Social', sub: 'Buzzing souks, music & night squares', emoji: '🎶' },
            { id: 'traditional', label: 'Cultural and Traditional', sub: 'Living history, crafts & architecture', emoji: '🕌' },
            { id: 'adventurous', label: 'Adventurous', sub: 'Dune trekking, surf & rugged valleys', emoji: '🧗' },
            { id: 'romantic', label: 'Romantic', sub: 'Candlelight dinners, sunsets & riads', emoji: '🌹' },
            { id: 'combo', label: 'A Balanced Combination', sub: 'Best of both serenity and excitement', emoji: '🌟' }
        ]
    },
    {
        id: 'season',
        title: 'When are you planning to visit? (Optional)',
        subtitle: 'Morocco is fantastic in every season with contrasting microclimates.',
        type: 'single',
        optional: true,
        options: [
            { id: 'spring', label: 'Spring (Mar – May)', sub: 'Blooming almond valleys & mild sun', emoji: '🌸' },
            { id: 'summer', label: 'Summer (Jun – Aug)', sub: 'Atlantic coastal breezes & vibrant festivals', emoji: '☀️' },
            { id: 'autumn', label: 'Autumn (Sep – Nov)', sub: 'Warm days & cool desert nights', emoji: '🍂' },
            { id: 'winter', label: 'Winter (Dec – Feb)', sub: 'Snowy Atlas peaks & mild southern sun', emoji: '❄️' },
            { id: 'flexible', label: 'Flexible / Not Decided Yet', sub: 'Open to the best timing', emoji: '🗓' }
        ]
    },
    {
        id: 'transport',
        title: 'How will you travel?',
        subtitle: 'Select your preferred mode of transportation within Morocco.',
        type: 'single',
        options: [
            { id: 'public', label: 'Public Transport', sub: 'Al Boraq High-Speed Train & CTM Coaches', emoji: '🚆' },
            { id: 'rental', label: 'Rental Car', sub: 'Self-drive freedom along scenic routes', emoji: '🚗' },
            { id: 'private', label: 'Private Transport', sub: 'Chauffeur, private minivan, or guided tour', emoji: '🚐' },
            { id: 'undecided', label: 'Not Decided Yet', sub: 'Recommend the best option for my route', emoji: '❓' }
        ]
    },
    {
        id: 'startCity',
        title: 'Where will you start your trip? (Optional)',
        subtitle: 'Select your gateway city or airport of arrival.',
        type: 'single',
        optional: true,
        options: [
            { id: 'marrakech', label: 'Marrakech (RAK)', sub: 'Menara International Airport', emoji: '🕌' },
            { id: 'casablanca', label: 'Casablanca (CMN)', sub: 'Mohammed V International Airport', emoji: '✈️' },
            { id: 'tangier', label: 'Tangier (TNG)', sub: 'Ibn Battouta Airport or Ferry', emoji: '⚓' },
            { id: 'fes', label: 'Fès (FEZ)', sub: 'Saïss International Airport', emoji: '🏛' },
            { id: 'agadir', label: 'Agadir (AGA)', sub: 'Al Massira Airport', emoji: '🏄' },
            { id: 'rabat', label: 'Rabat (RBA)', sub: 'Rabat–Salé Airport', emoji: '🏛' },
            { id: 'anywhere', label: 'Open / Any Airport', sub: 'Recommend best flight gateway', emoji: '🌍' }
        ]
    },
    {
        id: 'notes',
        title: 'Any additional preferences?',
        subtitle: 'Tell us about dietary needs, accessibility, photography interests, or dream activities.',
        type: 'text',
        optional: true
    }
];

// Clean data model preserving submitted visitor preferences
let userTripPreferences = {
    experience: [],
    budget: 'moderate',
    budgetCurrency: 'USD',
    budgetAmount: '',
    duration: '3-4',
    companions: 'partner',
    atmosphere: 'romantic',
    season: 'spring',
    transport: 'public',
    startCity: 'marrakech',
    notes: '',
    submittedAt: null
};

let currentPlannerStep = 0;

function openTripPlanner(prefill = {}) {
    const planner = $('#planner');
    if (!planner) return;

    if (prefill.startCity) {
        userTripPreferences.startCity = prefill.startCity;
    }

    currentPlannerStep = 0;
    renderPlannerProgress();
    renderPlannerStep();

    planner.classList.remove('hidden-planner');
    $('#plannerResult')?.classList.add('hidden');
    $('#plannerQuestionView')?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTripPlanner() {
    $('#planner')?.classList.add('hidden-planner');
    document.body.style.overflow = '';
}

function renderPlannerProgress() {
    const container = $('#progress');
    if (!container) return;

    const total = PLANNER_QUESTIONS.length;
    container.innerHTML = PLANNER_QUESTIONS.map((q, idx) => `
        <div class="flex items-center ${idx < total - 1 ? 'flex-1' : ''}">
            <div class="pdot ${idx === currentPlannerStep ? 'active' : ''} ${idx < currentPlannerStep ? 'done' : ''}" title="Step ${idx + 1}: ${q.title}"></div>
            ${idx < total - 1 ? `<div class="pline ${idx < currentPlannerStep ? 'done' : ''}"><i></i></div>` : ''}
        </div>
    `).join('');
}

function renderPlannerStep() {
    const stepBody = $('#stepBody');
    if (!stepBody) return;

    const q = PLANNER_QUESTIONS[currentPlannerStep];
    const total = PLANNER_QUESTIONS.length;
    const cur = currentPlannerStep;

    const btnBack = $('#btnBack');
    const btnSkip = $('#btnSkip');
    const btnNext = $('#btnNext');

    if (btnBack) btnBack.style.visibility = cur === 0 ? 'hidden' : 'visible';
    if (btnSkip) btnSkip.style.display = q.optional ? 'inline-block' : 'none';
    if (btnNext) btnNext.textContent = cur === total - 1 ? '✨ Submit Preferences' : 'Continue →';

    let contentHtml = `
        <div class="max-w-2xl mx-auto text-center mb-8">
            <span class="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] mb-2 inline-block">
                Question ${cur + 1} of ${total}
            </span>
            <h3 class="font-heading text-2xl md:text-3xl font-extrabold mb-2 text-[var(--text-main)]">${q.title}</h3>
            <p class="text-sm opacity-75">${q.subtitle}</p>
        </div>
    `;

    if (q.type === 'single' || q.type === 'multi') {
        const isMulti = q.type === 'multi';
        const currentVal = userTripPreferences[q.id];

        contentHtml += `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
                ${q.options.map(opt => {
                    const isSelected = isMulti 
                        ? (Array.isArray(currentVal) && currentVal.includes(opt.id))
                        : currentVal === opt.id;
                    return `
                        <div class="opt-card ${isSelected ? 'sel' : ''}" onclick="selectPlannerOption('${q.id}', '${opt.id}', ${isMulti})">
                            <div class="tick"><i class="fa-solid fa-check"></i></div>
                            <div class="text-3xl mb-2">${opt.emoji}</div>
                            <h4 class="font-bold text-sm mb-1">${opt.label}</h4>
                            ${opt.sub ? `<p class="text-[11px] opacity-70 leading-tight">${opt.sub}</p>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        if (q.hasCurrencySelector) {
            contentHtml += `
                <div class="max-w-2xl mx-auto mt-6 p-4 rounded-2xl surface-card flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="text-left">
                        <label class="block text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider mb-1">Currency & Custom Budget (Optional)</label>
                        <p class="text-[11px] opacity-70">Specify your total expected budget if desired:</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <select id="budgetCurrencySelect" onchange="userTripPreferences.budgetCurrency = this.value"
                                class="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[var(--accent-gold)]">
                            <option value="USD" ${userTripPreferences.budgetCurrency === 'USD' ? 'selected' : ''}>USD ($)</option>
                            <option value="EUR" ${userTripPreferences.budgetCurrency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                            <option value="MAD" ${userTripPreferences.budgetCurrency === 'MAD' ? 'selected' : ''}>MAD (د.م)</option>
                            <option value="GBP" ${userTripPreferences.budgetCurrency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                        </select>
                        <input type="number" id="budgetAmountInput" placeholder="e.g. 1000"
                               value="${escapeHtml(userTripPreferences.budgetAmount)}"
                               oninput="userTripPreferences.budgetAmount = this.value"
                               class="w-28 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]">
                    </div>
                </div>
            `;
        }
    } else if (q.type === 'text') {
        contentHtml += `
            <div class="max-w-2xl mx-auto">
                <textarea id="plannerNotesInput" rows="5"
                          placeholder="e.g. We love traditional pottery and tagine cooking. Prefer quiet boutique riads. Interested in photography..."
                          oninput="userTripPreferences.notes = this.value"
                          class="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-4 text-sm focus:outline-none focus:border-[var(--accent-primary)] resize-none">${escapeHtml(userTripPreferences.notes)}</textarea>
                <p class="text-[11px] opacity-60 mt-2 text-right">Optional: leave blank or add special interests.</p>
            </div>
        `;
    }

    stepBody.innerHTML = contentHtml;
    renderPlannerProgress();
}

function selectPlannerOption(qId, optId, isMulti) {
    if (isMulti) {
        if (!Array.isArray(userTripPreferences[qId])) {
            userTripPreferences[qId] = [];
        }
        const arr = userTripPreferences[qId];
        const idx = arr.indexOf(optId);
        if (idx > -1) {
            arr.splice(idx, 1);
        } else {
            arr.push(optId);
        }
    } else {
        userTripPreferences[qId] = optId;
    }
    renderPlannerStep();
}

function handlePlannerNext() {
    const total = PLANNER_QUESTIONS.length;
    if (currentPlannerStep < total - 1) {
        currentPlannerStep++;
        renderPlannerStep();
    } else {
        // Record timestamp and navigate to Apertus AI Integration Placeholder
        userTripPreferences.submittedAt = new Date().toISOString();
        showApertusPlaceholder(userTripPreferences);
    }
}

function handlePlannerBack() {
    if (currentPlannerStep > 0) {
        currentPlannerStep--;
        renderPlannerStep();
    }
}

function handlePlannerSkip() {
    handlePlannerNext();
}

// =============================================================================
// 9. APERTUS AI MODEL INTEGRATION POINT & PLACEHOLDER VIEW
// =============================================================================
/**
 * -----------------------------------------------------------------------------
 * DEVELOPER INTEGRATION POINT (FOR TEAMMATE):
 * -----------------------------------------------------------------------------
 * This service object is where the Apertus AI model should be connected.
 * Do not rebuild the trip questionnaire or visual layout — hook your backend
 * client into `ApertusAIService.generateItinerary(preferences)` below.
 */
const ApertusAIService = {
    /**
     * Future integration function for teammate to connect Apertus AI model.
     * @param {Object} preferences - Sanitized visitor trip preferences
     * @returns {Promise<Object|null>} Model-generated itinerary payload
     */
    async generateItinerary(preferences) {
        // [APERTUS INTEGRATION POINT]:
        // Connect Apertus AI model API here when ready.
        // Example:
        // const response = await fetch('/api/apertus/itinerary', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(preferences)
        // });
        // return await response.json();
        return null;
    }
};

/**
 * Displays the clean, dedicated recommendation results placeholder.
 * Does NOT run any local recommendation algorithms or fake itineraries.
 */
function showApertusPlaceholder(preferences) {
    $('#plannerQuestionView')?.classList.add('hidden');
    const resultView = $('#plannerResult');
    if (!resultView) return;

    // Format human-readable summary badges of visitor's preferences
    const experiencesText = (preferences.experience && preferences.experience.length > 0)
        ? preferences.experience.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ')
        : 'General Exploration';
    const durationText = preferences.duration === '8+' ? '8+ Days' : `${preferences.duration} Days`;
    const budgetText = preferences.budget ? preferences.budget.charAt(0).toUpperCase() + preferences.budget.slice(1) : 'Moderate';
    const atmosphereText = preferences.atmosphere ? preferences.atmosphere.charAt(0).toUpperCase() + preferences.atmosphere.slice(1) : 'Balanced';
    const companionsText = preferences.companions ? preferences.companions.charAt(0).toUpperCase() + preferences.companions.slice(1) : 'Traveling';
    const startCityText = preferences.startCity ? preferences.startCity.charAt(0).toUpperCase() + preferences.startCity.slice(1) : 'Morocco Gateway';

    resultView.innerHTML = `
        <div class="max-w-4xl mx-auto py-2">
            
            <!-- Moroccan Ornamental Header Banner -->
            <div class="surface-card rounded-3xl p-6 md:p-10 mb-8 border border-[var(--accent-gold)] relative overflow-hidden">
                <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-gold)] to-[var(--accent-burgundy)]"></div>
                
                <div class="text-center max-w-2xl mx-auto">
                    <div class="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center mx-auto mb-4 text-2xl text-[var(--accent-primary)]">
                        <i class="fa-solid fa-compass"></i>
                    </div>
                    
                    <span class="text-xs uppercase font-bold tracking-widest text-[var(--accent-gold)] mb-2 inline-block">
                        🇲🇦 Apertus AI Integration Placeholder
                    </span>
                    <h2 class="font-heading text-3xl md:text-5xl font-extrabold mb-3 text-[var(--text-main)]">
                        Your Moroccan Journey
                    </h2>
                    <p class="text-sm md:text-base opacity-85 leading-relaxed mb-6">
                        Your personalized travel itinerary will appear here once the <strong>Apertus AI model</strong> is connected. Your trip preferences have been cleanly collected and stored below, ready for model processing.
                    </p>

                    <!-- Back to Questionnaire Action -->
                    <button onclick="returnToQuestionnaire()" 
                            class="px-6 py-3 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold text-xs transition-all shadow-md inline-flex items-center gap-2">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Return to Questionnaire & Edit Preferences</span>
                    </button>
                </div>
            </div>

            <!-- Preserved Preferences Summary Card -->
            <div class="surface-card rounded-2xl p-6 mb-8 border border-[var(--border-color)]">
                <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 class="font-heading text-base font-bold text-[var(--accent-primary)]">
                        Saved Travel Preferences Payload
                    </h3>
                    <span class="text-[11px] opacity-60 font-mono">
                        Status: Ready for Apertus
                    </span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
                    <div class="surface-inset p-3 rounded-xl">
                        <span class="text-[10px] font-bold opacity-60 uppercase block">Duration</span>
                        <span class="text-xs font-extrabold text-[var(--accent-primary)] mt-1 block">${durationText}</span>
                    </div>
                    <div class="surface-inset p-3 rounded-xl">
                        <span class="text-[10px] font-bold opacity-60 uppercase block">Atmosphere</span>
                        <span class="text-xs font-extrabold text-[var(--accent-primary)] mt-1 block">${atmosphereText}</span>
                    </div>
                    <div class="surface-inset p-3 rounded-xl">
                        <span class="text-[10px] font-bold opacity-60 uppercase block">Companions</span>
                        <span class="text-xs font-extrabold text-[var(--accent-primary)] mt-1 block">${companionsText}</span>
                    </div>
                    <div class="surface-inset p-3 rounded-xl">
                        <span class="text-[10px] font-bold opacity-60 uppercase block">Budget Tier</span>
                        <span class="text-xs font-extrabold text-[var(--accent-primary)] mt-1 block">${budgetText} (${preferences.budgetCurrency})</span>
                    </div>
                    <div class="surface-inset p-3 rounded-xl">
                        <span class="text-[10px] font-bold opacity-60 uppercase block">Starting City</span>
                        <span class="text-xs font-extrabold text-[var(--accent-primary)] mt-1 block">${startCityText}</span>
                    </div>
                    <div class="surface-inset p-3 rounded-xl">
                        <span class="text-[10px] font-bold opacity-60 uppercase block">Season</span>
                        <span class="text-xs font-extrabold text-[var(--accent-primary)] mt-1 block">${preferences.season ? preferences.season.toUpperCase() : 'FLEXIBLE'}</span>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs opacity-75">
                    <span><strong>Experiences:</strong> ${experiencesText}</span>
                    ${preferences.notes ? `<span class="italic max-w-xs truncate">"${escapeHtml(preferences.notes)}"</span>` : ''}
                </div>
            </div>

            <!-- Clearly Structured Content Areas Reserved for Apertus Results -->
            <div class="space-y-6 mb-8">
                
                <!-- Apertus Slot 1: Recommended Destination Header -->
                <div class="apertus-slot">
                    <div class="w-10 h-10 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center mx-auto mb-2 text-base">
                        <i class="fa-solid fa-map-location-dot"></i>
                    </div>
                    <h4 class="font-heading text-base font-bold mb-1">
                        [Apertus Result Area 1: Recommended Moroccan Destination & Rationale]
                    </h4>
                    <p class="text-xs opacity-70 max-w-lg mx-auto">
                        This section is reserved for the primary Moroccan city or regional route chosen by the Apertus AI model, along with a personalized explanation of why it fits the traveler.
                    </p>
                </div>

                <!-- Apertus Slot 2: Day-by-Day Itinerary -->
                <div class="apertus-slot">
                    <div class="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mx-auto mb-2 text-base">
                        <i class="fa-solid fa-calendar-days"></i>
                    </div>
                    <h4 class="font-heading text-base font-bold mb-1">
                        [Apertus Result Area 2: Day-by-Day Customized Route & Activities]
                    </h4>
                    <p class="text-xs opacity-70 max-w-lg mx-auto">
                        Structured container reserved for day-by-day morning, afternoon, and evening recommendations generated by Apertus.
                    </p>
                </div>

                <!-- Apertus Slot 3: Budget Breakdown & Practical Insights -->
                <div class="apertus-slot">
                    <div class="w-10 h-10 rounded-full bg-[var(--accent-burgundy)]/10 text-[var(--accent-burgundy)] flex items-center justify-center mx-auto mb-2 text-base">
                        <i class="fa-solid fa-wallet"></i>
                    </div>
                    <h4 class="font-heading text-base font-bold mb-1">
                        [Apertus Result Area 3: Estimated Budget Breakdown & Cultural Tips]
                    </h4>
                    <p class="text-xs opacity-70 max-w-lg mx-auto">
                        Reserved for accommodation, food, local transport, and activity cost estimates generated by Apertus in ${preferences.budgetCurrency}.
                    </p>
                </div>
            </div>

            <!-- Footer Controls -->
            <div class="pt-6 border-t border-[var(--border-color)] flex items-center justify-between flex-wrap gap-4">
                <button onclick="returnToQuestionnaire()" 
                        class="px-6 py-3.5 rounded-xl surface-inset hover:border-[var(--accent-primary)] font-bold text-xs transition-all flex items-center gap-2">
                    <i class="fa-solid fa-rotate-left"></i>
                    <span>Edit Travel Preferences</span>
                </button>
                <button onclick="closeTripPlanner()" 
                        class="px-6 py-3.5 rounded-xl bg-[var(--accent-burgundy)] hover:opacity-90 text-white font-bold text-xs transition-all shadow-md">
                    <span>Close Trip Planner</span>
                </button>
            </div>
        </div>
    `;

    resultView.classList.remove('hidden');
}

function returnToQuestionnaire() {
    $('#plannerResult')?.classList.add('hidden');
    $('#plannerQuestionView')?.classList.remove('hidden');
    renderPlannerProgress();
    renderPlannerStep();
}

// =============================================================================
// 10. VOICE TRANSLATOR: INTERFACE PREVIEW
// =============================================================================
const VOICE_PREVIEW_PHRASES = {
    en: {
        spoken: 'Where is the nearest entrance to the medina, please?',
        darijaAr: 'فين كاين أقرب باب للمدينة عافاك؟',
        darijaLat: 'Fein kayen aqreb bab l-medina afak?'
    },
    fr: {
        spoken: 'Où se trouve la porte la plus proche de la médina, s’il vous plaît ?',
        darijaAr: 'فين كاين أقرب باب للمدينة عافاك؟',
        darijaLat: 'Fein kayen aqreb bab l-medina afak?'
    },
    es: {
        spoken: '¿Dónde está la entrada más cercana a la medina, por favor?',
        darijaAr: 'فين كاين أقرب باب للمدينة عافاك؟',
        darijaLat: 'Fein kayen aqreb bab l-medina afak?'
    },
    de: {
        spoken: 'Wo ist bitte der nächste Eingang zur Medina?',
        darijaAr: 'فين كاين أقرب باب للمدينة عافاك؟',
        darijaLat: 'Fein kayen aqreb bab l-medina afak?'
    },
    it: {
        spoken: 'Dov’è l’ingresso più vicino alla medina, per favore?',
        darijaAr: 'فين كاين أقرب باب للمدينة عافاك؟',
        darijaLat: 'Fein kayen aqreb bab l-medina afak?'
    },
    ar: {
        spoken: 'أين يوجد أقرب مدخل إلى المدينة العتيقة من فضلك؟',
        darijaAr: 'فين كاين أقرب باب للمدينة عافاك؟',
        darijaLat: 'Fein kayen aqreb bab l-medina afak?'
    }
};

let currentVoiceLang = 'en';

function openVoiceTranslator() {
    const modal = $('#voiceModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    selectVoiceLanguage(currentVoiceLang);
}

function closeVoiceTranslator() {
    stopVoiceRecording(true);   // never keep the microphone open after the modal closes
    $('#voiceModal')?.classList.add('hidden');
    document.body.style.overflow = '';
}

// =============================================================================
// 10b. VOICE RECORDER (microphone → audio Blob)
//      Tap the mic to record, tap again to stop. The recorded audio is played
//      back and then handed to translateWithApertus() below.
// =============================================================================
let voiceRecorder = null;
let voiceStream = null;
let voiceChunks = [];
let voiceTimerId = null;
let voiceStartedAt = 0;
let voiceAudioUrl = null;
let voiceDiscard = false;

function setVoiceStatus(text) {
    const el = $('#voiceStatus');
    if (el) el.textContent = text;
}

function formatVoiceTime(ms) {
    const s = Math.floor(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function setVoiceRecordingUI(isRecording) {
    const btn = $('#voiceRecordBtn');
    const icon = $('#voiceRecordIcon');
    const dot = $('#voiceRecordDot');
    if (btn) {
        btn.setAttribute('aria-pressed', String(isRecording));
        btn.setAttribute('aria-label', isRecording ? 'Stop recording' : 'Start recording');
        btn.classList.toggle('bg-[var(--accent-burgundy)]', isRecording);
        btn.classList.toggle('bg-[var(--accent-primary)]', !isRecording);
        btn.classList.toggle('animate-pulse', isRecording);
    }
    if (icon) icon.className = isRecording ? 'fa-solid fa-stop' : 'fa-solid fa-microphone';
    if (dot) dot.classList.toggle('hidden', !isRecording);
}

async function startVoiceRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        setVoiceStatus('Recording is not supported in this browser. Try Chrome, Edge, Firefox or Safari.');
        return;
    }
    if (!window.isSecureContext) {
        setVoiceStatus('The microphone needs a secure page (https:// or localhost).');
        return;
    }
    try {
        voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
        const denied = err && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
        setVoiceStatus(denied
            ? 'Microphone access was blocked. Allow it in your browser settings and try again.'
            : 'No microphone was found.');
        return;
    }

    voiceChunks = [];
    voiceDiscard = false;
    voiceRecorder = new MediaRecorder(voiceStream);
    voiceRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) voiceChunks.push(e.data); };
    voiceRecorder.onstop = onVoiceRecordingStopped;
    voiceRecorder.start();

    // reset previous result
    $('#voicePlayback')?.classList.add('hidden');
    $('#voiceResult')?.classList.add('hidden');
    voiceStartedAt = Date.now();
    voiceTimerId = setInterval(() => {
        const t = $('#voiceTimer');
        if (t) t.textContent = formatVoiceTime(Date.now() - voiceStartedAt);
    }, 250);
    setVoiceRecordingUI(true);
    setVoiceStatus('Recording… tap again to stop.');
}

function stopVoiceRecording(discard = false) {
    voiceDiscard = discard;
    if (voiceTimerId) { clearInterval(voiceTimerId); voiceTimerId = null; }
    if (voiceRecorder && voiceRecorder.state !== 'inactive') {
        voiceRecorder.stop();           // triggers onVoiceRecordingStopped
    } else {
        releaseVoiceStream();
    }
    setVoiceRecordingUI(false);
    if (discard) setVoiceStatus('Tap the microphone and speak.');
}

function releaseVoiceStream() {
    if (voiceStream) {
        voiceStream.getTracks().forEach(t => t.stop());   // turns the browser's mic indicator off
        voiceStream = null;
    }
}

async function onVoiceRecordingStopped() {
    releaseVoiceStream();
    if (voiceDiscard || !voiceChunks.length) { voiceChunks = []; return; }

    const mimeType = (voiceRecorder && voiceRecorder.mimeType) || 'audio/webm';
    const audioBlob = new Blob(voiceChunks, { type: mimeType });
    voiceChunks = [];

    // Let the visitor listen to what was recorded
    const player = $('#voicePlayback');
    if (player) {
        if (voiceAudioUrl) URL.revokeObjectURL(voiceAudioUrl);
        voiceAudioUrl = URL.createObjectURL(audioBlob);
        player.src = voiceAudioUrl;
        player.classList.remove('hidden');
    }

    setVoiceStatus('Recording saved. Translating…');
    try {
        const result = await translateWithApertus(audioBlob, currentVoiceLang);
        showVoiceTranslation(result);
    } catch (err) {
        console.error('Voice translation failed:', err);
        setVoiceStatus('Translation failed. Please try again.');
    }
}

function showVoiceTranslation(result) {
    if (!result) {
        // Apertus is not connected yet: the recording is ready, nothing to display.
        setVoiceStatus('Recording saved. Translation will appear here once Apertus is connected.');
        return;
    }
    $('#voiceResultAr').textContent = result.darijaAr || '';
    $('#voiceResultLat').textContent = result.darijaLat || '';
    $('#voiceResult')?.classList.remove('hidden');
    setVoiceStatus('Done.');
}

/**
 * ===========================================================================
 *  APERTUS INTEGRATION POINT
 *  Called automatically when a recording finishes.
 *    audioBlob  : the recorded audio (Blob, usually audio/webm or audio/mp4)
 *    sourceLang : language the visitor spoke ('en','fr','es','de','it','ar')
 *  Return (or resolve with):
 *    { darijaAr: 'النص بالدارجة', darijaLat: 'Text in Latin letters' }
 *  Return null to show "waiting for Apertus" (current behaviour).
 *  Example once the API is available:
 *    const body = new FormData();
 *    body.append('audio', audioBlob, 'recording.webm');
 *    body.append('source_lang', sourceLang);
 *    const res = await fetch('<APERTUS_ENDPOINT>', { method: 'POST', body });
 *    return await res.json();
 * ===========================================================================
 */
async function translateWithApertus(audioBlob, sourceLang) {
    return null;
}

function toggleVoiceRecording() {
    if (voiceRecorder && voiceRecorder.state === 'recording') {
        stopVoiceRecording(false);
    } else {
        startVoiceRecording();
    }
}

function selectVoiceLanguage(langCode) {
    currentVoiceLang = langCode;

    $$('.voice-lang-btn').forEach(btn => {
        const isSelected = btn.dataset.voiceLang === langCode;
        btn.classList.toggle('border-[var(--accent-gold)]', isSelected);
        btn.classList.toggle('bg-[var(--accent-primary)]/15', isSelected);
    });

    const phrase = VOICE_PREVIEW_PHRASES[langCode] || VOICE_PREVIEW_PHRASES.en;
    const spokenEl = $('#voiceSampleSpoken');
    const darijaArEl = $('#voiceSampleDarijaAr');
    const darijaLatEl = $('#voiceSampleDarijaLat');

    if (spokenEl) spokenEl.textContent = `"${phrase.spoken}"`;
    if (darijaArEl) darijaArEl.textContent = phrase.darijaAr;
    if (darijaLatEl) darijaLatEl.textContent = phrase.darijaLat;
}

// =============================================================================
// 10c. PAGE LANGUAGE SWITCHER (EN / FR / DE / AR)
//      UI only: choosing a language stores the choice and calls the hook below.
//      No text is translated yet.
// =============================================================================
const SITE_LANGUAGES = {
    en: { code: 'EN', name: 'English' },
    fr: { code: 'FR', name: 'Français' },
    de: { code: 'DE', name: 'Deutsch' },
    ar: { code: 'AR', name: 'العربية' }
};
let currentSiteLang = 'en';
let langToastTimer = null;

/**
 * ===========================================================================
 *  APERTUS INTEGRATION POINT — WHOLE-PAGE TRANSLATION
 *  Called every time the visitor picks a language in the navbar.
 *    targetLang : 'en' | 'fr' | 'de' | 'ar'
 *  What to do here once Apertus is connected:
 *    - translate the visible page text (headings, paragraphs, buttons, labels,
 *      destination cards, planner questions...) into targetLang
 *    - set document.documentElement.lang = targetLang
 *    - set document.documentElement.dir  = (targetLang === 'ar' ? 'rtl' : 'ltr')
 *  Return true when the page was translated.
 *  Return false/null to show the "coming soon" notice (current behaviour).
 * ===========================================================================
 */
async function translatePageWithApertus(targetLang) {
    return null;
}

function showLangToast(message) {
    let toast = $('#langToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'langToast';
        toast.className = 'lang-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (langToastTimer) clearTimeout(langToastTimer);
    langToastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function setLangMenuOpen(open) {
    $('#langMenu')?.classList.toggle('hidden', !open);
    $('#langToggle')?.setAttribute('aria-expanded', String(open));
}

function updateLangUI() {
    const lang = SITE_LANGUAGES[currentSiteLang] || SITE_LANGUAGES.en;
    const codeEl = $('#langCode');
    if (codeEl) codeEl.textContent = lang.code;
    $$('.lang-option').forEach(opt => {
        opt.setAttribute('aria-checked', String(opt.dataset.lang === currentSiteLang));
    });
}

async function selectSiteLanguage(langCode) {
    if (!SITE_LANGUAGES[langCode]) return;
    currentSiteLang = langCode;
    try { localStorage.setItem('maghrib_lang', langCode); } catch (e) { /* storage unavailable */ }
    updateLangUI();
    setLangMenuOpen(false);

    try {
        const translated = await translatePageWithApertus(langCode);
        if (!translated && langCode !== 'en') {
            showLangToast(`Translation to ${SITE_LANGUAGES[langCode].name} is coming soon.`);
        }
    } catch (err) {
        console.error('Page translation failed:', err);
        showLangToast('Translation failed. Please try again.');
    }
}

function initLanguageSwitcher() {
    const toggle = $('#langToggle');
    if (!toggle) return;

    try {
        const saved = localStorage.getItem('maghrib_lang');
        if (saved && SITE_LANGUAGES[saved]) currentSiteLang = saved;
    } catch (e) { /* storage unavailable */ }
    updateLangUI();

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setLangMenuOpen($('#langMenu').classList.contains('hidden'));
    });
    $$('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => selectSiteLanguage(opt.dataset.lang));
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#langSwitcher')) setLangMenuOpen(false);
    });
}

// Utility: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}

// =============================================================================
// 11. INITIALIZATION ON DOM READY
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Setup (Defaults to genuinely white Light Mode)
    initTheme();
    $$('.theme-toggle-btn').forEach(btn => btn.addEventListener('click', toggleTheme));

    // 2. Hero Slideshow
    initHeroSlideshow();

    // 2b. Discover Section Photographic Slideshow (user-provided images)
    initDiscoverSlideshow();

    // 3. Search System
    initSearch();

    // 4. Destinations Grid (loaded from the SQLite-backed API)
    loadDestinations().then(() => {
        renderDestinationsGrid();
    }).catch((error) => {
        console.error('Could not load destinations:', error);
        const grid = $('#destinationsGrid');
        if (grid) {
            grid.innerHTML = '<p class="col-span-full text-center py-10">Destinations could not be loaded. Please make sure the server is running.</p>';
        }
    });

    // 5. Filter Tabs
    $$('#filterTabs button').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategoryFilter = btn.dataset.filter;
            $$('#filterTabs button').forEach(b => {
                const active = b === btn;
                b.classList.toggle('tab-on', active);
                b.classList.toggle('tab-off', !active);
            });
            filterDestinations();
        });
    });

    // 6. Hero Quick Category Tag Buttons
    $$('#heroTags button').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            const targetFilter = tag === 'cities' ? 'imperial' : tag;
            const filterBtn = $(`#filterTabs button[data-filter="${targetFilter}"]`);
            if (filterBtn) {
                filterBtn.click();
            } else {
                setSearchPill(tag);
            }
            $('#discover')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 7. City Detail Modal Controls
    $('#closeCityModal')?.addEventListener('click', closeCityDetail);
    $('#cityModalCloseBottom')?.addEventListener('click', closeCityDetail);
    $('#cityModalPlanBtn')?.addEventListener('click', () => {
        if (currentOpenCity) planTripForCity(currentOpenCity.id);
    });

    $$('.city-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchCityTab(btn.dataset.cityTab);
        });
    });

    // 8. Lightbox Controls
    $('#closeLightboxBtn')?.addEventListener('click', closeLightbox);
    $('#lightboxNextBtn')?.addEventListener('click', nextLightboxImage);
    $('#lightboxPrevBtn')?.addEventListener('click', prevLightboxImage);

    // 9. Planner Controls
    $$('[data-open-planner]').forEach(btn => btn.addEventListener('click', () => openTripPlanner()));
    $('#plannerClose')?.addEventListener('click', closeTripPlanner);
    $('#btnNext')?.addEventListener('click', handlePlannerNext);
    $('#btnBack')?.addEventListener('click', handlePlannerBack);
    $('#btnSkip')?.addEventListener('click', handlePlannerSkip);

    // 9b. Page language switcher (navbar)
    initLanguageSwitcher();

    // 10. Voice Translator Controls
    $$('[data-open-voice]').forEach(btn => btn.addEventListener('click', openVoiceTranslator));
    $('#closeVoiceModal')?.addEventListener('click', closeVoiceTranslator);
    $('#voiceRecordBtn')?.addEventListener('click', toggleVoiceRecording);
    $$('.voice-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => selectVoiceLanguage(btn.dataset.voiceLang));
    });

    // 11. Mobile Drawer
    const burger = $('#burger');
    const mobileMenu = $('#mobileMenu');
    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        $$('#mobileMenu a, #mobileMenu button').forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 12. Global Keyboard Handlers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const langMenu = $('#langMenu');
            if (langMenu && !langMenu.classList.contains('hidden')) {
                setLangMenuOpen(false);
                $('#langToggle')?.focus();
                return;
            }
            const lightbox = $('#lightboxModal');
            if (lightbox && !lightbox.classList.contains('hidden-lightbox')) {
                closeLightbox();
                return;
            }
            const cityModal = $('#cityDetailModal');
            if (cityModal && !cityModal.classList.contains('hidden')) {
                closeCityDetail();
                return;
            }
            const planner = $('#planner');
            if (planner && !planner.classList.contains('hidden-planner')) {
                closeTripPlanner();
                return;
            }
            const voiceModal = $('#voiceModal');
            if (voiceModal && !voiceModal.classList.contains('hidden')) {
                closeVoiceTranslator();
                return;
            }
        } else if (e.key === 'ArrowRight') {
            const lightbox = $('#lightboxModal');
            if (lightbox && !lightbox.classList.contains('hidden-lightbox')) {
                nextLightboxImage();
            }
        } else if (e.key === 'ArrowLeft') {
            const lightbox = $('#lightboxModal');
            if (lightbox && !lightbox.classList.contains('hidden-lightbox')) {
                prevLightboxImage();
            }
        }
    });
});
