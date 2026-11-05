import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Activity, AlertTriangle, Search } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

export const SuperAdminView: React.FC = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await apiClient.fetchData();
      if (data && data.schools) setTenants(data.schools);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredTenants = tenants.filter((t: any) => 
    (t.name && t.name.includes(searchQuery)) || (t.region && t.region.includes(searchQuery))
  );

  if (isLoading) return <div className="flex items-center justify-center h-96 text-slate-400">در حال دریافت اطلاعات از دیتابیس...</div>;

  return (
    <div className="w-full text-slate-100 p-2 font-sans antialiased" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-400" /> کنسول مالک پلتفرم
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">پایش سراسری مدارس (متصل به Google Sheets)</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0c1322] border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> متصل به دیتابیس
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between">
            <div><span className="text-xs text-slate-400">کل مدارس</span><div className="mt-2 text-2xl font-bold text-white">{tenants.length}</div></div>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Building2 className="w-5 h-5" /></div>
          </div>
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between">
            <div><span className="text-xs text-slate-400">مجموع صندلی‌ها</span><div className="mt-2 text-2xl font-bold text-white">{tenants.reduce((sum, t) => sum + (Number(t.activeSeats) || 0), 0)}</div></div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Activity className="w-5 h-5" /></div>
          </div>
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between">
            <div><span className="text-xs text-slate-400">هشدارهای امنیتی</span><div className="mt-2 text-2xl font-bold text-amber-400">۰</div></div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </section>

        <section className="bg-[#0c1322] border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/80 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white">شبکه مدارس (داده‌های واقعی)</h2>
            <input type="text" placeholder="جستجو..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#090d16] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none w-64" />
          </div>
          <table className="w-full text-right border-collapse">
            <thead><tr className="border-b border-slate-800/80 text-[11px] text-slate-400 bg-slate-900/30"><th className="py-3.5 px-5">نام مدرسه</th><th className="py-3.5 px-5">منطقه</th><th className="py-3.5 px-5">وضعیت</th><th className="py-3.5 px-5">ظرفیت</th></tr></thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTenants.map((tenant: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/25">
                  <td className="py-3.5 px-5 text-slate-200">{tenant.name}</td>
                  <td className="py-3.5 px-5 text-slate-400">{tenant.region}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-semibold ${tenant.status === 'online' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {tenant.status === 'online' ? 'آنلاین' : 'آفلاین'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300 font-mono">{tenant.activeSeats} / {tenant.maxSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
