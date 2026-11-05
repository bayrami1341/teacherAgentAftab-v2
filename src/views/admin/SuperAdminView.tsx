import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Activity, Lock, 
  AlertTriangle, CheckCircle2, Search, Filter, Database
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  region: string;
  status: 'online' | 'offline' | 'grace';
  activeSeats: number;
  maxSeats: number;
  licensedTools: string[];
  lastPing: string;
}

const MOCK_TENANTS: Tenant[] = [
  { id: 'sch-demo-aftab', name: 'دبستان هوشمند نمونه آفتاب', region: 'تهران', status: 'online', activeSeats: 120, maxSeats: 150, licensedTools: ['باغچه جوانه', 'ریاضی روشا'], lastPing: 'همین الان' },
  { id: 'sch-rosha-primary', name: 'مجتمع آموزشی روشا', region: 'اصفهان', status: 'grace', activeSeats: 85, maxSeats: 100, licensedTools: ['ریاضی روشا'], lastPing: '۲ ساعت پیش' },
  { id: 'sch-javane-central', name: 'دبستان پسرانه جوانه', region: 'شیراز', status: 'offline', activeSeats: 0, maxSeats: 80, licensedTools: ['باغچه جوانه'], lastPing: 'دیروز' },
  { id: 'sch-alborz-north', name: 'دبیرستان البرز شمال', region: 'کرج', status: 'online', activeSeats: 45, maxSeats: 50, licensedTools: ['باغچه جوانه', 'ریاضی روشا'], lastPing: '۵ دقیقه پیش' },
];

const MOCK_LOGS = [
  { id: 1, time: '۱۴۰۵/۰۸/۱۴ - ۱۰:۳۲', type: 'SECURITY_VIOLATION', tenant: 'مجتمع آموزشی روشا', message: 'تلاش برای دسترسی به ابزار خریداری‌نشده (tool-garden) مسدود شد.' },
  { id: 2, time: '۱۴۰۵/۰۸/۱۴ - ۰۹:۱۵', type: 'SYSTEM', tenant: 'دبستان هوشمند نمونه آفتاب', message: 'لایسنس مدرسه با موفقیت تمدید و امضای ECDSA اعتبارسنجی شد.' },
  { id: 3, time: '۱۴۰۵/۰۸/۱۴ - ۰۸:۰۰', type: 'WARNING', tenant: 'دبستان پسرانه جوانه', message: 'قطع ارتباط با کلاینت مدرسه (وضعیت آفلاین).' },
];

export const SuperAdminView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = MOCK_TENANTS.filter(t => t.name.includes(searchQuery) || t.region.includes(searchQuery));

  return (
    <div className="w-full text-slate-100 p-2 font-sans antialiased" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* هدر */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-400" />
              کنسول مالک پلتفرم (Super Admin)
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">پایش سراسری مدارس، مدیریت لایسنس‌ها و لاگ‌های امنیتی گیت‌کیپر</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0c1322] border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            سرور مرکزی آفتاب: آنلاین
          </div>
        </header>

        {/* ۱. آمار کلان */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">کل مدارس مستأجر</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{MOCK_TENANTS.length}</span>
                <span className="text-xs text-slate-400">مدرسه</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">{MOCK_TENANTS.filter(t => t.status === 'online').length} مدرسه آنلاین</p>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Building2 className="w-5 h-5" /></div>
          </div>

          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">مجموع صندلی‌های فعال</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{MOCK_TENANTS.reduce((sum, t) => sum + t.activeSeats, 0)}</span>
                <span className="text-xs text-slate-400">از {MOCK_TENANTS.reduce((sum, t) => sum + t.maxSeats, 0)} ظرفیت</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">نرخ اشغال ظرفیت: ۶۸٪</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Activity className="w-5 h-5" /></div>
          </div>

          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400">هشدارهای امنیتی (امروز)</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-400">۳</span>
                <span className="text-xs text-slate-400">رویداد مسدودشده</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">توسط گیت‌کیپر هسته امنیتی</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </section>

        {/* ۲. جدول مدارس (Tenants) */}
        <section className="bg-[#0c1322] border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">شبکه مدارس و وضعیت لایسنس</h2>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="جستجوی مدرسه..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#090d16] border border-slate-700 text-slate-200 text-xs rounded-lg pl-3 pr-9 py-2 focus:border-indigo-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] font-medium text-slate-400 bg-slate-900/30">
                  <th className="py-3.5 px-5">نام مدرسه</th>
                  <th className="py-3.5 px-5">منطقه</th>
                  <th className="py-3.5 px-5">وضعیت</th>
                  <th className="py-3.5 px-5">ظرفیت صندلی</th>
                  <th className="py-3.5 px-5">ابزارهای مجاز</th>
                  <th className="py-3.5 px-5">آخرین اتصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-slate-200">{tenant.name}</td>
                    <td className="py-3.5 px-5 text-slate-400">{tenant.region}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold border ${
                        tenant.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        tenant.status === 'grace' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {tenant.status === 'online' ? 'آنلاین' : tenant.status === 'grace' ? 'دوره تنفس' : 'آفلاین'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-mono">{tenant.activeSeats} / {tenant.maxSeats}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-wrap gap-1">
                        {tenant.licensedTools.map((tool, idx) => (
                          <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px]">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">{tenant.lastPing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ۳. لاگ‌های امنیتی */}
        <section className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            آخرین رویدادهای ممیزی امنیتی (Audit Logs)
          </h2>
          <div className="space-y-2">
            {MOCK_LOGS.map(log => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-[#090d16] border border-slate-800/60 text-xs gap-2">
                <div className="flex items-center gap-3">
                  {log.type === 'SECURITY_VIOLATION' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                  {log.type === 'SYSTEM' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {log.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                  <span className="text-slate-200">{log.message}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
                  <span className="font-medium text-slate-400">{log.tenant}</span>
                  <span className="font-mono">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
