import React, { useState } from 'react';
import { AppRole } from '../types';
import {
  KeyRound,
  ShieldCheck,
  School,
  Sparkles,
  User,
  X,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: AppRole;
  onSelectRole: (role: AppRole, studentId?: string) => void;
  onExecuteCheatCode: (code: string) => { success: boolean; message: string };
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onExecuteCheatCode,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'passcode' | 'cheats'>('quick');
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const showFeedback = (text: string, isError = false) => {
    setFeedback({ text, isError });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toLowerCase();

    // 1. Check cheat codes first
    const cheatResult = onExecuteCheatCode(clean);
    if (cheatResult.success) {
      sound.playJoyfulChime();
      showFeedback(`⚡ کد مخفی اعمال شد: ${cheatResult.message}`);
      setInputCode('');
      return;
    }

    // 2. Check role passwords
    if (clean === 'owner1403' || clean === 'admin99' || clean === 'owner') {
      sound.playJoyfulChime();
      onSelectRole('owner');
      onClose();
      return;
    }

    if (clean === 'school1403' || clean === 'modir' || clean === 'school') {
      sound.playJoyfulChime();
      onSelectRole('school');
      onClose();
      return;
    }

    if (clean === 'teacher1403' || clean === 'moalem' || clean === 'teacher') {
      sound.playJoyfulChime();
      onSelectRole('teacher');
      onClose();
      return;
    }

    if (clean === 'ali101' || clean === 'ali') {
      sound.playWakeUpMelody();
      onSelectRole('student', 'p-15');
      onClose();
      return;
    }

    if (clean === 'sara102' || clean === 'sara') {
      sound.playHabitSuccess();
      onSelectRole('student', 'p-4');
      onClose();
      return;
    }

    if (clean === 'amir103' || clean === 'amir') {
      sound.playJoyfulChime();
      onSelectRole('student', 'p-1');
      onClose();
      return;
    }

    sound.playPlantClick(280);
    showFeedback('رمز عبور یا کد نامعتبر است. از کدهای تستی زیر استفاده کنید.', true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in font-['Vazirmatn']"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FAF7F0] rounded-3xl border border-[#D5CABC] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-[#E8DFC9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#7BA05B]/15 text-[#465E32] flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#7BA05B]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2D2D2D]">
                ورود به نقش‌ها و کدهای تستی سامانه‌ی «جوانه»
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                تغییر سریع دسترسی برای ارزیابی عملکرد سیستم در هر لایه
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A7A7A] hover:text-[#2D2D2D] rounded-xl hover:bg-[#F2ECE1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E8DFC9] bg-[#F2ECE1] p-1 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'quick'
                ? 'bg-white text-[#2D2D2D] shadow-2xs'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            ⚡ ورود سریع تستی (یک کلیک)
          </button>
          <button
            onClick={() => setActiveTab('passcode')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'passcode'
                ? 'bg-white text-[#2D2D2D] shadow-2xs'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            🔐 ورود با پسورد / کدهای مخفی
          </button>
          <button
            onClick={() => setActiveTab('cheats')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'cheats'
                ? 'bg-white text-[#2D2D2D] shadow-2xs'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            🛠️ جعبه‌ابزار کدهای مخفی
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mx-5 mt-3 p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
              feedback.isError
                ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]'
                : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
            }`}
          >
            {feedback.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Tab 1: Quick 1-Click Role Login */}
        {activeTab === 'quick' && (
          <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
            <span className="text-xs font-bold text-[#7A7A7A] block mb-1">
              انتخاب نقش برای تست:
            </span>

            {/* 1. Platform Owner */}
            <button
              onClick={() => {
                sound.playJoyfulChime();
                onSelectRole('owner');
                onClose();
              }}
              className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between group ${
                currentRole === 'owner'
                  ? 'bg-white border-[#7BA05B] shadow-xs ring-2 ring-[#7BA05B]/20'
                  : 'bg-white hover:bg-[#FAF8F2] border-[#E0D5C3]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D2D2D] text-white flex items-center justify-center text-lg">
                  👑
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2D2D2D] flex items-center gap-2">
                    <span>مالک پلتفرم (مدیریت کل)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">
                      لایه‌ی ۱
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7A7A] mt-0.5">
                    مدیریت کل مدارس، سهمیه‌ها و صدور لایسنس • رمز: <code>owner1403</code>
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F2EDE2] group-hover:bg-[#7BA05B] group-hover:text-white transition-colors">
                ورود
              </span>
            </button>

            {/* 2. School Admin */}
            <button
              onClick={() => {
                sound.playJoyfulChime();
                onSelectRole('school');
                onClose();
              }}
              className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between group ${
                currentRole === 'school'
                  ? 'bg-white border-[#7BA05B] shadow-xs ring-2 ring-[#7BA05B]/20'
                  : 'bg-white hover:bg-[#FAF8F2] border-[#E0D5C3]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7BA05B] text-white flex items-center justify-center text-lg">
                  🏫
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2D2D2D] flex items-center gap-2">
                    <span>مدیر مدرسه (دبستان شهید بهشتی)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EBF3E4] text-[#465E32]">
                      لایه‌ی ۲
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7A7A] mt-0.5">
                    لیست کلاس‌ها، ساخت معلم، صدور QR سهمیه • رمز: <code>school1403</code>
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F2EDE2] group-hover:bg-[#7BA05B] group-hover:text-white transition-colors">
                ورود
              </span>
            </button>

            {/* 3. Teacher */}
            <button
              onClick={() => {
                sound.playJoyfulChime();
                onSelectRole('teacher');
                onClose();
              }}
              className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between group ${
                currentRole === 'teacher'
                  ? 'bg-white border-[#7BA05B] shadow-xs ring-2 ring-[#7BA05B]/20'
                  : 'bg-white hover:bg-[#FAF8F2] border-[#E0D5C3]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A5CC85] text-[#2D2D2D] flex items-center justify-center text-lg">
                  👩‍🏫
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2D2D2D] flex items-center gap-2">
                    <span>معلم کلاس (سوم الف)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF8F2] text-[#55783A] border border-[#C8D9B5]">
                      لایه‌ی ۳
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7A7A] mt-0.5">
                    باغچه‌ی زنده، رادار ۱۰ ثانیه‌ای، پناهگاه بحران، حالت تخته‌ای • رمز: <code>teacher1403</code>
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F2EDE2] group-hover:bg-[#7BA05B] group-hover:text-white transition-colors">
                ورود
              </span>
            </button>

            {/* 4. Student Profiles */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#7A7A7A] block mb-2">
                ورود مستقیم به عنوان دانش‌آموز (اتاق گیاه):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    sound.playWakeUpMelody();
                    onSelectRole('student', 'p-15');
                    onClose();
                  }}
                  className="p-2.5 bg-white hover:bg-[#FAF8F2] border border-[#E0D5C3] rounded-xl text-right transition-all text-xs"
                >
                  <div className="font-bold text-[#2D2D2D]">علی (جوانه)</div>
                  <div className="text-[11px] text-[#E8A87C] font-semibold mt-0.5">
                    دل‌تنگ (۲ روز غیبت)
                  </div>
                  <span className="text-[10px] text-[#7A7A7A] block mt-1">کد: ali101</span>
                </button>

                <button
                  onClick={() => {
                    sound.playHabitSuccess();
                    onSelectRole('student', 'p-4');
                    onClose();
                  }}
                  className="p-2.5 bg-white hover:bg-[#FAF8F2] border border-[#E0D5C3] rounded-xl text-right transition-all text-xs"
                >
                  <div className="font-bold text-[#2D2D2D]">سارا (آفتاب‌گردان)</div>
                  <div className="text-[11px] text-[#7BA05B] font-semibold mt-0.5">
                    شاداب (مرحله ۴)
                  </div>
                  <span className="text-[10px] text-[#7A7A7A] block mt-1">کد: sara102</span>
                </button>

                <button
                  onClick={() => {
                    sound.playJoyfulChime();
                    onSelectRole('student', 'p-1');
                    onClose();
                  }}
                  className="p-2.5 bg-white hover:bg-[#FAF8F2] border border-[#E0D5C3] rounded-xl text-right transition-all text-xs"
                >
                  <div className="font-bold text-[#2D2D2D]">امیرعلی (نارنجک)</div>
                  <div className="text-[11px] text-[#D4A017] font-semibold mt-0.5">
                    آماده بذر طلایی
                  </div>
                  <span className="text-[10px] text-[#7A7A7A] block mt-1">کد: amir103</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manual Passcode Entry */}
        {activeTab === 'passcode' && (
          <div className="p-5 space-y-4">
            <form onSubmit={handleManualCodeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  کد دسترسی یا رمز عبور را وارد کنید:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="مثلاً: owner1403 یا ali101 یا clean"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-sm focus:outline-none focus:border-[#7BA05B]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute left-2 top-2 px-3 py-1 bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    تایید
                  </button>
                </div>
              </div>
            </form>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E8DFC9] text-xs space-y-2">
              <span className="font-bold text-[#2D2D2D] block">جدول کدهای تستی پیش‌فرض:</span>
              <ul className="space-y-1 text-[#555]">
                <li>• <strong>مالک پلتفرم:</strong> <code>owner1403</code> یا <code>admin99</code></li>
                <li>• <strong>مدیر مدرسه:</strong> <code>school1403</code> یا <code>modir</code></li>
                <li>• <strong>معلم کلاس:</strong> <code>teacher1403</code> یا <code>moalem</code></li>
                <li>• <strong>دانش‌آموز علی:</strong> <code>ali101</code></li>
                <li>• <strong>دانش‌آموز سارا:</strong> <code>sara102</code></li>
                <li>• <strong>دانش‌آموز امیرعلی:</strong> <code>amir103</code></li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Secret Cheats */}
        {activeTab === 'cheats' && (
          <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto text-xs">
            <span className="font-bold text-[#7A7A7A] block">
              فرمان‌های میانبر مخفی مخصوص تست توسعه‌دهنده و ارزیاب:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  const res = onExecuteCheatCode('clean');
                  showFeedback(res.message);
                }}
                className="p-3 bg-white hover:bg-[#FAF8F2] border border-[#E8DFC9] rounded-xl text-right transition-colors"
              >
                <div className="font-bold text-[#2D2D2D] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#7BA05B]" />
                  <span>باغچه‌ی تمیز تستی (clean)</span>
                </div>
                <p className="text-[11px] text-[#7A7A7A] mt-1">
                  حذف ۲۰ دیتای شلوغ؛ نگه‌داشتن فقط ۳ دانش‌آموز واقعی برای تست
                </p>
              </button>

              <button
                onClick={() => {
                  const res = onExecuteCheatCode('demo20');
                  showFeedback(res.message);
                }}
                className="p-3 bg-white hover:bg-[#FAF8F2] border border-[#E8DFC9] rounded-xl text-right transition-colors"
              >
                <div className="font-bold text-[#2D2D2D] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#E8A87C]" />
                  <span>تزریق ۲۰ گیاه شبیه‌سازی (demo20)</span>
                </div>
                <p className="text-[11px] text-[#7A7A7A] mt-1">
                  بارگذاری دیتای شلوغ برای دیدن رادار کامل و بذرخانه
                </p>
              </button>

              <button
                onClick={() => {
                  const res = onExecuteCheatCode('shelter');
                  showFeedback(res.message);
                }}
                className="p-3 bg-white hover:bg-[#FAF8F2] border border-[#E8DFC9] rounded-xl text-right transition-colors"
              >
                <div className="font-bold text-[#2D2D2D] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#55783A]" />
                  <span>تغییر حالت پناهگاه (shelter)</span>
                </div>
                <p className="text-[11px] text-[#7A7A7A] mt-1">
                  توقف یا ازسرگیری فرسایش احساسی گیاهان در شرایط جنگ
                </p>
              </button>

              <button
                onClick={() => {
                  const res = onExecuteCheatCode('revive');
                  showFeedback(res.message);
                }}
                className="p-3 bg-white hover:bg-[#FAF8F2] border border-[#E8DFC9] rounded-xl text-right transition-colors"
              >
                <div className="font-bold text-[#2D2D2D] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>شاداب‌سازی همه (revive)</span>
                </div>
                <p className="text-[11px] text-[#7A7A7A] mt-1">
                  تبدیل تمام گیاهان کلاس به حالت شاداب (Thriving)
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8DFC9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F2EDE2] hover:bg-[#E5DEC9] text-[#2D2D2D] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
