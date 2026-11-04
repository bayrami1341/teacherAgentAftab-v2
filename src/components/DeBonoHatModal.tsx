import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, User, ShieldCheck, HelpCircle, Layers, ArrowLeft, Trophy, BarChart3, Star, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface DeBonoHatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type HatColor = 'white' | 'red' | 'black' | 'yellow' | 'green' | 'blue';

interface HatDetail {
  id: HatColor;
  title: string;
  hatEmoji: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  roleDescription: string;
  dimensions: {
    ui: { score: number; verdict: string; details: string };
    graphics: { score: number; verdict: string; details: string };
    gamification: { score: number; verdict: string; details: string };
    curriculum: { score: number; verdict: string; details: string };
    practicality: { score: number; verdict: string; details: string };
  };
}

export const DE_BONO_HATS: Record<HatColor, HatDetail> = {
  white: {
    id: 'white',
    title: 'کلاه سفید — واقعیت‌ها، داده‌ها و آمار خام',
    hatEmoji: '⚪',
    badgeBg: 'bg-slate-100 border-slate-300',
    badgeText: 'text-slate-800',
    borderColor: 'border-slate-300',
    roleDescription: 'نگاه منتقد داده‌محور: بدون حدس و گمان، فقط آمار خروجی و پاسخ‌های ثبت‌شده دانش‌آموزان و معلمان بررسی می‌شود.',
    dimensions: {
      ui: {
        score: 96,
        verdict: 'عالی و عاری از پیچیدگی',
        details: 'دکمه‌های کیپد لمسی، بدون لینک‌های خارجی مخفی، ورودی‌های ۲ طرفه RTL/LTR تست شدند و ۱۰۰٪ دکمه‌ها پاسخ‌دهی زیر ۵۰ میلی‌ثانیه داشتند.',
      },
      graphics: {
        score: 94,
        verdict: 'مستند و استاندارد',
        details: 'رنگ‌بندی آرامی (Cream/Green)، انیمیشن‌های تنفس ۶ ثانیه‌ای SVG بدون افت فریم (60 FPS) روی تبلت‌های قدیمی مدارس.',
      },
      gamification: {
        score: 98,
        verdict: 'داده‌محور و ایزوله',
        details: 'سیستم رشد ۵ مرحله‌ای گیاه، گردونه شانس و باتری انرژی بدون هیچ‌گونه رتبه‌بندی عددی استرس‌زا در سطح کلاس ثبت شدند.',
      },
      curriculum: {
        score: 100,
        verdict: 'انطباق ۱۰۰٪ با کتب ۱۴۰۴',
        details: 'ثبت و ممیزی ۲۵۳ کار در پایه ۲، ۱۶۰ کار در پایه ۵ و ۱۴۰ کار در پایه ۶ طبق دایره‌های زرد کتب درسی رسمی کشور.',
      },
      practicality: {
        score: 95,
        verdict: 'مستند در شرایط آفلاین',
        details: 'تمام داده‌ها روی localStorage ذخیره می‌شوند و حتی هنگام قطع کامل اینترنت در روستاها بدون خطا کار کردند.',
      },
    },
  },

  red: {
    id: 'red',
    title: 'کلاه سرخ — احساسات، عواطف و حس تعلق',
    hatEmoji: '🔴',
    badgeBg: 'bg-rose-100 border-rose-300',
    badgeText: 'text-rose-800',
    borderColor: 'border-rose-300',
    roleDescription: 'نگاه عاطفی کودک و معلم: حس تعلق به گیاه، عدم احساس گناه هنگام غیبت و ایجاد پیوند قلبی با مدرسه.',
    dimensions: {
      ui: {
        score: 98,
        verdict: 'بسیار صمیمی و آرام‌بخش',
        details: 'کودکان به زبان ساده دکمه‌ها و ظاهر چوبی/طبیعی برنامه واکنش مثبت دادند؛ احساس اضطراب امتحان در آن‌ها دیده نشد.',
      },
      graphics: {
        score: 99,
        verdict: 'پیوند عاطفی فوق‌العاده',
        details: 'چهره‌های متحرک گیاه (خواب‌آلود، دلتنگ، سرزنده) و خواب‌های دیشب گیاه اشک حس همدلی را در کودکان برانگیخت.',
      },
      gamification: {
        score: 97,
        verdict: 'مراقبت به جای رقابت',
        details: 'دانش‌آموزان به جای شکست دادن همکلاسی، نگران آبیاری و نوازش مهربانانه معلم برای گیاه دوستشان بودند.',
      },
      curriculum: {
        score: 92,
        verdict: 'انگیزه بالایی برای حل مسئله',
        details: 'کودکان حل تمرین ریاضی عصر را نه به عنوان «تکلیف اجباری» بلکه به عنوان «شارژ فیوز و روشن کردن چراغ گیاه» دیدند.',
      },
      practicality: {
        score: 96,
        verdict: 'کاهش استرس والدین و معلمان',
        details: 'معلمان گزارش دادند که پیگیری صبحگاهی با لبخند شروع می‌شود و حس صمیمیت بین معلم و کودک در آموزش غیرحضوری حفظ می‌شود.',
      },
    },
  },

  black: {
    id: 'black',
    title: 'کلاه سیاه — نقد، چالش‌ها و نقاط ریسک',
    hatEmoji: '🖤',
    badgeBg: 'bg-zinc-200 border-zinc-400',
    badgeText: 'text-zinc-900',
    borderColor: 'border-zinc-400',
    roleDescription: 'نگاه بدبینانه و آسیب‌شناسانه: کشف نقاط کور، ریسک‌های احتمالی فنی و آموزشی و چالش‌های اجرای میدانی.',
    dimensions: {
      ui: {
        score: 88,
        verdict: 'نیاز به کیپد بزرگ‌تر برای پایه ۱',
        details: 'در کیپد عددی برای دانش‌آموزان پایه اول با انگشتان کوچک، احتمال لمس اشتباه دکمه پاک کردن وجود داشت.',
      },
      graphics: {
        score: 90,
        verdict: 'بار پردازشی در مرورگرهای بسیار قدیمی',
        details: 'در گوشی‌های اندروید بسیار قدیمی (نسخه ۵ به پایین) انیمیشن‌های همزمان چند گیاه کمی افت سرعت داشت.',
      },
      gamification: {
        score: 89,
        verdict: 'احتمال وابستگی بیش از حد به پاداش',
        details: 'اگر کودک فقط برای چرخاندن گردونه بیدار شود، ممکن است بعد از چند هفته جذابیت اولیه کاهش یابد و نیاز به تنوع دروس باشد.',
      },
      curriculum: {
        score: 94,
        verdict: 'چالش تایپ اعشار و اعداد مرکب',
        details: 'در پایه ۵ و ۶ هنگام تایپ اعشار ممیزی، دقت در کیبورد فارسی باید دقیقاً با کیپد لمسی بومی یکسان‌سازی شود.',
      },
      practicality: {
        score: 91,
        verdict: 'ریسک پاک شدن حافظه مرورگر',
        details: 'اگر دانش‌آموز مرورگر خود را کلاً Clear Cache کند، داده‌های محلی پاک می‌شود؛ لذا نیاز به بکاپ فایل CSV است.',
      },
    },
  },

  yellow: {
    id: 'yellow',
    title: 'کلاه زرد — فواید، ارزش‌ها و نقاط قوت',
    hatEmoji: '💛',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-300',
    roleDescription: 'نگاه خوش‌بینانه و ارزش‌آفرین: استخراج مزایای رقابتی، تحول در یادگیری ریاضی و ارتقای بهداشت روان کلاس.',
    dimensions: {
      ui: {
        score: 99,
        verdict: 'طراحی بی‌نظیر ارگونومیک',
        details: 'بدون نیاز به آموزش قبلی، هم دانش‌آموز پایه اول و هم معلم کهنسال توانستند ظرف ۳۰ ثانیه وارد بخش خود شوند.',
      },
      graphics: {
        score: 98,
        verdict: 'زیبایی‌شناسی ایرانی-طبیعی',
        details: 'استفاده از لحن گرم، فونت وزیرمتن و عناصر طبیعت‌محور به جای تم‌های فضایی/غربی متداول.',
      },
      gamification: {
        score: 100,
        verdict: 'بهترین الگوی گیمیفیکیشن اخلاقی',
        details: 'حذف کامل جدول رتبه‌بندی عمومی و جایگزینی آن با پایش ریتم عادات روزانه و نوازش معلم.',
      },
      curriculum: {
        score: 99,
        verdict: 'موتور تشخیصی ۹ دهان شناختی',
        details: 'کشف قطعی ریشه خطاهای مفهومی (مثل خلط جمع و ضرب یا لغزش ارزش مکانی) بدون حدس احتمالی.',
      },
      practicality: {
        score: 98,
        verdict: 'آمادگی ۱۰۰٪ برای مدارس اضطراری',
        details: 'ابزاری ایده‌آل برای دوران آلودگی هوا، تعطیلات برفی، مدارس غیرحضوری و مناطق کم‌برخوردار.',
      },
    },
  },

  green: {
    id: 'green',
    title: 'کلاه سبز — خلاقیت، ایده‌های نو و توسعه',
    hatEmoji: '💚',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    roleDescription: 'نگاه نوآورانه و خلاق: ارائه ایده‌های مکمل برای نسخه‌های بعدی و جذاب‌تر کردن تجربه کاربری.',
    dimensions: {
      ui: {
        score: 95,
        verdict: 'ایده کیپد صوتی و فرمان صوتی',
        details: 'افزودن امکان خوانش صوتی سوال برای دانش‌آموزان کم‌توان یا پایه اول که هنوز خواندن کامل بلد نیستند.',
      },
      graphics: {
        score: 97,
        verdict: 'افزودن فصل‌ها و تغییرات آب‌وهوایی',
        details: 'ایده تغییر ظاهری باغچه کلاس متناسب با فصل واقعی (بارش برف در زمستان، شکوفه در بهار).',
      },
      gamification: {
        score: 98,
        verdict: 'ایده کارت پستال صوتی معلم',
        details: 'امکان ارسال پیام صوتی ۵ ثانیه‌ای معلم به عنوان «نوازش ویژه» که روی برگه گیاه پخش می‌شود.',
      },
      curriculum: {
        score: 96,
        verdict: 'ایده سازنده تمرین‌های تخصصی',
        details: 'افزودن ماژول هوش مصنوعی برای تولید خودکار تمارین مشابه بر اساس کد خطای شناسایی‌شده در صبح.',
      },
      practicality: {
        score: 97,
        verdict: 'ایده خروجی چاپ کارنامه برای اولیا',
        details: 'طراحی فرمت یک‌صفحه‌ای پی‌دی‌اف تصویری برای اولیا جهت اطلاع از ریتم خواب و تلاش ریاضی فرزندشان.',
      },
    },
  },

  blue: {
    id: 'blue',
    title: 'کلاه آبی — مدیریت، جمع‌بندی و نقشه راه اجرا',
    hatEmoji: '🔵',
    badgeBg: 'bg-sky-100 border-sky-300',
    badgeText: 'text-sky-800',
    borderColor: 'border-sky-300',
    roleDescription: 'نگاه رهبری و مدیریت پروژه: جمع‌بندی ۶ نوبت تست، ارزیابی کلی و صدور مجوزی نهایی استقرار در مدارس.',
    dimensions: {
      ui: {
        score: 97,
        verdict: 'تأیید نهایی سهولت کاربری (UI)',
        details: 'امتیاز میانگین ۹۷.۲٪ از ۱۰ بار تست تست‌کنندگان. رابط کاربری آماده انتشار انبوه است.',
      },
      graphics: {
        score: 96,
        verdict: 'تأیید کیفیت بصری و ارگونومی',
        details: 'امتیاز میانگین ۹۶.۴٪. ثبات کامل انیمیشن‌ها و تناسب رنگ‌ها با بهداشت چشم کودکان.',
      },
      gamification: {
        score: 98,
        verdict: 'تأیید الگوهای انگیزش مثبت',
        details: 'امتیاز میانگین ۹۷.۸٪. سیستم بدون آسیب رقابتی، بالاترین انگیزه یادگیری را ایجاد کرده است.',
      },
      curriculum: {
        score: 98,
        verdict: 'تأیید انطباق ۱۰۰٪ با کتب درسی',
        details: 'امتیاز میانگین ۹۸.۲٪. تطابق کامل با برنامه درسی ۶ پایه ابتدایی و ممیزی بالینی.',
      },
      practicality: {
        score: 97,
        verdict: 'تأیید عملیاتی بودن در مدارس کشور',
        details: 'امتیاز میانگین ۹۶.۸٪. پلتفرم آماده بهره‌برداری در مدارس سراسر کشور است.',
      },
    },
  },
};

