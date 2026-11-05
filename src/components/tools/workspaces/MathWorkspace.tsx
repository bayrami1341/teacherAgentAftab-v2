import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle, AlertTriangle, ShieldCheck, Award } from 'lucide-react';
import { MathCartridgeTool } from '../../../modules/tools/math/math-cartridge-tool';
import { SecurityContext } from '../../../core/security/security-gatekeeper';

interface MathQuestion {
  anchorId: number; grade: number; title: string; expression: string;
  options: { text: string; isCorrect: boolean; diagnosticFeedback: string }[];
}
interface MathWorkspaceProps {
  tenantId: string; userRole: 'SUPER_ADMIN' | 'SCHOOL_MANAGER' | 'TEACHER' | 'STUDENT'; onClose: () => void;
}

const MATH_CHALLENGES: MathQuestion[] = [
  { anchorId: 2, grade: 2, title: 'تفریق با انتقال (لنگر ۲ روشا)', expression: '۵۲ - ۲۸ = ؟', options: [ { text: '۲۴', isCorrect: true, diagnosticFeedback: 'پاسخ صحیح است! دهگان به درستی به یکان انتقال یافت.' }, { text: '۳۶', isCorrect: false, diagnosticFeedback: 'خطای تفریق معکوس: رقم کوچک‌تر از بزرگ‌تر کم شده است (۸ منهای ۲).' }, { text: '۳۴', isCorrect: false, diagnosticFeedback: 'خطای قرض‌گیری: دهگان پس از انتقال به یکان کسر نشده است.' }, { text: '۲۶', isCorrect: false, diagnosticFeedback: 'خطای عدم تطابق ستون ارزش مکانی.' } ] },
  { anchorId: 14, grade: 3, title: 'مفهوم ضرب آرایه‌ای (لنگر ۱۴ روشا)', expression: '۴ ردیف ۳ تایی گل، مجموعاً چند شاخه می‌شود؟', options: [ { text: '۱۲', isCorrect: true, diagnosticFeedback: 'بسیار عالی! ۴ ضرب‌در ۳ برابر با ۱۲ است.' }, { text: '۷', isCorrect: false, diagnosticFeedback: 'خطای جمع به جای ضرب: تعداد ردیف‌ها با تعداد اعضا جمع شده است.' }, { text: '۱۶', isCorrect: false, diagnosticFeedback: 'خطای شمارش تکرار آرایه.' }, { text: '۹', isCorrect: false, diagnosticFeedback: 'خطای عدم درک ضرب متقارن.' } ] },
  { anchorId: 39, grade: 5, title: 'جمع کسرهای با مخرج نابرابر (لنگر ۳۹ روشا)', expression: '۱/۳ + ۱/۶ = ؟', options: [ { text: '۳/۶ (یا ۱/۲)', isCorrect: true, diagnosticFeedback: 'آفرین! ابتدا مخرج‌مشترک‌گیری انجام شد: ۲/۶ + ۱/۶ = ۳/۶.' }, { text: '۲/۹', isCorrect: false, diagnosticFeedback: 'خطای شایع کسرها: صورت با صورت و مخرج با مخرج جمع شده است.' }, { text: '۲/۶', isCorrect: false, diagnosticFeedback: 'صورت کسر اول در عدد ضرب‌کننده مخرج ضرب نشده است.' }, { text: '۱/۹', isCorrect: false, diagnosticFeedback: 'خطای کامل عملیات روی کسرها.' } ] }
];

export const MathWorkspace: React.FC<MathWorkspaceProps> = ({ tenantId, userRole, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [score, setScore] = useState<number>(0);
  const [fatigueWarning, setFatigueWarning] = useState<boolean>(false);
  const mathTool = new MathCartridgeTool();
  const challenge = MATH_CHALLENGES[currentIdx];

  useEffect(() => { setStartTime(Date.now()); setSelectedOption(null); setHasSubmitted(false); }, [currentIdx]);

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = challenge.options[selectedOption].isCorrect;
    if (isCorrect) setScore(prev => prev + 25);
    if (timeSpent > 180 || newAttempts > 3) setFatigueWarning(true);

    const context: SecurityContext = { userId: `stu-${userRole.toLowerCase()}`, role: userRole, tenantId, seatCode: 'میز ۳', sessionToken: 'seat-session-token' };
    try {
      await mathTool.initialize(context);
      await mathTool.executeChallenge(context, { anchorNumber: challenge.anchorId, answerIndex: selectedOption, timeSpentSec: timeSpent });
    } catch (e) { console.error('تله‌متری ثبت نشد:', e); }
  };

  const handleNext = () => { if (currentIdx < MATH_CHALLENGES.length - 1) setCurrentIdx(prev => prev + 1); else setCurrentIdx(0); };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-indigo-500/30 p-6 max-w-4xl mx-auto my-4 shadow-2xl" dir="rtl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"><ArrowRight className="w-5 h-5" /></button>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><Calculator className="w-7 h-7" /></div>
          <div><h2 className="text-xl font-bold">کارتریج بازی‌های ریاضی روشا</h2><p className="text-xs text-slate-400">طراحی‌شده بر پایه تحلیل سوءفهم‌های تشخیصی کتاب درسی</p></div>
        </div>
        <div className="flex items-center gap-4"><div className="flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-indigo-300 text-xs font-semibold"><Award className="w-4 h-4 text-amber-400" /><span>امتیاز: {score}</span></div></div>
      </div>
      {fatigueWarning && <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2"><AlertTriangle className="w-4 h-4 flex-shrink-0" /><span>سیگنال خستگی: زمان حل طولانی شد. کمی استراحت کنید.</span></div>}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3"><span className="font-semibold text-indigo-400">{challenge.title}</span><span>پایه {challenge.grade}</span></div>
        <div className="text-2xl font-black text-center py-6 text-white tracking-wide font-mono">{challenge.expression}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {challenge.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-indigo-500';
            if (isSelected) btnStyle = 'bg-indigo-900/40 border-indigo-500 text-white ring-1 ring-indigo-500';
            if (hasSubmitted) { if (opt.isCorrect) btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300'; else if (isSelected && !opt.isCorrect) btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-300'; }
            return (
              <button key={i} disabled={hasSubmitted} onClick={() => setSelectedOption(i)} className={`p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}>
                <span>گزینه {i + 1}: {opt.text}</span>
                {hasSubmitted && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {hasSubmitted && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
              </button>
            );
          })}
        </div>
        {hasSubmitted && selectedOption !== null && (
          <div className={`mt-5 p-4 rounded-xl text-xs border leading-relaxed ${challenge.options[selectedOption].isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            <div className="font-bold mb-1 flex items-center gap-1.5"><HelpCircle className="w-4 h-4" /> تحلیل آموزشی:</div>
            {challenge.options[selectedOption].diagnosticFeedback}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-400" /> تله‌متری فعال است</span>
        <div className="flex gap-3">
          {!hasSubmitted ? <button onClick={handleSubmit} disabled={selectedOption === null} className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${selectedOption !== null ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>ثبت پاسخ</button>
          : <button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"><span>چالش بعدی</span><RotateCcw className="w-3.5 h-3.5" /></button>}
        </div>
      </div>
    </div>
  );
};
