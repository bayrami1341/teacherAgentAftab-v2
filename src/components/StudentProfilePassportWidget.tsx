import React, { useState } from 'react';
import { Plant, Mood } from '../types';
import {
  User,
  Award,
  Star,
  ShieldCheck,
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Trophy,
  CheckCircle2,
  Share2,
  BookOpen,
  Printer,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { AnimatedPlantStageVisual } from './PlantStageSVGComponents';

interface StudentProfilePassportWidgetProps {
  plants: Plant[];
}

interface StudentBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'habit' | 'math' | 'empathy' | 'consistency';
  badgeBg: string;
  badgeText: string;
}

const BADGES_COLLECTION: StudentBadge[] = [
  {
    id: 'b-1',
    title: 'مدال سحرخیزی و سلام به خورشید',
    description: 'ثبت ۵ بیدارباش سر وقت و منظم قبل از ساعت ۷:۰۰ صبح',
    icon: '🌅',
    earnedDate: '۱۴۰۳/۰۸/۰۵',
    category: 'habit',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-800',
  },
  {
    id: 'b-2',
    title: 'نشان استاد شکستن کسرها',
    description: 'اتصال کامل فیوزهای محاسباتی ضرب و تقسیم کسرها در کارگاه روشا',
    icon: '🧩',
    earnedDate: '۱۴۰۳/۰۸/۰۸',
    category: 'math',
    badgeBg: 'bg-blue-100 border-blue-300',
    badgeText: 'text-blue-800',
  },
  {
    id: 'b-3',
    title: 'مدال احیاکنندهٔ سرزندگی جوانه',
    description: 'بازگرداندن گیاه از حالت دلتنگ به سرزنده با حضور و آبیاری بموقع',
    icon: '🌱',
    earnedDate: '۱۴۰۳/۰۸/۱۰',
    category: 'empathy',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-800',
  },
  {
    id: 'b-4',
    title: 'سپهر استمرار و نظم کلاسی',
    description: '۱۴ روز مراقبت مستمر بدون قطع ریتم عادات روزانه',
    icon: '🛡️',
    earnedDate: '۱۴۰۳/۰۸/۱۲',
    category: 'consistency',
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-800',
  },
];

