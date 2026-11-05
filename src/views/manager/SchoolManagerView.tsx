import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';

export const SchoolManagerView: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await apiClient.fetchData();
      if (data && data.classes) setClasses(data.classes);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) return <div className="flex items-center justify-center h-96 text-slate-400">در حال دریافت اطلاعات از دیتابیس...</div>;

  return (
    <div dir="rtl" className="w-full text-slate-100 p-2">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="border-b border-slate-800/80 pb-5">
          <h1 className="text-xl font-bold text-white">پنل مدیریت مدرسه</h1>
          <p className="text-xs text-slate-400 mt-1">متصل به دیتابیس ابری</p>
        </header>
        <section className="bg-[#0c1322] border border-slate-800/80 rounded-xl overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead><tr className="border-b border-slate-800/80 text-[11px] text-slate-400 bg-slate-900/30"><th className="py-3.5 px-5">نام کلاس</th><th className="py-3.5 px-5">معلم</th><th className="py-3.5 px-5">دانش‌آموزان</th></tr></thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {classes.map((cls: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/25">
                  <td className="py-3.5 px-5 text-slate-200">{cls.className}</td>
                  <td className="py-3.5 px-5 text-slate-400">{cls.teacherName}</td>
                  <td className="py-3.5 px-5 text-slate-300">{cls.studentCount || 0} نفر</td>
                </tr>
              ))}
              {classes.length === 0 && <tr><td colSpan={3} className="py-5 text-center text-slate-500">داده‌ای در شیت Classes یافت نشد.</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
