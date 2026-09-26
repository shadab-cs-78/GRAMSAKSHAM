import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, MapPin, Clock, Award, ChevronRight, 
  Zap, Smartphone, Sun, Sprout, Scissors, Map, Volume2, 
  Briefcase, Building, Phone, Laptop, CheckCircle2, TrendingUp 
} from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import TrainingLocationMap, { calcDistanceKm, TRAINING_CENTERS, getCentersForDistrict } from './TrainingLocationMap';
import { speakText } from '../../utils/speechHelper';

export default function Screen9Recommendations({ 
  recommendations = [], 
  profile,
  onSelectOpportunity, 
  onBack, 
  onViewMore,
  lang = 'hi',
  soundEnabled = true
}) {
  const [activeTab, setActiveTab] = useState('training');
  const [showMap, setShowMap] = useState(true);
  const [highlightedCourseId, setHighlightedCourseId] = useState(recommendations[0]?.id || 'NSQF-ELEC-01');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const tabs = [
    { id: 'training', label: t.tab_training },
    { id: 'jobs', label: t.tab_jobs },
    { id: 'self', label: t.tab_self },
    { id: 'centers', label: t.tab_centers || 'प्रशिक्षण केंद्र' }
  ];

  // User Location name & coordinates
  const locationDisplayName = profile?.locationName || profile?.district || t.options_location?.kundam || 'जबलपुर क्लस्टर';
  
  // District default coordinates if not provided
  const districtCoords = {
    'Rewa': { lat: 24.5362, lng: 81.3037 },
    'Ratlam': { lat: 23.3315, lng: 75.0367 },
    'Morena': { lat: 26.4947, lng: 77.9940 },
    'Shahdol': { lat: 23.2957, lng: 81.3577 },
    'Sehore': { lat: 23.2030, lng: 77.0844 },
    'Jabalpur': { lat: 23.1815, lng: 79.9650 }
  };
  const distName = profile?.district || '';
  const fallback = districtCoords[distName] || { lat: 23.1970, lng: 80.3520 };
  const userLat = profile?.coordinates?.lat || fallback.lat;
  const userLng = profile?.coordinates?.lng || fallback.lng;

  // District skill centers
  const districtCenters = getCentersForDistrict(locationDisplayName, profile?.district);

  // Audio speech readout
  const handleReadoutRecommendations = () => {
    if (soundEnabled) {
      if (activeTab === 'centers') {
        const firstCenter = districtCenters[0];
        const centerTitle = firstCenter ? (lang === 'en' ? firstCenter.title_en : firstCenter.title_hi) : '';
        const speechMsg = `${locationDisplayName} में सरकारी कौशल केंद्र: ${centerTitle}.`;
        speakText(speechMsg, lang);
      } else {
        const topRec = filteredItems[0];
        const recTitle = topRec ? (lang === 'en' ? topRec.title_en : topRec.title_hi) : '';
        const speechMsg = `${t.recs_title}. ${locationDisplayName} ${t.distance_from_loc} ${recTitle}.`;
        speakText(speechMsg, lang);
      }
    }
  };

  // Map icon based on role/type
  const getIcon = (type) => {
    switch (type) {
      case 'electrician': return <Zap className="w-7 h-7 text-amber-600" />;
      case 'mobile': return <Smartphone className="w-7 h-7 text-sky-600" />;
      case 'solar': return <Sun className="w-7 h-7 text-orange-500" />;
      case 'agriculture': return <Sprout className="w-7 h-7 text-emerald-600" />;
      case 'tailoring': return <Scissors className="w-7 h-7 text-pink-600" />;
      case 'drone': return <Briefcase className="w-7 h-7 text-indigo-600" />;
      case 'dairy': return <Building className="w-7 h-7 text-amber-600" />;
      case 'computer': return <Laptop className="w-7 h-7 text-blue-600" />;
      default: return <Award className="w-7 h-7 text-emerald-600" />;
    }
  };

  // Filter recommendations based on active tab
  const filteredItems = recommendations.filter(item => {
    if (activeTab === 'training') {
      return item.category === 'training' || (!item.category && item.employment_type !== 'wage');
    }
    if (activeTab === 'self') {
      return item.category === 'self_employment' || item.category === 'grant' || item.employment_type === 'self';
    }
    if (activeTab === 'jobs') {
      return item.category === 'job' || item.employment_type === 'wage' || item.employment_type === 'both';
    }
    return true;
  });

  // Calculate distance for an opportunity
  const getItemDistance = (item) => {
    const itemLat = item.coordinates?.lat || (item.institute?.lat) || userLat;
    const itemLng = item.coordinates?.lng || (item.institute?.lng) || userLng;
    const dist = calcDistanceKm(userLat, userLng, itemLat, itemLng);
    return dist < 1 ? (item.institute?.distance_km || 4) : dist;
  };

  // Dynamic subtitle based on tab
  const getSubtitle = () => {
    switch (activeTab) {
      case 'jobs': return t.course_sub_jobs || 'सत्यापित स्थानीय व कंपनी रोजगार अवसर';
      case 'self': return t.course_sub_self || 'स्वरोजगार एवं ₹50,000 पीएम-अजय अनुदान विकल्प';
      case 'centers': return t.course_sub_centers || 'आपके जिले में सरकारी मान्यता प्राप्त कौशल केंद्र';
      default: return t.course_sub_all || 'आपके प्रोफाइल और गाँव के अनुसार उपयुक्त पाठ्यक्रम';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col justify-between min-h-[calc(100vh-140px)] space-y-6">
      <div>
        {/* Title Header with Location Badge & Audio */}
        <div className="text-center mb-6 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.recs_title}
            </h2>
            <button
              onClick={handleReadoutRecommendations}
              className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
              title={t.listen_voice}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Active User Location Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-300 rounded-full text-emerald-900 text-xs sm:text-sm font-bold shadow-2xs">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{t.selected_loc_banner} <strong>{locationDisplayName}</strong> ({t.sorted_by_distance})</span>
          </div>

          <p className="text-slate-600 text-sm sm:text-base font-semibold">
            {getSubtitle()}
          </p>
        </div>

        {/* Category Filter Tabs with Dynamic Opportunity Count Badges */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center mb-6">
          {tabs.map(item => {
            const isSelected = activeTab === item.id;
            const count = item.id === 'training' 
              ? recommendations.filter(r => r.category === 'training' || (!r.category && r.employment_type !== 'wage')).length
              : item.id === 'jobs' 
                ? recommendations.filter(r => r.category === 'job' || r.employment_type === 'wage' || r.employment_type === 'both').length
                : item.id === 'self' 
                  ? recommendations.filter(r => r.category === 'self_employment' || r.category === 'grant' || r.employment_type === 'self').length
                  : districtCenters.length;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500' 
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Toggle Map View Button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              showMap ? 'bg-sky-100 text-sky-900 border border-sky-300' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{showMap ? t.hide_map : t.show_map}</span>
          </button>
        </div>

        {/* OpenStreetMap / Leaflet Location Tracker Component */}
        {showMap && (
          <div className="mb-8">
            <TrainingLocationMap
              userLocation={profile}
              selectedCourseId={highlightedCourseId}
              onSelectCourse={(id) => {
                setHighlightedCourseId(id);
                const found = recommendations.find(r => r.id === id);
                if (found) onSelectOpportunity(found);
              }}
              lang={lang}
            />
          </div>
        )}

        {/* TAB 4: Skill Centers Directory View */}
        {activeTab === 'centers' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {districtCenters.map((center) => {
              const dynamicDistKm = calcDistanceKm(userLat, userLng, center.lat, center.lng);
              const isHighlighted = center.id === highlightedCourseId;

              return (
                <div
                  key={center.id}
                  onClick={() => setHighlightedCourseId(center.id)}
                  className={`bg-white rounded-3xl border-2 transition-all p-5 flex flex-col justify-between group cursor-pointer ${
                    isHighlighted ? 'border-emerald-600 ring-4 ring-emerald-100 shadow-md' : 'border-slate-200 hover:border-emerald-400 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Visual Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-2xl">
                        🏫
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                          {t.gov_approved || 'सरकारी मान्यता प्राप्त'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                          {center.type}
                        </span>
                      </div>
                    </div>

                    {/* Center Name */}
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                      {lang === 'en' ? center.title_en : center.title_hi}
                    </h3>

                    {/* Distance & Features */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{locationDisplayName} से</span>
                        <span className="text-emerald-700 font-extrabold ml-auto">
                          {dynamicDistKm} km
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 space-y-0.5">
                        <div className="flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t.seats_label || 'सीटें उपलब्ध:'} 30-60 सीटें (निशुल्क प्रवेश)</span>
                        </div>
                        <div className="text-slate-600">
                          ✓ आवास, भोजन एवं मासिक प्रशिक्षण भत्ता उपलब्ध
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightedCourseId(center.id);
                      if (recommendations.length > 0) {
                        const matching = recommendations.find(r => r.id === center.id) || recommendations[0];
                        onSelectOpportunity(matching);
                      }
                    }}
                    className="mt-5 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t.btn_contact_center || 'केंद्र से संपर्क करें'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABS 1, 2, 3: Opportunities Cards Grid (Training, Jobs, Self-Employment) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const isHighlighted = item.id === highlightedCourseId;
              const dynamicDistKm = getItemDistance(item);
              const isJob = item.category === 'job' || item.employment_type === 'wage';
              const isSelf = item.category === 'self_employment' || item.category === 'grant' || item.employment_type === 'self';

              return (
                <div
                  key={item.id}
                  onClick={() => setHighlightedCourseId(item.id)}
                  className={`bg-white rounded-3xl border-2 transition-all p-5 flex flex-col justify-between group cursor-pointer ${
                    isHighlighted ? 'border-emerald-600 ring-4 ring-emerald-100 shadow-md' : 'border-slate-200 hover:border-emerald-400 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Visual Header with Icon and Tags */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                        isJob 
                          ? 'bg-blue-50 border-blue-200' 
                          : isSelf 
                            ? 'bg-amber-50 border-amber-200' 
                            : 'bg-emerald-50 border-emerald-100'
                      }`}>
                        {getIcon(item.image_type)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {isJob ? (
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            <span>रोजगार (Job)</span>
                          </span>
                        ) : isSelf ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>स्वरोजगार (PM-AJAY GIA)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                            NSQF Level {item.nsqf_level}
                          </span>
                        )}

                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.duration || item.duration_months || '3 महीने'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                      {lang === 'en' ? item.title_en : item.title_hi}
                    </h3>

                    {/* Distance & Details */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{lang === 'en' ? item.institute?.name_en : item.institute?.name_hi}</span>
                        <span className="text-emerald-700 font-extrabold ml-auto whitespace-nowrap">
                          ({dynamicDistKm} km)
                        </span>
                      </div>

                      {/* Benefit / Salary Highlights */}
                      {isJob ? (
                        <div className="space-y-1.5">
                          <div className="text-[12px] font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                            💼 {item.pm_ajay_benefits?.capital_subsidy || 'वेतन: ₹25,000 - ₹35,000 प्रतिमाह'}
                          </div>
                          {item.pm_ajay_benefits?.stipend && (
                            <div className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md">
                              🛡️ {item.pm_ajay_benefits?.stipend}
                            </div>
                          )}
                        </div>
                      ) : isSelf ? (
                        <div className="space-y-1.5">
                          <div className="text-[12px] font-black text-amber-950 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            💰 {item.pm_ajay_benefits?.capital_subsidy || '₹50,000 शत-प्रतिशत पूंजी अनुदान (GIA)'}
                          </div>
                          {item.pm_ajay_benefits?.stipend && (
                            <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 px-2.5 py-0.5 rounded-md">
                              📈 {item.pm_ajay_benefits?.stipend}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                          🎁 {item.pm_ajay_benefits?.capital_subsidy || '₹50,000 टूलकिट व अनुदान सहायता'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Details / Apply CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOpportunity(item);
                    }}
                    className={`mt-5 w-full py-3 px-4 rounded-xl active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${
                      isJob
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-700/20'
                        : isSelf
                          ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-700/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                    }`}
                  >
                    <span>
                      {isJob 
                        ? (t.btn_apply_job || 'नौकरी हेतु आवेदन करें')
                        : isSelf 
                          ? (t.btn_apply_grant || '₹50,000 अनुदान प्राप्त करें')
                          : (t.btn_view_details || 'विवरण देखें')}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state fallback */}
        {activeTab !== 'centers' && filteredItems.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
            <p className="text-slate-600 font-bold">
              इस श्रेणी में कोई अवसर नहीं मिला।
            </p>
            <button
              onClick={() => setActiveTab('training')}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-pointer"
            >
              सभी कौशल प्रशिक्षण देखें
            </button>
          </div>
        )}
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
          onClick={onViewMore}
          className="px-6 py-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <span>{t.btn_more_options}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
