import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mic, Volume2 } from 'lucide-react';
import { speakText, stopSpeaking } from '../../utils/speechHelper';

export default function Screen5VoiceAssistantWelcome({ onBack, onStartSpeaking, soundEnabled }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const welcomeMessageHi = "नमस्ते! मैं आपकी सहायक हूँ। मैं आपसे कुछ सरल प्रश्न पूछूँगी ताकि मैं आपके लिए सबसे सही हुनर और पीएम-अजय योजनाओं का पता लगा सकूँ।";

  useEffect(() => {
    if (soundEnabled) {
      setIsSpeaking(true);
      speakText(welcomeMessageHi, 'hi-IN', () => setIsSpeaking(false));
    }
    return () => {
      stopSpeaking();
    };
  }, [soundEnabled]);

  const handleReplayVoice = () => {
    setIsSpeaking(true);
    speakText(welcomeMessageHi, 'hi-IN', () => setIsSpeaking(false));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      <div>
        {/* Assistant & Speech Bubble Row matching Screen 5 */}
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 my-4">
          {/* Avatar Graphic */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-1.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-emerald-50 overflow-hidden flex items-center justify-center relative">
                {/* Stylized friendly Indian woman avatar */}
                <div className="text-7xl sm:text-8xl select-none" role="img" aria-label="Assistant Avatar">
                  👩🏽‍💼
                </div>
                {/* Badge */}
                <div className="absolute bottom-1 bg-emerald-700 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                  AI सहायक
                </div>
              </div>
            </div>
            {/* Pulsing indicator when speaking */}
            {isSpeaking && (
              <span className="absolute top-2 right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            )}
          </div>

          {/* Speech Bubble */}
          <div className="flex-1 relative bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
            {/* Bubble arrow pointing to avatar */}
            <div className="hidden md:block absolute -left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-l-2 border-b-2 border-emerald-300 -rotate-45"></div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                  नमस्ते! मैं आपकी सहायक हूँ।
                </h3>
                <p className="text-lg sm:text-xl font-bold text-emerald-800 leading-relaxed">
                  मैं आपसे कुछ सरल प्रश्न पूछूँगी ताकि मैं आपकी मदद कर सकूँ।
                </p>
                <p className="text-slate-500 text-sm sm:text-base font-medium pt-2 border-t border-slate-100">
                  Hello! I will ask you a few simple questions to understand your needs.
                </p>
              </div>

              {/* Speaker button to repeat audio */}
              <button
                onClick={handleReplayVoice}
                className="p-3 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer shrink-0"
                title="आवाज़ दोबारा सुनें (Listen Again)"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Big Start Speaking CTA Button */}
        <div className="text-center mt-10 max-w-md mx-auto">
          <button
            onClick={onStartSpeaking}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl p-5 sm:p-6 shadow-xl shadow-emerald-700/30 flex items-center justify-center gap-4 cursor-pointer transition-all border-2 border-emerald-500"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Mic className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                बोलना शुरू करें
              </div>
              <div className="text-emerald-100 font-bold text-xs sm:text-sm">
                Start Speaking
              </div>
            </div>
          </button>

          <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-4">
            धीरे और स्पष्ट बोलें <span className="text-slate-300 mx-1">|</span> Speak slowly and clearly
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>वापस / Back</span>
        </button>
      </div>
    </div>
  );
}
