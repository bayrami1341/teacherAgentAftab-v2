import React, { useEffect } from 'react';
import { Plant, RadarData } from '../types';
import { PlantSvg } from './PlantSvg';
import { Minimize2, RefreshCw, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface BoardModeProps {
  plants: Plant[];
  radar: RadarData;
  classNameTitle: string;
  onExit: () => void;
  onRefresh?: () => void;
}

export const BoardMode: React.FC<BoardModeProps> = ({
  plants,
  radar,
  classNameTitle,
  onExit,
  onRefresh,
}) => {
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date());

  // Listen to Escape key to exit
  useEffect(() => {
    sound.playBoardChime();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Auto-refresh interval every 30 seconds
    const interval = setInterval(() => {
      setLastRefreshed(new Date());
      if (onRefresh) onRefresh();
    }, 30000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [onExit, onRefresh]);

  // Overall phrase for bottom of projection screen
  const getBottomPhrase = () => {
    if (radar.healthPercentage >= 70) {
      return '🌿 امروز باغچه‌ی کلاسمون شاداب و سرزنده است.';
    }
    if (radar.healthPercentage >= 40) {
      return '🌱 امروز با هم به باغچه رسیدگی می‌کنیم تا همه‌ی جوانه‌ها پربار بشن.';
    }
    return '🌾 باغچه منتظر دیدار دوباره و دست‌های مهربان همه شماست.';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] text-[#2D2D2D] flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto fade-in-modal no-print">
      {/* Top Bar for Board Mode */}
      <header className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7BA05B] flex items-center justify-center text-white text-xl shadow-xs">
            🌿
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2D2D2D]">
              باغچه‌ی جمعی — {classNameTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#7A7A7A] mt-0.5">
              نمایش ویژه پروژکتور کلاس و تدریس اسکای‌روم / شاد
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8C8C8C] bg-[#FAF6EE] px-3 py-1.5 rounded-xl border border-[#E9DFCE]">
            <RefreshCw className="w-3 h-3 text-[#7BA05B] animate-spin" style={{ animationDuration: '6s' }} />
            <span>به‌روزرسانی خودکار هر ۳۰ ثانیه</span>
          </div>

          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F2ECE0] border border-[#D5C9B3] text-sm font-semibold text-[#2D2D2D] transition-all shadow-xs cursor-pointer active:scale-95"
            title="خروج از حالت تخته‌ای (Escape)"
          >
            <Minimize2 className="w-4 h-4" />
            <span>خروج از تمام‌صفحه</span>
          </button>
        </div>
      </header>

      {/* Main Board Garden: Extra Large 160px-180px Plants */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <div className="flex flex-wrap gap-6 sm:gap-10 justify-center items-end max-w-6xl mx-auto">
          {plants.map((plant) => {
            const isNeedAttention = plant.mood === 'longing' || plant.mood === 'alert';

            return (
              <div
                key={plant.id}
                style={{ marginTop: `${(plant.randomOffset || 0) * 1.5}px` }}
                className="flex flex-col items-center justify-end w-32 sm:w-36 transition-all duration-500"
              >
                {/* Plant Graphic rendered in Board Mode */}
                <div className="w-28 h-36 sm:w-32 sm:h-40 flex items-center justify-center">
                  <PlantSvg
                    mood={plant.mood}
                    stage={plant.stage}
                    size="100%"
                    isBoardMode={true}
                    accessory={plant.accessory}
                    potStyle={plant.potStyle}
                  />
                </div>

                {/* Plant Name: 24px, font-bold 600 */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-xl sm:text-2xl font-bold tracking-tight block ${
                      isNeedAttention ? 'text-[#7D8E80]' : 'text-[#2D2D2D]'
                    }`}
                  >
                    {plant.plantName}
                  </span>
                  {plant.gen > 1 && (
                    <span className="text-[11px] font-medium text-[#8C7B68] bg-[#F2ECE0] px-2 py-0.5 rounded-full mt-1 inline-block">
                      نسل {plant.gen}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Center Sentence: 20px, respectful and inspiring */}
      <footer className="text-center pt-4 border-t border-[#E8DFC9]">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF6EE] border border-[#E9DFCE] shadow-2xs">
          <Sparkles className="w-5 h-5 text-[#7BA05B]" />
          <p className="text-base sm:text-xl font-semibold text-[#3D4736]">
            {getBottomPhrase()}
          </p>
        </div>
      </footer>
    </div>
  );
};
