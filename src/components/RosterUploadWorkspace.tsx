import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle2, ShieldCheck, Printer, Users, Key, AlertCircle } from 'lucide-react';
import { dataBridge, CommittedRosterClass } from '../lib/services/data-bridge';
import { sound } from '../utils/audio';

interface RosterUploadWorkspaceProps {
  schoolId?: string;
}

export const RosterUploadWorkspace: React.FC<RosterUploadWorkspaceProps> = ({ schoolId = 'sch-aftab-demo' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [className, setClassName] = useState('سوم الف');
  const [grade, setGrade] = useState(3);
  const [parsedStudents, setParsedStudents] = useState<Array<{ name: string; nationalCode: string; parentPhone: string }>>([
    { name: 'علی علوی', nationalCode: '۰۰۱۲۳۴۵۶۷۸', parentPhone: '۰۹۱۲۱۱۱۲۲۳۳' },
    { name: 'مریم محمدی', nationalCode: '۰۰۸۷۶۵۴۳۲۱', parentPhone: '۰۹۱۲۴۴۴۵۵۶۶' },
    { name: 'رضا حسینی', nationalCode: '۰۰۳۳۴۴۵۵۶۶', parentPhone: '۰۹۱۲۷۷۷۸۸۹۹' },
    { name: 'سارا رضایی', nationalCode: '۰۰۹۹۸۸۷۷۶۶', parentPhone: '۰۹۱۲۰۰۰۱۱۲۲' },
  ]);
  const [committedClass, setCommittedClass] = useState<CommittedRosterClass | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSimulateDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    sound.playJoyfulChime();
    showToast('فایل اکسل با موفقیت تحلیل شد (۴ دانش‌آموز شناسایی شدند).');
  };

  const handleCommitRoster = () => {
    if (parsedStudents.length === 0) return;

    const res = dataBridge.commitRoster(schoolId, {
      className,
      grade,
      students: parsedStudents,
    });

    sound.playJoyfulChime();
    setCommittedClass(res);
    showToast(`کلاس «${className}» با ${res.students.length} دانش‌آموز ثبت و کارت‌های پین صادر گردید.`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 dir-rtl text-slate-100">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-medium text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              درگاه هوشمند روسترینگ و اکسل مدرسه
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              استخراج خودکار لیست دانش‌آموزان، تخصیص کد صندلی و صدور کارت‌های PIN ورود آفلاین
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const sampleCsv = "نام دانش آموز,کد ملی,شماره ولی\nعلی علوی,0012345678,09121112233\nمریم محمدی,0087654321,09124445566";
              const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = "نمونه_فایل_روستر_مدرسه.csv";
              a.click();
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-medium transition-colors flex items-center gap-2 border border-slate-700"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            دانلود قالب نمونه CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Drag & Drop Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              آپلود فایل اکسل یا CSV روستر
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">نام کلاس</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">پایه تحصیلی</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>پایه اول دبستان</option>
                  <option value={2}>پایه دوم دبستان</option>
                  <option value={3}>پایه سوم دبستان</option>
                  <option value={4}>پایه چهارم دبستان</option>
                  <option value={5}>پایه پنجم دبستان</option>
                  <option value={6}>پایه ششم دبستان</option>
                </select>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleSimulateDragDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">فایل اکسل (.xlsx / .csv) را اینجا رها کنید</p>
                <p className="text-[10px] text-slate-400 mt-1">یا کلیک کنید برای انتخاب از رایانه</p>
              </div>
            </div>

            <button
              onClick={handleCommitRoster}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              تایید و ثبت نهایی کلاس در دیتابیس
            </button>
          </div>
        </div>

        {/* Right Column: Parsed Roster & PIN Cards */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              لیست استخراج‌شده و پیش‌نمایش کارت‌های PIN ({parsedStudents.length} نفر)
            </h2>
          </div>

          {/* Student Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-800/40">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="p-3">نام و خانوادگی</th>
                  <th className="p-3">کد ملی</th>
                  <th className="p-3">شماره ولی</th>
                  <th className="p-3 text-center">کد PIN اختصاصی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {parsedStudents.map((st, i) => (
                  <tr key={i} className="hover:bg-slate-800/60">
                    <td className="p-3 font-medium">{st.name}</td>
                    <td className="p-3 font-mono text-slate-400">{st.nationalCode}</td>
                    <td className="p-3 font-mono text-slate-400">{st.parentPhone}</td>
                    <td className="p-3 text-center font-mono font-bold text-amber-400">
                      {committedClass?.students[i]?.pinCode || `PIN-${1000 + i * 37}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {committedClass && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Printer className="w-4 h-4" />
                  کارت‌های ورود دانش‌آموزی آماده چاپ است
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold"
                >
                  چاپ کارت‌ها
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {committedClass.students.map((st) => (
                  <div key={st.id} className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-1 dir-rtl">
                    <p className="font-bold text-white">{st.name}</p>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>صندلی: {st.deskCode}</span>
                      <span className="font-mono text-amber-400 font-bold">PIN: {st.pinCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
