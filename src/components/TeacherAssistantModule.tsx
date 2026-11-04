import React, { useState } from 'react';
import {
  Trophy,
  AlertTriangle,
  RadioTower,
  BatteryCharging,
  Rocket,
  CheckCircle2,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  Printer,
  Compass,
  Cpu,
  Brain,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../utils/audio';

import { Plant } from '../types';
import { AvaAdvisorWidget } from './AvaAdvisorWidget';

interface TeacherAssistantModuleProps {
  classNameTitle: string;
  plants?: Plant[];
  onRewardHabit?: (studentId: string, habitKey: string) => void;
  onExitToGarden?: () => void;
  onSendTeacherNudge?: (plantId: string) => void;
}

// 12 Cognitive Error Codes (CEAP v2.1) from math-game repo
interface CognitiveError {
  code: string;
  titleFa: string;
  cpaStage: 'مجسم (Concrete)' | 'تصویری (Pictorial)' | 'انتزاعی (Abstract)';
  description: string;
  clinicalActionFa: string;
}

const COGNITIVE_ERRORS: Record<string, CognitiveError> = {
  E_ADD_CONFUSION: {
    code: 'E_ADD_CONFUSION',
    titleFa: 'تداخل جمع و ضرب (جمع‌کننده)',
    cpaStage: 'مجسم (Concrete)',
    description: 'کودک به‌جای ضرب، عامل‌ها را جمع می‌کند؛ مثلاً ۲×۵ را ۷ یا ۳×۴ را ۷ حساب می‌کند.',
    clinicalActionFa: 'دسته‌بندی ملموس روی میز با مهره/لوبیا و مقایسه تفاوت ۲+۵ با دو دسته ۵تایی.',
  },
  E_SKIP_OVERCOUNT: {
    code: 'E_SKIP_OVERCOUNT',
    titleFa: 'بیش‌شماری در الگوی جهشی',
    cpaStage: 'تصویری (Pictorial)',
    description: 'در شمارش پرشی یک گام به جلو می‌افتد؛ مثلاً ۳×۴ را ۱۶ می‌گوید.',
    clinicalActionFa: 'رسم کمان‌های پرش روی محور خطی اعداد و شمارش ریتمیک ۵تا۵تا و ۴تا۴تا.',
  },
  E_SKIP_UNDERCOUNT: {
    code: 'E_SKIP_UNDERCOUNT',
    titleFa: 'کم‌شماری در الگوی جهشی',
    cpaStage: 'تصویری (Pictorial)',
    description: 'در شمارش جهشی یک گام عقب می‌ماند؛ مثلاً ۳×۴ را ۸ یا ۲×۶ را ۱۰ می‌گوید.',
    clinicalActionFa: 'رنگ‌آمیزی ردیفی خانه‌های جدول صدگان و چک کردن ایستگاه‌های مشترک.',
  },
  E_PLACE_SHIFT: {
    code: 'E_PLACE_SHIFT',
    titleFa: 'لغزش ارزش مکانی (جابه‌جا نویسی)',
    cpaStage: 'تصویری (Pictorial)',
    description: 'رقم‌های حاصل را وارونه می‌نویسد؛ مثلاً ۴×۶ را ۴۲ (به‌جای ۲۴) یا ۶×۷ را ۲۴ (به‌جای ۴۲) می‌زند.',
    clinicalActionFa: 'جدول ارزش مکانی و ساخت بسته‌های ده‌تایی و یکی با کویزنر برای تفکیک دهگان و یکان.',
  },
  E_COMMUTATIVE_FAIL: {
    code: 'E_COMMUTATIVE_FAIL',
    titleFa: 'عدم درک خاصیت جابه‌جایی',
    cpaStage: 'مجسم (Concrete)',
    description: 'حاصل ۲×۵=۱۰ را می‌داند، اما با ۵×۲ سردرگم و غافلگیر می‌شود.',
    clinicalActionFa: 'چرخش ۹۰ درجه‌ای صفحه مستطیلی شبکه‌ای؛ کودک با چشم خود یکی بودن مساحت را می‌بیند.',
  },
  E_ANCHOR_DRIFT: {
    code: 'E_ANCHOR_DRIFT',
    titleFa: 'انحراف محاسباتی از لنگر همسایه',
    cpaStage: 'انتزاعی (Abstract)',
    description: 'حاصل ضرب همسایه را می‌گوید؛ مثلاً ۴×۶ را ۲۰ (حاصل ۴×۵) یا ۶×۷ را ۳۵ می‌گوید.',
    clinicalActionFa: 'رسم دو آرایه ۴×۵ و ۴×۶ کنار هم و نشان دادن یک ستون اضافه (۴ واحد بیشتر).',
  },
  E_DOUBLING_HALVING: {
    code: 'E_DOUBLING_HALVING',
    titleFa: 'خطای دوبرابر / نصف کردن',
    cpaStage: 'تصویری (Pictorial)',
    description: 'حاصل ۲×۴=۸ را بلد است، ولی ۴×۴ را هم ۸ می‌گوید.',
    clinicalActionFa: 'تا زدن متوالی کاغذ شطرنجی و مشاهده عینی دوبرابر شدن مساحت مساحت‌ها.',
  },
};

// Remediation Side Missions from math-game (experience.mjs)
const SIDE_MISSIONS = [
  {
    id: 'side-1-antenna',
    title: 'تعمیر آنتن فرعی',
    objective: 'روشن کردن آنتن با سلول‌های جدول‌های ۲، ۳، ۴ و ۵',
    tablesCovered: [2, 3, 4, 5],
    sector: 'ایستگاه نیرو',
    icon: RadioTower,
  },
  {
    id: 'side-2-backup',
    title: 'شارژ سلول پشتیبان',
    objective: 'فعال‌سازی باتری پشتیبان برج با جدول‌های ۶، ۷، ۸ و ۹',
    tablesCovered: [6, 7, 8, 9],
    sector: 'ایستگاه آنتن',
    icon: BatteryCharging,
  },
  {
    id: 'side-3-fuel',
    title: 'تأمین سوخت اضافه',
    objective: 'آماده‌سازی سوخت ویژه پرتاب برای جدول‌های ۱۰، ۱۱ و ۱۲',
    tablesCovered: [10, 11, 12],
    sector: 'سکوی پرتاب',
    icon: Rocket,
  },
];

// Active Class Bottlenecks Data (Mock from math-game database)
interface Bottleneck {
  id: string;
  fact: string;
  errorRate: number; // 0..1
  affectedStudentsCount: number;
  affectedNames: string[];
  errorCode: string;
  severity: 'critical' | 'high' | 'medium';
  remedyMissionId: string;
}

const INITIAL_BOTTLENECKS: Bottleneck[] = [
  {
    id: 'b-1',
    fact: '۴ × ۶',
    errorRate: 0.44,
    affectedStudentsCount: 4,
    affectedNames: ['علی', 'امیرعلی', 'سهراب', 'رادین'],
    errorCode: 'E_PLACE_SHIFT',
    severity: 'critical',
    remedyMissionId: 'side-1-antenna',
  },
  {
    id: 'b-2',
    fact: '۶ × ۷',
    errorRate: 0.38,
    affectedStudentsCount: 3,
    affectedNames: ['سارا', 'مریم', 'نیما'],
    errorCode: 'E_ANCHOR_DRIFT',
    severity: 'high',
    remedyMissionId: 'side-2-backup',
  },
  {
    id: 'b-3',
    fact: '۳ × ۴',
    errorRate: 0.28,
    affectedStudentsCount: 2,
    affectedNames: ['حلما', 'کیان'],
    errorCode: 'E_ADD_CONFUSION',
    severity: 'medium',
    remedyMissionId: 'side-1-antenna',
  },
  {
    id: 'b-4',
    fact: '۸ × ۷',
    errorRate: 0.35,
    affectedStudentsCount: 3,
    affectedNames: ['علی', 'باران', 'ماهان'],
    errorCode: 'E_DOUBLING_HALVING',
    severity: 'high',
    remedyMissionId: 'side-2-backup',
  },
];

// Leaderboard Data from math-game Realtime Leaderboard
interface LeaderboardPlayer {
  rank: number;
  name: string;
  hero: 'astronaut' | 'pilot' | 'scientist';
  heroTitle: string;
  progressPct: number;
  overallAccuracy: number;
  totalSessions: number;
  totalQuestions: number;
  lastActivity: string;
}

const LEADERBOARD_DATA: LeaderboardPlayer[] = [
  { rank: 1, name: 'حلما', hero: 'astronaut', heroTitle: 'فضانورد', progressPct: 92, overallAccuracy: 0.96, totalSessions: 14, totalQuestions: 180, lastActivity: '۱۰ دقیقه پیش' },
  { rank: 2, name: 'امیرعلی', hero: 'pilot', heroTitle: 'خلبان', progressPct: 88, overallAccuracy: 0.91, totalSessions: 12, totalQuestions: 154, lastActivity: '۳۵ دقیقه پیش' },
  { rank: 3, name: 'سارا', hero: 'scientist', heroTitle: 'دانشمند', progressPct: 85, overallAccuracy: 0.89, totalSessions: 11, totalQuestions: 142, lastActivity: '۱ ساعت پیش' },
  { rank: 4, name: 'باران', hero: 'astronaut', heroTitle: 'فضانورد', progressPct: 78, overallAccuracy: 0.84, totalSessions: 9, totalQuestions: 118, lastActivity: 'امروز ۱۱:۲۰' },
  { rank: 5, name: 'علی', hero: 'pilot', heroTitle: 'خلبان', progressPct: 65, overallAccuracy: 0.76, totalSessions: 7, totalQuestions: 94, lastActivity: 'دیروز' },
  { rank: 6, name: 'مریم', hero: 'scientist', heroTitle: 'دانشمند', progressPct: 58, overallAccuracy: 0.71, totalSessions: 6, totalQuestions: 82, lastActivity: '۲ روز پیش' },
];

export const TeacherAssistantModule: React.FC<TeacherAssistantModuleProps> = ({
  classNameTitle,
  plants = [],
  onRewardHabit,
  onExitToGarden,
  onSendTeacherNudge,
}) => {
  const [activeTab, setActiveTab] = useState<'bottlenecks' | 'ava_advisor' | 'leaderboard' | 'cartridges' | 'arena_sim' | 'pipeline_info'>('ava_advisor');
  const [selectedBottleneck, setSelectedBottleneck] = useState<Bottleneck | null>(null);

  // Space Game Simulation State
  const [simQuestion, setSimQuestion] = useState({
    a: 4,
    b: 6,
    correct: 24,
    distractors: [
      { text: '۲۴', value: 24, errorKey: null },
      { text: '۴۲', value: 42, errorKey: 'E_PLACE_SHIFT' },
      { text: '۲۰', value: 20, errorKey: 'E_ANCHOR_DRIFT' },
      { text: '۱۰', value: 10, errorKey: 'E_ADD_CONFUSION' },
    ],
  });
  const [simFeedback, setSimFeedback] = useState<{ isCorrect: boolean; message: string; diagnostic?: string } | null>(null);

  const handleSimAnswer = (option: { text: string; value: number; errorKey: string | null }) => {
    if (option.value === simQuestion.correct) {
      sound.playJoyfulChime();
      setSimFeedback({
        isCorrect: true,
        message: 'عالی بود! پاسخ دقیق و درست است 🌟 مأموریت نجات ایستگاه با موفقیت جلو رفت.',
      });
      if (onRewardHabit) {
        onRewardHabit('p-15', 'homework');
      }
    } else {
      sound.playGentlePluck(280);
      const errInfo = option.errorKey ? COGNITIVE_ERRORS[option.errorKey] : null;
      setSimFeedback({
        isCorrect: false,
        message: `پاسخ نادرست است. گزینهٔ ${option.text} انتخاب شد.`,
        diagnostic: errInfo
          ? `🔍 تشخیص موتور هوشمند: خطای «${errInfo.titleFa}» (${errInfo.cpaStage}). راهکار بالینی: ${errInfo.clinicalActionFa}`
          : 'حدس تصادفی شناسایی شد.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner & Engine Context */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E3A8A] text-white rounded-3xl p-6 shadow-md border border-[#334155]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-3xl shadow-lg ring-4 ring-[#3B82F6]/30 shrink-0">
              📐
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  دستیار معلم ابتدایی — موتور تشخیصی ریاضی (Math Game Engine)
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#22C55E]/20 text-[#4ADE80] border border-[#22C55E]/30">
                  نسخه فعال: v10.3 (ماتریس CEAP & اسکلت G2/G3)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                کشف گلوگاه‌های شناختی • حلقهٔ گزارش به اقدام با مأموریت‌های درمانی • متصل به اکوسیستم «جوانه»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onExitToGarden && (
              <button
                onClick={onExitToGarden}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>🌿</span>
                <span>بازگشت به باغچه جوانه</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ کارنامهٔ گلوگاه‌ها</span>
            </button>
          </div>
        </div>

        {/* Engine Pipeline Metadata */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#38BDF8]" />
            <span>واحد تحلیل کتاب: <strong>ربات آشیل (Achilles)</strong> • واحد تألیف و توازن: <strong>آرنا (Arena)</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#94A3B8]">خشاب‌ها: <strong>G1, G2 (کد ۲۰۵), G3 (کد ۳۰۵)</strong></span>
            <span className="text-[#94A3B8]">پروتکل: <strong>رویکرد سه سطحی CPA</strong></span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        {[
          { id: 'ava_advisor', label: '🎙️ مشاور آوا (Voice-to-Emotion)', icon: Sparkles },
          { id: 'bottlenecks', label: '🔍 گلوگاه‌های کلاسی و مأموریت درمانی', icon: AlertTriangle },
          { id: 'leaderboard', label: '🏆 جدول قهرمانان و لیدربرد زنده', icon: Trophy },
          { id: 'cartridges', label: '📦 کارگاه خشاب‌ها (G1/G2/G3)', icon: Layers },
          { id: 'arena_sim', label: '🎮 شبیه‌ساز چالش درمانی آرنا', icon: Rocket },
          { id: 'pipeline_info', label: '📜 معماری خط لوله ربات آشیل و آرنا', icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPlantClick(500);
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: AVA ADVISOR (VOICE-TO-EMOTION) WIDGET */}
      {activeTab === 'ava_advisor' && (
        <AvaAdvisorWidget
          plants={plants}
          onSendNudge={onSendTeacherNudge}
        />
      )}

      {/* TAB 1: BOTTLENECKS & CLINICAL REMEDIATION */}
      {activeTab === 'bottlenecks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9] mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                  <span>گلوگاه‌های فعال کلاس — کشف الگوهای خطای شناختی</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  هنگامی که چند دانش‌آموز در یک فاکت ضرب مشخص گیر می‌کنند، سیستم الگوی خطا را ریشه‌یابی کرده و مأموریت بازی متناظر را پیشنهاد می‌دهد.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-[#FEF3C7] text-[#92400E] rounded-full border border-[#FDE68A]">
                {INITIAL_BOTTLENECKS.length} گلوگاه نیازمند مداخله
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-3">فاکت ضرب</th>
                    <th className="py-3 px-3">نرخ خطای کلاس</th>
                    <th className="py-3 px-3">تعداد دانش‌آموز درگیر</th>
                    <th className="py-3 px-3">تشخیص شناختی (کد خطا)</th>
                    <th className="py-3 px-3">مأموریت درمانی بازی (Remedy)</th>
                    <th className="py-3 px-3 text-center">اقدام معلم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {INITIAL_BOTTLENECKS.map((b) => {
                    const errMeta = COGNITIVE_ERRORS[b.errorCode];
                    const remedy = SIDE_MISSIONS.find((m) => m.id === b.remedyMissionId);
                    const RemedyIcon = remedy?.icon || Rocket;
                    return (
                      <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-3 font-black text-base text-[#0F172A]">
                          {b.fact}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                              b.severity === 'critical'
                                ? 'bg-[#FEE2E2] text-[#991B1B]'
                                : b.severity === 'high'
                                ? 'bg-[#FFEDD5] text-[#9A3412]'
                                : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}
                          >
                            ٪{Math.round(b.errorRate * 100)} خطا
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-[#1E293B]">
                            {b.affectedStudentsCount} نفر
                          </div>
                          <div className="text-[11px] text-[#64748B]">
                            ({b.affectedNames.join('، ')})
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-[#0F172A]">{errMeta?.titleFa}</div>
                          <div className="text-[11px] text-[#64748B]">{errMeta?.cpaStage}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          {remedy && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold">
                              <RemedyIcon className="w-3.5 h-3.5" />
                              <span>{remedy.title} ({remedy.sector})</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedBottleneck(b)}
                            className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            مشاهده تجویز فردا
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Clinical Action Drawer / Modal */}
          {selectedBottleneck && (
            <div
              className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
              onClick={() => setSelectedBottleneck(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#CBD5E1] space-y-4 text-right"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🩺</span>
                    <div>
                      <h4 className="text-lg font-bold text-[#0F172A]">
                        تجویز مداخله بالینی معلم برای گلوگاه «{selectedBottleneck.fact}»
                      </h4>
                      <span className="text-xs text-[#64748B]">
                        کد خطا: {selectedBottleneck.errorCode}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBottleneck(null)}
                    className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Cognitive Diagnosis Card */}
                <div className="bg-[#FAF8F5] border border-[#EADFCF] rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-[#7A5C43] block">
                    ۱. علت روانی-شناختی این خطا چیست؟
                  </span>
                  <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
                    {COGNITIVE_ERRORS[selectedBottleneck.errorCode]?.description}
                  </p>
                </div>

                {/* Tomorrow Clinical Action */}
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-[#065F46] block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span>۲. کار فردا در کلاس (مداخله CPA معلم):</span>
                  </span>
                  <p className="text-xs sm:text-sm text-[#064E3B] leading-relaxed font-medium">
                    «{COGNITIVE_ERRORS[selectedBottleneck.errorCode]?.clinicalActionFa}»
                  </p>
                </div>

                {/* In-Game Remedy Connection */}
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 text-xs space-y-1">
                  <span className="font-bold text-[#1E40AF] block">
                    ۳. مأموریت ایستگاه فضایی بازی برای این گروه:
                  </span>
                  <p className="text-[#334155]">
                    دانش‌آموزان درگیر ({selectedBottleneck.affectedNames.join('، ')}) به صورت خودکار به مأموریت «
                    {SIDE_MISSIONS.find((m) => m.id === selectedBottleneck.remedyMissionId)?.title}
                    » در ایستگاه بازی هدایت می‌شوند تا بدون سرزنش، سلول‌های آسیب‌دیده را شارژ کنند.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBottleneck(null)}
                  className="w-full py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  متوجه شدم، اقدام می‌کنم
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                <span>جدول زندهٔ قهرمانان کلاس (Live Leaderboard)</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                اتاق مسابقه کلاسی • رتبه‌بندی بر اساس پیشرفت ایستگاه‌ها و دقت کل جلسات بدون نمره‌دهی استرس‌زا
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B]">کد اتاق کلاس:</span>
              <span className="text-xs font-mono font-bold bg-[#F1F5F9] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                ۳۰۵-۸۸۲
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-3 text-center w-14">رتبه</th>
                  <th className="py-3 px-3">دانش‌آموز و نقش</th>
                  <th className="py-3 px-3">پیشرفت در ایستگاه فضایی</th>
                  <th className="py-3 px-3 text-center">دقت کل</th>
                  <th className="py-3 px-3 text-center">تعداد جلسه‌ها</th>
                  <th className="py-3 px-3 text-center">سؤال‌های پاسخ‌داده</th>
                  <th className="py-3 px-3 text-center">آخرین فعالیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {LEADERBOARD_DATA.map((player) => (
                  <tr
                    key={player.rank}
                    className={`hover:bg-[#F8FAFC] transition-colors ${
                      player.rank === 1
                        ? 'bg-[#FEFCE8]/60 font-semibold'
                        : player.rank === 2
                        ? 'bg-[#F8FAFC]/80'
                        : player.rank === 3
                        ? 'bg-[#FFF7ED]/50'
                        : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center text-base">
                      {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {player.rank === 1 && <span className="text-xs">👑</span>}
                        <span className="font-bold text-[#0F172A]">{player.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                          {player.heroTitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 sm:w-32 h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#3B82F6] to-[#10B981] rounded-full"
                            style={{ width: `${player.progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#64748B]">٪{player.progressPct}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-[#059669]">
                      ٪{Math.round(player.overallAccuracy * 100)}
                    </td>
                    <td className="py-3.5 px-3 text-center">{player.totalSessions}</td>
                    <td className="py-3.5 px-3 text-center font-mono">{player.totalQuestions}</td>
                    <td className="py-3.5 px-3 text-center text-xs text-[#64748B]">{player.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CARTRIDGES WORKSHOP (G1 / G2 / G3) */}
      {activeTab === 'cartridges' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'KH-G1-MATH',
              title: 'خشاب ریاضی اول دبستان',
              code: 'کد ۱۰۵',
              chapters: '۸ فصل مصوب',
              budget: '۲۵۰ سؤال استاندارد',
              levels: 'دانشی ۳۵٪ • کاربردی ۴۵٪ • استدلالی ۲۰٪',
              status: 'آماده و ممیزی‌شده',
              badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
              icon: '🌱',
            },
            {
              id: 'KH-G2-MATH',
              title: 'خشاب ریاضی دوم دبستان',
              code: 'کد ۲۰۵ (چاپ ۱۴۰۴)',
              chapters: '۸ فصل × ۱۸ صفحه (۱۴۴ صفحه)',
              budget: '۳۶۸ الی ۵۵۲ سؤال (قاعدهٔ ۱٫۵×)',
              levels: 'دانشی ۱۲۰-۱۸۰ • کاربردی ۱۷۰-۲۵۵ • استدلالی ۷۸-۱۱۷',
              status: 'تأییدشده با گیت ۴۳ آزمونه',
              badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
              icon: '📐',
            },
            {
              id: 'KH-G3-MATH',
              title: 'خشاب ریاضی سوم دبستان',
              code: 'کد ۳۰۵ (چاپ ۱۴۰۴)',
              chapters: '۸ فصل × ۱۸ صفحه (فصل ۴: ضرب و تقسیم)',
              budget: '۴۵۶ الی ۶۸۴ سؤال (۳۶ ردیف موضوعی)',
              levels: 'دانشی ۱۵۰-۲۲۶ • کاربردی ۲۱۲-۳۱۸ • استدلالی ۹۴-۱۴۰',
              status: 'پوشش کامل ماتریس دامنه‌ای',
              badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
              icon: '🎲',
            },
            {
              id: 'KH-G4-MATH',
              title: 'خشاب ریاضی چهارم دبستان',
              code: 'کد ۴۰۵ (چاپ ۱۴۰۴)',
              chapters: '۷ فصل × ۲۰ صفحه (۱۴۰ صفحه)',
              budget: '۴۸۰ الی ۶۰۰ سؤال استاندارد',
              levels: 'دانشی ۳۰٪ • کاربردی ۵۰٪ • استدلالی ۲۰٪',
              status: 'ممیزی‌شده با ران‌تایم G4-1404',
              badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
              icon: '🔷',
            },
            {
              id: 'KH-G5-MATH',
              title: 'خشاب ریاضی پنجم دبستان',
              code: 'کد ۵۰۵ (چاپ ۱۴۰۴)',
              chapters: '۷ فصل (ص ۱ تا ۱۶۰ - ۱۶۰ ردیف چک‌لیست)',
              budget: '۴۶ مهارت محوری • ۸ دهان شناختی',
              levels: 'دانشی ۳۲٪ • کاربردی ۴۸٪ • استدلالی ۲۰٪',
              status: 'تثبیت‌شده با G5-1404-RUNTIME',
              badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
              icon: '🌟',
            },
            {
              id: 'KH-G6-MATH',
              title: 'خشاب ریاضی ششم دبستان',
              code: 'کد ۶۰۵ (چاپ ۱۴۰۴)',
              chapters: '۷ فصل مصوب (مضارب، اعشار، دایره و تقریب)',
              budget: '۵۲۰ سؤال و کارت‌های مسابقه آرنا',
              levels: 'دانشی ۳۰٪ • کاربردی ۴۵٪ • استدلالی ۲۵٪',
              status: 'کامل و آماده بهره‌برداری',
              badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
              icon: '🏆',
            },
          ].map((cartridge) => (
            <div key={cartridge.id} className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{cartridge.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">{cartridge.title}</h4>
                    <span className="text-[11px] text-[#64748B] font-mono">{cartridge.id}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cartridge.badgeColor}`}>
                  {cartridge.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#334155]">
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">کتاب مرجع:</span>
                  <span className="font-semibold">{cartridge.code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">ساختار کتاب:</span>
                  <span className="font-semibold">{cartridge.chapters}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
                  <span className="text-[#64748B]">سهمیه بودجه مالک:</span>
                  <span className="font-bold text-[#1E40AF]">{cartridge.budget}</span>
                </div>
                <div className="py-1">
                  <span className="text-[#64748B] block mb-1">توزیع سطوح شناختی:</span>
                  <span className="text-[11px] font-medium text-[#0F172A] bg-[#F8FAFC] p-1.5 rounded-lg block">
                    {cartridge.levels}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  مشاهده اطلس خطا و نقشهٔ کتاب
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ARENA DIAGNOSTIC GAME SIMULATOR */}
      {activeTab === 'arena_sim' && (
        <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#2563EB]" />
                <span>شبیه‌ساز مسابقه و تست خطای شناختی آرنا (Arena Diagnostic Simulator)</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                روی گزینه‌های زیر کلیک کنید تا ببینید موتور چگونه پاسخ‌های انحرافی را به کدهای خطای شناختی CEAP نسبت می‌دهد.
              </p>
            </div>
            <span className="text-xs bg-[#EFF6FF] text-[#1E40AF] px-3 py-1 rounded-full border border-[#BFDBFE] font-bold">
              چالش ایستگاه: فاکت ۴ × ۶
            </span>
          </div>

          <div className="max-w-xl mx-auto space-y-5 py-4">
            <div className="p-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl text-center shadow-md">
              <span className="text-xs font-semibold text-[#38BDF8] block mb-1">
                تعمیر باتری ایستگاه فضایی
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-wider text-white">
                ۴ × ۶ = ؟
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {simQuestion.distractors.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSimAnswer(opt)}
                  className="p-4 rounded-2xl border-2 border-[#E2E8F0] hover:border-[#3B82F6] bg-[#F8FAFC] hover:bg-[#EFF6FF] text-xl font-black text-[#0F172A] transition-all transform active:scale-95 shadow-xs cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <span>{opt.text}</span>
                  {opt.errorKey && (
                    <span className="text-[10px] text-[#94A3B8] font-normal">
                      (تست {opt.errorKey.replace('E_', '')})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {simFeedback && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all animate-fade-in ${
                  simFeedback.isCorrect
                    ? 'bg-[#ECFDF5] border-[#6EE7B7] text-[#065F46]'
                    : 'bg-[#FFFBEB] border-[#FCD34D] text-[#92400E]'
                }`}
              >
                <div>{simFeedback.message}</div>
                {simFeedback.diagnostic && (
                  <div className="mt-2 pt-2 border-t border-[#FDE68A] text-xs font-normal leading-relaxed text-[#78350F]">
                    {simFeedback.diagnostic}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ARCHITECTURE PIPELINE (ACHILLES & ARENA) */}
      {activeTab === 'pipeline_info' && (
        <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#8B5CF6]" />
              <span>معماری خط تولید محتوا: تقسیم کار ربات آشیل (Achilles) و آرنا (Arena)</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              مبتنی بر اسناد رسمی مخزن math-game (`HANDOFF-COVER-v1`, `SKELETON-G2-KH-v1`, `SKELETON-G3-KH-v1`)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Achilles Bot Role */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  ۱. واحد ربات آشیل (تحلیل و انطباق کتاب درسی)
                </h4>
              </div>
              <ul className="text-xs text-[#475569] space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#3B82F6] font-bold">•</span>
                  <span><strong>نگاشت فایل به چاپی:</strong> تصحیح انحراف ۶ صفحه‌ای فایل‌های اسکن‌شده C205 و C305 تا شماره چاپی همواره ملاک مطلق باشد.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#3B82F6] font-bold">•</span>
                  <span><strong>قفل ستون فقرات:</strong> تثبیت ۸ فصل × ۱۸ صفحه مصوب آموزش و پرورش (۴ درس + ۱ حل مسئله + ۱ مرور و معما).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#3B82F6] font-bold">•</span>
                  <span><strong>گیت‌های Fail-Closed:</strong> هرگونه تناقض بین نسخه چاپی و اسکلت ماشینی بدون حل دستی متوقف می‌شود.</span>
                </li>
              </ul>
            </div>

            {/* Arena Bot Role */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏟️</span>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  ۲. واحد آرنا (تألیف محتوا و توازن خشاب‌ها)
                </h4>
              </div>
              <ul className="text-xs text-[#475569] space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#8B5CF6] font-bold">•</span>
                  <span><strong>کنترل پاکت بودجه:</strong> سقف و کف سؤالات در سه سطح دانشی، کاربردی و استدلالی (نسبت ۳۳/۴۶/۲۱) و قانون ۱٫۵×.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#8B5CF6] font-bold">•</span>
                  <span><strong>شاخه‌های گیت‌هاب `arena/*`:</strong> تألیف در اکسل‌های مادر، خروجی‌های JSON با هش اعتبارسنجی SHA-256 و ادغام رسمی.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#8B5CF6] font-bold">•</span>
                  <span><strong>توزیع CPA:</strong> اطمینان از پوشش کامل مفاهیم مجسم (دست‌ورزی)، تصویری (محور/آرایه) و انتزاعی.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADFCF] text-xs text-[#6B513E] leading-relaxed">
            💡 <strong>نتیجه در سوپرپلتفرم یکپارچه:</strong> تمام تحلیل‌های ریاضی آشیل و آرنا، بدون نیاز به نصب دوباره، در قالب ماژول «دستیار معلم» در خدمت پلتفرم مرکزی قرار می‌گیرند و همزمان با گیاه «جوانه» داده‌های آموزشی و عاطفی کودک را به صورت جامع تکمیل می‌کنند.
          </div>
        </div>
      )}
    </div>
  );
};
