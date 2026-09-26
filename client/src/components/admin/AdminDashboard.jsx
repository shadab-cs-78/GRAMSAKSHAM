import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Layers, 
  Briefcase, 
  Award, 
  MapPin, 
  CheckCircle2, 
  Download, 
  Filter, 
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
  Database,
  Server
} from 'lucide-react';
import { getApiBaseUrl } from '../../utils/apiConfig';

export default function AdminDashboard({ onBackToKiosk }) {
  const [stats, setStats] = useState({
    district: "Jabalpur",
    sc_population_coverage: "74%",
    active_kiosks: 18,
    ivr_calls_handled: 1240,
    total_screened: 246,
    gia_subsidy_allocated: "₹25,00,000"
  });

  const [batches, setBatches] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const [systemHealth, setSystemHealth] = useState({
    ai_engine: { status: 'CHECKING...', api_key_configured: false, model: 'gemini-3.7-flash' },
    database: { connected: false, mode: 'IN_MEMORY_STORE' }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const apiBase = getApiBaseUrl();
    try {
      const healthRes = await fetch(`${apiBase}/health`);
      if (healthRes.ok) {
        const hData = await healthRes.json();
        setSystemHealth(hData);
      }
    } catch (e) {}

    try {
      const planRes = await fetch(`${apiBase}/perspective-plan`);
      if (planRes.ok) {
        const pData = await planRes.json();
        if (pData.batches_formed) setBatches(pData.batches_formed);
        if (pData.active_districts) setDistrictsData(pData.active_districts);
        if (pData.total_screened) {
          setStats(prev => ({
            ...prev,
            total_screened: pData.total_screened,
            sc_population_coverage: pData.sc_population_coverage || "74%",
            gia_subsidy_allocated: pData.gia_subsidy_allocated || "₹25,00,000",
            active_kiosks: pData.active_kiosks || 18,
            ivr_calls_handled: pData.ivr_calls_handled || 1240
          }));
        }
      }
    } catch (e) {}

    try {
      const benRes = await fetch(`${apiBase}/beneficiaries`);
      if (benRes.ok) {
        const bData = await benRes.json();
        if (bData.beneficiaries && bData.beneficiaries.length > 0) {
          setBeneficiaries(bData.beneficiaries);
        }
      }
    } catch (e) {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
              MoSJE Administrative Dashboard
            </span>
            <span className="text-xs text-slate-400">जबलपुर जिला केंद्र (MP)</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            PM-AJAY GIA परिप्रेक्ष्य योजना (Perspective Planning Portal)
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            क्योस्क एवं आई.वी.आर. से प्राप्त मांग का स्वतः समूहीकरण, 30-सदस्यीय बैच निर्माण, वित्तीय सलाहकार आवंटन तथा पोस्ट-ट्रेनिंग प्लेसमेंट ट्रैकिंग।
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {onBackToKiosk && (
            <button
              onClick={onBackToKiosk}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/20 cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>क्योस्क पर वापस जाएँ</span>
            </button>
          )}

          <button 
            onClick={() => window.print()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer shrink-0 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>वार्षिक कार्ययोजना (AAP)</span>
          </button>
        </div>
      </div>

      {/* 🤖 LIVE AI ENGINE & DATABASE STATUS (Gemini API + MongoDB) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border-2 border-indigo-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Google Gemini AI & MongoDB Cloud Live Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold text-[10px] uppercase border border-indigo-400/40">
                  Vercel Serverless Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                MoSJE PM-AJAY GIA लाइव रिकमेंडेशन एवं जिला जनगणना (PCA SC) डेटाबेस स्थिति
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
              systemHealth.ai_engine?.api_key_configured
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${systemHealth.ai_engine?.api_key_configured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span>{systemHealth.ai_engine?.api_key_configured ? 'Gemini AI: ACTIVE' : 'AI: NSQF Rule Fallback'}</span>
            </span>

            <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
              systemHealth.database?.connected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{systemHealth.database?.connected ? 'DB: MongoDB Atlas' : 'DB: In-Memory Cache'}</span>
            </span>
          </div>
        </div>

        {/* Backend Environment Security Status (Zero Client-Side Key Exposure) */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-indigo-900/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                सुरक्षित बैकएंड वातावरण (Backend Environment Security)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Model: {systemHealth.ai_engine?.model || 'gemini-3.7-flash'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Google Gemini AI</p>
                <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${systemHealth.ai_engine?.api_key_configured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                  <span>{systemHealth.ai_engine?.api_key_configured ? 'सक्रिय (Backend .env / Vercel)' : 'NSQF Rule Fallback सक्रिय'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">MongoDB Atlas Cloud</p>
                <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${systemHealth.database?.connected ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
                  <span>{systemHealth.database?.connected ? 'कनेक्टेड (Cluster0 - gramsaksham)' : 'स्थानीय कैश (Fallback)'}</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
            🔒 <strong>सुरक्षा मानक:</strong> API Keys और क्रेडेंशियल्स ब्राउज़र में दर्ज नहीं किए जाते। यह सीधे बैकएंड <code>.env</code> या Vercel Environment Variables (<code>GEMINI_API_KEY</code>, <code>MONGODB_URI</code>) से सुरक्षित रूप से लोड होते हैं।
          </p>
        </div>

        {/* District PCA SC Census Data Summary (Shahdol, Ratlam, Morena, Jabalpur) */}
        {districtsData && districtsData.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                शामिल जिले व ग्रामीण SC जनसंख्या मैपिंग (PCA Census SC):
              </span>
              <span className="text-[11px] text-indigo-400 font-semibold">{districtsData.length} जिले सक्रिय (PCA SC Census)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {districtsData.map(dist => (
                <div key={dist.district_name} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-colors">
                  <div className="text-xs font-extrabold text-white flex items-center justify-between">
                    <span>{dist.district_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">#{dist.district_code}</span>
                  </div>
                  <div className="text-sm font-black text-amber-400 mt-1">
                    {dist.rural_sc_population?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ग्रामीण SC जनसंख्या ({dist.total_records_count || 'PCA'} रिकॉर्ड्स)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">कुल मूल्यांकित लाभार्थी</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{stats.total_screened}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 14 क्योस्क व IVR द्वारा सक्रिय
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">गठित प्रशिक्षण बैच</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{batches.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">30 लाभार्थी प्रति बैच मानक</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">GIA पूंजीगत अनुदान</div>
          <div className="text-3xl font-black text-amber-600 mt-1">{stats.gia_subsidy_allocated}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">अधिकतम ₹50,000 प्रति व्यक्ति</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">वित्तीय सलाहकार लिंकेज</div>
          <div className="text-3xl font-black text-sky-600 mt-1">100%</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">LBO / Bank Mitra टैग्ड</div>
        </div>
      </div>

      {/* Batches Table (Directly solves Issue 1 & 2 of Problem Statement) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              प्रशिक्षण बैच एवं परिप्रेक्ष्य योजना (Training Batches & Cohorts)
            </h3>
            <p className="text-xs text-slate-500">
              गाँव व ब्लॉक स्तर पर स्वतः एकत्रित मांग के आधार पर तैयार 30-सदस्यीय समूह
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            मान्यता: NSQF + MSDE Common Norms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">बैच आईडी</th>
                <th className="px-4 py-3">ट्रेड (NSQF Job Role)</th>
                <th className="px-4 py-3">संख्या</th>
                <th className="px-4 py-3">प्रशिक्षण संस्थान</th>
                <th className="px-4 py-3">वित्तीय सलाहकार</th>
                <th className="px-4 py-3 rounded-r-xl">स्थिति / प्लेसमेंट पार्टनर</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {batches.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-bold font-mono text-emerald-700">{b.batch_id}</td>
                  <td className="px-4 py-3.5 font-bold">{b.trade}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-bold text-xs">
                      {b.candidates}/30
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{b.center}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-sky-800">{b.financial_mentor}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs font-bold text-emerald-700">{b.status}</div>
                    <div className="text-[11px] text-slate-500">{b.placement_partner}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Beneficiaries Screened via Kiosk & IVR */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              पंजीकृत लाभार्थी पंजी (Recent Screened Beneficiaries)
            </h3>
            <p className="text-xs text-slate-500">
              क्योस्क (Kiosk) एवं आई.वी.आर. (IVR) से स्वतः दर्ज वास्तविक रिकॉर्ड
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {beneficiaries.map((ben, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">{ben.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    ben.channel === 'KIOSK' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ben.channel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Ref: {ben.id} • {ben.education}
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  अनुशंसित ट्रेड: {ben.trade}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                  {ben.subsidy_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
