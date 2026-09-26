import React from 'react';
import { Phone, Sparkles, ChevronRight, CheckCircle2, Volume2 } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/speechHelper';

export default function Screen1Welcome({ onStart, onOpenIVR, lang = 'hi', soundEnabled = true }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const handleSpeak = () => {
    if (soundEnabled) {
      speakText(`${t.welcome_title} ${t.welcome_name}. ${t.welcome_tagline}. ${t.welcome_subtext}`, lang);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      {/* Main Hero Card */}
      <div className="bg-gradient-to-b from-sky-50 via-emerald-50/40 to-amber-50/30 rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-md relative overflow-hidden">
        {/* Background Rural Art Decoration */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-emerald-200 shadow-inner bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5" /> PM-AJAY (GIA Component)
              </span>
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                title="आवाज़ सुनें"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {t.welcome_title}
            </h2>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              {t.welcome_name}
            </div>
            <p className="text-emerald-100 text-sm sm:text-base max-w-lg font-medium">
              {t.welcome_tagline}
            </p>
            <p className="text-amber-200 text-base sm:text-lg font-semibold pt-1">
              {t.welcome_subtext}
            </p>
          </div>

          {/* Official Logo & Rural Citizens Graphic */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/25 shadow-md">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1.5 shadow-xl flex items-center justify-center shrink-0">
              <img 
                src="/pwa-icon-192.png" 
                alt="Gram Saksham Official Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="flex -space-x-3 items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-emerald-400 overflow-hidden bg-amber-100 flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl">👨🏽‍🌾</span>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-400 overflow-hidden bg-sky-100 flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl">👩🏽‍🔧</span>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-emerald-300 overflow-hidden bg-emerald-100 flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl">🧑🏽‍🎓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Main Touch to Start Button */}
          <button
            onClick={onStart}
            className="md:col-span-7 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-emerald-700/25 border-2 border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-3xl shadow-inner transition-colors">
                👆🏽
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight">
                  {t.touch_to_start}
                </div>
              </div>
            </div>
            <ChevronRight className="w-8 h-8 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Call for Assistance / IVR Button */}
          <button
            onClick={onOpenIVR}
            className="md:col-span-5 bg-white hover:bg-slate-50 active:scale-[0.98] rounded-2xl p-5 border-2 border-slate-200 hover:border-emerald-400 shadow-sm flex items-center gap-4 text-left transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.call_ivr}
              </div>
              <div className="text-slate-800 font-semibold text-xs">
                {t.call_ivr_sub}
              </div>
              <div className="text-emerald-700 font-black text-xl tracking-tight mt-0.5">
                1800-123-4567
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-sm">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span>{t.footer_motto}</span>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t.govt_partner}</span>
        </div>
      </div>
    </div>
  );
}
