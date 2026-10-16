/**
 * चित्रसृष्टी (ChitraSrushti) - Marathi Virtual Keyboard & Real-time Transliteration
 */

// Virtual Keyboard Character Sets
const KEYBOARD_DATA = {
  swar: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः', 'ॲ', 'ऑ'],
  matras: ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', 'ँ', 'ॅ', 'ॉ', '्', '़'],
  vyanjan: [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व', 'श',
    'ष', 'स', 'ह', 'ळ', 'क्ष', 'ज्ञ', 'श्र'
  ],
  numbers: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  punctuations: ['।', '॥', ',', '.', '?', '!', '"', "'", '(', ')']
};

// Common English-to-Marathi phonetic offline mappings fallback
const OFFLINE_PHONETIC_MAP = {
  "mor": "मोर",
  "killa": "किल्ला",
  "shivaji": "शिवाजी",
  "maharaj": "महाराज",
  "ganpati": "गणपती",
  "bappa": "बाप्पा",
  "shetkari": "शेतकरी",
  "sundar": "सुंदर",
  "dhabdhaba": "धबधबा",
  "paaus": "पाऊस",
  "pavsat": "पावसात",
  "ful": "फूल",
  "phul": "फूल",
  "diwali": "दिवाळी",
  "rangoli": "रांगोळी",
  "panti": "पणती",
  "warli": "वॉरली",
  "chitra": "चित्र",
  "dongar": "डोंगर",
  "sahyadri": "सह्याद्री",
  "nadi": "नदी",
  "samudra": "समुद्र",
  "ghoda": "घोडा",
  "wagh": "वाघ",
  "hathi": "हत्ती",
  "raigad": "रायगड",
  "pune": "पुणे",
  "mumbai": "मुंबई",
  "kokan": "कोकण",
  "gudi": "गुढी",
  "padwa": "पाडवा",
  "aaji": "आजी",
  "chaha": "चहा",
  "bhakri": "भाकरी",
  "sakhal": "सकाळ",
  "surya": "सूर्य",
  "chandra": "चंद्र",
  "tare": "तारे",
  "aakash": "आकाश",
  "dhag": "ढग",
  "zhad": "झाड",
  "zhade": "झाडे",
  "ghar": "घर",
  "shala": "शाळा",
  "dev": "देव",
  "mandir": "मंदिर",
  "natya": "नृत्य",
  "gadi": "गाडी",
  "mahal": "महाल",
  "raja": "राजा",
  "rani": "राणी",
  "paithani": "पैठणी",
  "saree": "साडी",
  "sadi": "साडी"
};

let activeTargetInput = null;

function initMarathiKeyboard(inputElementId, containerElementId) {
  activeTargetInput = document.getElementById(inputElementId);
  const container = document.getElementById(containerElementId);
  if (!container || !activeTargetInput) return;

  container.innerHTML = `
    <div class="keyboard-panel p-4 bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-md">
      <div class="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span class="font-semibold text-amber-300 text-sm">मराठी देवनागरी कळफलक (Virtual Keyboard)</span>
        </div>
        <button id="closeKeyboardBtn" class="text-slate-400 hover:text-white px-2 py-1 rounded text-sm transition">
          ✕ बंद करा
        </button>
      </div>

      <!-- Tabs for Keyboard Categories -->
      <div class="flex gap-2 mb-3 text-xs overflow-x-auto pb-1">
        <button type="button" class="kb-tab-btn active px-3 py-1 rounded-lg bg-amber-600 text-white font-medium" data-cat="all">सर्व (All)</button>
        <button type="button" class="kb-tab-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="vyanjan">व्यंजने (क-ज्ञ)</button>
        <button type="button" class="kb-tab-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="swar">स्वर (अ-अः)</button>
        <button type="button" class="kb-tab-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="matras">मात्रा व चिन्हे</button>
        <button type="button" class="kb-tab-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="numbers">अंक व विरामचिन्हे</button>
      </div>

      <!-- Keys Container -->
      <div id="kbKeysGrid" class="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        <!-- Rendered via renderKeys -->
      </div>

      <!-- Action Row -->
      <div class="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/60">
        <button type="button" id="kbKeySpace" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 text-white font-medium rounded-lg text-sm transition">
          स्पेस (Space)
        </button>
        <button type="button" id="kbKeyBackspace" class="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-sm transition flex items-center gap-1">
          ⌫ हटवा
        </button>
        <button type="button" id="kbKeyHalant" class="px-3 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition" title="जोडाक्षरासाठी हलंत">
          ् (जोडाक्षर)
        </button>
      </div>
    </div>
  `;

  renderKeyboardKeys('all');

  // Tab click handlers
  container.querySelectorAll('.kb-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.kb-tab-btn').forEach(b => {
        b.classList.remove('bg-amber-600', 'text-white', 'active');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      btn.classList.add('bg-amber-600', 'text-white', 'active');
      btn.classList.remove('bg-slate-800', 'text-slate-300');
      renderKeyboardKeys(btn.getAttribute('data-cat'));
    });
  });

  // Action button listeners
  document.getElementById('kbKeySpace').addEventListener('click', () => insertChar(' '));
  document.getElementById('kbKeyBackspace').addEventListener('click', handleBackspace);
  document.getElementById('kbKeyHalant').addEventListener('click', () => insertChar('्'));
  document.getElementById('closeKeyboardBtn').addEventListener('click', () => {
    container.classList.add('hidden');
  });
}

