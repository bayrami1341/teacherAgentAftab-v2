import React, { useState } from 'react';
import { ShieldCheck, Key, CheckCircle2, Lock, School } from 'lucide-react';
import { featureManager } from '../../core/licensing/feature-manager';
import { ToolRegistry } from '../../modules/tools/registry';
import { SignedLicenseLease } from '../../core/security/crypto-verifier';

const AVAILABLE_SCHOOLS = [
  { id: 'sch-demo-aftab', name: 'دبستان هوشمند نمونه آفتاب' },
  { id: 'sch-rosha-primary', name: 'مجتمع آموزشی روشا' },
  { id: 'sch-javane-central', name: 'دبستان پسرانه جوانه' }
];

export const OwnerLicensePanel: React.FC = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('sch-demo-aftab');
  const allTools = ToolRegistry.getAllMetadata();
  const currentLease = featureManager.getActiveLease();
  const [activeTools, setActiveTools] = useState<string[]>(currentLease?.payload.licensedTools || ['tool-garden', 'tool-math-39']);
  const [seatLimit, setSeatLimit] = useState<number>(currentLease?.payload.maxSeats || 120);
  const [notice, setNotice] = useState<string | null>(null);

  const toggleTool = (toolId: string) => {
    setActiveTools(prev => prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]);
  };

  const handleApplyLicense = async () => {
    const selectedSchool = AVAILABLE_SCHOOLS.find(s => s.id === selectedSchoolId);
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    const tenDays = 10 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const updatedLease: SignedLicenseLease = {
      payload: {
        tenantId: selectedSchoolId,
        schoolName: selectedSchool ? selectedSchool.name : 'مدرسه انتخابی',
        licensedTools: activeTools,
        maxSeats: Number(seatLimit),
        issuedAt: now, validUntil: now + oneYear, graceUntil: now + oneYear + tenDays,
        nonce: `lease-${now}-${Math.random().toString(36).substring(7)}`
      },
      signature: 'DEV_LOCAL_EPHEMERAL_SIGNATURE'
    };
    featureManager.setLeaseForTesting(updatedLease);
    setNotice(`لایسنس مدرسه «${selectedSchool?.name}» با ${activeTools.length} ابزار فعال به‌روزرسانی شد.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl max-w-4xl mx-auto my-6" dir="rtl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><Key className="w-6 h-6" /></div>
        <div>
          <h2 className="text-xl font-bold">پیشخوان مالک پلتفرم</h2>
          <p className="text-xs text-slate-400">مدیریت لایسنس‌های چندمستأجری و تخصیص ابزارها</p>
        </div>
      </div>
      {notice && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5" /><span>{notice}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5"><School className="w-4 h-4" /> انتخاب مدرسه:</label>
          <select value={selectedSchoolId} onChange={(e) => setSelectedSchoolId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500">
            {AVAILABLE_SCHOOLS.map(sch => <option key={sch.id} value={sch.id}>{sch.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">سقف صندلی‌های مجاز:</label>
          <input type="number" value={seatLimit} onChange={(e) => setSeatLimit(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500" />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400" /> تخصیص ماژول‌ها:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTools.map((tool) => {
            const isAssigned = activeTools.includes(tool.id);
            return (
              <div key={tool.id} onClick={() => toggleTool(tool.id)} className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3 ${isAssigned ? 'bg-indigo-950/30 border-indigo-500/50 text-white' : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <div className={`mt-0.5 p-1.5 rounded-lg ${isAssigned ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {isAssigned ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{tool.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-slate-800">
        <button onClick={handleApplyLicense} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> ثبت و صدور لایسنس
        </button>
      </div>
    </div>
  );
};
