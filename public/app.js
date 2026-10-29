/**
 * चित्रसृष्टी (ChitraSrushti) - Main Application Controller
 * Handles Speech Recognition (mr-IN), Image Generation, History, Gallery & UI
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // DOM Elements
  const promptInput = document.getElementById('promptInput');
  const charCount = document.getElementById('charCount');
  const micBtn = document.getElementById('micBtn');
  const micStatusText = document.getElementById('micStatusText');
  const micSubtext = document.getElementById('micSubtext');
  const soundWave = document.getElementById('soundWave');
  const translitToggle = document.getElementById('translitToggle');
  const toggleKeyboardBtn = document.getElementById('toggleKeyboardBtn');
  const virtualKeyboardContainer = document.getElementById('virtualKeyboardContainer');
  const listenTTSBtn = document.getElementById('listenTTSBtn');
  const clearTextBtn = document.getElementById('clearTextBtn');
  const copyTextBtn = document.getElementById('copyTextBtn');
  const surpriseBtn = document.getElementById('surpriseBtn');
  const generateBtn = document.getElementById('generateBtn');
  const generateBtnText = document.getElementById('generateBtnText');
  const generateIcon = document.getElementById('generateIcon');
  const currentStyleLabel = document.getElementById('currentStyleLabel');
  
  // Advanced Controls
  const toggleAdvancedBtn = document.getElementById('toggleAdvancedBtn');
  const advancedPanel = document.getElementById('advancedPanel');
  const advancedIcon = document.getElementById('advancedIcon');
  const aspectRatioSelect = document.getElementById('aspectRatioSelect');
  const modelSelect = document.getElementById('modelSelect');
  const seedInput = document.getElementById('seedInput');
  const randomizeSeedBtn = document.getElementById('randomizeSeedBtn');
  const enhancePromptToggle = document.getElementById('enhancePromptToggle');

  // Preview / Result Elements
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const loadingStepTitle = document.getElementById('loadingStepTitle');
  const loadingStepDetail = document.getElementById('loadingStepDetail');
  const generatedImage = document.getElementById('generatedImage');
  const imageHoverActions = document.getElementById('imageHoverActions');
  const imageMetaBar = document.getElementById('imageMetaBar');
  const resultBadge = document.getElementById('resultBadge');
  const promptInspector = document.getElementById('promptInspector');
  const inspectorMarathiPrompt = document.getElementById('inspectorMarathiPrompt');
  const inspectorEnglishPrompt = document.getElementById('inspectorEnglishPrompt');
  const inspectorTTSBtn = document.getElementById('inspectorTTSBtn');
  const copyEnhancedPromptBtn = document.getElementById('copyEnhancedPromptBtn');
  const quickDownloadBtn = document.getElementById('quickDownloadBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const lightboxBtn = document.getElementById('lightboxBtn');

  // Live Prompt Preview Elements
  const liveEnglishPrompt = document.getElementById('liveEnglishPrompt');
  const transStatusIndicator = document.getElementById('transStatusIndicator');
  const refreshTranslationBtn = document.getElementById('refreshTranslationBtn');
  const promptSyncNote = document.getElementById('promptSyncNote');

  // SDXL Diffusers & CLIP Controls
  const cfgSlider = document.getElementById('cfgSlider');
  const cfgValBadge = document.getElementById('cfgValBadge');
  const stepsSlider = document.getElementById('stepsSlider');
  const stepsValBadge = document.getElementById('stepsValBadge');
  const negativePromptInput = document.getElementById('negativePromptInput');
  const hfTokenBox = document.getElementById('hfTokenBox');
  const hfTokenInput = document.getElementById('hfTokenInput');

  let translateDebounceTimer = null;
  let userEditedEnglishPrompt = false;

  // Metadata Badges
  const badgeStyle = document.getElementById('badgeStyle');
  const badgeRatio = document.getElementById('badgeRatio');
  const badgeSeed = document.getElementById('badgeSeed');
  const badgeModel = document.getElementById('badgeModel');
  const totalGenStat = document.getElementById('totalGenStat');

  // Gallery
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryEmptyState = document.getElementById('galleryEmptyState');
  const clearGalleryBtn = document.getElementById('clearGalleryBtn');
  const navGalleryBtn = document.getElementById('navGalleryBtn');

  // Modals & Drawers
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxMarathiText = document.getElementById('lightboxMarathiText');
  const lightboxEnglishText = document.getElementById('lightboxEnglishText');
  const lightboxDownloadLink = document.getElementById('lightboxDownloadLink');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  const helpModal = document.getElementById('helpModal');
  const helpModalBtn = document.getElementById('helpModalBtn');
  const closeHelpBtn = document.getElementById('closeHelpBtn');
  const closeHelpConfirmBtn = document.getElementById('closeHelpConfirmBtn');

  const quickVoiceTestBtn = document.getElementById('quickVoiceTestBtn');
  const sampleVoiceDrawer = document.getElementById('sampleVoiceDrawer');
  const closeSampleDrawer = document.getElementById('closeSampleDrawer');

  const langToggleBtn = document.getElementById('langToggleBtn');
  const toastContainer = document.getElementById('toastContainer');

  // State Variables
  let isListening = false;
  let recognition = null;
  let activeImageMetadata = null;
  let localHistory = [];

  // ================= 1. INITIALIZE VIRTUAL KEYBOARD & TRANSLITERATION =================
  if (typeof initMarathiKeyboard === 'function') {
    initMarathiKeyboard('promptInput', 'virtualKeyboardContainer');
  }

  if (typeof setupLiveTransliteration === 'function') {
    setupLiveTransliteration(promptInput, translitToggle);
  }

  toggleKeyboardBtn.addEventListener('click', () => {
    virtualKeyboardContainer.classList.toggle('hidden');
    if (!virtualKeyboardContainer.classList.contains('hidden')) {
      promptInput.focus();
    }
  });

  // ================= 2. CHARACTER COUNTER & TEXTAREA CONTROLS =================
  function updateLiveTranslation(force = false) {
    const text = promptInput.value.trim();
    if (!text) {
      if (liveEnglishPrompt) liveEnglishPrompt.value = '';
      userEditedEnglishPrompt = false;
      if (transStatusIndicator) {
        transStatusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-500"></span> रिक्त';
      }
      return;
    }

    if (userEditedEnglishPrompt && !force) {
      return; // Preserve user's custom edits
    }

    if (transStatusIndicator) {
      transStatusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> भाषांतर...';
    }

    clearTimeout(translateDebounceTimer);
    translateDebounceTimer = setTimeout(async () => {
      try {
        const selectedStyleRadio = document.querySelector('input[name="artStyle"]:checked');
        const style = selectedStyleRadio ? selectedStyleRadio.value : 'photorealistic';
        const enhance = enhancePromptToggle ? enhancePromptToggle.checked : true;

        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, style, enhance })
        });
        const data = await res.json();
        if (data && (data.enhanced || data.translated)) {
          if (liveEnglishPrompt) {
            liveEnglishPrompt.value = data.enhanced || data.translated;
          }
          if (transStatusIndicator) {
            transStatusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span> तयार';
          }
        }
      } catch (err) {
        if (transStatusIndicator) {
          transStatusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-rose-400"></span> त्रुटी';
        }
      }
    }, 400);
  }

  promptInput.addEventListener('input', () => {
    const len = promptInput.value.length;
    charCount.textContent = `${len} ${getTranslation('charCount')}`;
    updateLiveTranslation();
  });

  if (liveEnglishPrompt) {
    liveEnglishPrompt.addEventListener('input', () => {
      userEditedEnglishPrompt = true;
      if (promptSyncNote) promptSyncNote.textContent = '✏️ सानुकूलित (Customized)';
      if (transStatusIndicator) {
        transStatusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-cyan-400"></span> सानुकूल';
      }
    });
  }

  if (refreshTranslationBtn) {
    refreshTranslationBtn.addEventListener('click', () => {
      userEditedEnglishPrompt = false;
      if (promptSyncNote) promptSyncNote.textContent = 'आपोआप सिंक्रोनाइझ होतो';
      updateLiveTranslation(true);
      showToast('भाषांतर ताजे केले (Translation Refreshed)', 'info');
    });
  }

  clearTextBtn.addEventListener('click', () => {
    promptInput.value = '';
    charCount.textContent = `0 ${getTranslation('charCount')}`;
    if (liveEnglishPrompt) liveEnglishPrompt.value = '';
    userEditedEnglishPrompt = false;
    promptInput.focus();
    showToast('मजकूर पुसला (Cleared)', 'info');
  });

  copyTextBtn.addEventListener('click', () => {
    if (!promptInput.value.trim()) return;
    navigator.clipboard.writeText(promptInput.value.trim()).then(() => {
      showToast('मजकूर कॉपी झाला! (Copied to clipboard)', 'success');
    });
  });

  // ================= 3. MARATHI WEB SPEECH RECOGNITION (mr-IN) =================
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'mr-IN'; // Native Marathi language locale
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('mic-recording');
      soundWave.classList.remove('hidden');
      micStatusText.textContent = getTranslation('micButtonListening');
      micSubtext.textContent = 'मराठीत बोला... संगणक ऐकत आहे (Speak in Marathi...)';
      showToast('मायक्रोफोन सुरू झाला! मराठीत बोला.', 'info');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        const currentVal = promptInput.value.trim();
        promptInput.value = currentVal ? `${currentVal} ${finalTranscript}` : finalTranscript;
        promptInput.dispatchEvent(new Event('input'));
        showToast(`आवाज ओळखला: "${finalTranscript}"`, 'success');
      } else if (interimTranscript) {
        micSubtext.textContent = `ऐकत आहे: ${interimTranscript}...`;
      }
    };

    recognition.onerror = (event) => {
      console.warn('[Speech Recognition Error]', event.error);
      stopListening();
      if (event.error === 'not-allowed') {
        showToast('मायक्रोफोन परवानगी नाकारली गेली. कृपया ब्राउझरमध्ये माईक परवानगी द्या.', 'error');
      } else if (event.error === 'no-speech') {
        showToast('आवाज ऐकू आला नाही. कृपया पुन्हा प्रयत्न करा.', 'warning');
      } else {
        showToast(`स्पीच त्रुटी: ${event.error}`, 'error');
      }
    };

    recognition.onend = () => {
      stopListening();
    };

    micBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
        stopListening();
      } else {
        try {
          recognition.start();
        } catch (err) {
          console.error(err);
          stopListening();
        }
      }
    });

  } else {
    // Browser does not support Web Speech API natively
    micStatusText.textContent = 'माईक उपलब्ध नाही';
    micSubtext.textContent = 'तुमच्या ब्राउझरमध्ये Web Speech API समर्थित नाही (Chrome/Edge वापरा)';
    micBtn.addEventListener('click', () => {
      sampleVoiceDrawer.classList.remove('hidden');
      showToast('या ब्राऊझरमध्ये थेट माईक उपलब्ध नाही, कृपया Chrome वापरा किंवा खालील नमुना आवाज वापरा.', 'warning');
    });
  }

  function stopListening() {
    isListening = false;
    micBtn.classList.remove('mic-recording');
    soundWave.classList.add('hidden');
    micStatusText.textContent = getTranslation('micButtonStart');
    micSubtext.textContent = 'माईकवर क्लिक करून मराठीत बोला (उदा. "पावसात नाचणारा मोर")';
  }

  // ================= 4. TEXT-TO-SPEECH (TTS - LISTEN MARATHI) =================
  function speakMarathiText(text) {
    if (!('speechSynthesis' in window)) {
      showToast('तुमच्या ब्राउझरमध्ये आवाज संश्लेषण (TTS) उपलब्ध नाही.', 'warning');
      return;
    }
    if (!text || !text.trim()) {
      showToast('ऐकण्यासाठी प्रथम काही मजकूर लिहा किंवा बोला.', 'info');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'mr-IN'; // Marathi locale

    // Find Marathi voice or fallback
    const voices = window.speechSynthesis.getVoices();
    const marathiVoice = voices.find(v => v.lang === 'mr-IN' || v.lang.startsWith('mr'));
    if (marathiVoice) {
      utterance.voice = marathiVoice;
    } else {
      const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
      if (hindiVoice) utterance.voice = hindiVoice;
    }

    utterance.rate = 0.9; // natural cadence
    window.speechSynthesis.speak(utterance);
    showToast('उच्चार सुरू आहे...', 'info');
  }

  listenTTSBtn.addEventListener('click', () => speakMarathiText(promptInput.value));
  inspectorTTSBtn.addEventListener('click', () => {
    if (activeImageMetadata && activeImageMetadata.marathiPrompt) {
      speakMarathiText(activeImageMetadata.marathiPrompt);
    }
  });

  // ================= 5. QUICK VOICE SIMULATOR =================
  quickVoiceTestBtn.addEventListener('click', () => {
    sampleVoiceDrawer.classList.toggle('hidden');
  });

  closeSampleDrawer.addEventListener('click', () => {
    sampleVoiceDrawer.classList.add('hidden');
  });

  document.querySelectorAll('.sample-voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleText = btn.getAttribute('data-text');
      promptInput.value = sampleText;
      promptInput.dispatchEvent(new Event('input'));
      sampleVoiceDrawer.classList.add('hidden');
      speakMarathiText(sampleText);
      showToast(`नमुना आवाज निवडला: "${sampleText}"`, 'success');
    });
  });

  // ================= 6. PRESET PROMPTS & SURPRISE ME =================
  function renderPresetCategory(catKey) {
    const grid = document.getElementById('presetCardsGrid');
    if (!grid || !window.MARATHI_PRESETS) return;

    const items = MARATHI_PRESETS[catKey] || [];
    grid.innerHTML = items.map((item, idx) => `
      <div class="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/50 cursor-pointer transition group flex flex-col justify-between preset-item-card" data-prompt="${encodeURIComponent(item.prompt)}" data-style="${item.style}">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-white group-hover:text-orange-400 transition">${item.title}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">${item.badge}</span>
          </div>
          <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">${item.prompt}</p>
        </div>
        <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-slate-300">
          <span>शैली: ${getStyleLabel(item.style)}</span>
          <span class="text-orange-400 group-hover:translate-x-1 transition flex items-center gap-0.5 font-medium">वापरा →</span>
        </div>
      </div>
    `).join('');

    // Attach click listeners to cards
    grid.querySelectorAll('.preset-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const p = decodeURIComponent(card.getAttribute('data-prompt'));
        const s = card.getAttribute('data-style');
        promptInput.value = p;
        promptInput.dispatchEvent(new Event('input'));
        selectStyle(s);
        showToast('प्रॉम्प्ट लोड झाला!', 'success');
        promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // Preset tabs
  document.querySelectorAll('.preset-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.preset-tab').forEach(t => {
        t.classList.remove('bg-orange-600', 'text-white', 'active');
        t.classList.add('bg-slate-800', 'text-slate-300');
      });
      tab.classList.add('bg-orange-600', 'text-white', 'active');
      tab.classList.remove('bg-slate-800', 'text-slate-300');
      renderPresetCategory(tab.getAttribute('data-cat'));
    });
  });

  // Initial render of nature presets
  renderPresetCategory('nature');

  // Surprise Me Handler
  surpriseBtn.addEventListener('click', () => {
    if (typeof getRandomPreset === 'function') {
      const randomItem = getRandomPreset();
      promptInput.value = randomItem.prompt;
      promptInput.dispatchEvent(new Event('input'));
      selectStyle(randomItem.style);
      showToast(`🎲 नवीन कल्पना: ${randomItem.title}`, 'success');
    }
  });

  // Nav scroll helpers
  document.getElementById('navPresetsBtn').addEventListener('click', () => {
    document.getElementById('presetsSection').scrollIntoView({ behavior: 'smooth' });
  });

  navGalleryBtn.addEventListener('click', () => {
    document.getElementById('gallerySection').scrollIntoView({ behavior: 'smooth' });
  });

  // ================= 7. ART STYLE SELECTOR =================
  function selectStyle(styleKey) {
    const radio = document.querySelector(`input[name="artStyle"][value="${styleKey}"]`);
    if (radio) {
      radio.checked = true;
      currentStyleLabel.textContent = getStyleLabel(styleKey);
      userEditedEnglishPrompt = false;
      updateLiveTranslation(true);
    }
  }

  function getStyleLabel(styleKey) {
    const labels = {
      photorealistic: 'वास्तववादी छायाचित्र',
      warli: 'वॉरली लोककला',
      rajaravivarma: 'राजा रविवर्मा ऑइल पेंटिंग',
      cinematic: 'सिनेमॅटिक भव्य',
      watercolor: 'जलरंग चित्र',
      digital3d: '३डी डिजिटल रेंडर',
      anime: 'ॲनिमे / गिबली',
      peshwai: 'पेशवेकालीन वैभव',
      sketch: 'पेन्सिल स्केच'
    };
    return labels[styleKey] || styleKey;
  }

  document.querySelectorAll('input[name="artStyle"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentStyleLabel.textContent = getStyleLabel(e.target.value);
      userEditedEnglishPrompt = false;
      updateLiveTranslation(true);
    });
  });

  // ================= 8. ADVANCED OPTIONS ACCORDION =================
  toggleAdvancedBtn.addEventListener('click', () => {
    advancedPanel.classList.toggle('hidden');
    advancedIcon.classList.toggle('rotate-180');
  });

  randomizeSeedBtn.addEventListener('click', () => {
    const newSeed = Math.floor(Math.random() * 10000000);
    seedInput.value = newSeed;
    showToast(`नवीन सीड: ${newSeed}`, 'info');
  });

  // CLIP Slider listeners
  if (cfgSlider && cfgValBadge) {
    cfgSlider.addEventListener('input', () => {
      cfgValBadge.textContent = cfgSlider.value;
    });
  }

  if (stepsSlider && stepsValBadge) {
    stepsSlider.addEventListener('input', () => {
      stepsValBadge.textContent = stepsSlider.value;
    });
  }

  if (modelSelect && hfTokenBox) {
    modelSelect.addEventListener('change', () => {
      if (modelSelect.value === 'hf_sdxl') {
        hfTokenBox.classList.remove('hidden');
      } else {
        hfTokenBox.classList.add('hidden');
      }
    });
  }

  // ================= 9. IMAGE GENERATION ENGINE (SDXL & DUAL CLIP) =================
  async function generateArtwork() {
    const marathiText = promptInput.value.trim();
    if (!marathiText) {
      showToast('कृपया काही मराठी मजकूर लिहा किंवा बोला!', 'warning');
      promptInput.focus();
      return;
    }

    const selectedStyleRadio = document.querySelector('input[name="artStyle"]:checked');
    const style = selectedStyleRadio ? selectedStyleRadio.value : 'photorealistic';
    const ratio = aspectRatioSelect.value || '1:1';
    const engine = modelSelect ? modelSelect.value : 'sdxl_diffusers';
    const guidanceScale = cfgSlider ? parseFloat(cfgSlider.value) : 7.5;
    const steps = stepsSlider ? parseInt(stepsSlider.value) : 30;
    const negativePrompt = negativePromptInput ? negativePromptInput.value.trim() : '';
    const hfToken = hfTokenInput ? hfTokenInput.value.trim() : '';
    const enhance = enhancePromptToggle ? enhancePromptToggle.checked : true;
    let seed = (seedInput && seedInput.value.trim()) ? parseInt(seedInput.value.trim()) : Math.floor(Math.random() * 10000000);

    // Dimension map
    const dimensionMap = {
      '1:1': { width: 768, height: 768 },
      '16:9': { width: 1024, height: 576 },
      '9:16': { width: 576, height: 1024 },
      '4:3': { width: 800, height: 600 }
    };
    const { width, height } = dimensionMap[ratio] || { width: 768, height: 768 };

    // Set UI to loading state
    setGeneratingState(true);
    loadingStepTitle.textContent = getTranslation('statusTranslating');
    loadingStepDetail.textContent = 'मराठी मजकुराचे CLIP टोकनायझेशन व भाषांतर सुरू आहे...';

    try {
      // Step 1: Translate & Enhance Prompt
      let enhancedPrompt = '';
      if (userEditedEnglishPrompt && liveEnglishPrompt && liveEnglishPrompt.value.trim()) {
        enhancedPrompt = liveEnglishPrompt.value.trim();
      } else {
        const transRes = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: marathiText, style, enhance, negativePrompt })
        });
        const transData = await transRes.json();
        enhancedPrompt = transData.enhanced || transData.translated || marathiText;
        if (liveEnglishPrompt) liveEnglishPrompt.value = enhancedPrompt;
      }

      console.log('Marathi Input:', marathiText);
      console.log('Final AI Prompt:', enhancedPrompt);
      console.log(`[CLIP Params] CFG: ${guidanceScale}, Steps: ${steps}`);

      // Step 2: AI Image Generation
      loadingStepTitle.textContent = getTranslation('statusGenerating');
      loadingStepDetail.textContent = `SDXL Diffusers व Dual CLIP द्वारे चित्र साकारत आहे (${width}x${height}, CFG: ${guidanceScale})...`;

      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marathiPrompt: marathiText,
          prompt: enhancedPrompt,
          style,
          width,
          height,
          engine,
          seed,
          guidanceScale,
          steps,
          negativePrompt,
          hfToken,
          enhance
        })
      });

      const genData = await genRes.json();

      if (!genRes.ok || !genData.success) {
        throw new Error(genData.error || 'Failed to generate image');
      }

      // Successful Generation!
      displayGeneratedImage(genData.image);
      showToast(getTranslation('statusSuccess'), 'success');
      loadHistory(); // Refresh gallery

    } catch (err) {
      console.error('[Generation Error]', err);
      showToast(`त्रुटी: ${err.message}`, 'error');
    } finally {
      setGeneratingState(false);
    }
  }

  function setGeneratingState(isGenerating) {
    if (isGenerating) {
      generateBtn.disabled = true;
      generateBtn.classList.add('opacity-80', 'cursor-not-allowed');
      generateBtnText.textContent = getTranslation('generatingBtn');
      generateIcon.classList.add('animate-spin');

      emptyState.classList.add('hidden');
      generatedImage.classList.add('hidden');
      imageHoverActions.classList.add('hidden');
      imageMetaBar.classList.add('hidden');
      loadingState.classList.remove('hidden');
    } else {
      generateBtn.disabled = false;
      generateBtn.classList.remove('opacity-80', 'cursor-not-allowed');
      generateBtnText.textContent = getTranslation('generateBtn');
      generateIcon.classList.remove('animate-spin');
      loadingState.classList.add('hidden');
    }
  }

  function displayGeneratedImage(meta) {
    if (!meta) return;
    activeImageMetadata = meta;

    // Display image
    if (generatedImage) {
      generatedImage.src = meta.imageUrl || '';
      generatedImage.onload = () => {
        generatedImage.classList.remove('hidden');
        if (imageHoverActions) imageHoverActions.classList.remove('hidden');
        if (imageMetaBar) imageMetaBar.classList.remove('hidden');
        if (resultBadge) resultBadge.classList.remove('hidden');
      };
    }

    // Update inspector
    if (promptInspector) promptInspector.classList.remove('hidden');
    if (inspectorMarathiPrompt) inspectorMarathiPrompt.textContent = meta.marathiPrompt || '';
    if (inspectorEnglishPrompt) inspectorEnglishPrompt.textContent = meta.englishPrompt || '';

    // Update badges safely with optional fallbacks
    if (badgeStyle) badgeStyle.textContent = getStyleLabel(meta.style || 'photorealistic');
    if (badgeRatio) badgeRatio.textContent = (meta.width && meta.height) ? `${meta.width}x${meta.height}` : '768x768';
    if (badgeSeed) badgeSeed.textContent = `Seed: ${meta.seed || 42}`;
    if (badgeModel) {
      const modelName = meta.engine || meta.model || 'SDXL Diffusers';
      badgeModel.textContent = String(modelName).toUpperCase();
    }

    // Setup action buttons
    if (quickDownloadBtn) quickDownloadBtn.onclick = () => downloadImage(meta.imageUrl, meta.filename);
    if (downloadBtn) downloadBtn.onclick = () => downloadImage(meta.imageUrl, meta.filename);
    if (regenerateBtn) regenerateBtn.onclick = () => {
      if (seedInput) seedInput.value = Math.floor(Math.random() * 10000000);
      generateArtwork();
    };

    if (lightboxBtn) lightboxBtn.onclick = () => openLightbox(meta);
    if (generatedImage) generatedImage.onclick = () => openLightbox(meta);

    // Save locally
    saveToLocalHistory(meta);
  }

  // Ctrl + Enter shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generateArtwork();
    }
  });

  generateBtn.addEventListener('click', generateArtwork);

  copyEnhancedPromptBtn.addEventListener('click', () => {
    if (activeImageMetadata && activeImageMetadata.englishPrompt) {
      navigator.clipboard.writeText(activeImageMetadata.englishPrompt).then(() => {
        showToast('AI प्रॉम्प्ट कॉपी झाला!', 'success');
      });
    }
  });

  // Download image helper
  function downloadImage(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `chitra_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('चित्र डाउनलोड होत आहे...', 'success');
  }

  // ================= 10. GALLERY & HISTORY MANAGEMENT =================
  async function loadHistory() {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data && data.history) {
        renderGallery(data.history);
      }
    } catch (err) {
      console.warn('Failed to load history from server:', err);
      // Fallback to local storage
      const stored = localStorage.getItem('chitrasrushti_history');
      if (stored) {
        renderGallery(JSON.parse(stored));
      }
    }
  }

  function saveToLocalHistory(meta) {
    if (!meta || !meta.filename) return;
    try {
      let history = JSON.parse(localStorage.getItem('chitrasrushti_history') || '[]');
      if (!Array.isArray(history)) history = [];
      history = [meta, ...history.filter(h => h && h.filename && h.filename !== meta.filename)].slice(0, 50);
      localStorage.setItem('chitrasrushti_history', JSON.stringify(history));
    } catch (e) {}
  }

  function renderGallery(items) {
    if (!galleryGrid) return;
    const validItems = (Array.isArray(items) ? items : []).filter(item => item && (item.imageUrl || item.filename));
    if (validItems.length === 0) {
      galleryGrid.innerHTML = '';
      if (galleryEmptyState) galleryEmptyState.classList.remove('hidden');
      if (totalGenStat) totalGenStat.textContent = 'तयार चित्रे: ०';
      return;
    }

    if (galleryEmptyState) galleryEmptyState.classList.add('hidden');
    if (totalGenStat) totalGenStat.textContent = `तयार चित्रे: ${validItems.length}`;

    galleryGrid.innerHTML = validItems.map(item => `
      <div class="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition shadow-lg flex flex-col justify-between">
        <div class="aspect-square overflow-hidden cursor-pointer" onclick="viewHistoryItem('${encodeURIComponent(JSON.stringify(item))}')">
          <img src="${item.imageUrl || ''}" alt="${item.marathiPrompt || ''}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy">
        </div>
        <div class="p-2.5 bg-slate-950/80 space-y-1">
          <p class="text-xs font-semibold text-slate-200 truncate" title="${item.marathiPrompt || ''}">${item.marathiPrompt || ''}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-400">
            <span class="text-orange-400">${getStyleLabel(item.style || 'photorealistic')}</span>
            <div class="flex items-center gap-1">
              <button type="button" class="p-1 hover:text-white" title="डाउनलोड" onclick="downloadImageDirect('${item.imageUrl || ''}', '${item.filename || 'chitra.jpg'}')">
                ⬇
              </button>
              <button type="button" class="p-1 hover:text-rose-400" title="काढून टाका" onclick="deleteHistoryItem('${item.filename || ''}')">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  window.downloadImageDirect = (url, name) => downloadImage(url, name);

  window.viewHistoryItem = (jsonStr) => {
    try {
      const item = JSON.parse(decodeURIComponent(jsonStr));
      displayGeneratedImage(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  window.deleteHistoryItem = async (filename) => {
    if (!confirm('हे चित्र काढून टाकायचे आहे का? (Delete this image?)')) return;
    try {
      await fetch(`/api/history/${filename}`, { method: 'DELETE' });
      showToast('चित्र काढून टाकले', 'info');
      loadHistory();
    } catch (err) {
      showToast('चित्र हटवण्यात त्रुटी', 'error');
    }
  };

  clearGalleryBtn.addEventListener('click', async () => {
    if (!confirm('सर्व मागील चित्रे पुसायची आहेत का?')) return;
    localStorage.removeItem('chitrasrushti_history');
    galleryGrid.innerHTML = '';
    galleryEmptyState.classList.remove('hidden');
    totalGenStat.textContent = 'तयार चित्रे: ०';
    showToast('सर्व गॅलरी पुसली', 'info');
  });

  // ================= 11. LIGHTBOX MODAL =================
  function openLightbox(meta) {
    if (!meta) return;
    if (lightboxImage) lightboxImage.src = meta.imageUrl || '';
    if (lightboxMarathiText) lightboxMarathiText.textContent = meta.marathiPrompt || '';
    if (lightboxEnglishText) lightboxEnglishText.textContent = meta.englishPrompt || '';
    if (lightboxDownloadLink) {
      lightboxDownloadLink.href = meta.imageUrl || '#';
      lightboxDownloadLink.download = meta.filename || 'chitra.jpg';
    }
    if (lightboxModal) lightboxModal.classList.remove('hidden');
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.add('hidden');
  }

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      if (helpModal) helpModal.classList.add('hidden');
    }
  });

  // ================= 12. HELP & LANGUAGE =================
  if (helpModalBtn && helpModal) helpModalBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
  if (closeHelpBtn && helpModal) closeHelpBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
  if (closeHelpConfirmBtn && helpModal) closeHelpConfirmBtn.addEventListener('click', () => helpModal.classList.add('hidden'));

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'mr' ? 'en' : 'mr';
      setLanguage(nextLang);
      showToast(nextLang === 'en' ? 'Switched to English' : 'मराठी भाषा निवडली', 'info');
    });
  }

  // ================= 13. TOAST NOTIFICATIONS =================
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
      error: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
      warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
      info: 'bg-slate-900/95 border-orange-500/40 text-orange-200'
    };

    toast.className = `toast-notice pointer-events-auto px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 ${colors[type] || colors.info}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}</span><span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Load history on boot
  loadHistory();
});