export const StudentProfilePassportWidget: React.FC<StudentProfilePassportWidgetProps> = ({
  plants,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(plants[0]?.id || 'p-15');
  const [previewStage, setPreviewStage] = useState<number>(plants[0]?.stage || 3);

  const selectedStudent = plants.find((p) => p.id === selectedStudentId) || plants[0] || {
    id: 'p-15',
    childName: 'علی',
    plantName: 'جوانه',
    gen: 1,
    stage: 3,
    growthDays: 14,
    lastSeenDays: 0,
    mood: 'thriving' as Mood,
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-6 text-right dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white text-2xl shadow-md ring-4 ring-[#8B5CF6]/20">
            🪪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                پروفایل جامع و گذرنامهٔ رشد دانش‌آموز (Student Learning Passport)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6B21A8] text-[10px] font-bold border border-[#E9D5FF]">
                ثبت دستاوردها بدون نمره
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              شناسنامهٔ عاطفی و آموزشی کودک • مدال‌های افتخار، انیمیشن‌های لایه‌بندی‌شده SVG و خاطرات مراقبت
            </p>
          </div>
        </div>

        {/* Print Passport Action */}
        <button
          type="button"
          onClick={() => {
            sound.playJoyfulChime();
            window.print();
          }}
          className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>چاپ کارنامهٔ دستاوردهای {selectedStudent.childName}</span>
        </button>
      </div>

      {/* Student Dropdown Selector */}
      <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EADFCF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 w-full sm:w-72">
          <label className="text-xs font-bold text-[#4A3B32] block">انتخاب پروفایل دانش‌آموز:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              const found = plants.find((p) => p.id === e.target.value);
              if (found) setPreviewStage(found.stage);
              sound.playPlantClick(500);
            }}
            className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white font-bold text-[#0F172A] outline-none text-xs cursor-pointer"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                پروفایل دانش‌آموز: {p.childName} (گیاه «{p.plantName}» — نسل {p.gen})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Growth Indicators */}
        <div className="flex items-center gap-4 text-xs font-bold text-[#334155]">
          <div className="flex items-center gap-1.5">
            <span>🪴 نسل فعلی:</span>
            <span className="text-[#2563EB] font-black">نسل {selectedStudent.gen}</span>
          </div>
          <div className="h-4 w-px bg-[#CBD5E1]" />
          <div className="flex items-center gap-1.5">
            <span>🌱 مرحله رشد:</span>
            <span className="text-[#059669] font-black">مرحله {selectedStudent.stage} از ۵</span>
          </div>
          <div className="h-4 w-px bg-[#CBD5E1]" />
          <div className="flex items-center gap-1.5">
            <span>⏱️ استمرار مراقبت:</span>
            <span className="text-[#D97706] font-black">{selectedStudent.growthDays} روز</span>
          </div>
        </div>
      </div>

      {/* 🚀 MULTI-STAGE ANIMATED SVG SHOWCASE LABORATORY */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white space-y-6 border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-800/40">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              <h4 className="font-black text-base sm:text-lg text-purple-100">
                آزمایشگاه انیمیشن ۵ مرحله رشد گیاه (Layered SVG + Motion Framework)
              </h4>
            </div>
            <p className="text-xs text-purple-300 mt-1">
              روی هر مرحله کلیک کنید تا انیمیشن لایه‌ای اختصاصی (باز شدن شکوفه، چرخش برگ‌ها، تابش نور و ذرات کیهانی) اجرا شود:
            </p>
          </div>

          <div className="flex items-center gap-2 bg-purple-900/60 p-1.5 rounded-2xl border border-purple-700/60">
            {[1, 2, 3, 4, 5].map((stg) => (
              <button
                key={stg}
                type="button"
                onClick={() => {
                  setPreviewStage(stg);
                  sound.playGrowthWoodTap(stg);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  previewStage === stg
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105 ring-2 ring-white'
                    : 'text-purple-200 hover:bg-purple-800/50'
                }`}
              >
                مرحله {stg}
              </button>
            ))}
          </div>
        </div>

        {/* Live Motion Visual Representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Main Interactive Stage Renderer */}
          <div className="bg-slate-950/80 p-6 rounded-3xl border border-purple-500/30 flex flex-col items-center justify-center min-h-[260px] relative">
            <AnimatedPlantStageVisual stage={previewStage} mood={selectedStudent.mood} size="xl" showLabel={true} />
          </div>

          {/* Detailed Stage Description & Visual Feature Badges */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-purple-900/30 border border-purple-500/30 space-y-2">
              <span className="text-amber-300 font-bold block text-sm">
                ویژگی‌های بصری و افکت انیمیشن در مرحله {previewStage}:
              </span>
              {previewStage === 1 && (
                <p className="text-purple-200 leading-relaxed">
                  🌱 <b>جوانه شاداب:</b> جوانه نوپا با انیمیشن فنری شکوفایی لایه‌ای (Spring Scale)، قطره شبنم لغزنده و هاله سبز ملایم.
                </p>
              )}
              {previewStage === 2 && (
                <p className="text-purple-200 leading-relaxed">
                  🌿 <b>ساقه و برگ‌های جوان:</b> ساقه متحرک با افکت بوی نسیم (Swaying Motion)، گره‌های شاخه جدید و انتشار انرژی.
                </p>
              )}
              {previewStage === 3 && (
                <p className="text-purple-200 leading-relaxed">
                  🌸 <b>بوته پرگل و شکوفا:</b> شکوفایی ترتیبی ۵ گل ارغوانی و صورتی با چرخش زاویه‌ای، ذرات گرده افشان و هاله نوری پالس‌دار.
                </p>
              )}
              {previewStage === 4 && (
                <p className="text-purple-200 leading-relaxed">
                  🌳 <b>درخت بارور میوه‌دار:</b> تنه چوبی استوار، چتر برگی پرپشت، سیب‌های سرخ معلق با افکت پاندولی و تابش پرتوهای آفتاب.
                </p>
              )}
              {previewStage >= 5 && (
                <p className="text-purple-200 leading-relaxed">
                  👑 <b>درخت کهنسال امپراتوری:</b> تنه کریستالی طلایی، چتر نورانی هفت‌رنگ، تاج امپراتوری و مدار ذرات ستاره‌ای در حال گردش.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-purple-900/20 border border-purple-700/30 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>فریم‌ورک: Framer Motion</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-900/20 border border-purple-700/30 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>گرافیک: Layered SVG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          <span>مدال‌ها و دستاوردهای ثبت‌شده برای «{selectedStudent.childName}»:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {BADGES_COLLECTION.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border ${badge.badgeBg} flex items-start gap-3 shadow-2xs`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center text-2xl shadow-xs shrink-0">
                {badge.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className={`font-black text-xs sm:text-sm ${badge.badgeText}`}>{badge.title}</h5>
                  <span className="text-[10px] text-[#64748B] font-mono">{badge.earnedDate}</span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Moments Timeline */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3 text-xs">
        <div className="flex items-center justify-between font-bold text-[#0F172A]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span>خط خاطرات و رویدادهای عاطفی ثبت‌شده در گذرنامه:</span>
          </span>
          <span className="text-[11px] text-[#64748B]">۴ خاطره ماندگار</span>
        </div>

        <div className="space-y-2 border-r-2 border-[#8B5CF6] pr-3 mr-2">
          <div className="relative">
            <span className="font-bold text-[#0F172A]">روشنایی اولین برگ تازه:</span>
            <p className="text-[#64748B] text-[11px]">گیاه «{selectedStudent.plantName}» پس از ۳ روز آبیاری منظم اولین جوانه سبز را باز کرد.</p>
          </div>
          <div className="relative">
            <span className="font-bold text-[#0F172A]">سلام سحرگاهی قبل از ساعت ۷ صبح:</span>
            <p className="text-[#64748B] text-[11px]">ارسال اولین پیام سلام سحرگاهی به گیاه با شادابی کامل.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

