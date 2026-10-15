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

let activePlannerDestinationId = null;

function planTripForCity(cityId) {
    activePlannerDestinationId = cityId;
    closeCityDetail();
    openTripPlanner({ destinationId: cityId });
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
    tripDays: 4,
    companions: 'partner',
    atmosphere: 'romantic',
    season: 'spring',
    transport: 'public',
    startCity: 'marrakech',
    notes: '',
    submittedAt: null
};

let currentPlannerStep = 0;

function getActivePlannerQuestions() {
    if (!activePlannerDestinationId) return PLANNER_QUESTIONS;
    return ['budget', 'duration'].map(id => PLANNER_QUESTIONS.find(question => question.id === id));
}

function openTripPlanner(prefill = {}) {
    const planner = $('#planner');
    if (!planner) return;

    // A city-card launch pins the generated plan to that city. Opening the
    // general planner clears any previous pin so its recommendations stay open.
    activePlannerDestinationId = typeof prefill.destinationId === 'string' ? prefill.destinationId : null;

    // The magic-wand flow for a specific city only asks about budget and trip
    // length. Start with neutral defaults so answers from the full planner do
    // not silently affect this city plan.
    if (activePlannerDestinationId) {
        userTripPreferences = {
            ...userTripPreferences,
            experience: [],
            budget: 'moderate',
            budgetCurrency: 'MAD',
            budgetAmount: '',
            duration: '3-4',
            tripDays: 4,
            companions: null,
            atmosphere: null,
            season: null,
            transport: 'undecided',
            startCity: 'anywhere',
            notes: ''
        };
    }

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

    const questions = getActivePlannerQuestions();
    const total = questions.length;
    container.innerHTML = questions.map((q, idx) => `
        <div class="flex items-center ${idx < total - 1 ? 'flex-1' : ''}">
            <div class="pdot ${idx === currentPlannerStep ? 'active' : ''} ${idx < currentPlannerStep ? 'done' : ''}" title="Step ${idx + 1}: ${q.title}"></div>
            ${idx < total - 1 ? `<div class="pline ${idx < currentPlannerStep ? 'done' : ''}"><i></i></div>` : ''}
        </div>
    `).join('');
}

function renderPlannerStep() {
    const stepBody = $('#stepBody');
    if (!stepBody) return;

    const questions = getActivePlannerQuestions();
    const q = questions[currentPlannerStep];
    const total = questions.length;
    const cur = currentPlannerStep;

    const btnBack = $('#btnBack');
    const btnSkip = $('#btnSkip');
    const btnNext = $('#btnNext');

    if (btnBack) btnBack.style.visibility = cur === 0 ? 'hidden' : 'visible';
    if (btnSkip) btnSkip.style.display = q.optional ? 'inline-block' : 'none';
    if (btnNext) btnNext.textContent = cur === total - 1 ? '✨ Submit Preferences' : 'Continue →';

    let contentHtml = `
        <div class="max-w-2xl mx-auto text-center mb-8">
            ${activePlannerDestinationId ? `<span class="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-2 inline-block">City trip · ${escapeHtml(DESTINATIONS.find(city => city.id === activePlannerDestinationId)?.name || 'Selected city')}</span>` : ''}
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
        if (q.id === 'duration') {
            const bounds = { '1-2': [1, 2], '3-4': [3, 4], '5-7': [5, 7], '8+': [8, 30] }[userTripPreferences.duration] || [1, 30];
            if (!Number.isInteger(userTripPreferences.tripDays) || userTripPreferences.tripDays < bounds[0] || userTripPreferences.tripDays > bounds[1]) {
                userTripPreferences.tripDays = bounds[1];
            }
            contentHtml += `<div class="max-w-2xl mx-auto mt-5 p-4 rounded-2xl surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><label for="tripDaysInput" class="block text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">Exact number of trip days</label><p class="text-[11px] opacity-70 mt-1">Choose a number within the selected range.</p></div><div class="flex items-center gap-2"><input id="tripDaysInput" type="number" min="${bounds[0]}" max="${bounds[1]}" step="1" value="${userTripPreferences.tripDays}" oninput="userTripPreferences.tripDays = this.value === '' ? '' : Number(this.value)" class="w-24 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm font-bold" aria-label="Exact number of trip days"><span class="text-xs opacity-70">days</span></div></div>`;
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
        if (qId === 'duration') {
            const defaultDays = { '1-2': 2, '3-4': 4, '5-7': 7, '8+': 8 }[optId];
            const bounds = { '1-2': [1, 2], '3-4': [3, 4], '5-7': [5, 7], '8+': [8, 30] }[optId];
            if (userTripPreferences.tripDays < bounds[0] || userTripPreferences.tripDays > bounds[1]) userTripPreferences.tripDays = defaultDays;
        }
    }
    renderPlannerStep();
}

