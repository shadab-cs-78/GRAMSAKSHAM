import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, PhoneCall, Volume2, Mic, CheckCircle2, RotateCcw, Smartphone, Settings, ArrowLeft } from 'lucide-react';
import { speakText, stopSpeaking, createSpeechRecognizer } from '../../utils/speechHelper';

const IVR_FLOW = {
  1: {
    audio_hi: "नमस्ते! ग्राम सक्षम हेल्पलाइन में आपका स्वागत है। प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) के तहत कौशल प्रशिक्षण और ₹50,000 अनुदान की जानकारी के लिए कृपया अपनी शिक्षा बताएं। अनपढ़ के लिए 1 दबाएं, 5वीं या 8वीं के लिए 2 दबाएं, 10वीं के लिए 3 दबाएं, 12वीं या कॉलेज के लिए 4 दबाएं।",
    subtitle: "अपनी शिक्षा चुनें (Select Education): [1] अनपढ़ | [2] 5वीं/8वीं | [3] 10वीं | [4] 12वीं+",
    nextStep: 2
  },
  2: {
    audio_hi: "धन्यवाद। अब बताइए कि आप क्या काम सीखना चाहते हैं? बिजली और सोलर के लिए 1 दबाएं, मोबाइल रिपेयरिंग के लिए 2 दबाएं, सिलाई और बुटीक के लिए 3 दबाएं, या खेती और मशरूम के लिए 4 दबाएं।",
    subtitle: "पसंदीदा हुनर चुनें (Choose Trade): [1] इलेक्ट्रीशियन/सोलर | [2] मोबाइल रिपेयर | [3] सिलाई | [4] कृषि",
    nextStep: 3
  },
  3: {
    audio_hi: "क्या आप खुद की दुकान या व्यवसाय खोलना चाहते हैं, या किसी कंपनी में नौकरी करना चाहते हैं? खुद के व्यवसाय और ₹50,000 अनुदान के लिए 1 दबाएं, नौकरी के लिए 2 दबाएं।",
    subtitle: "कार्य प्रकार (Employment): [1] स्वरोजगार + ₹50,000 अनुदान | [2] नौकरी (Placement)",
    nextStep: 4
  },
  4: {
    audio_hi: "बधाई हो! आपकी योग्यता के आधार पर आपके निकटतम आईटीआई केंद्र में इलेक्ट्रीशियन NSQF Level 4 प्रशिक्षण और ₹50,000 टूलकिट अनुदान स्वीकृत है। आपके मोबाइल नंबर पर एसएमएस भेज दिया गया है। ग्राम सक्षम से जुड़ने के लिए धन्यवाद।",
    subtitle: "स्वीकृत: इलेक्ट्रीशियन (NSQF Level 4) + ₹50,000 टूलकिट अनुदान। विवरण SMS द्वारा भेजा गया।",
    nextStep: null
  }
};

// Play DTMF Beep tone using Web Audio API
function playDTMFTone(freq1 = 697, freq2 = 1209) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.frequency.value = freq1;
    osc2.frequency.value = freq2;

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.2);
    osc2.stop(audioCtx.currentTime + 0.2);
  } catch (e) {}
}

