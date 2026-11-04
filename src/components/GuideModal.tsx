import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Wifi,
  Smartphone,
  Laptop,
  CheckCircle2,
  Users,
  Target,
  Trophy,
  Award,
  Zap,
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  KeyRound,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [guideTab, setGuideTab] = useState<'hooks' | 'install' | 'usage' | 'roles'>('hooks');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs fade-in-modal no-print font-['Vazirmatn']"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div
        className="w-full max-w-3xl bg-[#FDFBF7] rounded-3xl border border-[#E8DFC9] p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE7D8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7BA05B] flex items-center justify-center text-white text-xl shadow-xs">
              📖
            </div>
            <div>
              <h3 id="guide-modal-title" className="text-base sm:text-lg font-bold text-[#2D2D2D]">
                راهنمای جامع نصب، راه‌اندازی و ضرورت پلتفرم «جوانه»
              </h3>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                نسخه نهایی ۱.۰ — ویژه‌ی معلمان، مدیران مدارس و دانش‌آموزان
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#777] hover:text-[#2D2D2D] hover:bg-[#EFE7D8] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#F2ECE1] p-1 rounded-2xl gap-1 my-4 text-xs font-bold border border-[#E8DFC9]">
          <button
            onClick={() => {
              sound.playPlantClick(480);
              setGuideTab('hooks');
            }}
            className={`py-2 rounded-xl transition-all ${
              guideTab === 'hooks'
                ? 'bg-white text-[#2D2D2D] shadow-2xs'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            🪝 ۱. ضرورت پلتفرم
          </button>
          <button
            onClick={() => {
              sound.playPlantClick(510);
              setGuideTab('install');
            }}
            className={`py-2 rounded-xl transition-all ${
              guideTab === 'install'
                ? 'bg-white text-[#2D2D2D] shadow-2xs'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            🚀 ۲. نصب گام‌به‌گام
          </button>
          <button
            onClick={() => {
              sound.playPlantClick(540);
              setGuideTab('usage');
            }}
            className={`py-2 rounded-xl transition-all ${
              guideTab === 'usage'
                ? 'bg-white text-[#2D2D2D] shadow-2xs'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            📖 ۳. راهنمای استفاده
          </button>
          <button
            onClick={() => {
              sound.playPlantClick(570);
              setGuideTab('roles');
            }}
            className={`py-2 rounded-xl transition-all ${
              guideTab === 'roles'
                ? 'bg-white text-[#2D2D2D] shadow-2xs'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            🔑 ۴. کلید نقش‌ها
          </button>
        </div>

        {/* Tab 1: Hooks & Core Necessity */}
        {guideTab === 'hooks' && (
          <div className="space-y-3.5 text-right text-xs sm:text-sm max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3.5 bg-[#FAF6EE] border border-[#EADBCA] rounded-2xl">
              <span className="font-bold text-[#4F7332] flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#7BA05B]" />
                <span>چرا پلتفرم «جوانه» تحول‌بخش آموزش ابتدایی است؟</span>
              </span>
              <p className="text-xs text-[#555] leading-relaxed">
                سامانه‌ی جوانه تلفیقی از کشف اختلالات یادگیری، انگیزش بازی‌وارسازی شده، ابزارسازی کلاسی معلم و شبکه هم‌افزایی معلمان است که ۱۰۰٪ به صورت آفلاین کار می‌کند.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white border border-[#E8DFC9] rounded-2xl flex items-start gap-2.5">
                <span className="p-2 bg-[#EBF3E4] rounded-xl text-[#4F7332] mt-0.5">
                  <BrainCircuit className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-[#2D2D2D] text-xs sm:text-sm">۱. کشف و رفع دقیق گلوگاه‌های شناختی ریاضی (پایه‌های ۱ تا ۶)</h4>
                  <ul className="list-disc list-inside text-xs text-[#666] mt-1 space-y-0.5 pr-1">
                    <li>شناسایی هوشمند نقطه افت دانش‌آموز بر اساس شماره صفحه دقیق کتاب درسی.</li>
                    <li>ارائه تمرین‌های جبرانی کوتاه و هدفمند جهت رفع ریشه‌ای ضعف ریاضی بدون سرخوردگی.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8DFC9] rounded-2xl flex items-start gap-2.5">
                <span className="p-2 bg-[#F2EDE2] rounded-xl text-[#7A5C3D] mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-[#2D2D2D] text-xs sm:text-sm">۲. کتاب‌ساز تعاملی و آفلاین معلمان (ابزارک آفتاب)</h4>
                  <ul className="list-disc list-inside text-xs text-[#666] mt-1 space-y-0.5 pr-1">
                    <li>تولید کتب درسی و کتابچه‌های تمرین تعاملی در ۴ گام بسیار ساده.</li>
                    <li>خروجی فایل HTML مستقل و بدون نیاز به اینترنت برای اجرا روی تبلت دانش‌آموز.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8DFC9] rounded-2xl flex items-start gap-2.5">
                <span className="p-2 bg-[#FEF3C7] rounded-xl text-[#D97706] mt-0.5">
                  <Trophy className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-[#2D2D2D] text-xs sm:text-sm">۳. لیگ مسابقات کلاسی و چرخه شانس پاداش</h4>
                  <ul className="list-disc list-inside text-xs text-[#666] mt-1 space-y-0.5 pr-1">
                    <li>ایجاد رقابت سالم گروهی بین دانش‌آموزان با لیگ مدارس.</li>
                    <li>گردونه شانس جهت پاداش‌دهی روزانه به عادات مثبت آموزشی و انگیزش پایدار.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8DFC9] rounded-2xl flex items-start gap-2.5">
                <span className="p-2 bg-[#E0F2FE] rounded-xl text-[#0284C7] mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-[#2D2D2D] text-xs sm:text-sm">۴. تالار گفت‌وگو و شبکه علمی معلمان</h4>
                  <ul className="list-disc list-inside text-xs text-[#666] mt-1 space-y-0.5 pr-1">
                    <li>فیلتر هوشمند گروه‌های کاری بر اساس «پایه تحصیلی» (۱ تا ۶) و «موضوع درسی».</li>
                    <li>پرسش و پاسخ تخصصی معلمان، تبادل روش‌های تدریس و هم‌افزایی کلاسی.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E8DFC9] rounded-2xl flex items-start gap-2.5">
                <span className="p-2 bg-[#FEE2E2] rounded-xl text-[#DC2626] mt-0.5">
                  <Wifi className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-[#2D2D2D] text-xs sm:text-sm">۵. عملکرد ۱۰۰٪ آفلاین و PWA کلاسی</h4>
                  <ul className="list-disc list-inside text-xs text-[#666] mt-1 space-y-0.5 pr-1">
                    <li>ارتباط کامل لپ‌تاپ معلم و تبلت دانش‌آموزان از طریق وای‌فای هات‌اسپات (بدون اینترنت).</li>
                    <li>قابلیت نصب مستقیم روی صفحه اصلی تبلت بدون نیاز به اپ‌استور یا کافه‌بازار.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Step-by-Step Installation */}
        {guideTab === 'install' && (
          <div className="space-y-4 text-right text-xs sm:text-sm max-h-[60vh] overflow-y-auto pr-1">
            <div className="bg-[#FAF6EE] border border-[#EADBCA] p-4 rounded-2xl">
              <span className="font-bold text-[#4F7332] flex items-center gap-2 mb-1.5">
                <Laptop className="w-4 h-4 text-[#7BA05B]" />
                <span>گام اول: نصب و اجرای سرور محلی (لپ‌تاپ معلم)</span>
              </span>
              <p className="text-xs text-[#555] leading-relaxed mb-2">
                برنامه‌ی جوانه کاملاً مستقل از اینترنت بین‌المللی است. دستورات زیر را در ترمینال سیستم اجرا کنید:
              </p>
              <div className="bg-[#2D2D2D] text-[#A5CC85] p-3 rounded-xl font-mono text-xs dir-ltr text-left space-y-1">
                <div># ۱. نصب وابستگی‌ها (فقط بار اول)</div>
                <div>npm install</div>
                <div className="pt-1.5"># ۲. اجرای برنامه روی شبکه‌ی محلی کلاس</div>
                <div>npm run dev -- --host</div>
              </div>
              <p className="text-[11px] text-[#7A7A7A] mt-2">
                پس از اجرا، آدرس محلی شامل آی‌پی لپ‌تاپ (مانند <code>http://192.168.1.50:3000</code>) در ترمینال نمایش داده می‌شود.
              </p>
            </div>

            <div className="bg-white border border-[#E8DFC9] p-4 rounded-2xl space-y-2">
              <span className="font-bold text-[#2D2D2D] flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#7BA05B]" />
                <span>گام دوم: ایجاد هات‌اسپات وای‌فای کلاسی (بدون اینترنت)</span>
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#555] pr-1 leading-relaxed">
                <li>هات‌اسپات (Mobile Hotspot) گوشی یا لپ‌تاپ معلم را روشن کنید (نیاز به بسته داده نیست).</li>
                <li>تبلت‌ها یا گوشی‌های دانش‌آموزان را به همین وای‌فای متصل نمایید.</li>
                <li>آدرس آی‌پی لپ‌تاپ معلم را در مرورگر دانش‌آموزان وارد کنید.</li>
              </ol>
            </div>

            <div className="bg-white border border-[#E8DFC9] p-4 rounded-2xl space-y-2">
              <span className="font-bold text-[#2D2D2D] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#7BA05B]" />
                <span>گام سوم: نصب آسان روی تبلت دانش‌آموز به صورت PWA</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#555] pr-1 leading-relaxed">
                <li>در مرورگر Chrome یا Safari دانش‌آموز، گزینه <strong>Add to Home Screen (افزودن به صفحه اصلی)</strong> را انتخاب کنید.</li>
                <li>آیکون «جوانه» روی صفحه اصلی تبلت اضافه شده و مانند یک اپلیکیشن بومی آفلاین باز می‌شود.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Simple Usage Guide */}
        {guideTab === 'usage' && (
          <div className="space-y-4 text-right text-xs sm:text-sm max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3.5 bg-white border border-[#E8DFC9] rounded-2xl space-y-2">
              <span className="font-bold text-[#465E32] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7BA05B]" />
                <span>👩‍🏫 راهنمای معلم (کلاس و تدریس):</span>
              </span>
              <ul className="list-disc list-inside text-xs text-[#555] space-y-1 pr-1 leading-relaxed">
                <li><strong>رادار ۱۰ ثانیه‌ای:</strong> مشاهده حال عمومی، حضور غیاب و وضعیت عاطفی کل کلاس در ابتدای زنگ.</li>
                <li><strong>کتاب‌ساز تعاملی (آفتاب):</strong> ساخت کتابچه‌های درسی، افزودن سوالات چندگزینه‌ای و خروجی HTML.</li>
                <li><strong>گلوگاه‌شناس ریاضی:</strong> انتخاب پایه تحصیلی (۱ تا ۶) و صفحه کتاب درسی برای ساخت تکلیف جبرانی.</li>
                <li><strong>تالار گفت‌وگو:</strong> تبادل تجربه با سایر معلمان بر اساس فیلتر پایه و درس.</li>
                <li><strong>لیگ و گردونه شانس:</strong> تعریف مسابقات کلاسی و اهداء پاداش از گردونه شانس.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-white border border-[#E8DFC9] rounded-2xl space-y-2">
              <span className="font-bold text-[#1E293B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#475569]" />
                <span>🏫 راهنمای مدیر مدرسه:</span>
              </span>
              <ul className="list-disc list-inside text-xs text-[#555] space-y-1 pr-1 leading-relaxed">
                <li><strong>پایش کلان:</strong> مشاهده شاخص‌های کلی مشارکت کلاس‌ها و وضعیت سلامت روان بدون افشای نمره فردی.</li>
                <li><strong>مدیریت لایسنس:</strong> صدور کارت‌های QR جهت فعال‌سازی حساب معلمان و کلاس‌های جدید.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-white border border-[#E8DFC9] rounded-2xl space-y-2">
              <span className="font-bold text-[#8C5D39] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4A017]" />
                <span>🎒 راهنمای دانش‌آموز:</span>
              </span>
              <ul className="list-disc list-inside text-xs text-[#555] space-y-1 pr-1 leading-relaxed">
                <li><strong>اتاق جوانه:</strong> رسیدگی به عادات روزانه (خواب، مسواک، مشق) برای رشد گیاه شخصی.</li>
                <li><strong>گردونه شانس و لیگ:</strong> چرخاندن گردونه پاداش پس از انجام تکالیف و مشاهده جایگاه کلاسی.</li>
                <li><strong>کتاب‌خوان:</strong> مطالعه کتابچه‌های تعاملی معلم و انجام تمرین‌های ریاضی.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Roles & Test Passcodes */}
        {guideTab === 'roles' && (
          <div className="space-y-4 text-right text-xs sm:text-sm max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-xs text-[#666] leading-relaxed">
              برای ارزیابی سریع پلتفرم، می‌توانید از دکمه‌ی <strong>«کلید نقش‌ها 🔐»</strong> در بالای صفحه استفاده کرده یا کلمات عبور زیر را وارد نمایید:
            </p>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">👑 ۱. مالک پلتفرم (Platform Owner):</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#F1F5F9] rounded text-[#475569]">
                    رمز: owner1403
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-1">
                  مدیریت کلان مدارس، تمدید لایسنس‌ها و گزارش‌های عملکردی بدون دسترسی به اطلاعات شخصی.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E8DFC9] rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#465E32]">🏫 ۲. مدیر مدرسه (School Principal):</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#EBF3E4] rounded text-[#465E32]">
                    رمز: school1403
                  </span>
                </div>
                <p className="text-xs text-[#666] mt-1">
                  مدیریت کلاس‌ها، صدور کارت QR سهمیه‌های معلمان و پایش سلامتی کلاسی.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#D5E6C9] rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3B4D2B]">👩‍🏫 ۳. معلم کلاس (Teacher Garden):</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#F2EDE2] rounded text-[#2D2D2D]">
                    رمز: teacher1403
                  </span>
                </div>
                <p className="text-xs text-[#666] mt-1">
                  دسترسی به رادار کلاس، کتاب‌ساز آفتاب، شناسایی گلوگاه ریاضی، دیکته‌گو، تالار معلمان و لیگ.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E8DFC9] rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8C5D39]">🎒 ۴. حساب‌های دانش‌آموزی نمونه:</span>
                  <span className="text-xs text-[#7A7A7A]">۳ دانش‌آموز آزمایشی</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  <div className="p-2 bg-[#FAF8F2] rounded-xl text-xs">
                    <span className="font-bold">علی (جوانه):</span>
                    <div className="text-[11px] font-mono text-[#A66135]">رمز: ali101</div>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-xl text-xs">
                    <span className="font-bold">سارا (آفتاب‌گردان):</span>
                    <div className="text-[11px] font-mono text-[#4F7332]">رمز: sara102</div>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-xl text-xs">
                    <span className="font-bold">امیرعلی (نارنجک):</span>
                    <div className="text-[11px] font-mono text-[#D4A017]">رمز: amir103</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[#EFE7D8] flex items-center justify-between">
          <span className="text-[11px] text-[#7A7A7A]">
            جوانه • پلتفرم جامع آموزش ابتدایی و مراقبت عاطفی مدارس
          </span>
          <button
            onClick={() => {
              sound.playPlantClick(480);
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            متوجه شدم 🌿
          </button>
        </div>
      </div>
    </div>
  );
};
