import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Screen1Welcome from './components/kiosk/Screen1Welcome';
import Screen2Language from './components/kiosk/Screen2Language';
import Screen3Consent from './components/kiosk/Screen3Consent';
import Screen4AccessMode from './components/kiosk/Screen4AccessMode';
import Screen6ProfileCollection from './components/kiosk/Screen6ProfileCollection';
import Screen8Processing from './components/kiosk/Screen8Processing';
import Screen9Recommendations from './components/kiosk/Screen9Recommendations';
import Screen10CourseDetails from './components/kiosk/Screen10CourseDetails';
import Screen11Feedback from './components/kiosk/Screen11Feedback';
import Screen12SessionComplete from './components/kiosk/Screen12SessionComplete';
import PhoneSimulator from './components/ivr/PhoneSimulator';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminPinModal from './components/AdminPinModal';
import { Lock, Phone, ShieldCheck } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from './data/translations';
import { getApiBaseUrl } from './utils/apiConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState('kiosk'); // 'kiosk', 'ivr', 'admin'
  const [currentScreen, setCurrentScreen] = useState(1); // 1 to 11
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);

  // Selected Language: 'hi', 'en', 'bn', 'te', 'pa'
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const currentLangCode = selectedLang?.id || 'hi';

  // Access Mode: 'voice' ((AI) Voice + Text) or 'touch' (Touch + Text)
  const [accessMode, setAccessMode] = useState('voice');

  // 5 Profile Parameters
  const [profile, setProfile] = useState({
    education: 'secondary',
    skills: 'farming',
    interests: ['electrician'],
    location: 'kundam',
    locationName: 'कुंडम (जनजातीय ब्लॉक)',
    coordinates: { lat: 23.1970, lng: 80.3520 },
    employment_preference: 'self',
    district: 'Jabalpur Rural'
  });

  const [recommendations, setRecommendations] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [referenceId, setReferenceId] = useState('GS20260920-1234');

  // Fetch initial recommendations
  useEffect(() => {
    fetchRecommendations(profile);
  }, []);

  const fetchRecommendations = async (userProfile) => {
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProfile, lang: currentLangCode })
      });
      const data = await res.json();
      if (data && data.recommendations) {
        setRecommendations(data.recommendations);
        if (data.recommendations.length > 0) {
          setSelectedOpportunity(data.recommendations[0]);
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable, using local fallback", err);
      const localData = [
        {
          id: "NSQF-ELEC-01",
          title_hi: "इलेक्ट्रीशियन (ITI)",
          title_en: "Electrician (ITI)",
          category: "training",
          nsqf_level: 4,
          duration_months: "3-6 महीने",
          suitable_for: [
            "आपकी रुचि विद्युत/तकनीकी कार्यों में है",
            "इस क्षेत्र में स्थानीय और नजदीकी शहरों में भारी मांग है",
            "स्वरोजगार (दुकान/सर्विस) और नौकरी दोनों के अवसर"
          ],
          institute: {
            name_hi: "राजकीय आईटीआई जबलपुर",
            name_en: "Govt ITI Jabalpur",
            distance_km: 5,
            contact: "0761-2645890",
            address: "सिविल लाइन्स, जिला केंद्र"
          },
          employment_type: "both",
          pm_ajay_benefits: {
            capital_subsidy: "₹50,000 टूलकिट एवं दुकान अनुदान",
            stipend: "₹1,500 प्रतिमाह प्रशिक्षण भत्ता"
          },
          image_type: "electrician"
        },
        {
          id: "NSQF-MOB-02",
          title_hi: "मोबाइल रिपेयरिंग",
          title_en: "Mobile Repairing",
          category: "training",
          nsqf_level: 4,
          duration_months: "3 महीने",
          suitable_for: [
            "तकनीकी व डिजिटल उपकरणों में रुचि",
            "गाँव व स्थानीय बाज़ार में तुरंत दुकान खोलने की सुविधा",
            "कम लागत में त्वरित आय"
          ],
          institute: {
            name_hi: "ग्रामीण स्वरोजगार प्रशिक्षण संस्थान (RSETI)",
            name_en: "RSETI Jabalpur",
            distance_km: 8,
            contact: "0761-2894561",
            address: "ब्लॉक हेडक्वार्टर"
          },
          employment_type: "self",
          pm_ajay_benefits: {
            capital_subsidy: "₹45,000 रिपेयरिंग उपकरण किट",
            stipend: "₹1,500 प्रतिमाह भत्ता"
          },
          image_type: "mobile"
        },
        {
          id: "NSQF-SOLAR-03",
          title_hi: "सोलर पीवी इंस्टॉलर (सूर्यमित्र)",
          title_en: "Solar PV Installer",
          category: "training",
          nsqf_level: 4,
          duration_months: "3 महीने",
          suitable_for: [
            "ग्रामीण क्षेत्रों में पीएम-कुसुम सोलर पंप विस्तार",
            "हरित ऊर्जा क्षेत्र में उच्च वेतन की नौकरी",
            "स्थानीय पंचायतों में सौर संयंत्र रखरखाव"
          ],
          institute: {
            name_hi: "कौशल विकास केंद्र - नवीन ऊर्जा",
            name_en: "Skill Centre Renewable Energy",
            distance_km: 12,
            contact: "0761-2458712",
            address: "औद्योगिक क्षेत्र"
          },
          employment_type: "both",
          pm_ajay_benefits: {
            capital_subsidy: "₹50,000 सोलर उपकरण किट",
            stipend: "₹2,000 प्रतिमाह भत्ता"
          },
          image_type: "solar"
        },
        {
          id: "JOB-DRN-01",
          title_hi: "ड्रोन पायलट (कीटनाशक व नैनो-यूरिया छिड़काव)",
          title_en: "Agricultural Drone Pilot / Operator",
          category: "job",
          nsqf_level: 5,
          duration: "नियमित रोजगार (फुल टाइम)",
          min_education: "secondary",
          institute: {
            name_hi: "भारत एग्रीटेक कस्टम हायरिंग सर्विसेज प्रा. लि.",
            name_en: "Bharat AgriTech Drone Services Pvt Ltd",
            distance_km: 18,
            contact: "1800-456-7890",
            address: "कृषि हब, मंडी रोड"
          },
          employment_type: "wage",
          pm_ajay_benefits: {
            capital_subsidy: "वेतन: ₹25,000 - ₹40,000 प्रतिमाह + इंसेंटिव",
            stipend: "ईपीएफ, ईएसआईसी स्वास्थ्य बीमा एवं यात्रा भत्ता",
            toolkit: "कंपनी द्वारा दिया जाने वाला डीजीसीए मान्यता प्राप्त ड्रोन"
          },
          image_type: "drone"
        },
        {
          id: "JOB-SOL-02",
          title_hi: "सोलर पंप सर्विस इंजीनियर व ग्रिड मेंटेनेंस",
          title_en: "Solar Pump Service Engineer & Grid Tech",
          category: "job",
          nsqf_level: 4,
          duration: "नियमित रोजगार",
          min_education: "secondary",
          institute: {
            name_hi: "मध्य प्रदेश डिस्कॉम अधिकृत सोलर सर्विसेज",
            name_en: "MP DISCOM Authorized Solar Infrastructure Ltd",
            distance_km: 10,
            contact: "07662-258900",
            address: "सोलर पार्क सर्विस कॉम्प्लेक्स"
          },
          employment_type: "wage",
          pm_ajay_benefits: {
            capital_subsidy: "वेतन: ₹20,000 - ₹35,000 प्रतिमाह",
            stipend: "ईएसआईसी + पीएफ + फील्ड ट्रैवल अलाउंस",
            toolkit: "कंपनी वाहन एवं डिजिटल फॉल्ट-डिटेक्टर किट"
          },
          image_type: "solar"
        },
        {
          id: "BIZ-AGR-01",
          title_hi: "केंचुआ खाद एवं बायो-फर्टिलाइजर ग्राम उद्यम",
          title_en: "Vermicompost & Bio-Fertilizer Micro-Enterprise",
          category: "self_employment",
          nsqf_level: 4,
          duration: "स्वरोजगार (खुद का व्यवसाय)",
          min_education: "no_formal",
          institute: {
            name_hi: "जिला उद्योग केंद्र (DIC) एवं नाबार्ड सहयोगी बैंक",
            name_en: "District Industries Centre & Lead Bank (PNB)",
            distance_km: 6,
            contact: "07652-240120",
            address: "कलेक्ट्रेट रोड, जिला उद्योग केंद्र"
          },
          employment_type: "self",
          pm_ajay_benefits: {
            capital_subsidy: "₹50,000 शत-प्रतिशत पूंजीगत अनुदान (PM-AJAY GIA)",
            stipend: "बैंक लोन पर 5% ब्याज छूट (मुद्रा योजना)",
            toolkit: "एचडीपीई वर्मी-बेड एवं पैकेजिंग मशीन किट"
          },
          image_type: "agriculture"
        },
        {
          id: "BIZ-SOL-02",
          title_hi: "ग्रामीण सोलर रिपेयरिंग, बैटरी चार्जिंग व सर्विस केंद्र",
          title_en: "Rural Solar Repair & Service Micro-Center",
          category: "self_employment",
          nsqf_level: 4,
          duration: "स्वरोजगार (दुकान/केंद्र)",
          min_education: "primary",
          institute: {
            name_hi: "लीड बैंक पीएनबी / ग्रामीण बैंक स्वरोजगार शाखा",
            name_en: "Lead Bank PNB / Gramin Bank Enterprise Branch",
            distance_km: 5,
            contact: "07662-241560",
            address: "तहसील परिसर"
          },
          employment_type: "self",
          pm_ajay_benefits: {
            capital_subsidy: "₹50,000 प्रत्यक्ष दुकान एवं टूलकिट अनुदान (PM-AJAY GIA)",
            stipend: "पीएम-कुसुम अधिकृत वेंडर रजिस्ट्रेशन सहायता",
            toolkit: "मल्टीमीटर, इनवर्टर चार्जर व सेफ्टी लैडर किट"
          },
          image_type: "solar"
        }
      ];
      setRecommendations(localData);
      setSelectedOpportunity(localData[0]);
    }
  };

  const handleEndSession = async (feedback) => {
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/save-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          selectedOpportunity,
          feedback
        })
      });
      const data = await res.json();
      if (data && data.reference_id) {
        setReferenceId(data.reference_id);
      }
    } catch (e) {
      const fallbackId = 'GS20260920-' + Math.floor(1000 + Math.random() * 9000);
      setReferenceId(fallbackId);
    }
    setCurrentScreen(10); // Advance to Session Complete Screen
  };

  const resetToHome = () => {
    setCurrentScreen(1);
    setActiveTab('kiosk');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-['Mukta',sans-serif]">
      {/* Universal Top Header */}
      <Header
        currentScreen={currentScreen}
        onGoHome={resetToHome}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        currentLang={currentLangCode}
      />

      {/* Main Container */}
      <main className="flex-1 py-4 sm:py-6">
        {/* TAB 1: KIOSK FLOW */}
        {activeTab === 'kiosk' && (
          <div>
            {/* Screen 1: Welcome Screen */}
            {currentScreen === 1 && (
              <Screen1Welcome
                onStart={() => setCurrentScreen(2)}
                onOpenIVR={() => setActiveTab('ivr')}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 2: Language Selection */}
            {currentScreen === 2 && (
              <Screen2Language
                selectedLang={selectedLang}
                onSelectLang={(lang) => setSelectedLang(lang)}
                onBack={() => setCurrentScreen(1)}
                onNext={() => setCurrentScreen(3)}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 3: Consent Screen */}
            {currentScreen === 3 && (
              <Screen3Consent
                onBack={() => setCurrentScreen(2)}
                onNext={() => setCurrentScreen(4)}
                onExit={resetToHome}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 4: Access Mode (Touch Screen vs Voice Assistant) */}
            {currentScreen === 4 && (
              <Screen4AccessMode
                selectedMode={accessMode}
                onSelectMode={(m) => setAccessMode(m)}
                onBack={() => setCurrentScreen(3)}
                onNext={() => setCurrentScreen(5)}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 5: Profile Collection (5 Steps, Touch Screen or AI Voice with Manual Edit) */}
            {currentScreen === 5 && (
              <Screen6ProfileCollection
                profile={profile}
                mode={accessMode}
                onUpdateProfile={(updatedProfile) => {
                  setProfile(updatedProfile);
                  fetchRecommendations(updatedProfile);
                }}
                onBack={() => setCurrentScreen(4)}
                onNext={() => {
                  fetchRecommendations(profile);
                  setCurrentScreen(6); // Advances directly to Processing screen
                }}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 6: Processing Screen */}
            {currentScreen === 6 && (
              <Screen8Processing
                onComplete={() => setCurrentScreen(7)}
                profile={profile}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 7: Recommendation Results + OpenStreetMap Tracker */}
            {currentScreen === 7 && (
              <Screen9Recommendations
                recommendations={recommendations}
                profile={profile}
                onSelectOpportunity={(item) => {
                  setSelectedOpportunity(item);
                  setCurrentScreen(8);
                }}
                onBack={() => setCurrentScreen(5)}
                onViewMore={() => setCurrentScreen(8)}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 8: Course / Opportunity Details */}
            {currentScreen === 8 && (
              <Screen10CourseDetails
                opportunity={selectedOpportunity}
                profile={profile}
                onBack={() => setCurrentScreen(7)}
                onInterested={() => setCurrentScreen(9)}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 9: Feedback & Next Steps */}
            {currentScreen === 9 && (
              <Screen11Feedback
                onBack={() => setCurrentScreen(8)}
                onEndSession={(rating) => handleEndSession(rating)}
                onShowMore={() => setCurrentScreen(7)}
                onTalkAdvisor={() => setActiveTab('ivr')}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}

            {/* Screen 10: Session Complete */}
            {currentScreen === 10 && (
              <Screen12SessionComplete
                referenceId={referenceId}
                selectedOpportunity={selectedOpportunity}
                profile={profile}
                onGoHome={resetToHome}
                lang={currentLangCode}
                soundEnabled={soundEnabled}
              />
            )}
          </div>
        )}

        {/* TAB 2: IVR PHONE ON MOBILE & FEATURE PHONE */}
        {activeTab === 'ivr' && (
          <PhoneSimulator onBackToKiosk={() => setActiveTab('kiosk')} />
        )}

        {/* TAB 3: MoSJE ADMINISTRATIVE DASHBOARD & PERSPECTIVE PLANNING */}
        {activeTab === 'admin' && (
          <AdminDashboard onBackToKiosk={() => setActiveTab('kiosk')} />
        )}
      </main>

      {/* Official Government Footer with Protected Admin Access */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-3 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Government Meta & Live Status */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            <span className="font-bold text-white tracking-wide">ग्राम सक्षम (Gram Saksham)</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300">MoSJE PM-AJAY (GIA)</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-emerald-400 font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              SIH PS ID: 26097
            </span>
          </div>

          {/* Action Links & Admin Access */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            {/* Toll-free IVR button */}
            <button
              onClick={() => setActiveTab('ivr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer text-[11px] font-bold"
              title="Switch to IVR Mobile Helpline Simulator"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>हेल्पलाइन (1800-123-4567)</span>
            </button>

            {/* Password-protected MoSJE Admin Portal button */}
            <button
              onClick={() => {
                if (activeTab === 'admin') {
                  setActiveTab('kiosk');
                } else {
                  setShowAdminPinModal(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 transition-colors cursor-pointer text-[11px] font-extrabold"
              title="Enter Admin PIN (Default: 26097) to view MoSJE Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeTab === 'admin' ? 'क्योस्क पर वापस जाएँ' : 'अधिकारी पोर्टल (Admin Portal)'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Protected Admin Access PIN Modal */}
      <AdminPinModal
        isOpen={showAdminPinModal}
        onClose={() => setShowAdminPinModal(false)}
        onSuccess={() => {
          setShowAdminPinModal(false);
          setActiveTab('admin');
        }}
        lang={currentLangCode}
      />
    </div>
  );
}
