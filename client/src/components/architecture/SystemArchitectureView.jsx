import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  PhoneCall, 
  Monitor, 
  Workflow, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Users,
  Compass,
  Zap,
  Globe
} from 'lucide-react';

export default function SystemArchitectureView() {
  const [activeView, setActiveView] = useState('architecture'); // 'architecture' or 'flow'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
              SIH Technical Architecture • MoSJE PM-AJAY GIA
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            Gram Saksham — System Architecture & Flow
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Voice-Enabled Kiosk & IVR Platform for NSQF Skilling and Livelihood Mapping for Scheduled Caste Communities.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveView('architecture')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'architecture'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>1. System Architecture</span>
          </button>
          <button
            onClick={() => setActiveView('flow')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeView === 'flow'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>2. System Flowchart</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SYSTEM ARCHITECTURE (Interactive representation of Image 2) */}
      {activeView === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Gram Saksham — Unified Architecture Overview
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                How Beneficiaries, Touch Kiosks, IVR Phones, AI Engine, and MoSJE Portals connect seamlessly
              </p>
            </div>

            {/* Visual Block Diagram matching Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Users & Access Channels */}
              <div className="lg:col-span-4 space-y-4">
                {/* Beneficiary Box */}
                <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-5 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                      👥
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Beneficiary (User)</h4>
                      <p className="text-xs text-emerald-800 font-bold">Target SC Citizens & Rural Youth</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2">
                    <li>• Rural Citizens & Job Seekers</li>
                    <li>• Traditional Artisans & Farmers</li>
                    <li>• Low Digital Literacy Users</li>
                  </ul>
                </div>

                {/* Kiosk Frontend Box */}
                <div className="bg-sky-50 rounded-2xl border-2 border-sky-300 p-5 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Kiosk Frontend (Web App)</h4>
                      <p className="text-xs text-sky-800 font-bold">React + Vite + Tailwind</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2">
                    <li>• Touchscreen Fullscreen UI</li>
                    <li>• Multilingual Voice In/Out (Web Speech)</li>
                    <li>• Accessible & Offline-friendly</li>
                  </ul>
                </div>

                {/* IVR Phone Access Box */}
                <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-5 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">IVR / Phone Access</h4>
                      <p className="text-xs text-amber-900 font-bold">Toll-Free 1800-123-4567</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2">
                    <li>• Works on basic 2G/3G/4G feature phones</li>
                    <li>• DTMF Keypad (1, 2, 3) + Spoken voice</li>
                    <li>• Twilio / Exotel TwiML webhook</li>
                  </ul>
                </div>
              </div>

              {/* Middle Column: Core Backend Engine */}
              <div className="lg:col-span-4 bg-rose-50/70 rounded-2xl border-2 border-rose-300 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-rose-200">
                  <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">Backend Server</h4>
                    <p className="text-xs text-rose-800 font-bold">Node.js + Express API Engine</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-800">
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                    🔌 <strong>REST API Endpoints:</strong> Session, profile & recommendations
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                    👤 <strong>User Profile Processing:</strong> 5-parameter synthesis
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                    📞 <strong>IVR Webhook Handling:</strong> Dynamic TwiML voice turns
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                    🧠 <strong>LLM Integration:</strong> Gemini Flash / Offline rule engine
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                    🎯 <strong>Recommendation Engine APIs:</strong> Explainable matching
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                    💾 <strong>Data Storage & Retrieval:</strong> SQLite / MongoDB
                  </div>
                </div>
              </div>

              {/* Right Column: AI Services, DB & Admin Portal */}
              <div className="lg:col-span-4 space-y-4">
                {/* Speech & AI Services */}
                <div className="bg-purple-50 rounded-2xl border-2 border-purple-300 p-5 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Speech & AI Services</h4>
                      <p className="text-xs text-purple-800 font-bold">Multilingual Speech Intelligence</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2">
                    <li>• <strong>STT:</strong> Web Speech API / Whisper / Bhashini</li>
                    <li>• <strong>LLM:</strong> Gemini Flash / Intent reasoning</li>
                    <li>• <strong>TTS:</strong> Natural Hindi/regional voice response</li>
                  </ul>
                </div>

                {/* Database */}
                <div className="bg-indigo-50 rounded-2xl border-2 border-indigo-300 p-5 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Database (SQLite / MongoDB)</h4>
                      <p className="text-xs text-indigo-800 font-bold">Relational & Offline-Ready</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2">
                    <li>• Beneficiary Profiles & Preferences</li>
                    <li>• NSQF Training & Opportunity Catalog</li>
                    <li>• Session Logs & Admin Planning Data</li>
                  </ul>
                </div>

                {/* Admin & Field Dashboard */}
                <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-5 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Admin / Field Dashboard</h4>
                      <p className="text-xs text-amber-900 font-bold">MoSJE Perspective Planning</p>
                    </div>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 pl-2">
                    <li>• Manage Beneficiary Records & Batches</li>
                    <li>• Assign Financial Mentors (LBO PNB)</li>
                    <li>• Track Follow-ups & 70% Placement rate</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Key Benefits Callout matching Image 2 */}
            <div className="mt-8 p-5 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Benefits:</span>
              </div>
              <div>• Multi-channel (Kiosk + IVR)</div>
              <div>• Voice-enabled & Multilingual</div>
              <div>• Accessible for all</div>
              <div>• Real opportunities & training</div>
              <div>• Explainable recommendations</div>
              <div>• Scalable & lightweight</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SYSTEM FLOW (Interactive representation of Image 1) */}
      {activeView === 'flow' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Gram Saksham — End-to-End System Flowchart
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Flow of user interaction from Welcome Screen through AI Profiling to Explainable Recommendations
            </p>
          </div>

          <div className="max-w-xl mx-auto flex flex-col items-center space-y-3 text-xs sm:text-sm font-bold">
            {/* Start Node */}
            <div className="w-6 h-6 rounded-full bg-slate-900 shadow-md"></div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Welcome Screen */}
            <div className="w-64 py-2.5 rounded-2xl bg-sky-50 border-2 border-sky-300 text-slate-800 text-center shadow-xs">
              Welcome Screen (Screen 1)
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Select Language */}
            <div className="w-64 py-2.5 rounded-2xl bg-sky-50 border-2 border-sky-300 text-slate-800 text-center shadow-xs">
              Select Language (Screen 2)
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* User Consent */}
            <div className="w-64 py-2.5 rounded-2xl bg-sky-50 border-2 border-sky-300 text-slate-800 text-center shadow-xs">
              User Consent (Screen 3)
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Decision Diamond: Consent Given? */}
            <div className="py-2 px-6 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-950 font-black rotate-0 shadow-xs">
              Consent Given?
            </div>

            {/* Branching */}
            <div className="w-full flex justify-between px-10 text-xs text-slate-500">
              <span className="text-emerald-700 font-extrabold">Yes ↓</span>
              <span className="text-rose-700 font-extrabold">No ➔ Exit Session</span>
            </div>

            {/* Choose Access Mode */}
            <div className="w-64 py-2.5 rounded-2xl bg-sky-50 border-2 border-sky-300 text-slate-800 text-center shadow-xs">
              Choose Access Mode (Screen 4)
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Kiosk / IVR Box */}
            <div className="w-72 p-3 rounded-2xl border-2 border-dashed border-slate-400 bg-slate-50 text-center space-y-2">
              <div className="text-[10px] uppercase font-black text-slate-500">Kiosk / IVR Interaction</div>
              <div className="py-1.5 px-3 rounded-xl bg-sky-100 border border-sky-300 text-sky-900">
                Voice Interview (Screen 5)
              </div>
              <div className="text-slate-400">↓</div>
              <div className="py-1.5 px-3 rounded-xl bg-sky-100 border border-sky-300 text-sky-900">
                Speech-to-Text (Screen 7)
              </div>
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Create Beneficiary Profile + Yellow Sticky Note Callout */}
            <div className="relative flex items-center justify-center">
              <div className="w-64 py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-center shadow-xs font-black">
                Create Beneficiary Profile (Screen 6)
              </div>

              {/* Exact Sticky Note matching Image 1 */}
              <div className="hidden sm:block absolute left-full ml-4 w-44 p-2.5 bg-[#fef9c3] border border-amber-300 rounded-tr-xl rounded-bl-lg shadow-md text-[11px] font-mono text-amber-950 text-left">
                <div className="font-bold underline mb-1">Captured Fields:</div>
                <div>• Education</div>
                <div>• Skills</div>
                <div>• Interests</div>
                <div>• Location</div>
                <div>• Employment Preference</div>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Recommendation Engine */}
            <div className="w-64 py-2.5 rounded-2xl bg-indigo-50 border-2 border-indigo-400 text-indigo-950 text-center shadow-xs font-black">
              Recommendation Engine (Screen 8)
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Parallel Bar (Fork) */}
            <div className="w-72 h-1.5 bg-slate-900 rounded-full"></div>

            {/* Parallel Matching */}
            <div className="w-full flex justify-center gap-4 py-2">
              <div className="w-36 py-2 rounded-xl bg-sky-50 border border-sky-300 text-center text-xs">
                Match Training (NSQF)
              </div>
              <div className="w-36 py-2 rounded-xl bg-sky-50 border border-sky-300 text-center text-xs">
                Match Local Opportunities (ODOP / GIA)
              </div>
            </div>

            {/* Parallel Bar (Join) */}
            <div className="w-72 h-1.5 bg-slate-900 rounded-full"></div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Eligibility + Matching Criteria */}
            <div className="w-72 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-center text-xs font-black">
              Eligibility + Skill + Interest + Location Matching
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Generate Explainable Recommendations */}
            <div className="w-72 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 text-center text-xs font-black">
              Generate Explainable Recommendations (Screen 9 & 10)
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Display / Speak */}
            <div className="w-72 py-2.5 rounded-2xl bg-emerald-600 text-white text-center text-xs font-black shadow-md">
              Display on Kiosk / Speak through IVR
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* Session Reset */}
            <div className="w-64 py-2 rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 text-center text-xs">
              Session Reset (Screen 11 & 12)
            </div>
            <div className="w-0.5 h-6 bg-slate-300"></div>

            {/* End Node */}
            <div className="w-7 h-7 rounded-full border-3 border-slate-900 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