function handlePlannerNext() {
    const total = getActivePlannerQuestions().length;
    if (currentPlannerStep < total - 1) {
        currentPlannerStep++;
        renderPlannerStep();
    } else {
        // Keep the saved answers intact while the backend builds the itinerary.
        userTripPreferences.submittedAt = new Date().toISOString();
        showApertusRecommendations(userTripPreferences);
    }
}

function handlePlannerBack() {
    const questions = getActivePlannerQuestions();
    if (currentPlannerStep > 0 && currentPlannerStep < questions.length) {
        currentPlannerStep--;
        renderPlannerStep();
    }
}

function handlePlannerSkip() {
    handlePlannerNext();
}

// =============================================================================
// 9. APERTUS RECOMMENDATIONS & DATABASE-BACKED DAY PLAN
// =============================================================================
let recommendationsPending = false;

function formatMadRange(range) {
    if (!range || !Number.isFinite(range.min) || !Number.isFinite(range.max)) return 'Price unavailable';
    if (range.min === 0 && range.max === 0) return 'Free self-guided';
    return `${range.min.toLocaleString()}–${range.max.toLocaleString()} MAD`;
}

function renderItineraryHtml(itinerary) {
    if (!itinerary || !Array.isArray(itinerary.days)) return '';
    const fallback = escapeHtml(itinerary.destination?.imageFallback || '/assets/hero/marrakech-riad-rooftops-1600.jpg');
    const money = range => escapeHtml(formatMadRange(range));
    const imageCard = (item, detail) => {
        const image = item.image?.url ? `<img src="${escapeHtml(item.image.url)}" alt="${escapeHtml(item.image.alt || item.name)}" loading="eager" decoding="async" class="w-full h-44 object-cover" onerror="this.onerror=null;this.src='${fallback}'">` : `<img src="${fallback}" alt="${escapeHtml(item.name)}" class="w-full h-44 object-cover">`;
        return `<article class="surface-card rounded-xl overflow-hidden border border-[var(--border-color)]">${image}<div class="p-4"><div class="flex items-start justify-between gap-2"><h5 class="font-bold text-sm">${escapeHtml(item.name || '')}</h5><span class="text-[10px] whitespace-nowrap text-[var(--accent-gold)] font-bold">${money(item.price)}</span></div><p class="text-xs opacity-75 mt-1">${escapeHtml(item.description || '')}</p><p class="text-[10px] opacity-65 mt-2">${escapeHtml(item.time || '')}${item.durationMinutes ? ` · ${item.durationMinutes} min` : ''} · ${escapeHtml(item.location || '')}</p>${detail || ''}${item.tip || item.practicalTip ? `<p class="text-[10px] opacity-65 mt-2">${escapeHtml(item.tip || item.practicalTip)}</p>` : ''}</div></article>`;
    };
    const days = itinerary.days.map(day => {
        const schedule = [...(day.activities || []), ...(day.meals || [])].sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
        const cards = schedule.map(item => {
            const detail = item.category === 'meal'
                ? `<p class="text-[10px] font-bold mt-2 text-[var(--accent-primary)]">${escapeHtml(item.mealType || 'Meal')} · ${money(item.price)} / person</p>`
                : `<p class="text-[10px] font-bold mt-2 text-[var(--accent-primary)]">${money(item.price)} / person</p>`;
            return `<div><span class="inline-flex mb-2 px-2.5 py-1 rounded-full surface-inset text-[10px] font-extrabold text-[var(--accent-gold)]"><i class="fa-regular fa-clock mr-1"></i>${escapeHtml(item.time || 'Flexible')}</span>${imageCard(item, detail)}</div>`;
        }).join('');
        const stay = day.overnightStay;
        const stayHtml = stay ? `<div class="mt-4 p-4 rounded-xl surface-inset grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">${stay.image?.url ? `<img src="${escapeHtml(stay.image.url)}" alt="${escapeHtml(stay.image.alt || stay.type)}" loading="eager" class="w-full h-32 object-cover rounded-lg" onerror="this.onerror=null;this.src='${fallback}'">` : ''}<div><strong class="text-sm">Stay tonight · ${escapeHtml(stay.name || stay.type)}</strong><p class="text-xs text-[var(--accent-primary)] mt-1">${money(stay.pricePerUnitNight)} / ${stay.unit === 'per_person_per_night' ? 'bed/person' : 'room'} per night · ${stay.roomsOrBeds} unit(s)</p><p class="text-xs mt-1">This night estimate: ${money(stay.total)}</p><p class="text-[10px] opacity-70 mt-2">${escapeHtml(stay.note || '')}</p></div></div>` : '';
        return `<section class="surface-card rounded-2xl p-4 md:p-6 border border-[var(--border-color)] mb-5"><div class="flex justify-between items-start gap-3 mb-4"><div><span class="text-[10px] uppercase tracking-wider font-bold text-[var(--accent-gold)]">Day ${day.dayNumber} · Daily plan</span><h3 class="font-heading text-xl font-bold">${escapeHtml(day.title || itinerary.destination.name)}</h3><p class="text-xs opacity-70 mt-1">${escapeHtml(day.description || '')}</p></div><strong class="text-xs whitespace-nowrap">Day total: ${money(day.dailySubtotal)}</strong></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${cards}</div>${stayHtml}<p class="text-[10px] opacity-65 mt-3">${day.localTransport ? `Local transport (group): ${money(day.localTransport.price)} · ` : ''}Optional expenses (group): ${money(day.optionalExpenses?.price)}.</p></section>`;
    }).join('');
    const stay = itinerary.accommodationSummary;
    const accommodation = itinerary.nightsCount > 0 && stay ? `<section class="surface-card rounded-2xl overflow-hidden border border-[var(--accent-gold)] mb-5"><div class="grid grid-cols-1 md:grid-cols-[260px_1fr]"><img src="${escapeHtml(stay.image?.url || fallback)}" alt="${escapeHtml(stay.image?.alt || `Illustrative stay in ${itinerary.destination.name}`)}" class="w-full h-48 md:h-full min-h-48 object-cover" loading="eager" onerror="this.onerror=null;this.src='${fallback}'"><div class="p-5 md:p-6"><span class="text-[10px] uppercase tracking-widest font-extrabold text-[var(--accent-gold)]">${stay.nights} night(s) · ${stay.roomsOrBeds} ${stay.unit === 'per_person_per_night' ? 'bed(s)' : 'room(s)'}</span><h3 class="font-heading text-xl font-bold mt-1">Your stay in ${escapeHtml(itinerary.destination.name)}</h3><p class="text-sm font-bold text-[var(--accent-primary)] mt-2">${escapeHtml(stay.name || stay.type)} · ${money(stay.pricePerUnitNight)} / night</p><p class="text-xs opacity-75 mt-2">${escapeHtml(stay.note || '')}</p><p class="mt-4 pt-3 border-t border-[var(--border-color)] flex justify-between text-sm"><span>Estimated stay total</span><strong>${money(stay.total)}</strong></p></div></div></section>` : '';
    const totals = itinerary.pricing?.totals;
    const budgetRows = totals ? [
        ['Activities & experiences', totals.activitiesExperiences], ['Breakfast', totals.breakfast], ['Lunch', totals.lunch], ['Dinner', totals.dinner],
        [`Accommodation (${itinerary.nightsCount} night(s))`, totals.accommodation], ['Local transportation', totals.transportation], ['Optional expenses', totals.optionalExpenses]
    ].map(([label, range]) => `<div class="flex justify-between gap-3 border-b border-[var(--border-color)] py-2 text-xs"><span>${escapeHtml(label)}</span><strong>${money(range)}</strong></div>`).join('') : '';
    return `<div class="max-w-5xl mx-auto mt-8" id="generatedItinerary"><header class="surface-card rounded-3xl p-5 md:p-8 border border-[var(--accent-gold)] mb-6 flex gap-4 items-center"><img src="${escapeHtml(itinerary.destination.image || fallback)}" alt="${escapeHtml(itinerary.destination.imageAlt || itinerary.destination.name)}" class="w-20 h-20 md:w-28 md:h-28 object-cover rounded-2xl" onerror="this.onerror=null;this.src='${fallback}'"><div><span class="text-[10px] uppercase tracking-widest font-bold text-[var(--accent-gold)]">Personalized day-by-day plan · ${itinerary.travelers} traveler(s)</span><h2 class="font-heading text-2xl md:text-3xl font-extrabold">${itinerary.daysCount} days in ${escapeHtml(itinerary.destination.name)}</h2><p class="text-xs opacity-70 mt-1">${itinerary.nightsCount} night(s) · price estimates in MAD</p></div></header>${days}${accommodation}<section class="surface-card rounded-2xl p-5 md:p-7 border border-[var(--accent-gold)]"><h3 class="font-heading text-xl font-bold mb-4">Estimated trip budget · MAD</h3>${budgetRows}<div class="flex justify-between gap-3 pt-3 text-sm"><strong>Estimated total (group)</strong><strong>${money(totals?.totalIncludingOptional)}</strong></div><div class="flex justify-between gap-3 text-sm text-[var(--accent-primary)]"><strong>Estimated per person</strong><strong>${money(totals?.perPersonIncludingOptional)}</strong></div>${itinerary.pricing?.budgetComparison ? `<div class="mt-4 rounded-xl surface-inset p-3 text-xs"><strong>Budget: ${escapeHtml(itinerary.pricing.budgetComparison.status.replaceAll('_', ' '))}</strong><p class="mt-1">${escapeHtml(itinerary.pricing.budgetComparison.explanation)}</p></div>` : ''}<p class="text-[10px] opacity-70 mt-4">${escapeHtml(itinerary.disclaimer || '')}</p></section></div>`;
}