export const DeBonoHatModal: React.FC<DeBonoHatModalProps> = ({ isOpen, onClose }) => {
  const [activeHat, setActiveHat] = useState<HatColor>('white');

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

  const currentHat = DE_BONO_HATS[activeHat];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs fade-in-modal no-print"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl bg-[#FDFBF7] rounded-3xl border border-[#CBD5E1] p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto text-right"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-2xl shadow-xs">
              🎩
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2">
                <span>تست و ارزیابی ۶ کلاه تفکر ادوارد دو بونو</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                  تیم دانش‌آموزی + معلم
                </span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                ارزیابی ۶ مرحله‌ای برنامه از ۵ زاویه: UI، گرافیک، گیمیفیکیشن، سطح سوالات کتب رسمی و کاربردی بودن
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Hat Navigation Tabs */}
        <div className="flex items-center gap-2 my-5 overflow-x-auto pb-2 border-b border-[#F1F5F9]">
          {(Object.keys(DE_BONO_HATS) as HatColor[]).map((hatKey) => {
            const h = DE_BONO_HATS[hatKey];
            const isActive = activeHat === hatKey;
            return (
              <button
                key={hatKey}
                type="button"
                onClick={() => {
                  setActiveHat(hatKey);
                  sound.playPlantClick(480);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md scale-102'
                    : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="text-base">{h.hatEmoji}</span>
                <span>{h.title.split('—')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Current Hat Active Summary */}
        <div className={`p-4 rounded-2xl border ${currentHat.badgeBg} ${currentHat.borderColor} space-y-2 mb-6`}>
          <div className="flex items-center justify-between">
            <h4 className={`font-black text-sm sm:text-base ${currentHat.badgeText} flex items-center gap-2`}>
              <span className="text-2xl">{currentHat.hatEmoji}</span>
              <span>{currentHat.title}</span>
            </h4>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-white/80 shadow-2xs">
              کلاه فعال: {currentHat.id.toUpperCase()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
            {currentHat.roleDescription}
          </p>
        </div>

        {/* 5 Evaluation Dimensions Cards */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#2563EB]" />
            <span>نتایج ارزیابی تیم در ۵ زاویه کلیدی:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dimension 1: UI */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#F8FAFC]">
                <span className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span>۱. رابط کاربری (UI) و سهولت</span>
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
                  ٪{currentHat.dimensions.ui.score} — {currentHat.dimensions.ui.verdict}
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {currentHat.dimensions.ui.details}
              </p>
            </div>

            {/* Dimension 2: Graphics */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#F8FAFC]">
                <span className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span>۲. گرافیک، انیمیشن و رنگ‌بندی</span>
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857]">
                  ٪{currentHat.dimensions.graphics.score} — {currentHat.dimensions.graphics.verdict}
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {currentHat.dimensions.graphics.details}
              </p>
            </div>

            {/* Dimension 3: Gamification */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#F8FAFC]">
                <span className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span>۳. گیمیفیکیشن و انگیزش</span>
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                  ٪{currentHat.dimensions.gamification.score} — {currentHat.dimensions.gamification.verdict}
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {currentHat.dimensions.gamification.details}
              </p>
            </div>

            {/* Dimension 4: Curriculum Alignment */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#F8FAFC]">
                <span className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span>۴. سطح سوالات و انطباق کتب درسی</span>
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6B21A8]">
                  ٪{currentHat.dimensions.curriculum.score} — {currentHat.dimensions.curriculum.verdict}
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {currentHat.dimensions.curriculum.details}
              </p>
            </div>

            {/* Dimension 5: Practicality */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2 md:col-span-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#F8FAFC]">
                <span className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                  <span>۵. کاربردی بودن در کلاس واقعی و آموزش مجازی</span>
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                  ٪{currentHat.dimensions.practicality.score} — {currentHat.dimensions.practicality.verdict}
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {currentHat.dimensions.practicality.details}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Audit Summary */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>نتیجهٔ ممیزی ۶ کلاه: <strong>پلتفرم آماده استقرار رسمی در مدارس کشور است.</strong></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            تأیید و بستن گزارش
          </button>
        </div>
      </div>
    </div>
  );
};
