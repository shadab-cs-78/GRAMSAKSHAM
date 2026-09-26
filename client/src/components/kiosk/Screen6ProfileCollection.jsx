import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  UserX, 
  BookOpen, 
  GraduationCap, 
  Wrench, 
  Award, 
  MoreHorizontal, 
  Mic, 
  MicOff,
  Check, 
  Volume2, 
  Sprout, 
  Scissors, 
  Hammer, 
  Building, 
  Zap, 
  Smartphone, 
  Sun, 
  Utensils, 
  MapPin, 
  Briefcase, 
  Store, 
  Layers, 
  Edit3,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Play,
  Navigation
} from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { speakText, stopSpeaking, createSpeechRecognizer, playChime } from '../../utils/speechHelper';

// 1. Education Options
const EDUCATION_OPTIONS = [
  { id: 'secondary', icon: BookOpen },
  { id: 'higher_secondary', icon: GraduationCap },
  { id: 'primary', icon: BookOpen },
  { id: 'diploma', icon: Wrench },
  { id: 'graduate', icon: Award },
  { id: 'no_formal', icon: UserX },
  { id: 'other', icon: MoreHorizontal }
];

// 2. Existing / Traditional Skills Options
const SKILLS_OPTIONS = [
  { id: 'farming', icon: Sprout },
  { id: 'tailoring', icon: Scissors },
  { id: 'carpentry_metal', icon: Hammer },
  { id: 'leather_craft', icon: Wrench },
  { id: 'construction', icon: Building },
  { id: 'none', icon: UserX }
];

// 3. New Interests / Aspirations Options
const INTERESTS_OPTIONS = [
  { id: 'electrician', icon: Zap },
  { id: 'mobile_repair', icon: Smartphone },
  { id: 'solar_tech', icon: Sun },
  { id: 'food_processing', icon: Utensils },
  { id: 'organic_farming', icon: Sprout },
  { id: 'fashion_boutique', icon: Scissors }
];

// 4. Location / Village / Block Options (User Location & Clusters with Real Census Districts)
const LOCATION_OPTIONS = [
  { id: 'live_gps', icon: Navigation, isGps: true },
  { id: 'ratlam', icon: MapPin, coords: { lat: 23.3315, lng: 75.0367 }, district: 'Ratlam' },
  { id: 'rewa', icon: MapPin, coords: { lat: 24.5362, lng: 81.3037 }, district: 'Rewa' },
  { id: 'morena', icon: MapPin, coords: { lat: 26.4947, lng: 77.9940 }, district: 'Morena' },
  { id: 'shahdol', icon: MapPin, coords: { lat: 23.2957, lng: 81.3577 }, district: 'Shahdol' },
  { id: 'jabalpur', icon: Building, coords: { lat: 23.1815, lng: 79.9650 }, district: 'Jabalpur' },
  { id: 'kundam', icon: MapPin, coords: { lat: 23.1970, lng: 80.3520 }, district: 'Jabalpur' },
  { id: 'jaora', icon: MapPin, coords: { lat: 23.6358, lng: 75.1278 }, district: 'Ratlam' },
  { id: 'mauganj', icon: MapPin, coords: { lat: 24.6820, lng: 81.8820 }, district: 'Rewa' },
  { id: 'ambah', icon: MapPin, coords: { lat: 26.7050, lng: 78.2310 }, district: 'Morena' },
  { id: 'sohagpur', icon: MapPin, coords: { lat: 23.3100, lng: 81.3700 }, district: 'Shahdol' }
];

// 5. Employment Preference Options
const PREFERENCE_OPTIONS = [
  { id: 'self', icon: Store },
  { id: 'wage', icon: Briefcase },
  { id: 'both', icon: Layers }
];

