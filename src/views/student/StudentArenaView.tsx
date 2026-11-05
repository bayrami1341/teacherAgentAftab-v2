import React, { useState } from 'react';
import { Sprout, Calculator, ArrowLeft, ShieldCheck } from 'lucide-react';
import { MathWorkspace } from '../../components/tools/workspaces/MathWorkspace';

export const StudentArenaView: React.FC = () => {
  const [step, setStep] = useState<'LOGIN' | 'DASHBOARD'>('LOGIN');
  const [selectedDesk, setSelectedDesk] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isMathOpen, setIsMathOpen] = useState(false);

  const desks = [
    { id: 'desk-1', name: 'میز ۱ (سرو)' },
    { id: 'desk-2', name: 'میز ۲ (سپیدار)' },
    { id: 'desk-3', name: 'میز ۳ (صنوبر)' },
    { id: 'desk-4', name: 'میز ۴ (بلوط)' },
    { id: 'desk-5', name: 'میز ۵ (افرا)' },
    { id: 'desk-6', name: 'میز ۶ (زیتون)' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDesk && pin.length === 4) {
      setStep('DASHBOARD');
    }
  };

  if (isMathOpen) {
    return (
      <div className="min-h-screen bg-[#090d16]">
        <MathWorkspace 
          tenantId="sch-demo-aftab" 
          userRole="STUDENT" 
          onClose={() => setIsMathOpen(false)} 
        />
      </div>
    );
  }

  if (step === 'LOGIN') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] p-4" dir="rtl">
        <div className="w-full max-w-md bg-[#0f172a] rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
              <Sprout className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">خوش آمدی!</h1>
            <p className="text-sm text-slate-400">برای ورود به کلاس، میز خود را انتخاب کن و پین را وارد کن.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">انتخاب میز کلاسی:</label>
              <select
                value={selectedDesk}
                onChange={(e) => setSelectedDesk(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-700 text-white rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                required
              >
                <option value="" disabled>یک میز انتخاب کنید...</option>
                {desks.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">پین ۴ رقمی:</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#090d16] border border-slate-700 text-white text-center tracking-[1em] text-2xl font-mono rounded-xl p-3 focus:border-emerald-500 outline-none"
                placeholder="••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>ورود به میز کار</span>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            <span>محیط امن Zero-PII (بدون ثبت مشخصات)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#090d16] p-4" dir="rtl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">سلام! خوش آمدی به باغچه.</h1>
        <p className="text-slate-400 text-sm">امروز قراره چه چالشی رو پشت سر بذاری؟</p>
      </div>

      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse" />
        <Sprout className="h-32 w-32 text-emerald-400 relative z-10" />
      </div>

      <button
        onClick={() => setIsMathOpen(true)}
        className="group relative flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-3xl shadow-lg shadow-indigo-900/50 transition-all hover:scale-105"
      >
        <Calculator className="h-8 w-8" />
        <div className="text-right">
          <div className="font-bold text-lg">شروع چالش ریاضی</div>
          <div className="text-xs text-indigo-200">کارتریج روشا (پایه سوم)</div>
        </div>
      </button>
    </div>
  );
};
