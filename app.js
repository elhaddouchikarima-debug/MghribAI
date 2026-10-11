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
        key: 'sahara-merzouga-caravan',
        fallback: 'assets/discover/sahara-merzouga-caravan.png',
        alt: 'Camel caravan crossing the golden Merzouga dunes in the Sahara',
        title: 'The Sahara Desert',
        subtitle: 'Merzouga Dunes & Camel Caravans',
        pos: '50% 62%',
        posMobile: '62% 50%'
    },
    {
        key: 'chefchaouen-mountain-panorama',
        fallback: 'assets/discover/chefchaouen-mountain-panorama.png',
        alt: 'Chefchaouen, the Blue City, spread across its mountainside at dusk',
        title: 'Chefchaouen',
        subtitle: 'The Blue Pearl of the Rif at Dusk',
        pos: '50% 55%',
        posMobile: '70% 50%'
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

// =============================================================================
// 2. MOROCCAN DESTINATIONS DATASET (AUTHENTIC & VERIFIED)
// =============================================================================
const DESTINATIONS = [
    {
        id: 'marrakech',
        name: 'Marrakech',
        nameFr: 'Marrakech',
        nameAr: 'مراكش',
        region: 'Marrakech-Safi',
        cats: ['imperial'],
        label: 'Imperial Capital',
        emoji: '🕌',
        img: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'The bustling Red City where centuries of history meet vibrant souks, tranquil riads, and Jemaa el-Fna.',
        overview: 'Marrakech is a feast for all senses. Founded in 1062 by the Almoravids, its red clay ramparts shelter lush hidden courtyards, aromatic spice markets, and grand Islamic architecture. As the sun sets, the legendary Jemaa el-Fna square comes alive with storytellers, musicians, and sizzling food stalls.',
        season: 'October – April',
        weather: 'Sunny & Mild (18°C – 28°C)',
        duration: '3 – 5 Days',
        budgetEst: '$45 – $120 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=80', caption: 'Koutoubia Mosque & Historic Medina' },
            { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80', caption: 'Vibrant Spice Souks of the Old Medina' },
            { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80', caption: 'Bahia Palace Moorish Archways' },
            { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', caption: 'Tranquil Riad Courtyard with Zellige Fountain' },
            { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80', caption: 'Ancient Clay Ramparts at Sunset' },
            { url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80', caption: 'Intricate Moroccan Zellige Ceramic Tiles' }
        ],
        landmarks: [
            { name: 'Jemaa el-Fna Square', icon: 'fa-sun', desc: 'UNESCO Masterpiece of Oral and Intangible Heritage' },
            { name: 'Bahia Palace', icon: 'fa-landmark', desc: '19th-century masterpiece of Islamic and Moroccan decorative arts' },
            { name: 'Koutoubia Mosque', icon: 'fa-mosque', desc: 'The 77-meter iconic minaret dominating the city skyline' },
            { name: 'Majorelle Garden', icon: 'fa-seedling', desc: 'Cobalt blue botanical sanctuary created by Jacques Majorelle' }
        ],
        food: [
            { name: 'Tanjia Marrakchia', desc: 'Slow-cooked spiced beef or lamb in a clay urn beneath the hammam ashes.' },
            { name: 'Pastilla', desc: 'Delicate crispy filo pastry layered with spiced meat, cinnamon, and toasted almonds.' },
            { name: 'Mint Tea with Sheeba', desc: 'Traditional gunpowder green tea steeped with fresh spearmint and wormwood.' }
        ],
        culture: 'Marrakech celebrates artisanal craftsmanship with over 40 distinct artisan guilds in the souks, from leather tanners to copper beaters and cedarwood carvers.',
        tips: [
            'Bargain with a friendly smile in the souks — counter-offer roughly half and negotiate warmly.',
            'Stay inside a traditional riad in the Medina for an authentic and peaceful oasis experience.',
            'Visit popular sites like Bahia Palace and Majorelle early morning to avoid peak crowds.'
        ],
        tags: ['marrakech', 'red city', 'medina', 'souks', 'palaces', 'culture', 'food', 'tanjia', 'shopping', 'imperial', 'history', 'spa', 'hammam']
    },
    {
        id: 'chefchaouen',
        name: 'Chefchaouen',
        nameFr: 'Chefchaouen',
        nameAr: 'شفشاون',
        region: 'Tanger-Tétouan-Al Hoceïma',
        cats: ['mountains', 'hidden'],
        label: 'The Blue Pearl',
        emoji: '💙',
        img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Nestled between the peaks of the Rif Mountains, famous worldwide for its serene blue-washed alleyways.',
        overview: 'Founded in 1471 as a fortress against Portuguese invasions, Chefchaouen is legendary for its tranquil blue-painted alleyways and mountain backdrop. Jewish refugees and Andalusian Muslims shaped its distinctive architecture, tinting walls in shades of sky blue to symbolize peace and spirituality.',
        season: 'Year-round (Best: March – June, Sept – Nov)',
        weather: 'Fresh Mountain Breeze (16°C – 25°C)',
        duration: '2 – 3 Days',
        budgetEst: '$35 – $75 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80', caption: 'Famous Blue-Washed Medina Alleyways' },
            { url: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=900&q=80', caption: 'Blue Steps Decorated with Clay Flowerpots' },
            { url: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&w=900&q=80', caption: 'Charming Indigo Passageways in the Old Town' },
            { url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=900&q=80', caption: 'Handcrafted Blue Wooden Doors' },
            { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80', caption: 'Rif Mountain Peaks Framing the Valley' },
            { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80', caption: 'View from the Spanish Mosque at Golden Hour' }
        ],
        landmarks: [
            { name: 'Plaza Uta el-Hammam', icon: 'fa-tree', desc: 'The atmospheric main square lined with cafes and red-stone kasbah' },
            { name: 'The Spanish Mosque', icon: 'fa-mountain', desc: 'Hilltop lookout offering breathtaking sunset views over the blue medina' },
            { name: 'Ras El Maa Waterfall', icon: 'fa-water', desc: 'Fresh mountain springs where locals gather and wash rugs' },
            { name: 'Kasbah Museum', icon: 'fa-shield', desc: 'Restored 15th-century fortress featuring Andalusian gardens and ethnography' }
        ],
        food: [
            { name: 'Jben (Fresh Goat Cheese)', desc: 'Tangy local mountain goat cheese served with fresh olive oil and herbs.' },
            { name: 'Bissara Soup', desc: 'Hearty fava bean soup laced with cumin, garlic, and fresh extra virgin olive oil.' },
            { name: 'Mountain Honey & Figs', desc: 'Wild thyme honey gathered from the surrounding Rif valleys.' }
        ],
        culture: 'Renowned for handwoven Berber wool blankets (mendil) with distinctive red, white, and blue stripes, and delicate cedarwood pottery.',
        tips: [
            'Wear comfortable walking shoes with grip; the cobbled alleys can be steep and slick.',
            'Hike up to the Spanish Mosque 45 minutes before sunset for the most photogenic panorama.',
            'Respect residents by asking permission before photographing people or private doorways.'
        ],
        tags: ['chefchaouen', 'blue pearl', 'blue city', 'mountains', 'rif', 'hiking', 'photography', 'relaxation', 'nature', 'hidden']
    },
    {
        id: 'fes',
        name: 'Fès',
        nameFr: 'Fès',
        nameAr: 'فاس',
        region: 'Fès-Meknès',
        cats: ['imperial'],
        label: 'Spiritual Capital',
        emoji: '🏛',
        img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'The spiritual and intellectual heart of Morocco, home to the worlds oldest university and medieval medina.',
        overview: 'Founded in the 8th century, Fès el-Bali is the worlds largest car-free urban area and a UNESCO World Heritage site. Stepping through the blue tile gates of Bab Bou Jeloud transports you into a living medieval civilization of over 9,000 labyrinthine alleyways, sacred mosques, and aromatic spice souks.',
        season: 'September – May',
        weather: 'Mild & Pleasant (17°C – 26°C)',
        duration: '2 – 4 Days',
        budgetEst: '$40 – $95 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=900&q=80', caption: 'Bab Bou Jeloud (The Famous Blue Gate)' },
            { url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=900&q=80', caption: 'Chouara Leather Tanneries from the Terraces' },
            { url: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=900&q=80', caption: 'Labyrinth of Fès el-Bali Medieval Medina' },
            { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', caption: 'Bou Inania Medersa Carved Stucco and Zellige' },
            { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80', caption: 'Al Quaraouiyine University Marble Court' },
            { url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80', caption: 'Fassi Cobalt Blue Ceramic Pottery' }
        ],
        landmarks: [
            { name: 'Chouara Tannery', icon: 'fa-shoe-prints', desc: '11th-century open-air stone dyeing pits producing world-renowned Moroccan leather' },
            { name: 'Al Quaraouiyine University', icon: 'fa-book-open', desc: 'Founded in 859 AD by Fatima al-Fihri, the oldest continually operating university in the world' },
            { name: 'Bou Inania Medersa', icon: 'fa-mosque', desc: 'Exquisite 14th-century Marinid theological college with intact clock tower' },
            { name: 'Bab Bou Jeloud Gate', icon: 'fa-door-open', desc: 'Grand Moorish entrance tiled in blue on the outside and green inside' }
        ],
        food: [
            { name: 'Pastilla Fassi', desc: 'The definitive Fassi luxury dish: shredded pigeon or chicken layered with spiced almonds and orange blossom water.' },
            { name: 'Lamb Tagine with Prunes', desc: 'Tender braised lamb slow-cooked with caramelized prunes, toasted almonds, and sesame.' },
            { name: 'Khlea', desc: 'Cured spiced beef dried in the sun and preserved in olive oil, traditionally eaten with eggs.' }
        ],
        culture: 'Fes is the artisan capital of Moroccan ceramics, famous worldwide for Fassi cobalt blue pottery, intricate zellige mosaics, and hammered brass lanterns.',
        tips: [
            'Hire an official licensed guide for your first morning to master the Medinas 9,000 alleys without getting lost.',
            'Accept the mint sprig offered by tannery shopkeepers — holding it to your nose counters the strong leather curing scents.',
            'Visit the Pottery Cooperative of Ain Nokbi just outside the medina to watch master artisans at work.'
        ],
        tags: ['fes', 'fez', 'imperial', 'history', 'culture', 'tanneries', 'medina', 'pottery', 'monuments', 'food', 'pastilla']
    },
    {
        id: 'tangier',
        name: 'Tangier',
        nameFr: 'Tanger',
        nameAr: 'طنجة',
        region: 'Tanger-Tétouan-Al Hoceïma',
        cats: ['coast', 'imperial'],
        label: 'Gateway of Africa',
        emoji: '⚓',
        img: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Where the Atlantic meets the Mediterranean, steeped in cosmopolitan romance, coastal views, and legendary literary history.',
        overview: 'Perched on the Strait of Gibraltar just 14 kilometers from Spain, Tangier has captivated artists, writers, and travelers for decades. Once a legendary international zone, the modern city blends bohemian cafes, whitewashed kasbah battlements, and the meeting point of two seas.',
        season: 'April – October',
        weather: 'Sunny & Maritime (19°C – 26°C)',
        duration: '2 – 3 Days',
        budgetEst: '$45 – $105 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=900&q=80', caption: 'Cap Spartel Lighthouse Where Atlantic Meets Mediterranean' },
            { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80', caption: 'Tangier Coastal Bay & Corniche at Dusk' },
            { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80', caption: 'Whitewashed Alleys in the Historic Kasbah' },
            { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80', caption: 'Waves Crashing against the Straits of Gibraltar' },
            { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80', caption: 'Grand Socco & Cinema Rif Moorish Architecture' },
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', caption: 'Sandy Coastline of Achakar Beach' }
        ],
        landmarks: [
            { name: 'Cap Spartel & Lighthouse', icon: 'fa-compass', desc: 'The northwestern tip of Africa where the Atlantic Ocean and Mediterranean Sea merge' },
            { name: 'Caves of Hercules', icon: 'fa-cave', desc: 'Mythological sea-cavern whose opening to the ocean mirrors the outline of Africa' },
            { name: 'The Kasbah & Museum', icon: 'fa-fort-awesome', desc: 'Former sultans palace with panoramic views across the Strait to Spain' },
            { name: 'Café Hafa', icon: 'fa-mug-hot', desc: 'Historic cliffside open-air cafe frequented by Paul Bowles and The Rolling Stones' }
        ],
        food: [
            { name: 'Fresh Mediterranean Fish Tagine', desc: 'Catch of the day with chermoula marinade, bell peppers, tomatoes, and preserved lemon.' },
            { name: 'Bocadillo Tanjawi', desc: 'Famous Tangier street sandwich stuffed with tuna, boiled egg, fries, olives, and harissa.' },
            { name: 'Mint Tea with Pine Nuts', desc: 'Northern Moroccan specialty tea served in the cliffside cafes of Cap Spartel.' }
        ],
        culture: 'A unique cultural crossroads connecting Andalusian music, international diplomacy, Mediterranean seafood traditions, and contemporary art.',
        tips: [
            'Take the Al Boraq high-speed train for a fast, scenic 2-hour trip connecting Tangier to Casablanca or Rabat.',
            'Spend late afternoon at Café Hafa sipping mint tea while watching ferry boats cross to Spain.',
            'Stroll through the Petit Socco to enjoy authentic vintage coffee shops and lively conversation.'
        ],
        tags: ['tangier', 'tanger', 'coast', 'beach', 'strait', 'mediterranean', 'atlantic', 'history', 'sea']
    },
    {
        id: 'essaouira',
        name: 'Essaouira',
        nameFr: 'Essaouira',
        nameAr: 'الصويرة',
        region: 'Marrakech-Safi',
        cats: ['coast'],
        label: 'Atlantic Fort & Port',
        emoji: '🌬',
        img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'A relaxed Atlantic coastal haven celebrated for 18th-century sea ramparts, fresh seafood, and soulful Gnaoua music.',
        overview: 'Formerly known as Mogador, Essaouira is an Atlantic seaside fortress designed in 1760 by a French military architect for Sultan Mohammed ben Abdallah. Known for its steady trade winds, squawking gulls, vibrant blue fishing skiffs, and relaxed artistic tempo, it offers an idyllic coastal escape.',
        season: 'May – November',
        weather: 'Fresh Ocean Breeze (19°C – 24°C)',
        duration: '2 – 4 Days',
        budgetEst: '$40 – $90 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=900&q=80', caption: 'Skala de la Kasbah Ramparts with Bronze Cannons' },
            { url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=80', caption: 'Ocean Bastions Facing the Atlantic Sea Spray' },
            { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80', caption: 'Windsurfing and Kitesurfing across the Atlantic Bay' },
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', caption: 'Wide Golden Sand Beach and Camel Rides' },
            { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80', caption: 'Ancient Portuguese Fortification Walls at Twilight' },
            { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80', caption: 'Thuya Wood Carving Workshops and Souks' }
        ],
        landmarks: [
            { name: 'Skala du Port & Ramparts', icon: 'fa-shield-halved', desc: 'Historic stone ramparts with ocean views across the Atlantic bastions' },
            { name: 'The Fishing Port', icon: 'fa-anchor', desc: 'Bustling harbor where fishermen haul blue wooden boats and grill fresh sardines' },
            { name: 'Mogador Island', icon: 'fa-water', desc: 'Protected nature reserve and sanctuary for rare Eleonoras falcons' },
            { name: 'Thuya Wood Crafts Guild', icon: 'fa-tree', desc: 'Famous artisan workshops carving aromatic burl thuya root wood' }
        ],
        food: [
            { name: 'Fresh Grilled Sardines', desc: 'Caught morning of, tossed on open coals with lemon juice and cumin salt.' },
            { name: 'Fish Tagine with Argan Oil', desc: 'Atlantic sea bass or monkfish cooked in clay tagine drizzled with culinary argan oil.' },
            { name: 'Argan Oil & Amlou', desc: 'Creamy Moroccan spread made from roasted almonds, pure argan oil, and wild honey.' }
        ],
        culture: 'The spiritual birthplace of Gnaoua music — a UNESCO Intangible Cultural Heritage blending sub-Saharan spiritual rhythms and Berber poetry.',
        tips: [
            'Bring a light windbreaker or sweater even in mid-summer; the Atlantic trade wind (Alizee) keeps it breezy.',
            'Select your fresh seafood directly at the port stalls to have it cooked on the spot for lunch.',
            'Take a beginner kitesurfing or horse-riding lesson along the wide sandy beach.'
        ],
        tags: ['essaouira', 'mogador', 'coast', 'beach', 'surfing', 'windsurfing', 'ramparts', 'port', 'seafood', 'gnaoua', 'music', 'argan']
    },
    {
        id: 'merzouga',
        name: 'Merzouga',
        nameFr: 'Merzouga',
        nameAr: 'مرزوكة',
        region: 'Drâa-Tafilalet',
        cats: ['desert'],
        label: 'Jewel of the Sahara',
        emoji: '🏜',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Awe-inspiring Sahara Desert dunes reaching up to 150 meters high, camel caravans, and starlit Berber camps.',
        overview: 'Merzouga is the gateway to Erg Chebbi, Moroccos most majestic dune sea. Watching the apricot-gold sands shift into deep violet as the Saharan sun dips below the horizon, followed by a sky glittering with millions of stars around a desert campfire, is an unforgettable experience.',
        season: 'October – April',
        weather: 'Sunny Warm Days, Crisp Starry Nights',
        duration: '2 – 3 Days',
        budgetEst: '$50 – $140 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80', caption: 'Erg Chebbi Majestic Sand Dunes at Sunset' },
            { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80', caption: 'Camel Caravan Trekking across Golden Ridges' },
            { url: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=900&q=80', caption: 'Vibrant Sunset Over the Endless Saharan Horizon' },
            { url: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=900&q=80', caption: 'Milky Way and Crystal Clear Stargazing Skies' },
            { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80', caption: 'Gateway to the Great Dunes of Tafilalet' },
            { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80', caption: 'Traditional Saharan Mint Tea & Desert Spices' }
        ],
        landmarks: [
            { name: 'Erg Chebbi Dunes', icon: 'fa-mountain-sun', desc: 'Moroccos tallest golden dunes shifting colors continuously with the sun' },
            { name: 'Khamlia Gnawa Village', icon: 'fa-drum', desc: 'Desert community famous for soulful live Gnawa music and hospitality' },
            { name: 'Dayet Srji Flamingo Lake', icon: 'fa-feather', desc: 'Seasonal desert lake attracting flocks of pink flamingos in winter and spring' },
            { name: 'Rissani Mausoleum & Date Souk', icon: 'fa-landmark', desc: 'Ancient trading post on the trans-Saharan caravan route' }
        ],
        food: [
            { name: 'Medfouna (Berber Pizza)', desc: 'Stuffed desert bread baked in sand ovens with spiced minced beef, almonds, and herbs.' },
            { name: 'Desert Camp Tagine', desc: 'Clay pot cooked over glowing charcoal in the sand, scented with cumin, ginger, and saffron.' },
            { name: 'Dates of Tafilalet', desc: 'Sweet, rich Medjool dates harvested from the surrounding desert palmeries.' }
        ],
        culture: 'Deeply rooted in nomadic Berber traditions, camel husbandry, celestial navigation, and warm hospitality around the evening fire.',
        tips: [
            'Pack warm layers — desert nights can drop below 10°C even after sunny 25°C days.',
            'Opt for a desert camp with private en-suite tents and solar power for maximum comfort.',
            'Wake up before dawn for a sunrise trek up the high ridge — the colors are unforgettable.'
        ],
        tags: ['merzouga', 'sahara', 'desert', 'dunes', 'erg chebbi', 'camels', 'stargazing', 'camp', 'medfouna', 'adventure']
    },
    {
        id: 'agadir',
        name: 'Agadir & Taghazout',
        nameFr: 'Agadir & Taghazout',
        nameAr: 'أكادير وتغازوت',
        region: 'Souss-Massa',
        cats: ['coast'],
        label: 'Sun & Atlantic Surf',
        emoji: '🏄',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Moroccos premier coastal resort with 300 days of sunshine, world-class surf breaks, and sandy crescent bays.',
        overview: 'Blessed with 300 days of annual sunshine and a wide 10-kilometer golden beach, Agadir is Moroccos modern seaside capital. Just 20 minutes north lies the world-famous surf village of Taghazout, where surfers from around the globe ride legendary point breaks.',
        season: 'Year-round (Best: October – May)',
        weather: 'Warm & Sunny (22°C – 28°C)',
        duration: '3 – 6 Days',
        budgetEst: '$45 – $110 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', caption: 'Agadir 10-Kilometer Golden Beach Crescent' },
            { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80', caption: 'Surfing World-Class Waves in Taghazout' },
            { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80', caption: 'Sunny Coastline and Beachfront Resorts' },
            { url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=80', caption: 'Atlantic Golden Hour Sunset over the Ocean' },
            { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80', caption: 'Waves Breaking near Anchor Point Bastion' },
            { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', caption: 'Paradise Valley Natural Rock Pools & Palms' }
        ],
        landmarks: [
            { name: 'Agadir Oufella Kasbah', icon: 'fa-landmark', desc: '16th-century hilltop citadel featuring panoramic views across the bay' },
            { name: 'Taghazout Bay & Anchor Point', icon: 'fa-water', desc: 'Legendary surf mecca with right-hand point breaks and chill bohemian cafes' },
            { name: 'Souk El Had', icon: 'fa-store', desc: 'One of the largest markets in Africa with over 6,000 stalls of spices and crafts' },
            { name: 'Paradise Valley', icon: 'fa-gem', desc: 'Mountain oasis 45 minutes inland with emerald rock pools and palm groves' }
        ],
        food: [
            { name: 'Argan Tagine of the Souss', desc: 'Slow-cooked local chicken with preserved lemons and organic Souss argan oil.' },
            { name: 'Grilled Sea Bream & Calamari', desc: 'Fresh seafood prepared on the beachfront boardwalk with homemade harissa.' },
            { name: 'Amlou on Warm Msemmen', desc: 'Rich dip of roasted almonds, pure argan oil, and blossom honey served on flaky flatbread.' }
        ],
        culture: 'Center of Amazigh (Berber) culture in the fertile Souss Valley, celebrated for silver jewelry and argan cooperatives.',
        tips: [
            'Take the modern cable car up to the restored Agadir Oufella Kasbah at sunset.',
            'Visit an authentic women-led argan oil cooperative on the road to Taghazout.',
            'Rent a surfboard or book a surf coaching lesson in Taghazout.'
        ],
        tags: ['agadir', 'taghazout', 'coast', 'beach', 'surf', 'sun', 'swimming', 'paradise valley', 'argan', 'souss']
    },
    {
        id: 'rabat',
        name: 'Rabat',
        nameFr: 'Rabat',
        nameAr: 'الرباط',
        region: 'Rabat-Salé-Kénitra',
        cats: ['imperial', 'coast'],
        label: 'Modern Capital & UNESCO Heritage',
        emoji: '🏛',
        img: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Moroccos elegant capital combining tree-lined boulevards, coastal ocean fortress, and UNESCO-listed monuments.',
        overview: 'Named a UNESCO World Heritage site, Rabat is one of Moroccos four Imperial Cities. It offers a sophisticated atmosphere with clean coastal air, the dramatic 12th-century Hassan Tower, and the cliffside Kasbah of the Udayas.',
        season: 'Year-round (Best: April – November)',
        weather: 'Pleasant Coastal Climate (18°C – 25°C)',
        duration: '2 – 3 Days',
        budgetEst: '$45 – $100 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=900&q=80', caption: 'Hassan Tower Red Sandstone Columns & Minaret' },
            { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', caption: 'Andalusian Gardens of the Kasbah of the Udayas' },
            { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80', caption: 'Blue and White Alleys of the Kasbah of the Udayas' },
            { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80', caption: 'Royal Palace Monumental Archway' },
            { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80', caption: 'Bouregreg Marina & Mohammed VI Tower' },
            { url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80', caption: 'Mausoleum of Mohammed V Royal Craftsmanship' }
        ],
        landmarks: [
            { name: 'Hassan Tower & Mausoleum', icon: 'fa-monument', desc: '12th-century minaret and tomb of the royal kings guarded by royal horsemen' },
            { name: 'Kasbah of the Udayas', icon: 'fa-fort-awesome', desc: '12th-century cliffside fortress with blue-and-white houses and ocean vistas' },
            { name: 'Chellah Necropolis', icon: 'fa-landmark', desc: 'Ancient Roman ruins of Sala Colonia intertwined with medieval Marinid royal tombs' },
            { name: 'Grand Theatre of Rabat', icon: 'fa-masks-theater', desc: 'Futuristic architectural masterpiece designed by Zaha Hadid' }
        ],
        food: [
            { name: 'Couscous Bidawi with Seven Vegetables', desc: 'Fluffy steamed semolina topped with pumpkin, turnips, carrots, and chickpeas.' },
            { name: 'Kaab el Ghazal (Gazelle Horns)', desc: 'Delicate crescent pastries filled with almond paste scented with orange blossom.' },
            { name: 'Harira Soup with Dates', desc: 'Rich tomato, lentil, and chickpea broth traditionally served with honeyed chebakia.' }
        ],
        culture: 'A calm, prestigious cultural center hosting the National Museum of Modern Art and pristine embassies.',
        tips: [
            'Rabat is very walkable and has modern trams connecting the capital across the river to Salé.',
            'Visit the Café Maure in the Kasbah of the Udayas for mint tea with a panoramic view of the river mouth.',
            'Dress respectfully when visiting the Mausoleum of Mohammed V.'
        ],
        tags: ['rabat', 'capital', 'imperial', 'history', 'monuments', 'unesco', 'hassan tower', 'udayas', 'museums']
    },
    {
        id: 'ifrane',
        name: 'Ifrane',
        nameFr: 'Ifrane',
        nameAr: 'إفران',
        region: 'Fès-Meknès',
        cats: ['mountains', 'hidden'],
        label: 'Little Switzerland of Morocco',
        emoji: '🌲',
        img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'A picturesque alpine resort in the Middle Atlas featuring cedar forests, Swiss-style chalets, and winter snow.',
        overview: 'Located at 1,665 meters altitude in the Middle Atlas, Ifrane was built in the 1930s. Often called the Switzerland of Morocco, it boasts red-roofed alpine chalets, pristine flower-lined parks, Europe-like cleanliness, and nearby ski slopes at Michlifen.',
        season: 'Year-round (Autumn & Winter for snow; Spring for greenery)',
        weather: 'Crisp Alpine Air (0°C in Winter, 22°C in Summer)',
        duration: '1 – 2 Days',
        budgetEst: '$40 – $95 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80', caption: 'Pristine Cedar and Pine Mountains of the Middle Atlas' },
            { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80', caption: 'Cèdre Gouraud Ancient Forest Near Azrou' },
            { url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=900&q=80', caption: 'Alpine Snow Chalets and Ski Resort of Michlifen' },
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80', caption: 'Snow-Dusted Middle Atlas Mountain Horizon' },
            { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80', caption: 'Green Valleys and Springs around Ifrane National Park' },
            { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', caption: 'Tranquil Lakeside Gardens of Al Akhawayn University' }
        ],
        landmarks: [
            { name: 'The Stone Lion of Ifrane', icon: 'fa-shield-cat', desc: 'Famous sculpture carved into living boulder commemorating the extinct Atlas Lion' },
            { name: 'Cèdre Gouraud Forest (Azrou)', icon: 'fa-tree', desc: 'Century-old cedar forest home to wild Barbary macaque monkeys' },
            { name: 'Michlifen Ski Station', icon: 'fa-person-skiing', desc: 'Volcanic crater ski resort situated at 2,000 meters altitude' },
            { name: 'Vittel Spring & Waterfalls', icon: 'fa-water', desc: 'Peaceful forested pathway leading to freshwater mountain springs' }
        ],
        food: [
            { name: 'Atlas Mountain Trout', desc: 'Fresh trout caught in cold mountain streams and grilled with fresh herbs.' },
            { name: 'Middle Atlas Wild Mushroom Tagine', desc: 'Seasonal morel and boletus mushrooms braised with tender beef.' },
            { name: 'Hot Spiced Mint Tea with Mountain Thyme', desc: 'Warming herbal tea infused with wild thyme and pennyroyal.' }
        ],
        culture: 'A unique blend of clean alpine university town culture and traditional Berber pastoral life from nearby Azrou.',
        tips: [
            'Visit the nearby Azrou cedar forest to see friendly Barbary macaques in their natural habitat.',
            'Great stopover destination when traveling between Fes and the Sahara Desert.',
            'In winter (Dec-Feb), pack warm winter coats, gloves, and boots.'
        ],
        tags: ['ifrane', 'mountains', 'snow', 'cedar', 'nature', 'switzerland', 'monkeys', 'middle atlas', 'hiking']
    },
    {
        id: 'al-hoceima',
        name: 'Al Hoceima',
        nameFr: 'Al Hoceïma',
        nameAr: 'الحسيمة',
        region: 'Tanger-Tétouan-Al Hoceïma',
        cats: ['coast', 'hidden'],
        label: 'Mediterranean Turquoise Jewel',
        emoji: '🏖',
        img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Crystal-clear turquoise Mediterranean waters framed by the dramatic red cliffs of the Rif Mountains.',
        overview: 'Overlooking one of the most stunning Mediterranean bays in North Africa, Al Hoceima combines turquoise waters, hidden coves, and pristine national parks. Its Spanish-influenced plazas and fresh grilled seafood make it a sublime coastal paradise.',
        season: 'May – October',
        weather: 'Warm Mediterranean Sunshine (22°C – 29°C)',
        duration: '2 – 4 Days',
        budgetEst: '$35 – $85 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80', caption: 'Plage Quemado Turquoise Water and Cliffs' },
            { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', caption: 'Al Hoceima National Park Coastal Cliffs' },
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', caption: 'Cala Bonita Cove with Crystal Calm Seas' },
            { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80', caption: 'Mediterranean Clear Blue Waters' },
            { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80', caption: 'Scenic Clifftop Promenades and Sunset Views' },
            { url: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=900&q=80', caption: 'Al Hoceima Harbor and Fishing Skiffs' }
        ],
        landmarks: [
            { name: 'Plage Quemado', icon: 'fa-umbrella-beach', desc: 'The iconic golden sand cove situated right at the foot of dramatic cliff walls' },
            { name: 'Al Hoceima National Park', icon: 'fa-mountain', desc: 'Coastal park sanctuary for rare osprey birds, dolphins, and unspoiled coves' },
            { name: 'Plage Asfiha & Spanish Rock', icon: 'fa-island-tropical', desc: 'Panoramic beach looking directly across at Peñón de Alhucemas' },
            { name: 'Cala Bonita', icon: 'fa-water', desc: 'Peaceful turquoise cove ideal for family swimming and snorkeling' }
        ],
        food: [
            { name: 'Mediterranean Espeto de Sardinas', desc: 'Fresh sardines skewered on canes and barbecued over open beach fires.' },
            { name: 'Rifian Paella & Seafood Platter', desc: 'Seafood rice dish bursting with local shrimp, squid, and clams.' },
            { name: 'Fresh Fig & Cactus Fruit', desc: 'Sweet prickly pears harvested fresh from coastal Rif slopes.' }
        ],
        culture: 'Proud Amazigh Rifian maritime culture, where Berber traditions merge with Mediterranean lifestyle.',
        tips: [
            'Rent a kayak or take a boat tour to explore secret sea caves in Al Hoceima National Park.',
            'Visit in June or September for tranquil beaches without midsummer holiday crowds.',
            'Try snorkeling at Cala Bonita where waters are calm and transparent.'
        ],
        tags: ['al hoceima', 'mediterranean', 'beach', 'turquoise', 'cove', 'rif', 'nature', 'swimming', 'seafood']
    },
    {
        id: 'ouarzazate',
        name: 'Ouarzazate & Aït Benhaddou',
        nameFr: 'Ouarzazate & Aït Benhaddou',
        nameAr: 'ورزازات وقصر آيت بن حدو',
        region: 'Drâa-Tafilalet',
        cats: ['desert', 'hidden'],
        label: 'Door of the Desert & UNESCO Ksar',
        emoji: '🏰',
        img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Legendary clay kasbahs, cinema studios, and the iconic UNESCO World Heritage fortress of Aït Benhaddou.',
        overview: 'Known as the Door of the Desert, Ouarzazate is famed for its monumental earthen architecture and global film studios. Nearby stands the majestic Ksar of Aït Benhaddou, a UNESCO World Heritage site and backdrop for Gladiator and Lawrence of Arabia.',
        season: 'October – April',
        weather: 'Sunny & Dry Desert Climate (20°C – 28°C)',
        duration: '1 – 3 Days',
        budgetEst: '$40 – $90 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80', caption: 'Aït Benhaddou Ancient Clay Kasbah Towers' },
            { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80', caption: 'Gateway to the Saharan Desert and Ounila Valley' },
            { url: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=900&q=80', caption: 'Red Clay Earth of Draa Valley at Sunset' },
            { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80', caption: 'Taourirt Kasbah Intricate Geometric Reliefs' },
            { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80', caption: 'Local Saffron and Spices of the Draa Valley' },
            { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80', caption: 'Lush Date Palm Oasis beneath Red Mountains' }
        ],
        landmarks: [
            { name: 'Ksar of Aït Benhaddou', icon: 'fa-chess-rook', desc: '11th-century UNESCO fortified clay village on the trans-Saharan caravan route' },
            { name: 'Atlas Film Studios', icon: 'fa-film', desc: 'One of the worlds largest movie production lots with Egyptian and Roman sets' },
            { name: 'Kasbah Taourirt', icon: 'fa-castle', desc: 'Historic residence of the Glaoui pasha featuring ornate clay rooms' },
            { name: 'Ounila Valley', icon: 'fa-road', desc: 'Spectacular canyon road linking Aït Benhaddou to the High Atlas' }
        ],
        food: [
            { name: 'Tagine of Camel Meat & Figs', desc: 'Slow-braised camel meat with desert figs, wild cumin, and sweet onions.' },
            { name: 'Ouarzazate Saffron Couscous', desc: 'Golden semolina scented with pure Taliouine saffron and organic vegetables.' },
            { name: 'Berber Bread with Olive Oil', desc: 'Fresh baked clay-oven flatbread dipped in local Draa olive oil.' }
        ],
        culture: 'Centuries of southern Moroccan Glaoua history, caravan trade lore, and traditional mud-brick earthen architecture.',
        tips: [
            'Cross the river stones early in the morning to explore Aït Benhaddou before tour buses arrive.',
            'Climb to the ruined granary at the summit of Aït Benhaddou for an extraordinary 360° valley view.',
            'Tour Atlas Film Studios for behind-the-scenes movie sets.'
        ],
        tags: ['ouarzazate', 'ait benhaddou', 'kasbah', 'cinema', 'gladiator', 'unesco', 'desert', 'history', 'architecture']
    },
    {
        id: 'high-atlas',
        name: 'High Atlas & Imlil (Toubkal)',
        nameFr: 'Haut Atlas & Imlil (Toubkal)',
        nameAr: 'الأطلس الكبير وإمليل (توبقال)',
        region: 'Marrakech-Safi',
        cats: ['mountains'],
        label: 'Roof of North Africa',
        emoji: '🏔',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        shortDesc: 'Gateway to Mount Toubkal (4,167m), terraced Berber villages, rushing mountain rivers, and alpine hiking.',
        overview: 'Rising just 90 minutes south of Marrakech, the High Atlas Mountains form the dramatic spine of Morocco. The village of Imlil serves as the premier mountain trekking base, where terraced apple orchards, stone Berber houses, and mule tracks lead toward Mount Toubkal.',
        season: 'April – October (Hiking); Dec – March (Snow sports)',
        weather: 'Cool Mountain Breeze (14°C – 24°C Summer)',
        duration: '2 – 4 Days',
        budgetEst: '$35 – $80 / day per person',
        gallery: [
            { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80', caption: 'High Atlas Snowy Peaks and Ridgelines' },
            { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80', caption: 'Traditional Stone Berber Village of Imlil' },
            { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', caption: 'Ourika Valley Cascades and Riverbanks' },
            { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80', caption: 'Walnut Groves along Mountain Trekking Trails' },
            { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', caption: 'Kasbah du Toubkal Terraces Facing High Peaks' },
            { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80', caption: 'Berber Hospitality with Freshly Steeped Mint Tea' }
        ],
        landmarks: [
            { name: 'Mount Toubkal Peak (4,167m)', icon: 'fa-mountain', desc: 'Highest mountain peak in North Africa and the Arab world' },
            { name: 'Aroumd Village', icon: 'fa-house-chimney-window', desc: 'Traditional village built on a spur of rock with views across the Mizane Valley' },
            { name: 'Tizi n’Tichka Pass', icon: 'fa-road', desc: 'Breathtaking 2,260-meter mountain pass connecting Marrakech to the south' },
            { name: 'Ourika Valley Waterfalls', icon: 'fa-water', desc: 'Lush green valley with natural cascades and riverside cafes' }
        ],
        food: [
            { name: 'Berber Tagine on Open Fire', desc: 'Conical earthenware tagine packed with mountain vegetables, wild herbs, and goat meat.' },
            { name: 'Fresh Walnuts & Mountain Honey', desc: 'Locally harvested Atlas walnuts served with warm bread and wild thyme honey.' },
            { name: 'High Atlas Herb Tea', desc: 'Infused with mountain sage, pennyroyal, and spearmint.' }
        ],
        culture: 'Authentic Berber highland culture emphasizing community solidarity, terraced agriculture, and mountain hospitality.',
        tips: [
            'Hiring an official registered mountain guide is mandatory for the Mount Toubkal summit trek.',
            'Pack sturdy hiking boots, sun protection, and a warm fleece for cool mountain evenings.',
            'Stop for lunch at a riverside Berber cafe in the Ourika Valley.'
        ],
        tags: ['high atlas', 'atlas', 'imlil', 'toubkal', 'mountains', 'hiking', 'trekking', 'berber', 'nature', 'ourika']
    }
];

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
        landmarksList.innerHTML = city.landmarks.map(lm => `
            <div class="surface-card p-5 rounded-2xl flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] text-base shrink-0">
                    <i class="fa-solid ${lm.icon}"></i>
                </div>
                <div>
                    <h5 class="font-bold text-sm mb-1">${lm.name}</h5>
                    <p class="text-xs opacity-75 leading-relaxed">${lm.desc}</p>
                </div>
            </div>
        `).join('');
    }

    // Food Tab
    const foodList = $('#cityFoodList');
    if (foodList) {
        foodList.innerHTML = city.food.map(f => `
            <div class="surface-card p-5 rounded-2xl">
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-[var(--accent-gold)] font-bold text-sm">🍲 ${f.name}</span>
                </div>
                <p class="text-xs opacity-80 leading-relaxed">${f.desc}</p>
            </div>
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
    $('#voiceModal')?.classList.add('hidden');
    document.body.style.overflow = '';
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

    // 4. Destinations Grid
    renderDestinationsGrid();

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

    // 10. Voice Translator Controls
    $$('[data-open-voice]').forEach(btn => btn.addEventListener('click', openVoiceTranslator));
    $('#closeVoiceModal')?.addEventListener('click', closeVoiceTranslator);
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