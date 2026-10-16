/**
 * चित्रसृष्टी (ChitraSrushti) - Internationalization & Localization (मराठी / English)
 */

const translations = {
  mr: {
    appTitle: "चित्रसृष्टी",
    appSubtitle: "मराठी आवाज आणि मजकुराचे अप्रतिम AI चित्रात रूपांतर",
    navHome: "मुख्यपृष्ठ",
    navGallery: "गॅलरी",
    navPresets: "प्रॉम्प्ट्स",
    navHelp: "मदत",
    navKeyboard: "मराठी कीबोर्ड",
    langToggle: "English",
    themeToggle: "थीम बदला",
    
    // Input Area
    inputHeader: "तुमची कल्पना सांगा किंवा लिहा",
    inputSubheader: "मराठीत बोला किंवा टाईप करा, AI काही सेकंदात त्याचे सुंदर चित्र तयार करेल!",
    micButtonStart: "मराठीत बोला (माईक)",
    micButtonListening: "ऐकत आहे... बोला!",
    micTooltip: "मायक्रोफोन सुरू करा आणि मराठीत बोला (Web Speech API)",
    listenTTS: "उच्चार ऐका",
    clearText: "मजकूर पुसा",
    copyText: "कॉपी करा",
    translitToggle: "इंग्लिश ते मराठी रूपांतर (उदा. 'mor' -> 'मोर')",
    virtualKeyboardBtn: "मराठी कळफलक (Virtual Keyboard)",
    surpriseBtn: "🎲 नवीन कल्पना (Surprise Me)",
    
    placeholder: "उदा: पावसात पिसारा फुलवून नाचणारा मोर, सह्याद्रीचे भव्य किल्ले, किंवा दिवाळीच्या दिव्यांची आरास...",
    charCount: "अक्षरे",
    
    // Style Selector
    styleSectionTitle: "चित्राची कलाशैली निवडा",
    stylePhotorealistic: "वास्तववादी छायाचित्र",
    styleWarli: "वॉरली लोककला",
    styleRajaRaviVarma: "राजा रविवर्मा ऑइल पेंटिंग",
    styleCinematic: "सिनेमॅटिक भव्य",
    styleWatercolor: "जलरंग (Watercolor)",
    styleDigital3d: "३डी डिजिटल रेंडर",
    styleAnime: "ॲनिमे / गिबली शैली",
    stylePeshwai: "पेशवेकालीन वैभव",
    styleSketch: "पेन्सिल स्केच",
    styleNone: "साधी / मूळ शैली",

    // Advanced Options
    advancedTitle: "प्रगत पर्याय (Aspect Ratio, Model & Seed)",
    aspectRatio: "चित्राचा आकार (Aspect Ratio)",
    ratioSquare: "1:1 चौरस (Square - DP/Post)",
    ratioLandscape: "16:9 आडवे (Landscape - Wallpaper)",
    ratioPortrait: "9:16 उभे (Portrait - Reel/Story)",
    ratioClassic: "4:3 क्लासिक (Classic)",
    modelLabel: "AI मॉडेल",
    modelFlux: "FLUX.1 (उच्च दर्जा - शिफारस केलेले)",
    modelTurbo: "Turbo (अतिशय जलद)",
    modelSdxl: "SDXL (स्थिर)",
    seedLabel: "सीड (Seed - यादृच्छिक/स्थिर)",
    seedRandom: "यादृच्छिक (Random)",

    // Generate Button & Status
    generateBtn: "🎨 चित्र तयार करा (Generate Image)",
    generatingBtn: "चित्र तयार होत आहे...",
    pressEnterHint: "टीप: कीबोर्डवर Ctrl + Enter दाबूनही चित्र तयार करू शकता",
    statusTranslating: "मराठीचे भाषांतर व विश्लेषण करत आहे...",
    statusGenerating: "AI द्वारे कलाकृती साकारत आहे...",
    statusSuccess: "चित्र यशस्वीरित्या तयार झाले!",
    statusError: "चित्र निर्मितीत त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",

    // Result Section
    resultTitle: "तयार झालेले चित्र",
    originalMarathiPrompt: "मूळ मराठी प्रॉम्प्ट:",
    translatedPrompt: "AI साठी वापरलेला प्रॉम्प्ट:",
    downloadHd: "डाउनलोड करा (HD)",
    fullscreenView: "मोठे करून पहा",
    copyPrompt: "प्रॉम्प्ट कॉपी करा",
    regenerate: "दुसरे चित्र बनवा (Regenerate)",

    // Preset Prompts
    presetsTitle: "लोकप्रिय मराठी प्रॉम्प्ट्स",
    tabNature: "निसर्ग आणि प्राणी",
    tabHistory: "इतिहास आणि किल्ले",
    tabFestivals: "सण आणि संस्कृती",
    tabRural: "ग्रामीण जीवन",
    tabArt: "पारंपरिक कला",
    tabFantasy: "कल्पनारम्य / फँटसी",

    // Gallery
    galleryTitle: "मागील चित्रांचा संग्रह (गॅलरी)",
    galleryEmpty: "अजून कोणतीही चित्रे तयार केलेली नाहीत. वरील फॉर्म भरून तुमचे पहिले चित्र बनवा!",
    clearHistory: "सर्व चित्रे पुसा",
    deleteImage: "काढून टाका",

    // Audio Test Simulator
    audioSimTitle: "माईक काम करत नाहीये? येथे नमुना ऑडिओ निवडून तपासा:",
    simSample1: "‘पावसात नाचणारा मोर’",
    simSample2: "‘सह्याद्रीचा भव्य किल्ला’",
    simSample3: "‘दिवाळीतील पणत्या आणि रांगोळी’",
    simSample4: "‘वारली चित्रातील आदिवासी नृत्य’",

    // Footer & Credits
    footerText: "चित्रसृष्टी - मराठी भाषा आणि प्रगत कृत्रिम बुद्धिमत्ता (AI) यांचा सुंदर संगम",
    footerMadeWith: "महाराष्ट्रातील संस्कृती आणि तंत्रज्ञानाच्या प्रेमातून साकारलेले."
  },
  en: {
    appTitle: "ChitraSrushti",
    appSubtitle: "Convert Marathi Voice and Text into Magnificent AI Images",
    navHome: "Home",
    navGallery: "Gallery",
    navPresets: "Presets",
    navHelp: "Help",
    navKeyboard: "Marathi Keyboard",
    langToggle: "मराठी",
    themeToggle: "Change Theme",

    // Input Area
    inputHeader: "Describe your imagination in Marathi",
    inputSubheader: "Speak or type in Marathi, and AI will turn it into stunning artwork within seconds!",
    micButtonStart: "Speak in Marathi (Mic)",
    micButtonListening: "Listening... Speak now!",
    micTooltip: "Start microphone and speak in Marathi (Web Speech API)",
    listenTTS: "Listen",
    clearText: "Clear",
    copyText: "Copy",
    translitToggle: "English to Marathi Transliteration (e.g. 'mor' -> 'मोर')",
    virtualKeyboardBtn: "Marathi On-Screen Keyboard",
    surpriseBtn: "🎲 Surprise Me",

    placeholder: "e.g.: A peacock dancing in the rain, majestic Sahyadri forts, or Diwali lamps with rangoli...",
    charCount: "characters",

    // Style Selector
    styleSectionTitle: "Select Visual Art Style",
    stylePhotorealistic: "Photorealistic 8K",
    styleWarli: "Warli Folk Art",
    styleRajaRaviVarma: "Raja Ravi Varma Oil Painting",
    styleCinematic: "Cinematic Dramatic",
    styleWatercolor: "Watercolor Painting",
    styleDigital3d: "3D Digital Render",
    styleAnime: "Anime / Ghibli Style",
    stylePeshwai: "Royal Peshwai Heritage",
    styleSketch: "Pencil & Charcoal Sketch",
    styleNone: "Simple / Natural",

    // Advanced Options
    advancedTitle: "Advanced Options (Aspect Ratio, Model & Seed)",
    aspectRatio: "Aspect Ratio",
    ratioSquare: "1:1 Square (Social Media)",
    ratioLandscape: "16:9 Landscape (Wallpaper)",
    ratioPortrait: "9:16 Portrait (Mobile Story)",
    ratioClassic: "4:3 Classic",
    modelLabel: "AI Model",
    modelFlux: "FLUX.1 (High Quality - Recommended)",
    modelTurbo: "Turbo (Fastest)",
    modelSdxl: "SDXL (Stable)",
    seedLabel: "Seed (Random or Fixed)",
    seedRandom: "Random Seed",

    // Generate Button & Status
    generateBtn: "🎨 Generate Image",
    generatingBtn: "Generating Image...",
    pressEnterHint: "Pro-tip: Press Ctrl + Enter on keyboard to generate quickly",
    statusTranslating: "Translating and analyzing Marathi prompt...",
    statusGenerating: "AI is crafting your artwork...",
    statusSuccess: "Image generated successfully!",
    statusError: "Error generating image. Please try again.",

    // Result Section
    resultTitle: "Generated Artwork",
    originalMarathiPrompt: "Original Marathi Prompt:",
    translatedPrompt: "AI Enhanced Visual Prompt:",
    downloadHd: "Download (HD)",
    fullscreenView: "Fullscreen View",
    copyPrompt: "Copy Prompt",
    regenerate: "Regenerate Variation",

    // Preset Prompts
    presetsTitle: "Curated Marathi Prompts",
    tabNature: "Nature & Animals",
    tabHistory: "History & Forts",
    tabFestivals: "Festivals & Culture",
    tabRural: "Rural Life",
    tabArt: "Traditional Art",
    tabFantasy: "Fantasy & Sci-Fi",

    // Gallery
    galleryTitle: "Saved Artwork Gallery",
    galleryEmpty: "No generated images yet. Try generating your first artwork using the input above!",
    clearHistory: "Clear Gallery",
    deleteImage: "Delete",

    // Audio Test Simulator
    audioSimTitle: "Microphone not available? Try these simulated Marathi voice clips:",
    simSample1: "‘Peacock dancing in the rain’",
    simSample2: "‘Majestic Sahyadri mountain fort’",
    simSample3: "‘Diwali oil lamps and colorful rangoli’",
    simSample4: "‘Warli tribal dance celebration’",

    // Footer & Credits
    footerText: "ChitraSrushti - A seamless fusion of Marathi heritage and modern Generative AI",
    footerMadeWith: "Crafted with passion for Marathi culture and cutting-edge web technology."
  }
};

let currentLang = 'mr';

function getTranslation(key) {
  if (translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  return translations.mr[key] || key;
}

function setLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'mr';
  localStorage.setItem('chitrasrushti_lang', currentLang);
  updateDOMTranslations();
}

function updateDOMTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const trans = getTranslation(key);
    if (trans) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', trans);
      } else {
        el.textContent = trans;
      }
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const trans = getTranslation(key);
    if (trans) el.setAttribute('title', trans);
  });

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'mr' ? 'English' : 'मराठी';
  }
}