export default function Screen6ProfileCollection({ 
  profile = {}, 
  mode = 'voice', // 'touch' or 'voice'
  onUpdateProfile, 
  onBack, 
  onNext, 
  lang = 'hi', 
  soundEnabled = true 
}) {
  // Current values
  const [education, setEducation] = useState(profile.education || 'secondary');
  const [skills, setSkills] = useState(profile.skills || 'farming');
  const [interests, setInterests] = useState(profile.interests?.[0] || 'electrician');
  const [location, setLocation] = useState(profile.location || 'village');
  const [locationInputText, setLocationInputText] = useState(profile.locationName || '');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [employmentPref, setEmploymentPref] = useState(profile.employment_preference || 'self');

  // Conversational Assistant Active Question Index (0 to 4, 5 is completed)
  const [activeStep, setActiveStep] = useState(0);

  // Streaming Typed Text State per step
  const [streamedQuestions, setStreamedQuestions] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showManualBox, setShowManualBox] = useState(false);

  const recognizerRef = useRef(null);
  const timerRef = useRef(null);
  const chatScrollRef = useRef(null);
  const typingTimerRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;
  const ttsLocale = lang === 'en' ? 'en-IN' : lang === 'bn' ? 'bn-IN' : lang === 'te' ? 'te-IN' : lang === 'pa' ? 'pa-IN' : 'hi-IN';

  // Helper to get translated option label
  const getOptionLabel = (stepIdx, optId) => {
    if (stepIdx === 0) return t.options_edu?.[optId] || optId;
    if (stepIdx === 1) return t.options_skills?.[optId] || optId;
    if (stepIdx === 2) return t.options_interests?.[optId] || optId;
    if (stepIdx === 3) return t.options_location?.[optId] || optId;
    if (stepIdx === 4) return t.options_pref?.[optId] || optId;
    return optId;
  };

  const getQuestionTitle = (stepIdx) => {
    if (stepIdx === 0) return t.step_edu_title;
    if (stepIdx === 1) return t.step_skills_title;
    if (stepIdx === 2) return t.step_interests_title;
    if (stepIdx === 3) return t.step_location_title;
    if (stepIdx === 4) return t.step_pref_title;
    return '';
  };

  const getStepOptions = (stepIdx) => {
    if (stepIdx === 0) return EDUCATION_OPTIONS;
    if (stepIdx === 1) return SKILLS_OPTIONS;
    if (stepIdx === 2) return INTERESTS_OPTIONS;
    if (stepIdx === 3) return LOCATION_OPTIONS;
    if (stepIdx === 4) return PREFERENCE_OPTIONS;
    return [];
  };

  const getSelectedValue = (stepIdx) => {
    if (stepIdx === 0) return education;
    if (stepIdx === 1) return skills;
    if (stepIdx === 2) return interests;
    if (stepIdx === 3) return location;
    if (stepIdx === 4) return employmentPref;
    return '';
  };

  // Helper to get full spoken text including option items
  const getSpokenPrompt = (stepIdx) => {
    if (t[`spoken_q${stepIdx}_full`]) {
      return t[`spoken_q${stepIdx}_full`];
    }
    const title = getQuestionTitle(stepIdx);
    const opts = getStepOptions(stepIdx).filter(o => !o.isGps);
    const optLabels = opts.map((opt, i) => `${i + 1}. ${getOptionLabel(stepIdx, opt.id)}`).join(', ');
    return `${title} ${t.speak_options_prefix || 'विकल्प हैं:'} ${optLabels}`;
  };

  // Smooth scroll chat down whenever conversation advances or updates
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTo({
          top: chatScrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 80);
  };

  // Typewriter streaming effect for newly active question
  useEffect(() => {
    if (mode !== 'voice') return;

    if (activeStep <= 4) {
      const fullText = getQuestionTitle(activeStep);
      const spokenPrompt = getSpokenPrompt(activeStep);
      let charIndex = 0;
      setIsTyping(true);

      // Speak question AND its options aloud simultaneously in selected language
      if (soundEnabled) {
        speakText(spokenPrompt, ttsLocale);
      }

      if (typingTimerRef.current) clearInterval(typingTimerRef.current);

      typingTimerRef.current = setInterval(() => {
        charIndex += 2;
        if (charIndex <= fullText.length) {
          setStreamedQuestions(prev => ({
            ...prev,
            [activeStep]: fullText.slice(0, charIndex)
          }));
        } else {
          setStreamedQuestions(prev => ({
            ...prev,
            [activeStep]: fullText
          }));
          setIsTyping(false);
          clearInterval(typingTimerRef.current);
          scrollToBottom();
        }
      }, 25);
    } else if (activeStep === 5) {
      // Completed all 5 steps
      if (soundEnabled) {
        speakText(t.ai_done_msg, ttsLocale);
      }
      scrollToBottom();
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [activeStep, mode, lang, soundEnabled]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Map spoken phrase to nearest recognized choice (Supports keywords AND spoken numbers 1-6)
  const mapSpokenTextToField = (text, stepIdx) => {
    const q = (text || '').toLowerCase().trim();
    let matchedId = null;

    // Check if spoken text references a number (e.g. "1", "one", "पहला", "two", "दो"...)
    const options = getStepOptions(stepIdx);
    let spokenNum = null;
    if (q === '1' || q.includes('option 1') || q.includes('नंबर 1') || q.includes('एक') || q.includes('पहला') || q.includes('first') || q.includes('one')) spokenNum = 1;
    else if (q === '2' || q.includes('option 2') || q.includes('नंबर 2') || q.includes('दो') || q.includes('दूसरा') || q.includes('second') || q.includes('two')) spokenNum = 2;
    else if (q === '3' || q.includes('option 3') || q.includes('नंबर 3') || q.includes('तीन') || q.includes('तीसरा') || q.includes('third') || q.includes('three')) spokenNum = 3;
    else if (q === '4' || q.includes('option 4') || q.includes('नंबर 4') || q.includes('चार') || q.includes('चौथा') || q.includes('fourth') || q.includes('four')) spokenNum = 4;
    else if (q === '5' || q.includes('option 5') || q.includes('नंबर 5') || q.includes('पांच') || q.includes('पांचवा') || q.includes('fifth') || q.includes('five')) spokenNum = 5;
    else if (q === '6' || q.includes('option 6') || q.includes('नंबर 6') || q.includes('छह') || q.includes('छठा') || q.includes('sixth') || q.includes('six')) spokenNum = 6;

    if (spokenNum && options[spokenNum - 1]) {
      matchedId = options[spokenNum - 1].id;
    }

    if (!matchedId) {
      if (stepIdx === 0) {
        if (q.includes('school') || q.includes('नहीं') || q.includes('no') || q.includes('ਸਕੂਲ')) matchedId = 'no_formal';
        else if (q.includes('5') || q.includes('पांच') || q.includes('primary') || q.includes('प्राथमिक') || q.includes('প্রাথমিক') || q.includes('ప్రాథమిక')) matchedId = 'primary';
        else if (q.includes('10') || q.includes('दस') || q.includes('माध्यमिक') || q.includes('secondary') || q.includes('মাধ্যমিক') || q.includes('ਮੈਟ੍ਰਿਕ')) matchedId = 'secondary';
        else if (q.includes('12') || q.includes('बारह') || q.includes('higher') || q.includes('ਬਾਰ੍ਹਵੀਂ')) matchedId = 'higher_secondary';
        else if (q.includes('iti') || q.includes('diploma') || q.includes('आईटीआई') || q.includes('আইটিআই')) matchedId = 'diploma';
        else if (q.includes('graduate') || q.includes('स्नातक') || q.includes('ডিগ্রী')) matchedId = 'graduate';
        else matchedId = 'secondary';
      } else if (stepIdx === 1) {
        if (q.includes('farm') || q.includes('खेती') || q.includes('पशु') || q.includes('कृষি') || q.includes('వ్యవసాయ') || q.includes('ਖੇਤੀ')) matchedId = 'farming';
        else if (q.includes('tailor') || q.includes('सिलाई') || q.includes('सेलाई') || q.includes('కుట్టు') || q.includes('ਸਿਲਾਈ')) matchedId = 'tailoring';
        else if (q.includes('carpenter') || q.includes('बढ़ई') || q.includes('लोहार') || q.includes('ਤਰਖਾਣ')) matchedId = 'carpentry_metal';
        else if (q.includes('leather') || q.includes('चर्म') || q.includes('जूता') || q.includes('తోలు')) matchedId = 'leather_craft';
        else if (q.includes('construct') || q.includes('मिस्त्री') || q.includes('निर्माण') || q.includes('రాజమిస్త్రీ')) matchedId = 'construction';
        else matchedId = 'farming';
      } else if (stepIdx === 2) {
        if (q.includes('electric') || q.includes('बिजली') || q.includes('वायरिंग') || q.includes('ఎలక్ట్రీషియన్') || q.includes('ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ')) matchedId = 'electrician';
        else if (q.includes('mobile') || q.includes('फोन') || q.includes('ফোন') || q.includes('మొబైల్') || q.includes('ਮੋਬਾਈਲ')) matchedId = 'mobile_repair';
        else if (q.includes('solar') || q.includes('सौर') || q.includes('ਸੋਲਰ') || q.includes('సోలార్')) matchedId = 'solar_tech';
        else if (q.includes('food') || q.includes('खाद्य') || q.includes('बेकरी') || q.includes('ਫੂਡ')) matchedId = 'food_processing';
        else if (q.includes('mush') || q.includes('जैविक') || q.includes('organic') || q.includes('ਜੈਵਿਕ')) matchedId = 'organic_farming';
        else if (q.includes('boutique') || q.includes('बुटीक') || q.includes('ফ্যাশন') || q.includes('బోటిక్')) matchedId = 'fashion_boutique';
        else matchedId = 'electrician';
      } else if (stepIdx === 3) {
        if (q.includes('gps') || q.includes('वर्तमान') || q.includes('यहाँ') || q.includes('current') || q.includes('live') || q.includes('ਟਿਕਾਣਾ')) {
          handleGpsDetect();
          return;
        }
        if (q.includes('ratlam') || q.includes('रतलाम')) matchedId = 'ratlam';
        else if (q.includes('rewa') || q.includes('रीवा')) matchedId = 'rewa';
        else if (q.includes('morena') || q.includes('मुरैना')) matchedId = 'morena';
        else if (q.includes('shahdol') || q.includes('शहडोल')) matchedId = 'shahdol';
        else if (q.includes('jabalpur') || q.includes('जबलपुर')) matchedId = 'jabalpur';
        else if (q.includes('kundam') || q.includes('कुंडम')) matchedId = 'kundam';
        else if (q.includes('jaora') || q.includes('जावरा')) matchedId = 'jaora';
        else if (q.includes('mauganj') || q.includes('मऊगंज')) matchedId = 'mauganj';
        else if (q.includes('ambah') || q.includes('अंबाह')) matchedId = 'ambah';
        else if (q.includes('sohagpur') || q.includes('सोहागपुर')) matchedId = 'sohagpur';
        else {
          setLocationInputText(text);
          handleConfirmLocationInput(text);
          return;
        }
      } else if (stepIdx === 4) {
        if (q.includes('self') || q.includes('दुकान') || q.includes('स्वरोजगार') || q.includes('వ్యాపారం') || q.includes('ਸਵੈ')) matchedId = 'self';
        else if (q.includes('job') || q.includes('नौकरी') || q.includes('ਚਾਕরি') || q.includes('ఉద్యోగం') || q.includes('ਨੌਕਰੀ')) matchedId = 'wage';
        else matchedId = 'both';
      }
    }

    if (matchedId) {
      handleSelectOption(stepIdx, matchedId);
    }
  };

  // Dedicated Live GPS Locator
  const handleGpsDetect = () => {
    setIsLocatingGps(true);
    playChime(true);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingGps(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const locName = `📍 GPS (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`;
          setLocationInputText(locName);
          setLocation('live_gps');

          const updated = {
            ...profile,
            location: 'live_gps',
            locationName: locName,
            coordinates: { lat, lng },
            district: 'जबलपुर (GPS Live)'
          };
          if (onUpdateProfile) onUpdateProfile(updated);

          if (soundEnabled) {
            const prompt = t.gps_detected || 'स्थान प्राप्त हुआ';
            speakText(prompt, ttsLocale);
          }

          if (isRecording && recognizerRef.current) {
            try { recognizerRef.current.stop(); } catch (e) {}
            setIsRecording(false);
          }
          setLiveTranscript('');
          setShowManualBox(false);

          setTimeout(() => {
            if (activeStep === 3) setActiveStep(4);
            scrollToBottom();
          }, 900);
        },
        (err) => {
          setIsLocatingGps(false);
          const fallbackText = '📍 जबलपुर केंद्र (GPS)';
          setLocationInputText(fallbackText);
          setLocation('live_gps');
          const updated = {
            ...profile,
            location: 'live_gps',
            locationName: fallbackText,
            coordinates: { lat: 23.1815, lng: 79.9650 },
            district: 'Jabalpur'
          };
          if (onUpdateProfile) onUpdateProfile(updated);

          if (isRecording && recognizerRef.current) {
            try { recognizerRef.current.stop(); } catch (e) {}
            setIsRecording(false);
          }
          setLiveTranscript('');

          setTimeout(() => {
            if (activeStep === 3) setActiveStep(4);
            scrollToBottom();
          }, 900);
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      setIsLocatingGps(false);
      handleSelectOption(3, 'kundam');
    }
  };

  // Confirm manual or chip input for Location
  const handleConfirmLocationInput = (customText) => {
    const txt = (customText || locationInputText || '').trim();
    if (!txt) return;
    playChime(false);

    // Match with predefined clusters
    const matched = LOCATION_OPTIONS.find(l => 
      l.id !== 'live_gps' && (
        l.id.toLowerCase().includes(txt.toLowerCase()) || 
        (getOptionLabel(3, l.id) || '').toLowerCase().includes(txt.toLowerCase())
      )
    );

    const locId = matched ? matched.id : 'custom_location';
    const coords = matched?.coords || { lat: 23.1970, lng: 80.3520 };
    setLocation(locId);
    setLocationInputText(txt);

    const detectedDistrict = matched?.district || (
      txt.toLowerCase().includes('ratlam') || txt.includes('रतलाम') ? 'Ratlam' :
      txt.toLowerCase().includes('rewa') || txt.includes('रीवा') ? 'Rewa' :
      txt.toLowerCase().includes('morena') || txt.includes('मुरैना') ? 'Morena' :
      txt.toLowerCase().includes('shahdol') || txt.includes('शहडोल') ? 'Shahdol' :
      txt.toLowerCase().includes('sehore') || txt.includes('सीहोर') ? 'Sehore' : 'Jabalpur'
    );

    const updated = {
      ...profile,
      location: locId,
      locationName: txt,
      coordinates: coords,
      district: detectedDistrict
    };
    if (onUpdateProfile) onUpdateProfile(updated);

    if (isRecording && recognizerRef.current) {
      try { recognizerRef.current.stop(); } catch (e) {}
      setIsRecording(false);
    }
    setLiveTranscript('');
    setShowManualBox(false);

    if (activeStep === 3) {
      setActiveStep(4);
    }
    scrollToBottom();
  };

  // User answers a question (either via tap or voice transcript)
  const handleSelectOption = (stepIdx, optId) => {
    playChime(false);

    let updated = { ...profile };
    if (stepIdx === 0) {
      setEducation(optId);
      updated.education = optId;
    } else if (stepIdx === 1) {
      setSkills(optId);
      updated.skills = optId;
    } else if (stepIdx === 2) {
      setInterests(optId);
      updated.interests = [optId];
    } else if (stepIdx === 3) {
      if (optId === 'live_gps') {
        handleGpsDetect();
        return;
      }
      setLocation(optId);
      updated.location = optId;
      const found = LOCATION_OPTIONS.find(l => l.id === optId);
      const locLabel = t.options_location?.[optId] || optId;
      updated.locationName = locLabel;
      setLocationInputText(locLabel);
      updated.coordinates = found?.coords || { lat: 23.1970, lng: 80.3520 };
      updated.district = found?.district || (optId === 'jabalpur_center' ? 'Jabalpur' : 'Jabalpur Rural');
    } else if (stepIdx === 4) {
      setEmploymentPref(optId);
      updated.employment_preference = optId;
    }

    if (onUpdateProfile) onUpdateProfile(updated);

    // If currently recording, stop it cleanly
    if (isRecording && recognizerRef.current) {
      try { recognizerRef.current.stop(); } catch (e) {}
      setIsRecording(false);
    }
    setLiveTranscript('');
    setShowManualBox(false);

    // Advance to next question in sequence
    if (stepIdx === activeStep) {
      setActiveStep(prev => prev + 1);
    }
    scrollToBottom();
  };

  // Start or Stop Microphone
  const toggleRecording = () => {
    if (isRecording) {
      if (recognizerRef.current) {
        try { recognizerRef.current.stop(); } catch (e) {}
      }
      setIsRecording(false);
      playChime(false);
      return;
    }

    stopSpeaking();
    playChime(true);
    setIsRecording(true);
    setLiveTranscript('');

    const currentQ = activeStep <= 4 ? activeStep : 4;
    const recognizer = createSpeechRecognizer(
      ttsLocale,
      (text, isFinal) => {
        setLiveTranscript(text);
        setManualInput(text);
        if (isFinal) {
          mapSpokenTextToField(text, currentQ);
          setIsRecording(false);
        }
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        recognizerRef.current = recognizer;
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  // Replay voice for any question in chat
  const handleReplayVoice = (stepIdx) => {
    const text = getQuestionTitle(stepIdx);
    speakText(text, ttsLocale);
  };

  // Finish Assessment and advance to Screen 6 (Processing)
  const handleCompleteAssessment = () => {
    stopSpeaking();
    const finalProfile = {
      ...profile,
      education,
      skills,
      interests: [interests],
      location,
      employment_preference: employmentPref
    };
    if (onUpdateProfile) onUpdateProfile(finalProfile);
    onNext();
  };

  // Progress percentage
  const progressPercent = Math.min(100, Math.round((Math.min(activeStep, 5) / 5) * 100));

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 flex flex-col justify-between min-h-[calc(100vh-130px)]">
      
      {/* ------------------------------------------------------------- */}
      {/* MODE 1: CONVERSATIONAL AI ASSISTANT STREAM (SINGLE UNIFIED SCREEN) */}
      {/* ------------------------------------------------------------- */}
      {mode === 'voice' ? (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden">
          
          {/* TOP BAR: AI Sahayak Status & Progress Bar (Emerald & Gold Theme) */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 sm:px-6 py-3.5 border-b border-emerald-900 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-inner">
                  🤖
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-800"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base tracking-tight leading-none">
                    {t.ai_assistant_name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] tracking-wider uppercase">
                    PM-AJAY AI
                  </span>
                </div>
                <p className="text-emerald-100 text-xs font-semibold mt-0.5">
                  {t.profile_step_label} {Math.min(activeStep + 1, 5)} {t.of_steps} ({progressPercent}%)
                </p>
              </div>
            </div>

            {/* Top Progress Track */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-36 h-2 bg-emerald-950/60 rounded-full overflow-hidden p-0.5 hidden xs:block">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <button
                onClick={onBack}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {t.btn_quit}
              </button>
            </div>
          </div>

          {/* CHAT / DIALOGUE STREAM (Continuous conversation on one screen) */}
          <div 
            ref={chatScrollRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/70"
          >
            {/* 1. Welcome Greeting Bubble */}
            <div className="flex items-start gap-3 max-w-xl">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs text-base font-bold">
                🤖
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-xs border border-slate-200 text-slate-800 shadow-xs">
                <p className="font-semibold text-sm sm:text-base leading-relaxed text-slate-900">
                  {t.ai_welcome_msg}
                </p>
              </div>
            </div>

            {/* 2. Questions 0 to 4 rendered sequentially in conversational stream */}
            {[0, 1, 2, 3, 4].map((stepIdx) => {
              if (stepIdx > activeStep) return null; // Not yet reached

              const isCurrentQuestion = stepIdx === activeStep;
              const hasAnswered = stepIdx < activeStep || activeStep === 5;
              const questionText = isCurrentQuestion 
                ? (streamedQuestions[stepIdx] || getQuestionTitle(stepIdx))
                : getQuestionTitle(stepIdx);
              const selectedOptId = getSelectedValue(stepIdx);
              const options = getStepOptions(stepIdx);

              return (
                <div key={stepIdx} className="space-y-4 animate-in fade-in duration-300">
                  
                  {/* AI Question Message */}
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm text-sm font-bold mt-0.5">
                      {stepIdx + 1}
                    </div>
                    
                    <div className="bg-white p-4 sm:p-5 rounded-2xl rounded-tl-xs border-2 border-emerald-100 shadow-sm space-y-3 w-full">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                          {questionText}
                          {isCurrentQuestion && isTyping && (
                            <span className="inline-block w-2 h-4 bg-emerald-600 ml-1 animate-pulse"></span>
                          )}
                        </h4>
                        
                        {/* Audio & Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleReplayVoice(stepIdx)}
                            className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            title={t.listen_voice || "आवाज़ सुनें"}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              handleReplayVoice(stepIdx);
                              if (!isRecording) toggleRecording();
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="दोबारा बोलें"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{t.btn_retake_question || 'दोबारा बोलें'}</span>
                          </button>
                          
                          {stepIdx > 0 && isCurrentQuestion && (
                            <button
                              onClick={() => {
                                setActiveStep(stepIdx - 1);
                                scrollToBottom();
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="पिछला प्रश्न सुधारें"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>{t.btn_retake_previous || 'पिछला प्रश्न'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Interactive Option Chips underneath this question */}
                      <div className="pt-2 border-t border-slate-100">
                        {stepIdx === 3 ? (
                          /* Dedicated Question 4: Current Location Input + Live GPS + Real Census District Pills */
                          <div className="space-y-3">
                            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{t.voice_fail_hint || '💡 आवाज़ से बोलें या नीचे दिए गए जिलों व स्थानों में से सीधे चुनें:'}</span>
                            </div>

                            {/* Location Input & GPS Action Bar */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <input
                                  type="text"
                                  value={locationInputText}
                                  onChange={(e) => setLocationInputText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleConfirmLocationInput(locationInputText);
                                    }
                                  }}
                                  placeholder={t.manual_input_placeholder || 'अपने गाँव / ग्राम पंचायत का नाम लिखें...'}
                                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none transition-all"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Detect GPS Button */}
                                <button
                                  type="button"
                                  onClick={handleGpsDetect}
                                  disabled={isLocatingGps}
                                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs"
                                  title="Detect current GPS coordinates"
                                >
                                  <Navigation className={`w-4 h-4 text-emerald-700 ${isLocatingGps ? 'animate-spin' : ''}`} />
                                  <span>{isLocatingGps ? (t.detecting_gps || 'खोज रहे हैं...') : (t.current_gps_loc || '📍 जीपीएस पता करें')}</span>
                                </button>

                                {/* Confirm Button */}
                                <button
                                  type="button"
                                  onClick={() => handleConfirmLocationInput(locationInputText)}
                                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-700/20 cursor-pointer active:scale-95 transition-all"
                                >
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>{t.btn_confirm_answer || 'पुष्टि करें'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Quick Cluster Pills (Real Districts from Census Data) */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                त्वरित जिले व ग्रामीण क्लस्टर (Census SC Data):
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {LOCATION_OPTIONS.filter(opt => !opt.isGps).map((opt, i) => {
                                  const isChosen = selectedOptId === opt.id || locationInputText.includes(getOptionLabel(3, opt.id));
                                  const IconComp = opt.icon || MapPin;
                                  return (
                                    <button
                                      key={opt.id}
                                      onClick={() => {
                                        const label = getOptionLabel(3, opt.id);
                                        setLocationInputText(label);
                                        handleSelectOption(3, opt.id);
                                      }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                        isChosen
                                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 font-extrabold'
                                          : 'bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800'
                                      }`}
                                    >
                                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-black">
                                        {i + 1}
                                      </span>
                                      <IconComp className={`w-3.5 h-3.5 ${isChosen ? 'text-white' : 'text-emerald-600'}`} />
                                      <span>{getOptionLabel(3, opt.id)}</span>
                                      {isChosen && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Default Option Chips for steps 0, 1, 2, 4 */
                          <div className="space-y-2">
                            {isCurrentQuestion && (
                              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>{t.voice_fail_hint || '💡 आवाज़ से बोलें या नीचे दिए गए विकल्पों में से किसी एक को सीधे छुएं:'}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {options.map((opt, i) => {
                                const isChosen = selectedOptId === opt.id;
                                const IconComp = opt.icon || Award;
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => handleSelectOption(stepIdx, opt.id)}
                                    className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                      isChosen
                                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 font-extrabold'
                                        : 'bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800'
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                                      isChosen ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {i + 1}
                                    </span>
                                    <IconComp className={`w-4 h-4 ${isChosen ? 'text-white' : 'text-emerald-600'}`} />
                                    <span>{getOptionLabel(stepIdx, opt.id)}</span>
                                    {isChosen && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Beneficiary Answer Message (if answered) */}
                  {hasAnswered && (
                    <div className="flex items-start justify-end gap-3 max-w-xl ml-auto animate-in slide-in-from-right-4 duration-300">
                      <div className="bg-emerald-700 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-md space-y-2">
                        <div className="text-[11px] text-emerald-200 font-semibold flex items-center justify-between gap-4 border-b border-emerald-600/60 pb-1">
                          <span>{t.your_answer_label}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setActiveStep(stepIdx);
                                scrollToBottom();
                              }}
                              className="text-amber-300 hover:text-white flex items-center gap-1 font-bold text-xs underline cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{t.btn_edit_manual || 'सुधारें'}</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveStep(stepIdx);
                                handleReplayVoice(stepIdx);
                                scrollToBottom();
                              }}
                              className="text-emerald-200 hover:text-white flex items-center gap-1 font-bold text-xs cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{t.btn_retake_question || 'फिर से बोलें'}</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-300" />
                          <span>{stepIdx === 3 && profile.locationName ? profile.locationName : getOptionLabel(stepIdx, selectedOptId)}</span>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-sm text-base font-bold">
                        👤
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

            {/* 3. Completion Message when all 5 are answered */}
            {activeStep >= 5 && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-5 sm:p-6 rounded-3xl border-2 border-emerald-300 shadow-md space-y-4 animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md">
                    🎉
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">
                      {t.complete_title}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                      {t.ai_done_msg}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCompleteAssessment}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-95 cursor-pointer transition-all"
                  >
                    <span>{t.btn_done}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STICKY BOTTOM VOICE CONTROL DOCK (Gram Saksham Emerald Theme) */}
          <div className="bg-white border-t border-slate-200 px-4 py-3 sm:py-4 shadow-lg shrink-0">
            <div className="max-w-xl mx-auto flex flex-col items-center">
              
              {/* Central Ripple Mic Widget */}
              <div className="relative flex items-center justify-center my-1">
                
                {/* 3 Concentric Expanding Pulsing Rings (Emerald Green) */}
                {isRecording && (
                  <>
                    <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ripple-1 pointer-events-none"></div>
                    <div className="absolute w-28 h-28 rounded-full bg-emerald-500/30 animate-ripple-2 pointer-events-none"></div>
                    <div className="absolute w-28 h-28 rounded-full bg-emerald-500/40 animate-ripple-3 pointer-events-none"></div>
                  </>
                )}

                {/* Main Microphone Button */}
                <button
                  onClick={toggleRecording}
                  className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 shadow-rose-600/40 ring-4 ring-rose-200 scale-105'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                  title={t.tap_to_speak}
                >
                  {isRecording ? (
                    <Mic className="w-10 h-10 animate-pulse text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>
              </div>

              {/* Status Indicator & Live Transcript */}
              <div className="mt-2 text-center w-full min-h-[30px] flex items-center justify-center">
                {isRecording ? (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                    <span>{t.listening_label} 0:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}</span>
                    {liveTranscript && (
                      <span className="font-extrabold text-slate-900 border-l border-rose-300 pl-2">
                        "{liveTranscript}"
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    {t.tap_to_speak}
                  </p>
                )}
              </div>

              {/* Quick Manual Input fallback drawer */}
              {showManualBox && (
                <div className="w-full mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder={t.manual_input_placeholder}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowManualBox(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200"
                    >
                      {t.btn_close_edit}
                    </button>
                    <button
                      onClick={() => {
                        mapSpokenTextToField(manualInput, Math.min(activeStep, 4));
                        setShowManualBox(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                    >
                      {t.btn_confirm_answer}
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Micro Utility Bar */}
              <div className="w-full mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowManualBox(!showManualBox)}
                    className="hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{showManualBox ? t.btn_close_edit : t.btn_edit_manual}</span>
                  </button>

                  {activeStep > 0 && (
                    <button
                      onClick={() => {
                        setActiveStep(prev => Math.max(0, prev - 1));
                        scrollToBottom();
                      }}
                      className="hover:text-amber-700 text-slate-600 font-bold flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.btn_retake_previous || 'पिछला प्रश्न सुधारें'}</span>
                    </button>
                  )}
                </div>

                {activeStep < 5 ? (
                  <button
                    onClick={() => setActiveStep(prev => Math.min(prev + 1, 5))}
                    className="hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.btn_next}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteAssessment}
                    className="text-emerald-700 font-black flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.btn_done}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* MODE 2: TOUCH SCREEN (LARGE PICTORIAL VILLAGE CARDS)          */
        /* ------------------------------------------------------------- */
        <div className="w-full bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 space-y-6">
          <div className="text-center">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              {t.profile_step_label} {activeStep + 1} {t.of_steps}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              {getQuestionTitle(activeStep)}
            </h2>
          </div>

          {/* Dedicated Location Input in Touch Mode */}
          {activeStep === 3 && (
            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                {t.tap_or_speak_hint || 'अपना गाँव/स्थान लिखें, जीपीएस दबाएं या नीचे से चुनें:'}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="text"
                    value={locationInputText}
                    onChange={(e) => setLocationInputText(e.target.value)}
                    placeholder={t.manual_input_placeholder || 'अपने गाँव / ग्राम पंचायत का नाम लिखें...'}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGpsDetect}
                    disabled={isLocatingGps}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <Navigation className={`w-4 h-4 ${isLocatingGps ? 'animate-spin' : ''}`} />
                    <span>{isLocatingGps ? (t.detecting_gps || 'खोज रहे हैं...') : (t.current_gps_loc || '📍 जीपीएस')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmLocationInput(locationInputText)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t.btn_confirm_answer || 'पुष्टि करें'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Touch Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {getStepOptions(activeStep).map(opt => {
              const IconComp = opt.icon || Award;
              const isSelected = getSelectedValue(activeStep) === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(activeStep, opt.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 shadow-2xs ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs ring-4 ring-emerald-100'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl mb-2 flex items-center justify-center ${
                    isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="text-sm sm:text-base font-bold leading-tight">
                    {getOptionLabel(activeStep, opt.id)}
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-xs font-black text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{t.mode_selected}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (activeStep > 0) setActiveStep(prev => prev - 1);
                else onBack();
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer transition-colors"
            >
              {activeStep === 0 ? t.btn_back : t.btn_prev}
            </button>

            <button
              onClick={() => {
                if (activeStep < 4) setActiveStep(prev => prev + 1);
                else handleCompleteAssessment();
              }}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-700/25 cursor-pointer transition-all"
            >
              {activeStep === 4 ? t.btn_done : t.btn_next}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