async function showApertusRecommendations(preferences) {
    $('#plannerQuestionView')?.classList.add('hidden');
    const resultView = $('#plannerResult');
    if (!resultView) return;
    if (recommendationsPending) return;
    recommendationsPending = true;
    const next = $('#btnNext');
    if (next) { next.disabled = true; next.setAttribute('aria-busy', 'true'); }
    resultView.classList.remove('hidden');
    resultView.innerHTML = `<div class="max-w-4xl mx-auto py-16 text-center" role="status"><div class="animate-pulse text-3xl text-[var(--accent-primary)] mb-4"><i class="fa-solid fa-compass"></i></div><h2 class="font-heading text-2xl font-bold">Building your day-by-day Morocco plan…</h2><p class="text-sm opacity-70 mt-2">Matching your answers with city activities, food, stays and photos.</p></div>`;
    try {
        const response = await fetch('/api/recommendations', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences, language: currentSiteLang || 'en', destinationId: activePlannerDestinationId })
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
        if (!payload.itinerary || !Array.isArray(payload.itinerary.days)) throw new Error('No day-by-day itinerary was returned.');
        const recommendation = payload.destinations?.[0];
        resultView.innerHTML = `<div class="max-w-5xl mx-auto py-2"><section class="surface-card rounded-3xl p-6 md:p-8 mb-6 border border-[var(--accent-gold)]"><span class="text-[10px] uppercase tracking-widest font-extrabold text-[var(--accent-gold)]">${payload.modelStatus === 'apertus' ? 'Apertus AI · Morocco destination guide' : 'Morocco guide · local data fallback'}</span><h2 class="font-heading text-2xl md:text-3xl font-extrabold mt-2">${escapeHtml(recommendation?.city?.name || payload.itinerary.destination.name)}${activePlannerDestinationId ? ' day-by-day trip' : ' is your best match'}</h2><p class="text-sm opacity-80 mt-2">${escapeHtml(recommendation?.match_reason || payload.summary || '')}</p>${payload.modelNotice ? `<p class="text-xs opacity-65 mt-2">${escapeHtml(payload.modelNotice)}</p>` : ''}<p class="text-[10px] opacity-65 mt-3">${escapeHtml(payload.disclaimer || '')}</p></section>${renderItineraryHtml(payload.itinerary)}<div class="flex flex-wrap gap-3 mt-5"><button type="button" onclick="returnToQuestionnaire()" class="px-5 py-3 rounded-xl surface-inset font-bold text-xs">Edit answers</button><button type="button" onclick="closeTripPlanner()" class="px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-white font-bold text-xs">Close planner</button></div></div>`;
    } catch (error) {
        resultView.innerHTML = `<div class="max-w-3xl mx-auto py-16 text-center surface-card rounded-3xl p-8 border border-[var(--accent-gold)]"><div class="text-2xl text-[var(--accent-burgundy)] mb-3"><i class="fa-solid fa-triangle-exclamation"></i></div><h2 class="font-heading text-2xl font-bold mb-2">We couldn't create your itinerary</h2><p class="text-sm opacity-75 mb-6">${escapeHtml(error.message || 'Please check the server and try again.')}</p><div class="flex flex-wrap justify-center gap-3"><button type="button" onclick="showApertusRecommendations(userTripPreferences)" class="px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold">Try again</button><button type="button" onclick="returnToQuestionnaire()" class="px-5 py-3 rounded-xl surface-inset text-xs font-bold">Edit answers</button></div></div>`;
    } finally {
        recommendationsPending = false;
        if (next) { next.disabled = false; next.removeAttribute('aria-busy'); }
    }
}

