import React, { useEffect, useState } from 'react';
import { Check, Copy, CheckCheck, Home, Printer, Sparkles, Volume2, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/speechHelper';

export default function Screen12SessionComplete({ 
  referenceId = 'GS20260920-1234', 
  selectedOpportunity,
  profile,
  onGoHome, 
  lang = 'hi',
  soundEnabled = true
}) {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899']
      });
    } catch (e) {}

    if (soundEnabled) {
      speakText(`${t.complete_title} ${t.complete_sub}. ${t.ref_id_label}: ${referenceId}.`, lang);
    }
  }, [lang, soundEnabled, referenceId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSpeakSummary = () => {
    if (soundEnabled) {
      speakText(`${t.complete_title} ${t.complete_sub}. ${t.ref_id_label}: ${referenceId}.`, lang);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col justify-between items-center text-center min-h-[calc(100vh-140px)]">
      <div className="w-full flex flex-col items-center">
        {/* Checkmark Circle */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-700/30 ring-8 ring-emerald-100">
            <Check className="w-14 h-14 stroke-[3]" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Heading & Subtitle with Audio */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {t.complete_title}
          </h2>
          <button
            onClick={handleSpeakSummary}
            className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
            title={t.listen_voice}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-slate-700 font-bold text-lg sm:text-xl max-w-md">
          {t.complete_sub}
        </p>

        {/* Reference ID Card with Passbook details */}
        <div className="my-8 w-full max-w-md p-6 rounded-3xl bg-white border-2 border-emerald-300 shadow-sm flex flex-col items-center">
          <img 
            src="/pwa-icon-192.png" 
            alt="Gram Saksham" 
            className="w-14 h-14 object-contain mb-2"
          />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t.ref_id_label}
          </span>

          <div className="flex items-center justify-center gap-3 w-full py-2">
            <span className="text-2xl sm:text-3xl font-black tracking-wider text-slate-900 font-mono">
              {referenceId}
            </span>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
              title={t.copy_btn}
            >
              {copied ? <CheckCheck className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {selectedOpportunity && (
            <div className="mt-3 pt-3 border-t border-slate-100 w-full text-center text-xs text-slate-600">
              {t.selected_trade} <strong className="text-emerald-800">{lang === 'en' ? selectedOpportunity.title_en : selectedOpportunity.title_hi}</strong>
            </div>
          )}

          {profile?.locationName && (
            <div className="mt-1 text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.selected_loc_banner} <strong className="text-slate-800">{profile.locationName}</strong></span>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.btn_print_passbook}</span>
            </button>
          </div>
        </div>

        {/* Return to Home */}
        <button
          onClick={onGoHome}
          className="px-8 py-4 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center gap-3 shadow-lg shadow-emerald-700/25 cursor-pointer transition-all"
        >
          <Home className="w-6 h-6" />
          <span>{t.btn_back_home}</span>
        </button>
      </div>

      {/* Footer Branding */}
      <div className="w-full mt-10 pt-6 border-t border-slate-200 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
          <span className="text-emerald-700">{t.footer_motto}</span>
        </div>
      </div>
    </div>
  );
}
