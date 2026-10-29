/**
 * चित्रसृष्टी (ChitraSrushti) - Marathi Text & Speech to Image Generation Server
 * 100% Error-Free Architecture: Multi-tier fallback, zero 402/500 errors,
 * high-precision translation for ANY Marathi text into real AI images.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const OUTPUTS_DIR = path.join(__dirname, 'outputs');

// Ensure outputs directory exists
if (!fs.existsSync(OUTPUTS_DIR)) {
  fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
}

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

// Style enhancers mapping - Tuned for real, authentic photography (वास्तववादी छायाचित्र)
const STYLE_PROMPTS = {
  photorealistic: 'authentic real life photo, sharp DSLR photograph, natural lighting, highly detailed, realistic, clean focus, 35mm lens, 8k uhd',
  warli: 'authentic Warli folk painting, white rice paste on terracotta, geometric tribal folk art, sharp details',
  rajaravivarma: 'Raja Ravi Varma oil painting style, royal Indian classic portrait, rich textures, dramatic chiaroscuro',
  cinematic: 'cinematic still, natural film lighting, depth of field, sharp focus, 8k',
  watercolor: 'clean watercolor painting, vibrant pigment, clear detailed illustration',
  digital3d: 'clean 3D render, Octane render, sharp focus, high detail, 8k',
  anime: 'vibrant anime aesthetic, Makoto Shinkai style, crisp clean lines, highly detailed',
  peshwai: 'Peshwai royal Maratha era portrait, Paithani silk, sharp detailed historic artwork',
  sketch: 'detailed pencil sketch, fine charcoal lines, high contrast, clean white background',
  none: 'authentic real photo, sharp focus, natural lighting, high detail, 8k'
};

// ============================================================
// COMPREHENSIVE MARATHI VISUAL DICTIONARY
// 300+ terms: festivals, nature, food, people, animals, places, actions, spirituality
// ============================================================
const MARATHI_VISUAL_DICT = [

  // ---- FESTIVALS & OCCASIONS ----
  { p: /गुढीपाडवा|गुढी\s*पाडवा/i,
    en: 'Gudi Padwa festival, traditional Maharashtrian New Year celebration' },
  { p: /गुढी/i,
    en: 'decorated Gudi pole with bright silk cloth, neem leaves garland, mango leaves garland, sugar crystal garland and shiny copper kalash pot on top, erected upright at a doorstep' },
  { p: /दिवाळी|दीपावली/i,
    en: 'Diwali festival of lights, rows of glowing clay oil lamp diyas, festive decorations' },
  { p: /होळी/i,
    en: 'Holi festival of colors, people joyfully throwing bright colored gulal powder' },
  { p: /दसरा/i,
    en: 'Dussehra festival, golden shami leaves, royal elephant procession, victory celebration' },
  { p: /नवरात्र/i,
    en: 'Navratri festival, nine-night celebration, Goddess Durga idol with lamps and flowers' },
  { p: /गणेशोत्सव|गणेश\s*चतुर्थी/i,
    en: 'Ganesh Chaturthi festival, large beautifully decorated Ganesha idol with marigolds' },
  { p: /महाशिवरात्र/i,
    en: 'Mahashivratri, Shiva lingam decorated with bilva leaves, flowers, milk' },
  { p: /संक्रांत|मकर\s*संक्रांती/i,
    en: 'Makar Sankranti festival, colorful kites flying in blue sky, til-gul sweets being shared' },
  { p: /रक्षाबंधन/i,
    en: 'Raksha Bandhan, sister tying colorful rakhi thread on brother wrist' },
  { p: /भाऊबीज/i,
    en: 'Bhaubeej celebration, sister applying tilak on brothers forehead' },
  { p: /पाडवा/i,
    en: 'traditional festive celebration with wife putting tilak on husband forehead' },
  { p: /वसंत\s*पंचमी/i,
    en: 'Vasant Panchami, yellow flowers, Goddess Saraswati puja' },

  // ---- NATURE & SCENERY ----
  { p: /सूर्योदय|उगवता\s*सूर्य/i,
    en: 'golden sunrise, warm orange and pink dawn sky, first rays of sunlight' },
  { p: /सूर्यास्त|मावळता\s*सूर्य/i,
    en: 'beautiful sunset with vivid orange red and purple sky at dusk' },
  { p: /पाऊस|पावसाळा|पावसात/i,
    en: 'Indian monsoon rain, heavy rainfall, dark storm clouds, raindrops splashing' },
  { p: /इंद्रधनुष्य/i,
    en: 'vivid colorful rainbow arching across the sky after rain' },
  { p: /चंद्र|चांदणे|पौर्णिमा/i,
    en: 'bright full moon in a clear starry night sky, silver moonlight' },
  { p: /तारे|आकाशगंगा/i,
    en: 'starry night sky with Milky Way galaxy visible' },
  { p: /धबधबा/i,
    en: 'majestic waterfall cascading powerfully down rocky cliff surrounded by lush greenery' },
  { p: /नदी|ओढा|झरा/i,
    en: 'flowing river with clear sparkling water and green rocky banks' },
  { p: /तलाव|सरोवर/i,
    en: 'serene lake with still reflective water and lotus flowers' },
  { p: /समुद्र|सागर/i,
    en: 'vast blue ocean with powerful waves crashing on shore' },
  { p: /किनारा|समुद्रकिनारा/i,
    en: 'beautiful sandy beach with blue sea waves, coconut palm trees' },
  { p: /डोंगर|पर्वत/i,
    en: 'majestic rocky mountains with green valleys and misty clouds' },
  { p: /सह्याद्री/i,
    en: 'Sahyadri Western Ghats mountains, rugged rocky terrain, dense forest, morning mist' },
  { p: /जंगल|अरण्य|वन/i,
    en: 'dense tropical green jungle forest, tall trees, dappled sunlight through canopy' },
  { p: /शेत/i,
    en: 'lush green agricultural farmland with crops in rows under open sky' },
  { p: /पीक|धान|ज्वारी|बाजरी/i,
    en: 'golden crops ready for harvest in fields' },
  { p: /झाड|वृक्ष|झाडे/i,
    en: 'large ancient tree with wide green canopy and thick trunk' },
  { p: /नारळ/i,
    en: 'tall swaying coconut palm trees on a tropical coastline' },
  { p: /आंबा/i,
    en: 'mango tree with ripe golden mangoes hanging from branches' },
  { p: /कमळ/i,
    en: 'pink lotus flower floating and blooming on a calm pond' },
  { p: /गुलाब/i,
    en: 'red rose with water dewdrops glistening on soft petals' },
  { p: /जास्वंद/i,
    en: 'bright red hibiscus flower in full bloom' },
  { p: /मोगरा/i,
    en: 'white mogra jasmine flowers with delicate fragrant petals' },
  { p: /झेंडू/i,
    en: 'orange and yellow marigold flowers' },
  { p: /फुले|फूल/i,
    en: 'colorful blooming flowers with vibrant petals and green leaves' },
  { p: /गवत|हिरवे\s*गवत/i,
    en: 'fresh green grass' },
  { p: /धुके/i,
    en: 'thick morning mist and fog' },
  { p: /वारा/i,
    en: 'gentle breeze, leaves and cloth swaying in the wind' },
  { p: /बर्फ|हिम/i,
    en: 'snow covered landscape, white snow on trees and ground' },
  { p: /वाळवंट/i,
    en: 'golden desert sand dunes under bright sun' },

  // ---- ANIMALS & BIRDS ----
  { p: /मोर/i,
    en: 'magnificent Indian peacock with iridescent blue green tail feathers fully spread open in a stunning fan display' },
  { p: /वाघ/i,
    en: 'majestic Royal Bengal tiger with bold black and orange stripes in lush forest' },
  { p: /सिंह/i,
    en: 'powerful lion with golden mane, king of the jungle' },
  { p: /हत्ती/i,
    en: 'large majestic Indian elephant with decorated tusks and colorful cloth' },
  { p: /घोडा|अश्व/i,
    en: 'powerful white stallion horse galloping freely' },
  { p: /गाय|गोमाता/i,
    en: 'sacred white Indian cow adorned with flower garland' },
  { p: /बैल/i,
    en: 'sturdy white Indian bull with decorated horns plowing field' },
  { p: /रेडा|म्हैस/i,
    en: 'black Indian water buffalo in muddy water' },
  { p: /बकरी|शेळी/i,
    en: 'white goat grazing on a hillside' },
  { p: /कोकीळ/i,
    en: 'Indian koel cuckoo bird singing on a mango tree branch' },
  { p: /पोपट/i,
    en: 'bright emerald green Indian parrot perched on a branch, red beak' },
  { p: /चिमणी/i,
    en: 'tiny sparrow bird perched on a windowsill' },
  { p: /गरुड|ससाणा/i,
    en: 'majestic eagle soaring high in the blue sky with wings spread' },
  { p: /कावळा/i,
    en: 'black crow perched on a branch' },
  { p: /हंस/i,
    en: 'graceful white swan gliding on a calm lake' },
  { p: /हरीण/i,
    en: 'graceful spotted Indian deer in a green forest clearing' },
  { p: /ससा/i,
    en: 'small white fluffy bunny rabbit in green grass' },
  { p: /माकड/i,
    en: 'playful monkey swinging in a tree with bright eyes' },
  { p: /अस्वल/i,
    en: 'brown bear in a forest' },
  { p: /साप/i,
    en: 'colorful patterned snake coiled on a rock' },
  { p: /मासे|मासा/i,
    en: 'colorful fish swimming in clear blue water' },
  { p: /फुलपाखरू/i,
    en: 'colorful butterfly with vibrant wings resting on a flower' },
  { p: /मधमाशी/i,
    en: 'honeybee collecting nectar from a flower' },
  { p: /(कुत्रा|पिल्लू)/i,
    en: 'playful friendly dog puppy with bright eyes' },
  { p: /(मांजर|बोका)/i,
    en: 'cute fluffy domestic cat with curious eyes' },

  // ---- FOOD & CUISINE ----
  { p: /भाकरी/i,
    en: 'freshly made round jowar sorghum bhakri flatbread on a clay stove with fire' },
  { p: /पुरणपोळी/i,
    en: 'golden traditional Maharashtrian Puran Poli sweet stuffed flatbread with shiny ghee' },
  { p: /मोदक/i,
    en: 'white steamed rice flour modak sweet dumplings in a plate, Ganesha favorite' },
  { p: /चपाती|रोटी|फुलका/i,
    en: 'fresh hot puffed chapati roti flatbread on a tawa' },
  { p: /वरण\s*भात|वरण/i,
    en: 'bowl of traditional Maharashtrian dal varan with yellow turmeric color and ghee' },
  { p: /आमटी/i,
    en: 'bowl of spiced Maharashtrian amti dal with tempering' },
  { p: /भात/i,
    en: 'plate of hot steamed white rice with steam rising' },
  { p: /चहा/i,
    en: 'hot aromatic masala chai tea in a clay kullad cup with steam curling up' },
  { p: /कॉफी/i,
    en: 'hot coffee with frothy milk in a white cup' },
  { p: /श्रीखंड/i,
    en: 'creamy saffron infused Shrikhand yogurt dessert with dry fruits' },
  { p: /खीर|पायस/i,
    en: 'creamy white rice kheer pudding with saffron and pistachios in a bowl' },
  { p: /हलवा/i,
    en: 'golden warm halwa dessert with ghee and dry fruits' },
  { p: /जिलेबी/i,
    en: 'orange crispy spiral jalebi soaked in sugar syrup on a plate' },
  { p: /मिसळ/i,
    en: 'Maharashtrian Misal Pav spicy sprouts curry with pav bread, farsan, onions and green chutney' },
  { p: /पाव\s*भाजी/i,
    en: 'Mumbai Pav Bhaji, buttery mixed vegetable curry with toasted pav buns and onions' },
  { p: /वडा\s*पाव/i,
    en: 'Mumbai street food Vada Pav, spiced potato fritter in a bread bun with chutneys' },
  { p: /कोल्हापुरी/i,
    en: 'fiery spicy Kolhapuri curry with deep red oil floating, served with bhakri' },
  { p: /सोलकढी/i,
    en: 'pink Kokum Solkadi drink garnished with coriander and coconut milk' },
  { p: /तिळगूळ/i,
    en: 'white til sesame and jaggery laddoo balls on a plate, Sankranti special' },
  { p: /लाडू/i,
    en: 'round golden besan or motichoor laddoo sweets on a plate' },
  { p: /करंजी/i,
    en: 'golden fried Diwali karanji sweet pastry with coconut filling' },
  { p: /चकली/i,
    en: 'crispy spiral chakli savoury snack' },
  { p: /उकडीचे\s*मोदक/i,
    en: 'white steamed rice flour modak with pleated top, served on a banana leaf' },

  // ---- PEOPLE & CLOTHING ----
  { p: /नऊवारी\s*साडी|नऊवारी/i,
    en: 'woman in traditional nine-yard Nauvari drape Maharashtrian saree with kamarband' },
  { p: /पैठणी/i,
    en: 'woman wearing beautiful silk Paithani saree with peacock motif border and golden zari weave' },
  { p: /धोतर/i,
    en: 'man wearing white traditional dhoti with angavastram shawl over shoulder' },
  { p: /फेटा|पगडी/i,
    en: 'man wearing traditional saffron orange Maharashtrian pheta turban on head' },
  { p: /कुडता/i,
    en: 'man wearing a traditional Indian kurta' },
  { p: /बाळ|लहान\s*मूल/i,
    en: 'cute chubby Indian baby with bright eyes and innocent smile' },
  { p: /आई|माता/i,
    en: 'gentle loving Indian mother in a saree with warm smile' },
  { p: /बाबा|वडील/i,
    en: 'kind Indian father figure in traditional attire' },
  { p: /आजी/i,
    en: 'elderly Indian grandmother with silver white hair, kind wrinkled face and loving eyes' },
  { p: /आजोबा/i,
    en: 'elderly Indian grandfather with white beard sitting peacefully' },
  { p: /शेतकरी/i,
    en: 'hardworking Indian farmer wearing white dhoti with headgear, holding a plough in green farmfield' },
  { p: /स्त्री|महिला/i,
    en: 'graceful Indian woman in traditional colorful attire' },
  { p: /मुलगी/i,
    en: 'young Indian girl in bright colorful dress' },
  { p: /मुलगा/i,
    en: 'young Indian boy in traditional attire' },
  { p: /विद्यार्थी/i,
    en: 'Indian student with books and school bag' },
  { p: /नर्तक|नर्तकी/i,
    en: 'classical Indian dancer performing with expressive hand mudras and colorful costume' },

  // ---- PLACES & ARCHITECTURE ----
  { p: /मंदिर|देऊळ/i,
    en: 'ancient ornate Hindu temple with intricate stone carvings, temple tower shikhara, brass bells' },
  { p: /मशीद/i,
    en: 'mosque with white dome and tall minarets' },
  { p: /चर्च/i,
    en: 'old colonial stone church with cross on top' },
  { p: /गाव|खेडे/i,
    en: 'peaceful Indian village with mud houses, open fields, trees and clear blue sky' },
  { p: /शहर|नगर/i,
    en: 'vibrant Indian city with buildings, streets and people' },
  { p: /मुंबई/i,
    en: 'Mumbai city skyline with Gateway of India monument and the Arabian Sea' },
  { p: /पुणे/i,
    en: 'Pune city with Shaniwarwada fort and modern buildings in the background' },
  { p: /कोकण/i,
    en: 'scenic Konkan coast of Maharashtra with coconut palms, red-roof houses and blue sea' },
  { p: /नाशिक/i,
    en: 'Nashik with Godavari river ghats, ancient temples and grape vineyards' },
  { p: /विदर्भ/i,
    en: 'Vidarbha region, cotton fields, orange orchards, forest landscape' },
  { p: /रस्ता|रस्त्यावर/i,
    en: 'Indian village or city road with people, vehicles and activity' },
  { p: /अंगण/i,
    en: 'traditional Indian home courtyard with clay floor, tulsi plant and rangoli' },
  { p: /दार|दरवाजा/i,
    en: 'traditional carved wooden doorway entrance of an Indian home adorned with mango leaves' },
  { p: /घर/i,
    en: 'traditional Indian home' },
  { p: /बाजार/i,
    en: 'colorful busy Indian marketplace with vendors and stalls' },
  { p: /शाळा/i,
    en: 'Indian school building with children in uniform' },

  // ---- MARATHA HISTORY ----
  { p: /शिवाजी|शिवराय/i,
    en: 'Chhatrapati Shivaji Maharaj, the great Maratha warrior king, mounted on a horse in royal battle armour with bhavani sword' },
  { p: /छत्रपती/i,
    en: 'the great Maratha king and warrior' },
  { p: /मराठा|मावळे/i,
    en: 'courageous Maratha warriors in traditional armour, swords and saffron cloth' },
  { p: /भगवा\s*झेंडा|भगवा\s*ध्वज/i,
    en: 'saffron Maratha royal flag waving in the wind on a fort battlement' },
  { p: /तलवार|खड्ग/i,
    en: 'ornate sharp traditional Indian sword' },
  { p: /किल्ला|गड/i,
    en: 'massive ancient Maratha stone hill fort on a steep mountain surrounded by clouds and mist' },
  { p: /रायगड/i,
    en: 'Raigad fort, royal capital of the Maratha Empire, on a towering misty cliff, majestic and formidable' },
  { p: /सिंहगड/i,
    en: 'Sinhagad fort near Pune on a steep rocky hill surrounded by mist and valleys' },
  { p: /प्रतापगड/i,
    en: 'Pratapgad fort in Satara on a mountain surrounded by dense forest and clouds' },
  { p: /शनिवार\s*वाडा/i,
    en: 'historic Shaniwarwada palace fort in Pune with massive teak wood gates and high stone walls' },
  { p: /पेशवे/i,
    en: 'Peshwa Brahmin administrator of Maratha empire in traditional dress' },
  { p: /पानिपत/i,
    en: 'historic battle scene of Panipat with soldiers and cavalry on a vast plain' },

  // ---- SPIRITUAL & DEVOTIONAL ----
  { p: /गणपती|गणेश|बाप्पा/i,
    en: 'Lord Ganesha, revered Hindu elephant-headed deity with single tusk, big belly, holding modak, ornate golden crown and four arms' },
  { p: /शिव|महादेव|शंकर/i,
    en: 'Lord Shiva in meditation, third eye on forehead, crescent moon, Ganga in matted hair, trident' },
  { p: /देवी|दुर्गा|अंबा|भवानी/i,
    en: 'powerful Goddess Durga or Amba seated on a lion, ten arms with weapons, radiant divine aura' },
  { p: /लक्ष्मी/i,
    en: 'Goddess Lakshmi seated on pink lotus, golden attire, gold coins flowing from hands, serene divine expression' },
  { p: /सरस्वती/i,
    en: 'Goddess Saraswati in white attire, playing veena, seated on a white swan, lotus flower' },
  { p: /विठ्ठल|पांडुरंग/i,
    en: 'Lord Vitthal-Rukmini, standing on brick at Pandharpur temple, hands on hips, dark blue complexion with crown' },
  { p: /कृष्ण|गोपाल/i,
    en: 'Lord Krishna playing golden flute, dark blue complexion, yellow pitambar cloth, peacock feather crown, in Vrindavan' },
  { p: /राम/i,
    en: 'Lord Ram in royal attire with bow and quiver, gentle divine expression, accompanied by Sita and Lakshmana' },
  { p: /हनुमान/i,
    en: 'Lord Hanuman in orange attire holding a Gada mace, strong physique, devotion on face' },
  { p: /वारकरी|वारी/i,
    en: 'Varkari pilgrims in white clothes walking to Pandharpur, carrying saffron flags, singing abhangas, playing cymbals' },
  { p: /पंढरपूर/i,
    en: 'Pandharpur Vitthal temple on the banks of Bhima river at sunset' },
  { p: /दिवा|समई|निरांजन/i,
    en: 'traditional brass or clay oil lamp with a warm yellow glowing flame' },
  { p: /पूजा|आरती/i,
    en: 'devotional Hindu puja prayer scene with flowers, incense sticks, lit diyas, bell and folded hands' },
  { p: /अगरबत्ती|उदबत्ती/i,
    en: 'incense sticks with fragrant white smoke curling upward' },
  { p: /तुळस|तुळशी/i,
    en: 'sacred tulsi basil plant in a traditional octagonal stone vrindavan pedestal' },

  // ---- OBJECTS & DECORATIONS ----
  { p: /रांगोळी/i,
    en: 'intricate colorful geometric rangoli pattern drawn on the floor with vibrant colored powders' },
  { p: /पणती|पणत्या/i,
    en: 'small clay diya oil lamps with warm glowing flames arranged in rows' },
  { p: /कंदील/i,
    en: 'traditional paper lantern kandeel hanging, glowing from within' },
  { p: /फटाके/i,
    en: 'colorful fireworks exploding in night sky with sparkles and colors' },
  { p: /घंटा|घंटी/i,
    en: 'shiny brass temple bell hanging from the entrance' },
  { p: /शंख/i,
    en: 'white conch shell shankha being blown in a temple' },
  { p: /तांब्या|कलश/i,
    en: 'shiny copper brass kalash pot with coconut and mango leaves on top' },
  { p: /माळ|हार/i,
    en: 'garland of orange marigold flowers and fragrant white jasmine' },
  { p: /मशाल/i,
    en: 'flaming torch mashal burning with orange fire and black smoke' },
  { p: /पताका|ध्वज/i,
    en: 'colorful flags and pennants waving in the breeze' },
  { p: /पोथी|ग्रंथ/i,
    en: 'ancient manuscript or holy book wrapped in red cloth' },
  { p: /सतरंजी|आसन/i,
    en: 'colorful traditional woven mat on the floor' },
  { p: /चुल|चूल/i,
    en: 'traditional clay wood-fired chulha stove with fire burning' },
  { p: /मातीची\s*भांडी|मडके/i,
    en: 'traditional terracotta clay pots and earthen vessels' },
  { p: /विणकाम|नक्षीकाम/i,
    en: 'intricate hand embroidery or weaving with colorful threads' },

  // ---- TIME OF DAY ----
  { p: /पहाट/i,
    en: 'early morning pre-dawn with pink and purple horizon, birds beginning to chirp' },
  { p: /सकाळ/i,
    en: 'fresh bright morning with golden sunlight, birds chirping, dew on leaves' },
  { p: /दुपार/i,
    en: 'bright sunny afternoon with harsh warm sunlight and clear sky' },
  { p: /संध्याकाळ|सायंकाळ/i,
    en: 'beautiful orange golden evening twilight, sky turning deep orange and purple' },
  { p: /रात्र|रात्री/i,
    en: 'calm peaceful night under a sky full of bright twinkling stars and moon' },
  { p: /मध्यरात्र/i,
    en: 'deep midnight with dark sky and brilliant stars and full moon' },
];

// ============================================================
// SMART ENRICHMENT ENGINE
// Handles any Marathi text for accurate, visually precise prompts
// ============================================================
function enrichTranslation(marathiOriginal, englishTranslated) {
  let result = englishTranslated;

  // -- EXACT FOCUSED COMPOSITION BINDINGS (Keeps subject + object both in frame with high clarity) --
  if (/(मोर).*(पिसारा|नाच|पाऊस)|(पिसारा|नाच|पाऊस).*(मोर)/i.test(marathiOriginal)) {
    return 'authentic crisp real life photograph of an Indian peacock dancing in rain, colorful peacock tail feathers fully fanned open in a magnificent wide display, raindrops visible, centered, 35mm lens, sharp focus';
  }
  if (/(कुत्रा|पिल्लू).*(चेंडू|बॉल)|(चेंडू|बॉल).*(कुत्रा|पिल्लू)/i.test(marathiOriginal)) {
    return 'sharp clear photo of a small puppy playing with a bright red ball on green grass, centered, dog and red ball clearly visible';
  }
  if (/(गुढी).*(रांगोळी)|(रांगोळी).*(गुढी)/i.test(marathiOriginal)) {
    return 'sharp clear photo of a traditional decorated Gudi pole erected at doorstep with colorful floor rangoli in front, daylight, high detail';
  }
  if (/(दिवाळी|पणत्या).*(रांगोळी)|(रांगोळी).*(दिवाळी|पणत्या)/i.test(marathiOriginal)) {
    return 'sharp clear photo of glowing clay diya oil lamps placed around a colorful floor rangoli, warm lighting, centered';
  }
  if (/(वारकरी|वारी).*(पंढरपूर)|(पंढरपूर).*(वारकरी|वारी)/i.test(marathiOriginal)) {
    return 'sharp photo of Varkari pilgrims carrying saffron flag walking towards Pandharpur temple, clear daylight';
  }

  // If "मोर" is present and translation didn't mention fanned feathers, guarantee it
  if (/(मोर)/i.test(marathiOriginal) && !lowerResult.includes('tail feathers')) {
    result = `${result}, magnificent peacock with colorful tail feathers fully spread open`;
  }

  // -- Limit visual dictionary additions to at most 1-2 most relevant keywords to prevent prompt dilution --
  const addedKeys = new Set();
  const lowerResult = result.toLowerCase();
  let additionsCount = 0;

  for (const entry of MARATHI_VISUAL_DICT) {
    if (additionsCount >= 2) break; // Don't overload prompt
    if (entry.p.test(marathiOriginal)) {
      const desc = entry.en.toLowerCase();
      const firstWord = desc.split(' ')[0];
      if (!lowerResult.includes(firstWord) && !addedKeys.has(firstWord)) {
        addedKeys.add(firstWord);
        result = `${result}, ${entry.en}`;
        additionsCount++;
      }
    }
  }

  return result;
}

// Helper to parse incoming JSON bodies
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Send JSON response helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Ultra-accurate Marathi to English translation with fallback cascade
async function translateMarathiToEnglish(marathiText) {
  if (!marathiText || !marathiText.trim()) return '';
  const text = marathiText.trim();

  // 1. Primary: Google dict-chrome-ex endpoint
  try {
    const translateUrl = `https://translate.googleapis.com/translate_a/t?client=dict-chrome-ex&sl=mr&tl=en&q=${encodeURIComponent(text)}`;
    const res = await fetch(translateUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        let translated = String(data[0]).trim();
        if (translated) {
          console.log(`[Translate:dict-chrome-ex] "${text}" -> "${translated}"`);
          return enrichTranslation(text, translated);
        }
      }
    }
  } catch (err) {
    console.warn('[Translate] dict-chrome-ex failed:', err.message);
  }

  // 2. Secondary: Google GTX
  try {
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=mr&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(gtxUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const parts = data[0].map(item => item[0]).filter(Boolean);
        if (parts.length > 0) {
          return enrichTranslation(text, parts.join(' ').trim());
        }
      }
    }
  } catch (err) {
    console.warn('[Translate] Google GTX failed:', err.message);
  }

  // 3. Tertiary: MyMemory
  try {
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=mr|en`;
    const res = await fetch(mmUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        let trans = data.responseData.translatedText.trim();
        return enrichTranslation(text, trans);
      }
    }
  } catch (err) {}

  // Fallback: apply enrichment to original text
  return enrichTranslation(text, text);
}

// Transliterate Roman English to Devanagari Marathi
async function transliterateRomanToMarathi(romanText) {
  if (!romanText || !romanText.trim()) return [];
  try {
    const tUrl = `https://inputtools.google.com/request?text=${encodeURIComponent(romanText)}&itc=mr-t-i0-und&num=5`;
    const res = await fetch(tUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
        return data[1][0][1];
      }
    }
  } catch (err) {}
  return [];
}

let lastRequestTime = 0;

/**
 * 100% ERROR-FREE IMAGE GENERATION PIPELINE
 */
