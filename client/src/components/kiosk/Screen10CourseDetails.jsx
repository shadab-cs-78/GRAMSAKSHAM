import React from 'react';
import { ArrowLeft, CheckCircle2, MapPin, Phone, Building2, Award, Clock, HeartHandshake, ShieldCheck, Volume2 } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { calcDistanceKm, TRAINING_CENTERS } from './TrainingLocationMap';
import { speakText } from '../../utils/speechHelper';

export default function Screen10CourseDetails({ 
  opportunity, 
  profile,
  onBack, 
  onInterested,
  lang = 'hi',
  soundEnabled = true
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const current = opportunity || {
    id: "NSQF-ELEC-01",
    title_hi: "इलेक्ट्रीशियन (ITI)",
    title_en: "Electrician (ITI)",
    nsqf_level: 4,
    duration_months: "3-6 महीने",
    suitable_for: [
      "आपकी रुचि विद्युत/तकनीकी कार्यों में है",
      "इस क्षेत्र में स्थानीय और नजदीकी शहरों में भारी मांग है",
      "स्वरोजगार (दुकान) और नौकरी दोनों के अवसर",
      "पीएम-अजय GIA घटक के तहत ₹50,000 अनुदान और मासिक भत्ता"
    ],
    institute: {
      name_hi: "राजकीय आईटीआई जबलपुर",
      name_en: "Govt ITI Jabalpur",
      distance_km: 5,
      contact: "0761-2645890",
      eligibility: "10वीं पास"
    },
    pm_ajay_benefits: {
      capital_subsidy: "₹50,000 टूलकिट एवं दुकान अनुदान",
      stipend: "₹1,500 प्रतिमाह भत्ता"
    }
  };

  const title = lang === 'en' ? current.title_en : current.title_hi;
  const instName = lang === 'en' ? current.institute.name_en : current.institute.name_hi;

  // Calculate dynamic distance based on user location
  const matchingCenter = TRAINING_CENTERS.find(c => c.id === current.id) || TRAINING_CENTERS[0];
  const userLat = profile?.coordinates?.lat || 23.1970;
  const userLng = profile?.coordinates?.lng || 80.3520;
  const dynamicDistance = calcDistanceKm(userLat, userLng, matchingCenter.lat, matchingCenter.lng);
  const userLocationName = profile?.locationName || t.options_location?.kundam || 'कुंडम क्लस्टर';

  const handleSpeakDetails = () => {
    if (soundEnabled) {
      speakText(`${title}. ${instName}. ${t.distance_from_loc} ${dynamicDistance} km. ${current.pm_ajay_benefits.capital_subsidy}.`, lang);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col justify-between min-h-[calc(100vh-140px)]">
      <div>
        {/* Course Header Banner */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  NSQF Aligned Skill Pathway • PM-AJAY GIA
                </span>
                <button
                  onClick={handleSpeakDetails}
                  className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                  title={t.listen_voice}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                {title}
              </h2>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-black flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {current.duration_months}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black">
                NSQF Level {current.nsqf_level}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-sky-100 text-sky-800 text-xs font-black flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                {t.gov_approved}
              </span>
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
            {/* Left Column: Why is this suitable for you? (Explainable AI) */}
            <div className="md:col-span-7 bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200">
              <h3 className="text-lg font-black text-slate-900 mb-3">
                {t.details_why_title}
              </h3>

              <div className="space-y-3">
                {current.suitable_for.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 font-bold text-sm sm:text-base leading-snug">
                      {reason}
                    </span>
                  </div>
                ))}
              </div>

              {/* PM-AJAY Grant Highlight */}
              <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                <span className="text-lg">💰</span>
                <span>
                  <strong>{t.details_grant_badge}:</strong> {current.pm_ajay_benefits.capital_subsidy} + {current.pm_ajay_benefits.stipend}
                </span>
              </div>
            </div>

            {/* Right Column: Institute Details with Dynamic Distance */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-3">
                  {t.details_institute_title}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                    <div className="font-bold text-slate-900 text-sm">
                      {instName}
                    </div>
                  </div>

                  {/* Distance from User's Village */}
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{dynamicDistance} km {t.distance_away} • {userLocationName} से</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{current.institute.contact}</span>
                  </div>

                  <div className="pt-2 text-xs text-slate-600">
                    <strong>{t.eligibility_label}</strong> {current.institute.eligibility}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.gov_approved}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.btn_back}</span>
        </button>

        <button
          onClick={onInterested}
          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-base flex items-center gap-2 shadow-lg shadow-emerald-700/25 cursor-pointer transition-all"
        >
          <span>{t.btn_interested}</span>
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
