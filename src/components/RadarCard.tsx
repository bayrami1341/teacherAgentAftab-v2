import React from 'react';
import { Sparkles, HeartHandshake, ArrowUpRight } from 'lucide-react';
import { RadarData } from '../types';

interface RadarCardProps {
  radar: RadarData;
  onSelectPlantById: (plantId: string) => void;
}

export const RadarCard: React.FC<RadarCardProps> = ({ radar, onSelectPlantById }) => {
  const { overallMessage, healthPercentage, goodNews, needsAttention } = radar;

  // Determine overall status tone for card styling (soft pastel, NEVER harsh red)
  const isHealthy = healthPercentage >= 70;
  const isNeedsCare = healthPercentage < 40;

  return (
    <section className="bg-white border border-[#E8DFC9] rounded-2xl p-5 sm:p-6 shadow-xs hover:border-[#D9CDB2] transition-colors">
      <div className="flex flex-col gap-5">
        {/* Top: Human summary message & Progress bar */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {isHealthy ? '🌱' : isNeedsCare ? '🍂' : '🌿'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D]">
                {overallMessage}
              </h2>
            </div>
            <span className="text-xs font-medium text-[#7A7A7A]">
              رادار ۱۰ ثانیه‌ای ریتم کلاسی
            </span>
          </div>

          {/* Progress bar WITHOUT any stressful numbers or grades */}
          <div className="w-full bg-[#EFE9DC] h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(12, Math.min(100, healthPercentage))}%`,
                background: 'linear-gradient(90deg, #C8D9B5 0%, #9BC47A 50%, #7BA05B 100%)',
              }}
              title="هماهنگی و شادابی کلی باغچه"
            />
          </div>
        </div>

        {/* Middle Section: Good News & Needs Attention Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Column 1: Good News Feed (خبرهای خوب باغچه) */}
          {goodNews && goodNews.length > 0 && (
            <div className="bg-[#FAF7EE] border border-[#EFE5D3] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#486333] mb-2.5">
                  <Sparkles className="w-4 h-4 text-[#7BA05B]" />
                  <span>رویدادهای شادی‌بخش اخیر</span>
                </div>
                <div className="space-y-2">
                  {goodNews.map((news, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#3D4736] leading-relaxed bg-white/70 p-2.5 rounded-lg border border-[#EDE3CF]"
                    >
                      <span className="text-sm shrink-0 mt-0.5">
                        {news.type === 'comeback' ? '🕊️' : news.type === 'stage' ? '🌸' : news.type === 'dream' ? '🌙' : '🌾'}
                      </span>
                      <span>{news.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-[#8C8C8C] mt-3">
                این خبرها بر اساس رویدادهای زنده و واقعی ۴۸ ساعت گذشته ثبت شده‌اند.
              </p>
            </div>
          )}

          {/* Column 2: Needs Attention (نیاز به توجه مهربانانه) */}
          <div className="bg-[#FAF7EE] border border-[#EFE5D3] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8C5D39]">
                  <HeartHandshake className="w-4 h-4 text-[#E8A87C]" />
                  <span>نیازمند گفت‌وگو و احوالپرسی</span>
                </div>
                <span className="text-[11px] text-[#8C7A68] bg-[#F2E8D7] px-2 py-0.5 rounded-full">
                  حداکثر ۳ تا ۵ پیشنهاد
                </span>
              </div>

              {needsAttention && needsAttention.length > 0 ? (
                <div className="space-y-2">
                  {needsAttention.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectPlantById(item.plantId)}
                      className="w-full text-right p-2.5 rounded-lg bg-white/80 hover:bg-white border border-[#EDE3CF] hover:border-[#DDCBB1] transition-all group flex items-start justify-between gap-2 cursor-pointer shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#2D2D2D]">
                          <span className="font-bold text-[#3B4D2B]">
                            گیاه «{item.plantName}»
                          </span>
                          <span className="text-[#888] font-normal text-[11px]">
                            ({item.childName})
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FCEEE3] text-[#A66135]">
                            {item.lastSeenDays === 0
                              ? 'امروز دیده'
                              : `${item.lastSeenDays} روزه ندیده`}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#636363] leading-normal group-hover:text-[#333]">
                          <span className="text-[#8C5D39] font-medium">پیشنهاد: </span>
                          {item.hint}
                        </p>
                      </div>

                      <div className="p-1 rounded-md text-[#999] group-hover:text-[#4A6B32] group-hover:bg-[#EBF3E4] transition-colors shrink-0 mt-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#527339] bg-white/60 rounded-lg border border-[#E3EDD9]">
                  <span>🌿 امروز همه‌ی گیاهان باغچه حالشان خوب و آرام است.</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#8C8C8C] mt-3">
              کلیک روی هر مورد، کارت گفت‌وگو و جزئیات تکالیف را برای معلم باز می‌کند.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