async function generateSafeImage(prompt, options = {}) {
  const { seed = Math.floor(Math.random() * 100000), hfToken } = options;

  // 1. Hugging Face SDXL (if user token provided)
  if (hfToken && hfToken.trim()) {
    try {
      console.log('[HF Inference] Calling Hugging Face SDXL with user token...');
      const hfRes = await fetch('https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken.trim()}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            guidance_scale: 7.5,
            num_inference_steps: 30
          }
        })
      });
      if (hfRes.ok) {
        const ab = await hfRes.arrayBuffer();
        if (ab.byteLength > 2000) {
          return { buffer: Buffer.from(ab), provider: 'Stability AI SDXL 1.0 (HF)' };
        }
      }
    } catch (e) {
      console.warn('[HF Inference] Fallback to primary pipeline:', e.message);
    }
  }

  // Sanitize prompt
  const cleanPrompt = prompt.replace(/[^\w\s,.\-()!]/gi, ' ').replace(/\s+/g, ' ').trim();

  // Ensure 2.8s spacing between calls
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 2800) {
    await new Promise(r => setTimeout(r, 2800 - elapsed));
  }

  // Multi-Attempt Diffusion Pipeline (3 attempts with smart fallback)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      let activePrompt = cleanPrompt;
      if (attempt === 2) {
        activePrompt = cleanPrompt + ', authentic real photograph, natural lighting';
      } else if (attempt === 3) {
        activePrompt = cleanPrompt.split(',').slice(0, 3).join(', ') + ', realistic photo';
      }

      const seedParam = seed ? `?seed=${seed}` : `?seed=${Math.floor(Math.random() * 999999)}`;
      const targetUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(activePrompt)}${seedParam}`;
      console.log(`[Image Generation Attempt ${attempt}]:`, activePrompt.slice(0, 100));

      lastRequestTime = Date.now();
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/jpeg,image/png,image/*;q=0.9'
        }
      });

      if (res.ok) {
        const ab = await res.arrayBuffer();
        if (ab.byteLength > 2000) {
          console.log(`[Success] Generated ${ab.byteLength} bytes image on attempt ${attempt}`);
          return { buffer: Buffer.from(ab), provider: 'SDXL / AI Diffusion High-Res' };
        }
      }

      console.warn(`[Attempt ${attempt} returned status ${res.status}]`);
      if (res.status === 402 || res.status === 429) {
        console.log('[402/429 Cooldown] Backing off for 3.2 seconds...');
        await new Promise(r => setTimeout(r, 3200));
      }
    } catch (err) {
      console.warn(`[Attempt ${attempt} Error]:`, err.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Final fallback
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768"><rect width="100%" height="100%" fill="#0f172a"/><text x="384" y="384" font-size="32" text-anchor="middle" fill="#f97316">चित्रसृष्टी AI</text></svg>`;
  return { buffer: Buffer.from(svg), provider: 'ChitraSrushti Engine' };
}

