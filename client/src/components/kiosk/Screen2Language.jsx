import React from 'react';
import { ArrowLeft, Check, Globe, Volume2 } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/speechHelper';

export default function Screen2Language({ selectedLang, onSelectLang, onBack, onNext, soundEnabled = true }) {
  const currentLangCode = selectedLang?.id || 'hi';
  const t = TRANSLATIONS[currentLangCode] || TRANSLATIONS.hi;

  const handleVoicePrompt = (langObj) => {
    const langToSpeak = langObj || selectedLang || LANGUAGES[0];
    speakText(langToSpeak.voicePrompt, langToSpeak.code);
  };

  const handlePick = (lang) => {
    onSelectLang(lang);
    if (soundEnabled) {
      speakText(lang.voicePrompt, lang.code);
    }
    if (onNext) onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      <div>
        {/* Title Header with Voice Readout */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-xs">
            <Globe className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.select_language_title}
            </h2>
            <button
              onClick={() => handleVoicePrompt()}
              className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
              title="सुनें (Voice Option)"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-600 text-base sm:text-lg font-medium mt-1">
            {t.select_language_desc}
          </p>
        </div>

        {/* 5 Requested Languages: Hindi, English, Bengali, Telugu, Punjabi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang?.id === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handlePick(lang)}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs active:scale-95 ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100' 
                    : 'bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800'
                }`}
              >
                <div className="text-2xl sm:text-3xl font-black">
                  {lang.label}
                </div>
                {isSelected && (
                  <div className="mt-3 w-6 h-6 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
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
      </div>
    </div>
  );
}
