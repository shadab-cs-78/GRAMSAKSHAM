/**
 * Speech Helper for Web Speech API (TTS & STT) + Audio Cues
 * Works natively in Chrome, Edge, Safari, Android without any external API keys.
 * Full multi-language support for: Hindi (hi-IN), English (en-IN), Bengali (bn-IN), Telugu (te-IN), Punjabi (pa-IN)
 */

// Normalizes language code to standard BCP-47 locale
export function getTtsLocale(lang = 'hi') {
  const code = (lang || 'hi').toLowerCase().split('-')[0];
  switch (code) {
    case 'en': return 'en-IN';
    case 'bn': return 'bn-IN';
    case 'te': return 'te-IN';
    case 'pa': return 'pa-IN';
    case 'hi':
    default: return 'hi-IN';
  }
}

// Voice cache for eager availability
let cachedVoices = [];
function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Play gentle dual-frequency audio chime for village kiosk feedback
export function playChime(isStart = true) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (isStart) {
      // Pleasant rising chime (listening started)
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      // Soft confirmation blip (answer recorded)
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // AudioContext blocked by browser autoplay policy until user gesture
  }
}

/**
 * Text-to-Speech (Speaks in Hindi, English, Bengali, Telugu, Punjabi)
 * Automatically picks the best available native/cloud voice for the chosen language.
 */
export function speakText(text, lang = 'hi-IN', onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || typeof text !== 'string' || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  const targetLocale = getTtsLocale(lang);
  const langPrefix = targetLocale.split('-')[0].toLowerCase();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLocale;
  utterance.rate = 0.92; // Slightly measured pace for rural kiosks & elder beneficiaries
  utterance.pitch = 1.0;

  // Retrieve voices from cache or live API
  let voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices.length && window.speechSynthesis.getVoices) {
    voices = window.speechSynthesis.getVoices();
  }

  // Priority 1: Exact locale match (e.g. bn-IN, te-IN, pa-IN, hi-IN, en-IN)
  let matchedVoice = voices.find(v => {
    const vLang = (v.lang || '').replace('_', '-').toLowerCase();
    return vLang === targetLocale.toLowerCase();
  });

  // Priority 2: Prefix match (e.g. starts with 'bn', 'te', 'pa', 'hi', 'en')
  if (!matchedVoice) {
    matchedVoice = voices.find(v => (v.lang || '').toLowerCase().startsWith(langPrefix));
  }

  // Priority 3: Name match (e.g. 'bengali', 'bangla', 'telugu', 'punjabi', 'hindi', 'india')
  if (!matchedVoice) {
    const langNames = {
      hi: ['hindi', 'hi-in', 'swara', 'madhur'],
      en: ['india', 'en-in', 'neerja', 'prabhat'],
      bn: ['bengali', 'bangla', 'bn-in', 'bn-bd', 'tapan'],
      te: ['telugu', 'te-in', 'mohan'],
      pa: ['punjabi', 'panjabi', 'pa-in', 'raavi']
    };
    const keywords = langNames[langPrefix] || [langPrefix];
    matchedVoice = voices.find(v => {
      const nameLower = (v.name || '').toLowerCase();
      return keywords.some(k => nameLower.includes(k));
    });
  }

  // Priority 4: Indian regional fallback (e.g. Indian English or Hindi if regional not installed locally)
  if (!matchedVoice && (langPrefix === 'bn' || langPrefix === 'te' || langPrefix === 'pa')) {
    matchedVoice = voices.find(v => (v.lang || '').toLowerCase().includes('in') || (v.name || '').toLowerCase().includes('india'));
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn("Speech synthesis notice:", e);
    if (onEnd) onEnd();
  };

  // Small delay ensures previous cancel finishes cleanly
  setTimeout(() => {
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech speak error:", err);
      if (onEnd) onEnd();
    }
  }, 40);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Speech Recognition (Listens to microphone with interim & final callbacks)
export function createSpeechRecognizer(lang = 'hi-IN', onResult, onError, onEnd) {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("SpeechRecognition not supported in this browser.");
    return null;
  }

  const targetLocale = getTtsLocale(lang);
  const recognizer = new SpeechRecognition();
  recognizer.lang = targetLocale;
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.onresult = (event) => {
    let transcript = '';
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) isFinal = true;
    }
    if (onResult) onResult(transcript, isFinal);
  };

  recognizer.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    if (onError) onError(event.error);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return recognizer;
}
