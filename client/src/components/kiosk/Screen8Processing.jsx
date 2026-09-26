import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, MapPin } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/speechHelper';

export default function Screen8Processing({ onComplete, profile, lang = 'hi', soundEnabled = true }) {
  const [activeStep, setActiveStep] = useState(2);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;
  const userLocName = profile?.locationName || t.options_location?.kundam || 'कुंडम क्लस्टर';

  useEffect(() => {
    if (soundEnabled) {
      speakText(`${t.processing_title} ${userLocName}.`, lang);
    }

    const timer1 = setTimeout(() => {
      setActiveStep(3);
    }, 1200);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete, lang, soundEnabled, userLocName]);

  const steps = [
    t.proc_step_1,
    t.proc_step_2,
    t.proc_step_3,
    t.proc_step_4
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col justify-between items-center text-center min-h-[calc(100vh-140px)]">
      <div className="w-full">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          {t.processing_title}
        </h2>

        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shadow-2xs my-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.selected_loc_banner} <strong>{userLocName}</strong></span>
        </div>

        {/* 4-Step Stepper Progress */}
        <div className="my-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-5 h-1 bg-slate-200 -z-0"></div>
            <div 
              className="absolute left-6 top-5 h-1 bg-emerald-600 -z-0 transition-all duration-700"
              style={{ width: `${(activeStep / (steps.length - 1)) * 90}%` }}
            ></div>

            {steps.map((label, idx) => {
              const isDone = idx < activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div key={idx} className="flex flex-col items-center relative z-10 w-24">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : isCurrent 
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 animate-pulse' 
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isCurrent ? (
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div className={`text-xs sm:text-sm font-extrabold leading-tight ${
                      isCurrent || isDone ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Processing Card */}
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-sky-50/80 border-2 border-sky-200 shadow-sm text-left flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              AI Recommendation Engine • PM-AJAY GIA
            </div>
            <p className="text-slate-900 font-bold text-base leading-relaxed">
              {t.processing_ai_card}
            </p>
          </div>
        </div>
      </div>

      {/* Skip button */}
      <div className="pt-6">
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-emerald-700 underline font-medium cursor-pointer"
        >
          {t.skip_wait}
        </button>
      </div>
    </div>
  );
}
