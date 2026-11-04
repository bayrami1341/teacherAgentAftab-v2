import React, { useState } from 'react';
import { Plant, Mood } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
  Heart,
  Info,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface EmotionalRhythmChartWidgetProps {
  plants: Plant[];
}

// 7-Day Simulated Classroom Emotional Rhythm Data
const WEEKLY_RHYTHM_DATA = [
  {
    day: 'شنبه',
    thriving: 12,
    content: 5,
    longing: 2,
    alert: 1,
    healthScore: 82,
    note: 'شروع هفته با انرژی بالا؛ بیشتر دانش‌آموزان بیدارباش سحرگاه را ثبت کردند.',
  },
  {
    day: 'یکشنبه',
    thriving: 14,
    content: 4,
    longing: 1,
    alert: 1,
    healthScore: 88,
    note: 'بهترین ریتم بیدارباش؛ ۱۴ گیاه در وضعیت سرزنده قرار گرفتند.',
  },
  {
    day: 'دوشنبه',
    thriving: 11,
    content: 6,
    longing: 2,
    alert: 1,
    healthScore: 78,
    note: 'افت جزئی به دلیل قطعی برق منطقه‌ای و تعطیلی غیرحضوری.',
  },
  {
    day: 'سه‌شنبه',
    thriving: 9,
    content: 5,
    longing: 4,
    alert: 2,
    healthScore: 68,
    note: 'چند دانش‌آموز غایب بودند؛ معلم نوازش‌های مهربانانه ارسال کرد.',
  },
  {
    day: 'چهارشنبه',
    thriving: 13,
    content: 4,
    longing: 2,
    alert: 1,
    healthScore: 84,
    note: 'بازگشت شادابی به باغچه پس از نوازش‌های معلم و تکالیف عصر.',
  },
  {
    day: 'پنج‌شنبه',
    thriving: 15,
    content: 3,
    longing: 1,
    alert: 1,
    healthScore: 90,
    note: 'پایان هفته با تثبیت عادات و ثبت بیدارباش‌های سر وقت.',
  },
  {
    day: 'جمعه',
    thriving: 16,
    content: 3,
    longing: 1,
    alert: 0,
    healthScore: 94,
    note: 'روز آرامش باغچه؛ صفر گیاه نیازمند توجه ویژه.',
  },
];

