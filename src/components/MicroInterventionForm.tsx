import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, Eye, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { auditLogger } from '../lib/audit/audit-logger';
import { sound } from '../utils/audio';

interface MicroInterventionFormProps {
  deskCode?: string;
  childName?: string;
  onSave?: () => void;
}

export const MicroInterventionForm: React.FC<MicroInterventionFormProps> = ({
  deskCode = 'DESK-03',
  childName = 'علی',
  onSave,
}) => {
  const [interventionNote, setInterventionNote] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionNote.trim()) return;

    // FERPA / Caliper Clinical Audit logging
    auditLogger.logClinicalAccess('teacher_class_3', deskCode, 'WRITE', {
      childName,
      interventionNote: interventionNote.trim(),
      privacyProtected: true,
    });

    sound.playJoyfulChime();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    if (onSave) onSave();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-slate-100 space-y-4 dir-rtl relative overflow-hidden">
      {/* Projector Safety Watermark */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">ثبت مداخلات بالینی و یادداشت معلم (فرمت امن)</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLocked(!isLocked)}
            className={`px-3 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              isLocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {isLocked ? 'حالت قفل پروجکتور' : 'قفل عمومی'}
          </button>
        </div>
      </div>

      {isLocked ? (
        <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
          <Lock className="w-8 h-8 text-amber-500/60" />
          <p>جهت حفظ حریم خصوصی دانش‌آموز روی پروجکتور کلاس، یادداشت‌ها پنهان شده‌اند.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>کد صندلی: <strong className="text-emerald-400 font-mono">{deskCode}</strong> ({childName})</span>
            <span className="text-[10px] text-slate-500">انطباق کامل با FERPA & Caliper v1.2</span>
          </div>

          <textarea
            value={interventionNote}
            onChange={(e) => setInterventionNote(e.target.value)}
            rows={3}
            placeholder="مداخله پداگوژیک، ملاحظات رفتاری یا تذکر آموزشی..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

          <div className="flex items-center justify-between pt-1">
            {saved ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                در لاگ بالینی FERPA ثبت شد.
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
            >
              <Save className="w-4 h-4" />
              ثبت محرمانه مداخله
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
