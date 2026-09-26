import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckSquare, Square, Volume2 } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/speechHelper';

export default function Screen3Consent({ onBack, onNext, onExit, lang = 'hi', soundEnabled = true }) {
  const [agreed, setAgreed] = useState(true);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const handleSpeakConsent = () => {
    if (soundEnabled) {
      speakText(`${t.consent_title}. ${t.consent_body_1}. ${t.consent_body_2}`, lang);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      <div>
        {/* Title Header with Speak Option */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.consent_title}
            </h2>
            <button
              onClick={handleSpeakConsent}
              className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
              title="सहमति सुनें (Speak Option)"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Consent Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-slate-800 space-y-3">
            <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-900">
              {t.consent_body_1}
            </p>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              {t.consent_body_2}
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div 
            onClick={() => setAgreed(!agreed)}
            className="flex items-center gap-3 p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 cursor-pointer hover:bg-emerald-100/60 transition-colors"
          >
            {agreed ? (
              <CheckSquare className="w-7 h-7 text-emerald-600 fill-emerald-100 shrink-0" />
            ) : (
              <Square className="w-7 h-7 text-slate-400 shrink-0" />
            )}
            <span className="text-lg sm:text-xl font-bold text-slate-900 select-none">
              {t.consent_checkbox}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons with Exit Option */}
      <div className="mt-10 pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.btn_back}</span>
        </button>

        <div className="flex items-center gap-3">
          {!agreed && (
            <button
              onClick={onExit || onBack}
              className="px-5 py-3 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-sm cursor-pointer transition-colors"
            >
              {t.btn_exit}
            </button>
          )}

          <button
            onClick={() => agreed && onNext()}
            disabled={!agreed}
            className={`px-8 py-3.5 rounded-xl font-black text-lg flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              agreed 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/25 active:scale-95' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{t.btn_continue}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
