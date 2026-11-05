import React, { useState } from 'react';
import { Sprout, Droplets, Sun, AlertTriangle, ArrowRight, RotateCcw, CheckCircle2, Shield } from 'lucide-react';
import { GardenRoshaTool } from '../../../modules/tools/garden/garden-tool';
import { SecurityContext } from '../../../core/security/security-gatekeeper';

interface TablePlant {
  id: string; name: string; growthStage: number; waterLevel: number; sunlightLevel: number;
  statusTitle: string; fatigueIndex: number; lastAction: string;
}
interface GardenWorkspaceProps {
  tenantId: string; userRole: 'SUPER_ADMIN' | 'SCHOOL_MANAGER' | 'TEACHER' | 'STUDENT'; onClose: () => void;
}

const INITIAL_TABLES: TablePlant[] = [
  { id: 'seat-1', name: 'میز ۱ (سرو)', growthStage: 75, waterLevel: 80, sunlightLevel: 90, statusTitle: 'نهال نوپا', fatigueIndex: 0, lastAction: 'تثبیت لنگر ۳۹' },
  { id: 'seat-2', name: 'میز ۲ (سپیدار)', growthStage: 40, waterLevel: 55, sunlightLevel: 70, statusTitle: 'ساقه سبز', fatigueIndex: 0, lastAction: 'حل تمرین دست‌ورزی' },
  { id: 'seat-3', name: 'میز ۳ (صنوبر)', growthStage: 20, waterLevel: 25, sunlightLevel: 40, statusTitle: 'جوانه نورس', fatigueIndex: 2, lastAction: 'توقف بر اثر خستگی شناختی' },
  { id: 'seat-4', name: 'میز ۴ (بلوط)', growthStage: 90, waterLevel: 85, sunlightLevel: 95, statusTitle: 'شکوفایی کامل', fatigueIndex: 0, lastAction: 'ارائه مدل همیارانه' },
  { id: 'seat-5', name: 'میز ۵ (افرا)', growthStage: 55, waterLevel: 60, sunlightLevel: 65, statusTitle: 'ساقه سبز', fatigueIndex: 1, lastAction: 'محاسبه جدول ارزش مکانی' },
  { id: 'seat-6', name: 'میز ۶ (زیتون)', growthStage: 30, waterLevel: 35, sunlightLevel: 50, statusTitle: 'جوانه نورس', fatigueIndex: 0, lastAction: 'ترسیم الگوهای هندسی' },
];