function renderKeyboardKeys(category) {
  const grid = document.getElementById('kbKeysGrid');
  if (!grid) return;

  let html = '';

  if (category === 'all' || category === 'swar') {
    html += `
      <div>
        <div class="text-[11px] text-amber-400 font-semibold mb-1">स्वर:</div>
        <div class="flex flex-wrap gap-1.5">
          ${KEYBOARD_DATA.swar.map(ch => `<button type="button" class="kb-key" data-char="${ch}">${ch}</button>`).join('')}
        </div>
      </div>
    `;
  }

  if (category === 'all' || category === 'matras') {
    html += `
      <div>
        <div class="text-[11px] text-amber-400 font-semibold mb-1">मात्रा व जोडाक्षर:</div>
        <div class="flex flex-wrap gap-1.5">
          ${KEYBOARD_DATA.matras.map(ch => `<button type="button" class="kb-key kb-key-matra" data-char="${ch}">क${ch} (${ch})</button>`).join('')}
        </div>
      </div>
    `;
  }

  if (category === 'all' || category === 'vyanjan') {
    html += `
      <div>
        <div class="text-[11px] text-amber-400 font-semibold mb-1">व्यंजने:</div>
        <div class="flex flex-wrap gap-1.5">
          ${KEYBOARD_DATA.vyanjan.map(ch => `<button type="button" class="kb-key" data-char="${ch}">${ch}</button>`).join('')}
        </div>
      </div>
    `;
  }

  if (category === 'all' || category === 'numbers') {
    html += `
      <div>
        <div class="text-[11px] text-amber-400 font-semibold mb-1">अंक व चिन्हे:</div>
        <div class="flex flex-wrap gap-1.5">
          ${KEYBOARD_DATA.numbers.map(ch => `<button type="button" class="kb-key" data-char="${ch}">${ch}</button>`).join('')}
          ${KEYBOARD_DATA.punctuations.map(ch => `<button type="button" class="kb-key" data-char="${ch}">${ch}</button>`).join('')}
        </div>
      </div>
    `;
  }

  grid.innerHTML = html;

  // Add click listener to all keys
  grid.querySelectorAll('.kb-key').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const char = btn.getAttribute('data-char');
      insertChar(char);
    });
  });
}

function insertChar(char) {
  if (!activeTargetInput) return;
  const start = activeTargetInput.selectionStart;
  const end = activeTargetInput.selectionEnd;
  const val = activeTargetInput.value;

  activeTargetInput.value = val.substring(0, start) + char + val.substring(end);
  activeTargetInput.selectionStart = activeTargetInput.selectionEnd = start + char.length;
  activeTargetInput.focus();
  activeTargetInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function handleBackspace() {
  if (!activeTargetInput) return;
  const start = activeTargetInput.selectionStart;
  const end = activeTargetInput.selectionEnd;
  const val = activeTargetInput.value;

  if (start === end) {
    if (start > 0) {
      activeTargetInput.value = val.substring(0, start - 1) + val.substring(end);
      activeTargetInput.selectionStart = activeTargetInput.selectionEnd = start - 1;
    }
  } else {
    activeTargetInput.value = val.substring(0, start) + val.substring(end);
    activeTargetInput.selectionStart = activeTargetInput.selectionEnd = start;
  }
  activeTargetInput.focus();
  activeTargetInput.dispatchEvent(new Event('input', { bubbles: true }));
}

// Live Roman-to-Devanagari Transliteration setup
function setupLiveTransliteration(textarea, toggleCheckbox) {
  let isEnabled = true;
  if (toggleCheckbox) {
    isEnabled = toggleCheckbox.checked;
    toggleCheckbox.addEventListener('change', (e) => {
      isEnabled = e.target.checked;
    });
  }

  textarea.addEventListener('keydown', async (e) => {
    if (!isEnabled) return;

    // Trigger on Space or Enter
    if (e.key === ' ' || e.key === 'Enter') {
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = textarea.value.slice(0, cursorPos);
      const match = textBeforeCursor.match(/([a-zA-Z]+)$/);

      if (match) {
        const romanWord = match[1];
        const lower = romanWord.toLowerCase();

        // 1. Check quick offline table
        let marathiWord = OFFLINE_PHONETIC_MAP[lower];

        if (!marathiWord) {
          // 2. Fetch from server transliteration API
          try {
            const res = await fetch('/api/transliterate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: romanWord })
            });
            const data = await res.json();
            if (data.suggestions && data.suggestions.length > 0) {
              marathiWord = data.suggestions[0];
            }
          } catch (err) {
            console.warn('Transliteration failed:', err);
          }
        }

        if (marathiWord) {
          e.preventDefault();
          const wordStart = cursorPos - romanWord.length;
          const textAfterCursor = textarea.value.slice(cursorPos);
          const sep = e.key === ' ' ? ' ' : '\n';
          textarea.value = textarea.value.slice(0, wordStart) + marathiWord + sep + textAfterCursor;
          const newPos = wordStart + marathiWord.length + sep.length;
          textarea.selectionStart = textarea.selectionEnd = newPos;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  });
}
