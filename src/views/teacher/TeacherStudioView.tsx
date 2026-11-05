import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sprout, Calculator, Play, CheckCircle2, FileEdit, X } from 'lucide-react';
import { UserRole } from '../../core/security/security-gatekeeper';
import { GardenWorkspace } from '../../components/tools/workspaces/GardenWorkspace';
import { MathWorkspace } from '../../components/tools/workspaces/MathWorkspace';

interface DeskData { id: string; name: string; groupName: string; growthPct: number; stageName: string; notes: string; }

const CLASS_DESKS: DeskData[] = [
  { id: 'desk-1', name: 'میز ۱', groupName: 'گروه سرو', growthPct: 75, stageName: 'نهال بارور', notes: 'تسلط کامل بر الگوریتم جمع و انتقال دهگان؛ مشارکت فعال در گروه.' },
  { id: 'desk-2', name: 'میز ۲', groupName: 'گروه سپیدار', growthPct: 45, stageName: 'ساقه سبز', notes: 'نیازمند تمرین بیشتر در تفریق با دست‌ورزی مکعب‌ها.' },
  { id: 'desk-3', name: 'میز ۳', groupName: 'گروه صنوبر', growthPct: 20, stageName: 'جوانه نورس', notes: 'خطای تفریق معکوس در لنگر ۳۹ مشاهده شد؛ نیاز به بازخورد توصیفی.' },
  { id: 'desk-4', name: 'میز ۴', groupName: 'گروه بلوط', growthPct: 85, stageName: 'شکوفایی کامل', notes: 'درک مفهومی عالی از ضرب آرایه‌ای؛ راهنمای دانش‌آموزان همیار.' },
  { id: 'desk-5', name: 'میز ۵', groupName: 'گروه افرا', growthPct: 60, stageName: 'ساقه سبز', notes: 'پیشرفت در تقریب اعداد و درک جدول ارزش مکانی.' },
  { id: 'desk-6', name: 'میز ۶', groupName: 'گروه زیتون', growthPct: 35, stageName: 'جوانه نورس', notes: 'تمرکز بهتر در کارگاه مشارکتی، الگوهای هندسی حل شد.' },
];

export const TeacherStudioView: React.FC<{ tenantId?: string; userRole?: UserRole }> = ({
  tenantId = 'sch-demo-aftab', userRole = 'TEACHER'
}) => {
  const [desks, setDesks] = useState<DeskData[]>(CLASS_DESKS);
  const [isProjectorMaskActive, setIsProjectorMaskActive] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<'garden' | 'math' | null>(null);
  const [selectedDeskForNote, setSelectedDeskForNote] = useState<DeskData | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsProjectorMaskActive(prev => !prev); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNote = (desk: DeskData) => { setSelectedDeskForNote(desk); setNoteDraft(desk.notes); };
  const handleSaveNote = () => {
    if (!selectedDeskForNote) return;
    setDesks(prev => prev.map(d => (d.id === selectedDeskForNote.id ? { ...d, notes: noteDraft } : d)));
    setSelectedDeskForNote(null);
  };

  if (activeWorkspace === 'garden') return <GardenWorkspace tenantId={tenantId} userRole={userRole} onClose={() => setActiveWorkspace(null)} />;
  if (activeWorkspace === 'math') return <MathWorkspace tenantId={tenantId} userRole={userRole} onClose={() => setActiveWorkspace(null)} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>استودیوی زنده کلاس</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-normal">پایه سوم دبستان</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">پایش وضعیت میزها، هدایت پداگوژیک و راه‌اندازی ابزارهای تثبیت لنگر روشا</p>
        </div>
        <button onClick={() => setIsProjectorMaskActive(!isProjectorMaskActive)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all border ${isProjectorMaskActive ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'}`}>
          {isProjectorMaskActive ? <><EyeOff className="h-4 w-4" /><span>پروجکتور: فعال (اطلاعات بالینی مخفی)</span></> : <><Eye className="h-4 w-4 text-slate-400" /><span>حالت عادی (Esc برای پروجکتور)</span></>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800/80 bg-[#0d1424] p-4 flex items-center justify-between hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><Sprout className="h-6 w-6" /></div>
            <div><h3 className="text-sm font-bold text-white">باغچه یادگیری جوانه</h3><p className="text-xs text-slate-400 mt-0.5">شبیه‌ساز رشد میزها و تعادل بیولوژیک</p></div>
          </div>
          <button onClick={() => setActiveWorkspace('garden')} className="flex items-center gap-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors"><Play className="h-3.5 w-3.5 fill-current" /><span>اجرای کارگاه</span></button>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#0d1424] p-4 flex items-center justify-between hover:border-indigo-500/30 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"><Calculator className="h-6 w-6" /></div>
            <div><h3 className="text-sm font-bold text-white">کارتریج بازی‌های ریاضی</h3><p className="text-xs text-slate-400 mt-0.5">۳۹ لنگر تشخیصی بدون اضطراب سنجش</p></div>
          </div>
          <button onClick={() => setActiveWorkspace('math')} className="flex items-center gap-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors"><Play className="h-3.5 w-3.5 fill-current" /><span>شروع چالش</span></button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-200">وضعیت استقرار ۶ میز کلاس</h2>
          <span className="text-xs text-slate-500">پایش بی‌درنگ Zero-PII</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {desks.map((desk) => (
            <div key={desk.id} className="rounded-2xl border border-slate-800/80 bg-[#0c1322] p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div><h4 className="text-sm font-bold text-white">{desk.name}</h4><span className="text-[11px] text-slate-400">{desk.groupName}</span></div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">{desk.stageName}</span>
                </div>
                <div className="my-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5"><span>رشد شاخص شناختی</span><span className="font-mono text-slate-300">{desk.growthPct}٪</span></div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${desk.growthPct}%` }} /></div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1"><span>یادداشت مشاهده آموزگار:</span></div>
                  <div className={`rounded-xl bg-slate-900/80 border border-slate-800/60 p-2.5 text-xs text-slate-300 leading-relaxed min-h-[52px] ${isProjectorMaskActive ? 'projector-masked' : ''}`}>{desk.notes}</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                <button onClick={() => handleOpenNote(desk)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"><FileEdit className="h-3.5 w-3.5" /><span>ثبت و ویرایش مشاهده</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDeskForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">ثبت مشاهده پداگوژیک ({selectedDeskForNote.name})</h3>
              <button onClick={() => setSelectedDeskForNote(null)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <textarea rows={4} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed" placeholder="مشاهده خود را بنویسید..." />
            <div className="mt-4 flex justify-end gap-2.5">
              <button onClick={() => setSelectedDeskForNote(null)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800">انصراف</button>
              <button onClick={handleSaveNote} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /><span>ذخیره</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