export const EmotionalRhythmChartWidget: React.FC<EmotionalRhythmChartWidgetProps> = ({
  plants,
}) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [activeMoodFilter, setActiveMoodFilter] = useState<'all' | 'thriving' | 'longing' | 'alert'>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  // Custom Recharts Persian Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = WEEKLY_RHYTHM_DATA.find((d) => d.day === label);
      return (
        <div className="bg-[#0F172A] text-white p-3.5 rounded-2xl shadow-xl border border-white/20 text-right text-xs space-y-2 dir-rtl font-sans max-w-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 font-black">
            <span className="text-[#38BDF8]">{label}</span>
            <span className="text-[10px] bg-[#1E293B] px-2 py-0.5 rounded-full text-[#38BDF8]">
              شاخص سلامت: ٪{dayData?.healthScore}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-[#34D399]">
              <span>🌿 سرزنده و پرانرژی:</span>
              <span className="font-bold">{dayData?.thriving} گیاه</span>
            </div>
            <div className="flex items-center justify-between text-[#38BDF8]">
              <span>🍃 آرام و متوازن:</span>
              <span className="font-bold">{dayData?.content} گیاه</span>
            </div>
            <div className="flex items-center justify-between text-[#FBBF24]">
              <span>🌾 دلتنگ و چشم‌به‌راه:</span>
              <span className="font-bold">{dayData?.longing} گیاه</span>
            </div>
            <div className="flex items-center justify-between text-[#F87171]">
              <span>🍂 نیازمند توجه ویژه:</span>
              <span className="font-bold">{dayData?.alert} گیاه</span>
            </div>
          </div>

          {dayData?.note && (
            <div className="pt-2 border-t border-white/10 text-[10px] text-[#CBD5E1] leading-relaxed italic">
              💡 {dayData.note}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-5 text-right dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-2xl shadow-md ring-4 ring-[#10B981]/20">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                تحلیل بصری ریتم عاطفی کلاس (Visual Emotional Analytics)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] text-[10px] font-bold border border-[#A7F3D0]">
                نمودار هفته گذشته
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              پایش روند تغییرات خلق‌وخوی گیاهان (Mood) • تحلیل ریتم حضور، بیدارباش و بهداشت روان کلاس
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-2xl border border-[#E2E8F0] text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setChartType('line');
              sound.playPlantClick(480);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              chartType === 'line'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>نمودار خطی</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setChartType('area');
              sound.playPlantClick(520);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              chartType === 'area'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>نمودار مساحتی</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1">
          <span className="text-[11px] font-bold text-[#065F46] block">میانگین سرزندگی (Thriving)</span>
          <div className="text-lg font-black text-[#047857] flex items-center justify-between">
            <span>۱۳٫۶ گیاه</span>
            <span className="text-xs font-bold bg-[#A7F3D0] px-2 py-0.5 rounded-full text-[#064E3B]">٪۶۸</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] space-y-1">
          <span className="text-[11px] font-bold text-[#0369A1] block">گیاهان آرام (Content)</span>
          <div className="text-lg font-black text-[#0284C7] flex items-center justify-between">
            <span>۴٫۱ گیاه</span>
            <span className="text-xs font-bold bg-[#BAE6FD] px-2 py-0.5 rounded-full text-[#0C4A6E]">٪۲۰</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] space-y-1">
          <span className="text-[11px] font-bold text-[#92400E] block">گیاهان دلتنگ (Longing)</span>
          <div className="text-lg font-black text-[#D97706] flex items-center justify-between">
            <span>۲٫۰ گیاه</span>
            <span className="text-xs font-bold bg-[#FDE68A] px-2 py-0.5 rounded-full text-[#78350F]">٪۱۰</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] space-y-1">
          <span className="text-[11px] font-bold text-[#991B1B] block">نیازمند توجه (Alert)</span>
          <div className="text-lg font-black text-[#DC2626] flex items-center justify-between">
            <span>۰٫۹ گیاه</span>
            <span className="text-xs font-bold bg-[#FECACA] px-2 py-0.5 rounded-full text-[#7F1D1D]">٪۲</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#EADFCF] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#475569]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#2563EB]" />
            <span>روند تغییرات خلق‌وخو در ۷ روز گذشته:</span>
          </span>
          <span className="text-[11px] text-[#64748B]">
            راهنما: روی نقطه‌های نمودار بروید تا جزئیات مشاهده شود.
          </span>
        </div>

        <div className="w-full h-72 sm:h-80 dir-ltr text-xs">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={WEEKLY_RHYTHM_DATA} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      thriving: 'سرزنده 🌿',
                      content: 'آرام 🍃',
                      longing: 'دلتنگ 🌾',
                      alert: 'نیازمند توجه 🍂',
                      healthScore: 'شاخص سلامت کلاسی ٪',
                    };
                    return <span className="text-xs font-bold text-[#334155] mx-1">{labels[value] || value}</span>;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="thriving"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="content"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0284C7' }}
                />
                <Line
                  type="monotone"
                  dataKey="longing"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#F59E0B' }}
                />
                <Line
                  type="monotone"
                  dataKey="alert"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#EF4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            ) : (
              <AreaChart data={WEEKLY_RHYTHM_DATA} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      thriving: 'سرزنده 🌿',
                      content: 'آرام 🍃',
                      longing: 'دلتنگ 🌾',
                      alert: 'نیازمند توجه 🍂',
                    };
                    return <span className="text-xs font-bold text-[#334155] mx-1">{labels[value] || value}</span>;
                  }}
                />
                <Area type="monotone" dataKey="thriving" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="content" stackId="1" stroke="#0284C7" fill="#0284C7" fillOpacity={0.5} />
                <Area type="monotone" dataKey="longing" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.5} />
                <Area type="monotone" dataKey="alert" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.5} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pedagogical Trend Insight Box */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 text-xs space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-[#1E40AF]">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <span>تحلیل پداگوژیک و توصیهٔ عاطفی معلم:</span>
        </div>
        <p className="text-[#1E3A8A]">
          📈 <strong>روند هفتگی:</strong> اواسط هفته (سه‌شنبه) افت جزئی در بیدارباش مشاهده شد که با ارسال نوازش‌های مهربانانه معلم، در روزهای چهارشنبه و پنج‌شنبه ریتم شادابی کلاس دوباره به فوق‌العاده (٪۹۰) رسید.
        </p>
        <div className="flex items-center gap-1.5 text-[#0369A1] font-medium pt-1">
          <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
          <span>بدون رتبه‌بندی عددی؛ این نمودار منحصراً جهت آگاهی معلم از سلامت روان و ریتم عادات کلاس استفاده می‌شود.</span>
        </div>
      </div>
    </div>
  );
};
