import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, PhoneCall, Layers, Volume2 } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { speakText } from '../../utils/speechHelper';

export default function Screen11Feedback({ 
  onBack, 
  onEndSession, 
  onShowMore, 
  onTalkAdvisor,
  lang = 'hi',
  soundEnabled = true
}) {
  const [selectedRating, setSelectedRating] = useState('yes');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const ratings = [
    { id: 'yes', label: t.fb_yes, icon: '😃', color: 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-100' },
    { id: 'somewhat', label: t.fb_somewhat, icon: '😐', color: 'border-amber-400 bg-amber-50 text-amber-900 ring-4 ring-amber-100' },
    { id: 'no', label: t.fb_no, icon: '🙁', color: 'border-rose-400 bg-rose-50 text-rose-900 ring-4 ring-rose-100' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      <div>
        {/* Title Header */}
        <div className="text-center mb-8 flex items-center justify-center gap-2">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.feedback_title}
          </h2>
          <button
            onClick={() => soundEnabled && speakText(t.feedback_title, lang)}
            className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
            title={t.listen_voice}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Smiley Feedback Cards */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
          {ratings.map(r => {
            const isSelected = selectedRating === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRating(r.id)}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs active:scale-95 ${
                  isSelected 
                    ? r.color
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-4xl sm:text-5xl mb-2 select-none">
                  {r.icon}
                </div>
                <div className="text-base sm:text-lg font-black">
                  {r.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Options Box */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm max-w-xl mx-auto">
          <h3 className="text-center text-lg font-extrabold text-slate-900 mb-4">
            {t.more_info_q}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onShowMore}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center gap-3 text-left transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {t.btn_more_options}
                </div>
              </div>
            </button>

            <button
              onClick={onTalkAdvisor}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center gap-3 text-left transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {t.btn_talk_advisor}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.btn_back}</span>
        </button>

        <button
          onClick={() => onEndSession(selectedRating)}
          className="px-8 py-3.5 rounded-xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center gap-2 shadow-lg shadow-emerald-700/25 cursor-pointer transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{t.btn_end_session}</span>
        </button>
      </div>
    </div>
  );
}