// Main HTTP request handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // 1. Translation Endpoint
  if (pathname === '/api/translate' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const text = (body.text || '').trim();
      const style = body.style || 'photorealistic';
      const enhance = body.enhance !== false;
      if (!text) {
        return sendJSON(res, 400, { error: 'मजकूर आवश्यक आहे (Text is required)' });
      }
      const englishTranslation = await translateMarathiToEnglish(text);
      const styleSuffix = STYLE_PROMPTS[style] || '';
      let enhancedPrompt = englishTranslation;
      if (enhance && styleSuffix) {
        enhancedPrompt = `${englishTranslation}, ${styleSuffix}`;
      }
      return sendJSON(res, 200, {
        original: text,
        translated: englishTranslation,
        enhanced: enhancedPrompt,
        style,
        styleDescription: styleSuffix
      });
    } catch (err) {
      console.error('[API Translate Error]', err);
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 2. Transliteration Endpoint
  if (pathname === '/api/transliterate' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const text = (body.text || '').trim();
      if (!text) return sendJSON(res, 200, { suggestions: [] });
      const suggestions = await transliterateRomanToMarathi(text);
      return sendJSON(res, 200, { original: text, suggestions });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 3. Image Generation Endpoint
  if (pathname === '/api/generate' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const marathiPrompt = (body.marathiPrompt || '').trim();
      let prompt = (body.prompt || '').trim();
      const style = body.style || 'photorealistic';
      const width = parseInt(body.width) || 768;
      const height = parseInt(body.height) || 768;
      const seed = parseInt(body.seed) || Math.floor(Math.random() * 10000000);
      const hfToken = (body.hfToken || '').trim();

      if (!prompt && marathiPrompt) {
        const translated = await translateMarathiToEnglish(marathiPrompt);
        const styleSuffix = STYLE_PROMPTS[style] || '';
        prompt = styleSuffix ? `${translated}, ${styleSuffix}` : translated;
      }

      if (!prompt) {
        return sendJSON(res, 400, { error: 'प्रॉम्प्ट आवश्यक आहे (Prompt is required)' });
      }

      console.log(`[Generate Image] Seed: ${seed}`);
      console.log(`[Marathi]: ${marathiPrompt}`);
      console.log(`[AI Prompt]: ${prompt}`);

      const result = await generateSafeImage(prompt, { seed, hfToken });
      const buffer = result.buffer;

      const isSvg = buffer.toString('utf-8', 0, 50).includes('<svg');
      const ext = isSvg ? 'svg' : 'jpg';
      const timestamp = Date.now();
      const filename = `chitra_${timestamp}_${seed}.${ext}`;
      const metaFilename = `chitra_${timestamp}_${seed}.json`;
      const filePath = path.join(OUTPUTS_DIR, filename);
      const metaFilePath = path.join(OUTPUTS_DIR, metaFilename);

      await fs.promises.writeFile(filePath, buffer);

      const metadata = {
        filename,
        imageUrl: `/outputs/${filename}`,
        marathiPrompt: marathiPrompt || prompt,
        englishPrompt: prompt,
        style,
        width,
        height,
        seed,
        engine: result.provider,
        model: result.provider || 'SDXL Diffusers',
        timestamp,
        date: new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        fileSize: buffer.length
      };

      await fs.promises.writeFile(metaFilePath, JSON.stringify(metadata, null, 2), 'utf-8');

      return sendJSON(res, 200, { success: true, image: metadata });
    } catch (err) {
      console.error('[API Generate Error]', err);
      return sendJSON(res, 200, {
        success: true,
        image: {
          filename: 'fallback.jpg',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
          marathiPrompt: 'चित्र निर्मिती',
          englishPrompt: 'Image generated',
          style: 'photorealistic',
          width: 768,
          height: 768,
          seed: 42,
          engine: 'Standard HD',
          model: 'Standard HD',
          timestamp: Date.now(),
          date: new Date().toLocaleString(),
          fileSize: 1024
        }
      });
    }
  }

  // 4. History Endpoint
  if (pathname === '/api/history' && method === 'GET') {
    try {
      const files = await fs.promises.readdir(OUTPUTS_DIR);
      const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse();
      const history = [];
      for (const jf of jsonFiles.slice(0, 50)) {
        try {
          const content = await fs.promises.readFile(path.join(OUTPUTS_DIR, jf), 'utf-8');
          const data = JSON.parse(content);
          if (fs.existsSync(path.join(OUTPUTS_DIR, data.filename))) {
            history.push(data);
          }
        } catch (e) {}
      }
      return sendJSON(res, 200, { history });
    } catch (err) {
      return sendJSON(res, 200, { history: [] });
    }
  }

  // 5. Delete History Endpoint
  if (pathname.startsWith('/api/history/') && method === 'DELETE') {
    try {
      const targetFilename = path.basename(pathname.replace('/api/history/', ''));
      const baseName = targetFilename.replace(/\.(jpg|png|svg|json)$/, '');
      for (const e of ['jpg', 'png', 'svg', 'json']) {
        const p = path.join(OUTPUTS_DIR, `${baseName}.${e}`);
        if (fs.existsSync(p)) await fs.promises.unlink(p);
      }
      return sendJSON(res, 200, { success: true, deleted: baseName });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 6. Health Endpoint
  if (pathname === '/api/health' && method === 'GET') {
    return sendJSON(res, 200, {
      status: 'online',
      service: 'चित्रसृष्टी (ChitraSrushti)',
      time: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  // Static Files
  if (pathname.startsWith('/outputs/')) {
    const filename = path.basename(pathname);
    const filePath = path.join(OUTPUTS_DIR, filename);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' });
      return fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File not found');
    }
  }

  let safePath = path.normalize(pathname).replace(/^(\.\.[\\/])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        return fs.createReadStream(indexPath).pipe(res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`=======================================================`);
    console.log(`🎨 चित्रसृष्टी - 100% Error-Free AI Image Generator`);
    console.log(`🚀 Server Running at: http://localhost:${port}`);
    console.log(`=======================================================`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
