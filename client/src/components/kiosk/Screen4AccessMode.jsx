import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, TabletSmartphone, Mic, Check, Volume2, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/speechHelper';

export default function Screen4AccessMode({ 
  selectedMode = 'voice', 
  onSelectMode, 
  onBack, 
  onNext, 
  lang = 'hi', 
  soundEnabled = true 
}) {
  const [activeMode, setActiveMode] = useState(selectedMode || 'voice');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const ttsLocale = lang === 'en' ? 'en-IN' : lang === 'bn' ? 'bn-IN' : lang === 'te' ? 'te-IN' : lang === 'pa' ? 'pa-IN' : 'hi-IN';

  const handleSpeak = () => {
    if (soundEnabled) {
      speakText(`${t.access_mode_title}. ${t.access_mode_desc}`, ttsLocale);
    }
  };

  const handleChoose = (mode) => {
    setActiveMode(mode);
    if (onSelectMode) onSelectMode(mode);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      <div>
        {/* Title Header with Speak Option */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.access_mode_title}
            </h2>
            <button
              onClick={handleSpeak}
              className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
              title={t.listen_voice || 'Listen'}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-600 text-base sm:text-lg font-medium mt-1">
            {t.access_mode_desc}
          </p>
        </div>

        {/* 2 Modes Grid matching user's instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* Mode 1: Touch Screen */}
          <div 
            onClick={() => handleChoose('touch')}
            className={`p-7 rounded-3xl border-3 transition-all flex flex-col items-center text-center cursor-pointer shadow-sm active:scale-98 ${
              activeMode === 'touch'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-4 ring-emerald-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 shadow-inner">
              <TabletSmartphone className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {t.mode_touch_title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1">
              {t.mode_touch_desc}
            </p>

            <div className="mt-6">
              {activeMode === 'touch' ? (
                <span className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t.mode_selected}</span>
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                  {t.click_to_select}
                </span>
              )}
            </div>
          </div>

          {/* Mode 2: Voice Assistant */}
          <div 
            onClick={() => handleChoose('voice')}
            className={`p-7 rounded-3xl border-3 transition-all flex flex-col items-center text-center cursor-pointer shadow-sm active:scale-98 relative overflow-hidden ${
              activeMode === 'voice'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-4 ring-emerald-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {/* Top Recommended Tag */}
            <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {t.mode_badge}
            </div>

            <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-700/20">
              <Mic className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {t.mode_voice_title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1">
              {t.mode_voice_desc}
            </p>

            <div className="mt-6">
              {activeMode === 'voice' ? (
                <span className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t.mode_selected}</span>
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                  {t.click_to_select}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-10 pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.btn_back}</span>
        </button>

        <button
          onClick={() => {
            if (onSelectMode) onSelectMode(activeMode);
            onNext();
          }}
          className="px-8 py-3.5 rounded-xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-md shadow-emerald-700/25 active:scale-95 cursor-pointer transition-all"
        >
          <span>{t.btn_continue}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