export const GardenWorkspace: React.FC<GardenWorkspaceProps> = ({ tenantId, userRole, onClose }) => {
  const [tables, setTables] = useState<TablePlant[]>(INITIAL_TABLES);
  const [activeTableId, setActiveTableId] = useState<string>('seat-1');
  const [logMessage, setLogMessage] = useState<string | null>(null);
  const gardenTool = new GardenRoshaTool();
  const activeTable = tables.find(t => t.id === activeTableId) || tables[0];

  const handleIntervention = async (type: 'WATER' | 'SUN' | 'REST') => {
    const context: SecurityContext = { userId: `teacher-${userRole.toLowerCase()}`, role: userRole, tenantId, seatCode: activeTable.name, sessionToken: 'active-session-token' };
    try {
      await gardenTool.initialize(context);
      const response = await gardenTool.executeChallenge(context, { anchorId: 39, attempts: type === 'REST' ? 4 : 1, durationSeconds: type === 'REST' ? 200 : 45, isCorrect: type !== 'REST' });
      if (response.success) {
        setTables(prev => prev.map(t => {
          if (t.id !== activeTableId) return t;
          if (type === 'WATER') return { ...t, waterLevel: Math.min(100, t.waterLevel + 20), growthStage: Math.min(100, t.growthStage + 10), lastAction: 'آبیاری شناختی با ثبت بازخورد توصیفی', statusTitle: t.growthStage >= 80 ? 'شکوفایی کامل' : 'نهال بالنده' };
          else if (type === 'SUN') return { ...t, sunlightLevel: Math.min(100, t.sunlightLevel + 25), growthStage: Math.min(100, t.growthStage + 5), lastAction: 'تابش انگیزه و تشویق مشارکتی' };
          else return { ...t, fatigueIndex: 0, waterLevel: Math.max(40, t.waterLevel), lastAction: 'تنفس بیولوژیک و رهایی از فرسودگی ذهنی' };
        }));
        setLogMessage(`مداخله پداگوژیک روی ${activeTable.name} با موفقیت ثبت و تله‌متری صندلی به‌روز شد.`);
        setTimeout(() => setLogMessage(null), 3500);
      }
    } catch (err: unknown) {
      setLogMessage(`خطای امنیتی گیت‌کیپر: ${err instanceof Error ? err.message : 'خطای نامشخص'}`);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-emerald-500/30 p-6 max-w-6xl mx-auto my-4 shadow-2xl" dir="rtl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"><ArrowRight className="w-5 h-5" /></button>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Sprout className="w-7 h-7" /></div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">باغچه پداگوژیک جوانه <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-normal">پوشش لنگر ۳۹ روشا</span></h2>
            <p className="text-xs text-slate-400">پایش تجسمی رشد گیاه میزها، ریتم یادگیری و مهار فرسودگی شناختی (Zero-PII)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400"><Shield className="w-4 h-4 text-emerald-400" /><span>محیط امن ایزوله</span></div>
      </div>
      {logMessage && <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span>{logMessage}</span></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tables.map(table => {
            const isSelected = table.id === activeTableId;
            const hasFatigue = table.fatigueIndex >= 2;
            return (
              <div key={table.id} onClick={() => setActiveTableId(table.id)} className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between relative overflow-hidden ${isSelected ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}>
                {hasFatigue && <div className="absolute top-2 left-2 p-1 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30" title="خستگی شناختی"><AlertTriangle className="w-3.5 h-3.5" /></div>}
                <div><div className="text-xs font-bold text-slate-300 mb-1">{table.name}</div><div className="text-[11px] text-emerald-400 font-medium mb-3">{table.statusTitle}</div></div>
                <div className="my-3 flex items-center justify-center"><div className={`p-4 rounded-full transition-transform ${hasFatigue ? 'bg-amber-500/10 text-amber-400' : isSelected ? 'bg-emerald-500/20 text-emerald-400 scale-110' : 'bg-slate-800 text-slate-400'}`}><Sprout className="w-10 h-10 transition-all" style={{ transform: `scale(${0.7 + (table.growthStage / 200)})` }} /></div></div>
                <div><div className="flex justify-between text-[10px] text-slate-400 mb-1"><span>میزان بلوغ</span><span>{table.growthStage}٪</span></div><div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${table.growthStage}%` }} /></div></div>
              </div>
            );
          })}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4"><h3 className="text-sm font-bold text-slate-200">میزکار مداخله: {activeTable.name}</h3><p className="text-xs text-slate-400 mt-1">آخرین وضعیت: {activeTable.lastAction}</p></div>
            {activeTable.fatigueIndex >= 2 && <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2"><AlertTriangle className="w-4 h-4 flex-shrink-0" /><span>شاخص فرسودگی بالا! نیاز به استراحت و تنفس ذهنی دارد.</span></div>}
            <div className="space-y-4 mb-6">
              <div><div className="flex justify-between text-xs text-slate-300 mb-1.5"><span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-400" /> رطوبت پداگوژیک:</span><span className="font-bold text-cyan-400">{activeTable.waterLevel}٪</span></div><div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${activeTable.waterLevel}%` }} /></div></div>
              <div><div className="flex justify-between text-xs text-slate-300 mb-1.5"><span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-400" /> تابش انگیزه:</span><span className="font-bold text-amber-400">{activeTable.sunlightLevel}٪</span></div><div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${activeTable.sunlightLevel}%` }} /></div></div>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <button onClick={() => handleIntervention('WATER')} className="w-full bg-cyan-600/90 hover:bg-cyan-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/20"><Droplets className="w-4 h-4" /> آبیاری شناختی</button>
            <button onClick={() => handleIntervention('SUN')} className="w-full bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"><Sun className="w-4 h-4" /> تابش انگیزه</button>
            <button onClick={() => handleIntervention('REST')} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2"><RotateCcw className="w-3.5 h-3.5" /> تنفس زیستی و رفع خستگی</button>
          </div>
        </div>
      </div>
    </div>
  );
};
