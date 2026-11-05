import React, { useState, useRef } from 'react';

export interface ClassRoster {
  id: string;
  className: string;
  grade: string;
  teacherName: string;
  studentCount: number;
  lastSidaSync: string;
  status: 'synced' | 'pending' | 'needs_update';
}

export interface ContractInfo {
  contractNumber: string;
  planTitle: string;
  expirationDate: string;
  status: 'active' | 'grace_period' | 'expired';
  gracePeriodTotalDays: number;
  gracePeriodRemainingDays: number;
  invoiceAmount: string;
}

const INITIAL_CLASSES: ClassRoster[] = [
  { id: 'cls-101', className: 'چهارم - الف (شهید بهشتی)', grade: 'پایه چهارم', teacherName: 'محمدرضا کریمی', studentCount: 28, lastSidaSync: '۱۴۰۵/۰۸/۱۲', status: 'synced' },
  { id: 'cls-102', className: 'چهارم - ب (ابن سینا)', grade: 'پایه چهارم', teacherName: 'سارا احمدی', studentCount: 26, lastSidaSync: '۱۴۰۵/۰۸/۱۰', status: 'synced' },
  { id: 'cls-201', className: 'پنجم - الف (خوارزمی)', grade: 'پایه پنجم', teacherName: 'علی‌اکبر حسینی', studentCount: 30, lastSidaSync: '۱۴۰۵/۰۷/۲۹', status: 'needs_update' },
  { id: 'cls-301', className: 'ششم - الف (فارابی)', grade: 'پایه ششم', teacherName: 'مریم رضایی', studentCount: 0, lastSidaSync: 'ثبت نشده', status: 'pending' },
];

const INITIAL_CONTRACT: ContractInfo = {
  contractNumber: 'CNT-1405-8842',
  planTitle: 'اشتراک سازمانی مدرسه (پکیج کامل)',
  expirationDate: '۱۴۰۵/۰۸/۱۱',
  status: 'grace_period',
  gracePeriodTotalDays: 10,
  gracePeriodRemainingDays: 7,
  invoiceAmount: '۱۲,۵۰۰,۰۰۰ تومان',
};

