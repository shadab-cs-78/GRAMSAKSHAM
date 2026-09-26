import React, { useState, useEffect } from 'react';
import { Home, Volume2, VolumeX, PhoneCall, Monitor, Users, Download } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Header({ 
  currentScreen, 
  onGoHome, 
  activeTab, 
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  currentLang = 'hi'
}) {
  const [timeString, setTimeString] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.hi;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
      setTimeString(now.toLocaleString('en-IN', options).replace(',', ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
      {/* Main Kiosk Header bar - Clean, Official & Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center overflow-hidden p-0.5">
            <img 
              src="/pwa-icon-192.png" 
              alt="Gram Saksham" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                Gram <span className="text-emerald-600">Saksham</span>
              </h1>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold hidden md:inline">
                PM-AJAY GIA
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-700 tracking-wide mt-0.5">
              {t.brand_sub}
            </p>
          </div>
        </div>

        {/* Right side controls: Date/Time, Sound, Home */}
        <div className="flex items-center gap-3 sm:gap-5">
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-bounce"
              title={t.btn_install_pwa}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.btn_install_pwa}</span>
            </button>
          )}

          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-700">{timeString || '20 Sep 2026 10:24 AM'}</div>
            <div className="text-[11px] text-slate-500 font-medium">CSC Kiosk #04</div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              soundEnabled ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-400 bg-slate-100'
            }`}
            title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={onGoHome}
            className="p-2.5 rounded-full border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-all shadow-xs cursor-pointer"
            title={t.btn_back_home || 'Home'}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
