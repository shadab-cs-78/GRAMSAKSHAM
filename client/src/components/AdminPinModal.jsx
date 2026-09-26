import React, { useState } from 'react';
import { ShieldCheck, Lock, X, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminPinModal({ isOpen, onClose, onSuccess, lang = 'hi' }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  // Master PIN: Problem Statement ID 26097 or admin123
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (pin.trim() === '26097' || pin.trim().toLowerCase() === 'admin123' || pin.trim() === '1234') {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const isHindi = lang === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/30 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                MoSJE PM-AJAY GIA
              </span>
              <h3 className="text-xl font-black text-white">
                {isHindi ? 'अधिकारी प्रमाणीकरण' : 'Admin Security Access'}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi 
              ? 'यह अनुभाग केवल सामाजिक न्याय एवं अधिकारिता मंत्रालय के अधिकृत अधिकारियों के लिए है।'
              : 'This section is restricted to authorized MoSJE District & State administrative officers.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {isHindi ? 'सुरक्षा पिन / पासवर्ड दर्ज करें' : 'Enter Security PIN / Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-lg font-mono tracking-widest text-slate-900 outline-none transition-all"
              />
            </div>

            {/* Quick Demo Hint for Evaluators */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <KeyRound className="w-3 h-3" />
                <span>Default PIN: <b>26097</b></span>
              </span>
              <span className="text-slate-400">(PS ID: 26097)</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>
                {isHindi ? 'गलत सुरक्षा पिन! कृपया पुनः प्रयास करें।' : 'Invalid PIN! Please check and try again.'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm cursor-pointer transition-colors text-center"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
            >
              <span>{isHindi ? 'प्रवेश करें' : 'Verify & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