export const SchoolManagerView: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoster[]>(INITIAL_CLASSES);
  const [contract] = useState<ContractInfo>(INITIAL_CONTRACT);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [targetClassId, setTargetClassId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalClasses = classes.length;
  const totalTeachers = new Set(classes.map((c) => c.teacherName)).size;
  const totalStudents = classes.reduce((sum, item) => sum + item.studentCount, 0);
  const graceProgressPercent = Math.max(0, Math.min(100, Math.round((contract.gracePeriodRemainingDays / contract.gracePeriodTotalDays) * 100)));

  const handleTriggerSidaUpload = (classId: string | null = null) => {
    setTargetClassId(classId);
    setUploadMessage(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadMessage(null);

    setTimeout(() => {
      if (targetClassId) {
        setClasses((prev) => prev.map((cls) => cls.id === targetClassId ? { ...cls, studentCount: cls.studentCount === 0 ? 27 : cls.studentCount, lastSidaSync: '۱۴۰۵/۰۸/۱۴ (هم‌اکنون)', status: 'synced' } : cls));
        setUploadMessage(`فایل «${file.name}» با موفقیت برای کلاس انتخاب‌شده پردازش شد.`);
      } else {
        setClasses((prev) => prev.map((cls) => ({ ...cls, studentCount: cls.studentCount === 0 ? 25 : cls.studentCount, lastSidaSync: '۱۴۰۵/۰۸/۱۴ (هم‌اکنون)', status: 'synced' })));
        setUploadMessage(`فایل جامع سیدا «${file.name}» با موفقیت پردازش شد.`);
      }
      setIsUploading(false);
      setTargetClassId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  return (
    <div dir="rtl" className="w-full text-slate-100 p-2 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />

      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">پنل مدیریت مدرسه</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">نمای کلی آمار، مدیریت روسترینگ کلاس‌ها (سیدا) و وضعیت قرارداد سازمانی</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c1322] border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> سال تحصیلی ۱۴۰۵-۱۴۰۶
            </span>
          </div>
        </header>

        <section aria-label="نمای کلی آمار مدرسه" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between hover:border-slate-700/80 transition-colors">
            <div>
              <span className="text-xs font-medium text-slate-400">تعداد کلاس‌ها</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{totalClasses}</span>
                <span className="text-xs text-slate-400">({totalStudents} دانش‌آموز)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">{classes.filter((c) => c.status === 'synced').length} کلاس همگام‌سازی شده</p>
            </div>
          </div>
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between hover:border-slate-700/80 transition-colors">
            <div>
              <span className="text-xs font-medium text-slate-400">معلمان</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{totalTeachers}</span>
                <span className="text-xs text-slate-400">معلم فعال</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">دسترسی کامل به پنل پایش</p>
            </div>
          </div>
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5 flex items-start justify-between hover:border-slate-700/80 transition-colors">
            <div>
              <span className="text-xs font-medium text-slate-400">وضعیت اشتراک</span>
              <div className="mt-2 flex items-center gap-2">
                {contract.status === 'active' && <span className="text-lg font-bold text-emerald-400">فعال</span>}
                {contract.status === 'grace_period' && <span className="text-lg font-bold text-amber-400">دوره تنفس</span>}
                {contract.status === 'expired' && <span className="text-lg font-bold text-rose-400">منقضی شده</span>}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">انقضا: {contract.expirationDate} ({contract.gracePeriodRemainingDays} روز باقی‌مانده)</p>
            </div>
          </div>
        </section>

        <section aria-label="مدیریت کلاس‌ها و روسترینگ" className="bg-[#0c1322] border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">مدیریت کلاس‌ها و روسترینگ (سیدا)</h2>
            </div>
            <button type="button" onClick={() => handleTriggerSidaUpload(null)} disabled={isUploading} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors cursor-pointer shrink-0">
              <span>{isUploading ? 'در حال پردازش...' : 'آپلود اکسل سیدا'}</span>
            </button>
          </div>

          {uploadMessage && (
            <div className="mx-5 mt-4 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
              <span>{uploadMessage}</span>
              <button type="button" onClick={() => setUploadMessage(null)} className="text-emerald-400 hover:text-emerald-200 text-xs font-bold">بستن</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] font-medium text-slate-400 bg-slate-900/30">
                  <th className="py-3.5 px-5">نام کلاس</th>
                  <th className="py-3.5 px-5">معلم</th>
                  <th className="py-3.5 px-5">تعداد دانش‌آموز</th>
                  <th className="py-3.5 px-5">آخرین بروزرسانی</th>
                  <th className="py-3.5 px-5 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-800/25 transition-colors group">
                    <td className="py-3.5 px-5 font-medium text-slate-200">
                      <div>{cls.className}</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">{cls.grade}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300">{cls.teacherName}</td>
                    <td className="py-3.5 px-5"><span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-200 font-medium">{cls.studentCount} نفر</span></td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${cls.status === 'synced' ? 'bg-emerald-400' : cls.status === 'needs_update' ? 'bg-amber-400' : 'bg-slate-500'}`} />
                        <span className="text-slate-400">{cls.lastSidaSync}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-left">
                      <button type="button" onClick={() => handleTriggerSidaUpload(cls.id)} disabled={isUploading} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors cursor-pointer">
                        <span>بروزرسانی اکسل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-label="وضعیت قرارداد و مالی" className="bg-[#0c1322] border border-slate-800/80 rounded-xl p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold text-white">وضعیت قرارداد و امور مالی</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">در دوره تنفس</span>
              </div>
              <p className="text-xs text-slate-400">شماره قرارداد: <span className="text-slate-200 font-mono">{contract.contractNumber}</span></p>
            </div>
            <div className="w-full lg:w-96 bg-[#090d16] border border-amber-500/25 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-amber-300 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> دوره تنفس</span>
                <span className="font-bold text-white">{contract.gracePeriodRemainingDays} از {contract.gracePeriodTotalDays} روز</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-l from-amber-400 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${graceProgressPercent}%` }} /></div>
              <div className="flex items-center justify-between pt-1">
                <button type="button" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer shrink-0">پرداخت و تمدید</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default SchoolManagerView;