export default function PhoneSimulator({ onBackToKiosk }) {
  const [callState, setCallState] = useState('IDLE'); // IDLE, CALLING, CONNECTED, ENDED
  const [currentStep, setCurrentStep] = useState(1);
  const [callDuration, setCallDuration] = useState(0);
  const [callLog, setCallLog] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [isMobileMicListening, setIsMobileMicListening] = useState(false);

  // Call timer
  useEffect(() => {
    let timer;
    if (callState === 'CONNECTED') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const startCall = () => {
    playDTMFTone(770, 1336);
    setCallState('CALLING');
    setTimeout(() => {
      setCallState('CONNECTED');
      setCurrentStep(1);
      playPrompt(1);
    }, 1200);
  };

  const endCall = () => {
    stopSpeaking();
    setCallState('ENDED');
    setTimeout(() => {
      setCallState('IDLE');
    }, 1800);
  };

  const playPrompt = (stepNum) => {
    const stepData = IVR_FLOW[stepNum];
    if (!stepData) return;

    setCallLog(prev => [...prev, { speaker: 'IVR', text: stepData.subtitle }]);
    speakText(stepData.audio_hi, 'hi-IN', () => {
      if (!stepData.nextStep) {
        setTimeout(endCall, 3500);
      }
    });
  };

  const handleKeyPress = (digit) => {
    playDTMFTone(852, 1477);
    if (callState !== 'CONNECTED') return;

    setCallLog(prev => [...prev, { speaker: 'USER', text: `दबाया गया अंक: [ ${digit} ]` }]);
    stopSpeaking();

    const next = IVR_FLOW[currentStep]?.nextStep;
    if (next) {
      setCurrentStep(next);
      setTimeout(() => {
        playPrompt(next);
      }, 600);
    } else {
      endCall();
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-emerald-700">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2.5 py-1 rounded-full">
            Real Mobile Phone & Feature Phone Access • PM-AJAY GIA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            ग्राम सक्षम आई.वी.आर. (Toll-Free Helpline 1800-123-4567)
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            बिना इंटरनेट किसी भी मोबाइल या साधारण कीपैड फोन से वास्तविक आवाज और कीपैड द्वारा सहायता प्राप्त करें।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="टेलीकॉम सेटिंग्स"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">SIM / Twilio Setup</span>
          </button>

          <button
            onClick={onBackToKiosk}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors cursor-pointer shadow-xs"
          >
            क्योस्क पर लौटें
          </button>
        </div>
      </div>

      {/* Twilio / SIM Telephony Setup Drawer */}
      {showConfig && (
        <div className="mb-6 p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 text-xs space-y-3">
          <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            वास्तविक मोबाइल सिम से कॉल करने हेतु सेटिंग्स (Real GSM Phone Setup)
          </h4>
          <p className="text-slate-300">
            आप अपने असली मोबाइल फोन के डायलर से इस हेल्पलाइन पर कॉल कर सकते हैं:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-emerald-300 border border-slate-800">
            1. Twilio Voice Webhook URL: <strong>https://YOUR-DOMAIN.ngrok.app/api/ivr/twilio/incoming</strong><br />
            2. Direct Mobile Dial: <strong>tel:18001234567</strong> (or your Twilio Toll-Free Number)<br />
            3. Responses: TwiML Voice Speech Synthesis in Hindi (`hi-IN`)
          </div>
        </div>
      )}

      {/* Main Dialpad & Call Screen Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Mobile Phone Device Mockup */}
        <div className="md:col-span-6 flex justify-center">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-[45px] p-4 shadow-2xl border-4 border-slate-700 relative">
            {/* Phone Speaker Notch */}
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>

            {/* Phone Screen Display */}
            <div className="bg-slate-950 text-white rounded-3xl p-4 h-[380px] flex flex-col justify-between border border-slate-800 relative overflow-hidden">
              {/* Status bar */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>BSNL 4G</span>
                <span>{callState === 'CONNECTED' ? formatTime(callDuration) : '10:24 AM'}</span>
                <span>85%</span>
              </div>

              {/* Central Call State Screen */}
              <div className="my-auto text-center">
                {callState === 'IDLE' && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center text-2xl shadow-lg">
                      <PhoneCall className="w-8 h-8" />
                    </div>
                    <div className="text-xl font-bold text-white tracking-wider">
                      1800-123-4567
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      पीएम-अजय टोल-फ्री हेल्पलाइन
                    </div>
                  </div>
                )}

                {callState === 'CALLING' && (
                  <div className="space-y-3 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-amber-600 text-white mx-auto flex items-center justify-center shadow-lg">
                      <Phone className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="text-lg font-bold text-white">कॉल जुड़ रही है...</div>
                    <div className="text-xs text-slate-400 font-mono">1800-123-4567</div>
                  </div>
                )}

                {callState === 'CONNECTED' && (
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/40">
                      <Volume2 className="w-7 h-7 animate-pulse" />
                    </div>
                    <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      कॉल सक्रिय • {formatTime(callDuration)}
                    </div>
                    <div className="text-base font-extrabold text-white">
                      Gram Saksham IVR
                    </div>
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 font-medium text-left leading-relaxed">
                      {IVR_FLOW[currentStep]?.subtitle}
                    </div>
                  </div>
                )}

                {callState === 'ENDED' && (
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-full bg-red-600/30 border border-red-500 text-red-400 mx-auto flex items-center justify-center text-2xl">
                      <PhoneOff className="w-7 h-7" />
                    </div>
                    <div className="text-base font-bold text-white">कॉल समाप्त</div>
                  </div>
                )}
              </div>

              {/* Bottom Phone Action Button (Call / Hangup) */}
              <div className="pt-2">
                {callState === 'IDLE' ? (
                  <button
                    onClick={startCall}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 cursor-pointer active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>कॉल करें / Dial 1800-123-4567</span>
                  </button>
                ) : (
                  <button
                    onClick={endCall}
                    className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 cursor-pointer active:scale-95 transition-all"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>कॉल काटें / Hang Up</span>
                  </button>
                )}
              </div>
            </div>

            {/* Feature Phone DTMF Keypad Grid with realistic audio feedback */}
            <div className="grid grid-cols-3 gap-2 mt-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyPress(k)}
                  className={`py-3 rounded-xl font-bold text-base transition-all active:scale-90 cursor-pointer flex flex-col items-center justify-center ${
                    callState === 'CONNECTED'
                      ? 'bg-slate-800 hover:bg-emerald-700 text-white border border-slate-700 shadow-xs'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-pointer hover:bg-slate-800'
                  }`}
                >
                  <span>{k}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Real-Time Call Log */}
        <div className="md:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                लाइव कॉल संवाद (Real-Time Call Transcript)
              </h3>
              <button
                onClick={() => setCallLog([])}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                रीसेट
              </button>
            </div>

            <div className="space-y-3 min-h-[220px] max-h-[300px] overflow-y-auto pr-2">
              {callLog.length === 0 ? (
                <div className="text-center text-slate-400 text-xs sm:text-sm py-12">
                  कॉल शुरू करने के लिए फोन पर "कॉल करें" दबाएं।
                </div>
              ) : (
                callLog.map((log, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-2xl text-xs sm:text-sm ${
                      log.speaker === 'IVR' 
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-900 border border-slate-200 text-right font-bold'
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-0.5">
                      {log.speaker === 'IVR' ? '🤖 GramSaksham Voice Engine' : '👤 लाभार्थी (Caller)'}
                    </div>
                    <div>{log.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              मोबाइल फोन संगतता (Mobile Device Compatibility)
            </div>
            <p>
              • किसी भी साधारण टचस्क्रीन स्मार्टफोन या बेसिक 2G कीपैड फोन से वास्तविक आवाज और कीपैड इनपुट सपोर्ट।
            </p>
            <p>
              • वेब ऑडियो द्वारा वास्तविक DTMF टोन और वेब स्पीच द्वारा बिना किसी बाहरी API शुल्क के लाइव फोन कॉल अनुभव।
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