function returnToQuestionnaire() {
    $('#plannerResult')?.classList.add('hidden');
    $('#plannerQuestionView')?.classList.remove('hidden');
    renderPlannerProgress();
    renderPlannerStep();
}

// =============================================================================
// 10. VOICE TRANSLATOR
// =============================================================================
let currentVoiceLang = 'en';
let currentVoiceTargetLang = 'darija';
let lastVoiceTargetLang = 'darija';

function openVoiceTranslator() {
    const modal = $('#voiceModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if ($('#voiceTargetLang')) $('#voiceTargetLang').value = currentVoiceTargetLang;
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
let voicePending = false;
let lastDarijaText = '';

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
    if (voicePending || (voiceRecorder && voiceRecorder.state === 'recording')) return;
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
    try {
        const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported?.(type));
        voiceRecorder = mimeType ? new MediaRecorder(voiceStream, { mimeType }) : new MediaRecorder(voiceStream);
        voiceRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) voiceChunks.push(e.data); };
        voiceRecorder.onstop = onVoiceRecordingStopped;
        voiceRecorder.start();
    } catch {
        releaseVoiceStream();
        setVoiceStatus('Could not start audio recording. Try another browser or microphone.');
        return;
    }

    // reset previous result
    $('#voicePlayback')?.classList.add('hidden');
    $('#voiceResult')?.classList.add('hidden');
    voiceStartedAt = Date.now();
    voiceTimerId = setInterval(() => {
        const t = $('#voiceTimer');
        const elapsed = Date.now() - voiceStartedAt;
        if (t) t.textContent = formatVoiceTime(elapsed);
        if (elapsed >= 60000) stopVoiceRecording(false);
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

    voicePending = true;
    const recordButton = $('#voiceRecordBtn');
    if (recordButton) recordButton.disabled = true;
    const targetLabel = $('#voiceTargetLang')?.selectedOptions?.[0]?.textContent?.trim() || 'the selected language';
    setVoiceStatus(`Transcribing your recording, then translating to ${targetLabel}…`);
    try {
        const result = await translateWithApertus(audioBlob, currentVoiceLang, currentVoiceTargetLang);
        showVoiceTranslation(result);
    } catch (err) {
        console.error('Voice translation failed:', err);
        setVoiceStatus(`Translation failed: ${err.message || 'Please try again.'}`);
        $('#voiceResult')?.classList.remove('hidden');
        $('#voiceRetryBtn')?.classList.remove('hidden');
    } finally {
        voicePending = false;
        if (recordButton) recordButton.disabled = false;
    }
}

function showVoiceTranslation(result) {
    $('#voiceTranscript').textContent = result.transcription || '';
    $('#voiceTranscript').dir = currentVoiceLang === 'ar' ? 'rtl' : 'auto';
    $('#voiceTranslatedText').textContent = result.translatedText || '';
    $('#voiceTranslatedText').dir = ['ar', 'darija'].includes(result.targetLanguage) ? 'rtl' : 'auto';
    $('#voiceTranslationLabel').textContent = `Translation · ${result.targetLanguageName || 'Selected language'}`;
    const transliteration = $('#voiceTransliteration');
    transliteration.textContent = result.transliteration || '';
    transliteration.classList.toggle('hidden', !result.transliteration);
    lastDarijaText = result.translatedText || '';
    lastVoiceTargetLang = result.targetLanguage || currentVoiceTargetLang;
    $('#voiceResult')?.classList.remove('hidden');
    $('#voiceRetryBtn')?.classList.remove('hidden');
    setVoiceStatus('Done.');
}

async function translateWithApertus(audioBlob, sourceLang, targetLang) {
    const response = await fetch('/api/voice-translate', {
        method: 'POST',
        headers: { 'Content-Type': audioBlob.type || 'audio/webm', 'X-Source-Language': sourceLang, 'X-Target-Language': targetLang },
        body: audioBlob
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`);
    if (!result.transcription || !result.translatedText) throw new Error('The voice service returned an incomplete result.');
    return result;
}

function speakTranslation() {
    if (!lastDarijaText || !('speechSynthesis' in window)) {
        setVoiceStatus('Speech playback is not available in this browser.');
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lastDarijaText);
    const locales = { en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', it: 'it-IT', ar: 'ar', darija: 'ar-MA' };
    utterance.lang = locales[lastVoiceTargetLang] || 'ar-MA';
    const prefix = utterance.lang.slice(0, 2).toLowerCase();
    const matchingVoice = window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith(prefix));
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.onerror = () => setVoiceStatus('Could not play speech on this device.');
    window.speechSynthesis.speak(utterance);
}

function retryVoiceTranslation() {
    $('#voiceResult')?.classList.add('hidden');
    setVoiceStatus('Tap the microphone and speak.');
    startVoiceRecording();
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

    const targetSelect = $('#voiceTargetLang');
    if (targetSelect) {
        [...targetSelect.options].forEach(option => { option.disabled = option.value === langCode; });
        if (currentVoiceTargetLang === langCode) currentVoiceTargetLang = 'darija';
        targetSelect.value = currentVoiceTargetLang;
    }

}

function selectVoiceTargetLanguage(langCode) {
    currentVoiceTargetLang = langCode;
}

// =============================================================================
// 10c. PAGE LANGUAGE SWITCHER (EN / FR / ES / DE / IT / AR)
// =============================================================================
const SITE_LANGUAGES = {
    en: { code: 'EN', name: 'English' },
    fr: { code: 'FR', name: 'Français' },
    es: { code: 'ES', name: 'Español' },
    de: { code: 'DE', name: 'Deutsch' },
    it: { code: 'IT', name: 'Italiano' },
    ar: { code: 'AR', name: 'العربية' }
};
let currentSiteLang = 'en';
let langToastTimer = null;
const pageOriginals = new Map();
const pageTranslationCache = new Map();
let pageTranslationRun = 0;
let pageTranslationObserver = null;
let pageMutationTimer = null;

function pageCacheKey(lang, value) { return `${lang}\u0000${value}`; }

function getPageCachedTranslation(lang, value) {
    const key = pageCacheKey(lang, value);
    if (pageTranslationCache.has(key)) return pageTranslationCache.get(key);
    try {
        const cached = localStorage.getItem(`mghrib_page_translation:${key}`);
        if (cached) {
            pageTranslationCache.set(key, cached);
            return cached;
        }
    } catch (e) { /* storage unavailable */ }
    return null;
}

function setPageCachedTranslation(lang, value, translated) {
    const key = pageCacheKey(lang, value);
    pageTranslationCache.set(key, translated);
    try { localStorage.setItem(`mghrib_page_translation:${key}`, translated); } catch (e) { /* cache is optional */ }
}

function ignoredTranslationElement(element) {
    return !element || element.closest('script, style, noscript, template, code, pre, #langToggle, .lang-option, .lang-chip, .lang-name, #langCode, #langToast, [data-no-translate]');
}

function collectPageTranslations({ onlyUnknown = false } = {}) {
    const entries = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if (ignoredTranslationElement(node.parentElement) || !node.nodeValue.trim() || !/[A-Za-z\u0600-\u06FF]/.test(node.nodeValue)) continue;
        if (!pageOriginals.has(node)) pageOriginals.set(node, { kind: 'text', original: node.nodeValue });
        const record = pageOriginals.get(node);
        if (onlyUnknown && record.translated) continue;
        entries.push({ node, record });
    }
    // These are UI strings; entered form values are deliberately never read or changed.
    document.querySelectorAll('input[placeholder], textarea[placeholder], [aria-label], [title]').forEach(element => {
        if (ignoredTranslationElement(element)) return;
        for (const attr of ['placeholder', 'aria-label', 'title']) {
            if (!element.hasAttribute(attr)) continue;
            const value = element.getAttribute(attr);
            if (!value?.trim()) continue;
            let attributes = pageOriginals.get(element);
            if (!attributes) { attributes = { kind: 'attributes', values: {} }; pageOriginals.set(element, attributes); }
            if (!(attr in attributes.values)) attributes.values[attr] = value;
            if (!onlyUnknown || !attributes.translated?.[attr]) entries.push({ element, attr, record: attributes, original: attributes.values[attr] });
        }
    });
    return entries;
}

function restorePageOriginals() {
    pageOriginals.forEach((record, target) => {
        if (!target.isConnected) return;
        if (record.kind === 'text') target.nodeValue = record.original;
        else Object.entries(record.values).forEach(([attr, value]) => target.setAttribute(attr, value));
        record.translated = null;
    });
}

function setPageEntry(entry, value, lang) {
    if (entry.node) {
        entry.node.nodeValue = value;
        entry.record.translated = lang;
    } else {
        entry.element.setAttribute(entry.attr, value);
        entry.record.translated ||= {};
        entry.record.translated[entry.attr] = lang;
    }
}

async function requestPageTranslationBatch(lang, entries, runId) {
    const pending = [];
    const results = new Array(entries.length);
    entries.forEach((entry, index) => {
        const original = entry.original ?? entry.record.original ?? entry.record.values[entry.attr];
        const cached = getPageCachedTranslation(lang, original);
        if (cached !== null) results[index] = cached;
        else pending.push({ index, text: original });
    });
    const requestBatches = [];
    let requestBatch = [];
    let requestChars = 0;
    for (const item of pending) {
        if (requestBatch.length >= 60 || requestChars + item.text.length > 12000) {
            if (requestBatch.length) requestBatches.push(requestBatch);
            requestBatch = [];
            requestChars = 0;
        }
        requestBatch.push(item);
        requestChars += item.text.length;
    }
    if (requestBatch.length) requestBatches.push(requestBatch);
    for (const batch of requestBatches) {
        if (runId !== pageTranslationRun) return false;
        const response = await fetch('/api/translate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetLanguage: lang, items: batch.map(item => item.text) })
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || `Translation request failed (${response.status})`);
        if (!Array.isArray(payload.translations) || payload.translations.length !== batch.length || payload.translations.some(value => typeof value !== 'string')) {
            throw new Error('Translation provider returned an invalid response');
        }
        batch.forEach((item, index) => {
            results[item.index] = payload.translations[index];
            setPageCachedTranslation(lang, item.text, payload.translations[index]);
        });
    }
    if (runId !== pageTranslationRun) return false;
    entries.forEach((entry, index) => setPageEntry(entry, results[index], lang));
    return true;
}

async function translatePageWithApertus(targetLang) {
    const runId = ++pageTranslationRun;
    restorePageOriginals();
    document.documentElement.lang = targetLang;
    document.documentElement.dir = targetLang === 'ar' ? 'rtl' : 'ltr';
    if (targetLang === 'en') {
        pageTranslationObserver?.observe(document.body, { childList: true, subtree: true });
        return true;
    }

    const entries = collectPageTranslations();
    const batches = [];
    // Keep each request comfortably within the backend payload limit.
    let batch = [];
    let chars = 0;
    for (const entry of entries) {
        const original = entry.original ?? entry.record.original ?? entry.record.values[entry.attr];
        if (batch.length >= 60 || chars + original.length > 12000) {
            if (batch.length) batches.push(batch);
            batch = [];
            chars = 0;
        }
        batch.push(entry);
        chars += original.length;
    }
    if (batch.length) batches.push(batch);
    let nextBatch = 0;
    const workers = Array.from({ length: Math.min(2, batches.length) }, async () => {
        while (nextBatch < batches.length) {
            const batch = batches[nextBatch++];
            await requestPageTranslationBatch(targetLang, batch, runId);
        }
    });
    await Promise.all(workers);
    if (runId !== pageTranslationRun) return false;
    pageTranslationObserver?.observe(document.body, { childList: true, subtree: true });
    return true;
}

function observeNewPageText() {
    if (!document.body || pageTranslationObserver) return;
    pageTranslationObserver = new MutationObserver(() => {
        if (currentSiteLang === 'en') return;
        clearTimeout(pageMutationTimer);
        pageMutationTimer = setTimeout(async () => {
            const lang = currentSiteLang;
            const entries = collectPageTranslations({ onlyUnknown: true });
            if (!entries.length) return;
            try { await requestPageTranslationBatch(lang, entries, pageTranslationRun); }
            catch (error) { showLangToast('Some new page content could not be translated.'); }
        }, 250);
    });
}

function showLangToast(message, { persistent = false } = {}) {
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
    if (!persistent) langToastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
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
    showLangToast(langCode === 'en' ? 'Restoring English…' : `Translating to ${SITE_LANGUAGES[langCode].name}…`, { persistent: true });

    try {
        const translated = await translatePageWithApertus(langCode);
        if (translated) showLangToast(langCode === 'en' ? 'English restored.' : `Page translated to ${SITE_LANGUAGES[langCode].name}.`);
    } catch (err) {
        if (langCode !== 'en' && currentSiteLang === langCode) {
            restorePageOriginals();
            document.documentElement.lang = 'en';
            document.documentElement.dir = 'ltr';
            currentSiteLang = 'en';
            try { localStorage.setItem('maghrib_lang', 'en'); } catch (e) { /* storage unavailable */ }
            updateLangUI();
        }
        if (currentSiteLang === 'en' || currentSiteLang === langCode) showLangToast(err.message || 'Translation failed. Please try again.');
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
    observeNewPageText();

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
    if (currentSiteLang !== 'en') {
        // Wait for initial page sections and destination cards to finish rendering.
        setTimeout(() => selectSiteLanguage(currentSiteLang), 0);
    }
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
    $('#voiceSpeakBtn')?.addEventListener('click', speakTranslation);
    $('#voiceRetryBtn')?.addEventListener('click', retryVoiceTranslation);
    $('#voiceTargetLang')?.addEventListener('change', event => selectVoiceTargetLanguage(event.target.value));
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
