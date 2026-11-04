import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

interface WallBatteryHUDProps {
  completedHabits: string[];
  lastSeenDays?: number;
  className?: string;
}

/**
 * Game-style Wall Battery HUD (نماد شارژ انرژی بازی روی دیوار کنار پنجره)
 * Sleek, zero fluff, instantly recognized by kids.
 */
export const WallBatteryHUD: React.FC<WallBatteryHUDProps> = ({
  completedHabits = [],
  lastSeenDays = 0,
  className = '',
}) => {
  const count = completedHabits.length;
  const percentage = Math.min(100, Math.round((count / 4) * 100));
  const isFull = count >= 4;
  const isDepleted = count === 0 && lastSeenDays >= 2;

  const getSegmentBg = (index: number) => {
    const isFilled = index < count;
    if (!isFilled) {
      return isDepleted
        ? 'bg-[#EF4444]/25 border border-[#EF4444]/40'
        : 'bg-[#64748B]/30 border border-[#94A3B8]/30';
    }
    if (isFull) {
      return 'bg-gradient-to-t from-[#15803D] to-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.8)] battery-segment-shimmer';
    }
    if (count === 3) {
      return 'bg-gradient-to-t from-[#16A34A] to-[#4ADE80]';
    }
    if (count === 2) {
      return 'bg-gradient-to-t from-[#65A30D] to-[#84CC16]';
    }
    return 'bg-gradient-to-t from-[#D97706] to-[#F59E0B]';
  };

  return (
    <div
      title={`شارژ انرژی جوانه: ${percentage}٪ (${count} از ۴ کار انجام شده)`}
      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border backdrop-blur-md shadow-xs select-none transition-all ${
        isFull
          ? 'bg-[#F0FDF4]/90 border-[#86EFAC] text-[#15803D] battery-charged-glow'
          : isDepleted
          ? 'bg-[#FEF2F2]/90 border-[#FECDD3] text-[#B91C1C]'
          : 'bg-[#FAF6EE]/90 border-[#D8C7A8] text-[#334155]'
      } ${className}`}
    >
      {/* SKEUOMORPHIC SMARTPHONE / GAME BATTERY ICON */}
      <div className="relative flex items-center">
        {/* Battery Main Body */}
        <div
          className={`relative h-6 sm:h-7 w-16 sm:w-20 p-0.5 sm:p-1 rounded-lg border-2 flex items-center justify-between gap-0.5 sm:gap-1 shadow-inner overflow-hidden transition-all duration-500 ${
            isFull
              ? 'border-[#22C55E] bg-[#052E16]/90'
              : isDepleted
              ? 'border-[#EF4444] bg-[#450A0A]/60'
              : 'border-[#334155] bg-[#0F172A]/85'
          }`}
        >
          {/* 4 Discrete Battery Segments */}
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = idx < count;
            return (
              <div
                key={idx}
                className={`flex-1 h-full rounded-xs sm:rounded-sm transition-all duration-500 relative ${getSegmentBg(
                  idx
                )}`}
              >
                {isFilled && (
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-white/50 rounded-t-xs pointer-events-none" />
                )}
              </div>
            );
          })}

          {/* Center Lightning Charging Bolt Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Zap
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
                isFull
                  ? 'text-[#FEF08A] fill-[#FACC15] scale-110 drop-shadow-[0_0_5px_#FACC15]'
                  : count > 0
                  ? 'text-[#A7F3D0] fill-[#34D399] opacity-90'
                  : isDepleted
                  ? 'text-[#FCA5A5] opacity-60'
                  : 'text-white/30'
              }`}
            />
          </div>
        </div>

        {/* Battery Positive Anode Terminal (+) */}
        <div
          className={`w-1 h-3 rounded-r-xs sm:rounded-r-sm border-y-1.5 border-r-1.5 transition-colors ${
            isFull
              ? 'border-[#22C55E] bg-[#22C55E]'
              : isDepleted
              ? 'border-[#EF4444] bg-[#EF4444]'
              : 'border-[#334155] bg-[#334155]'
          }`}
        />
      </div>

      {/* Numerical percentage badge */}
      <div className="flex items-center gap-0.5 text-xs sm:text-sm font-black tabular-nums">
        <span>{percentage}٪</span>
        {isFull && <Sparkles className="w-3 h-3 text-[#16A34A] animate-pulse" />}
      </div>
    </div>
  );
};

// Backward-compatible alias
export const PlantEnergyBattery = WallBatteryHUD;
