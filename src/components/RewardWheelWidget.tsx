import React, { useState } from 'react';
import { Sparkles, Trophy, Gift, Check, X, RotateCw, Award, Star } from 'lucide-react';
import { sound } from '../utils/audio';
import { eventBus } from '../utils/eventBus';

interface RewardWheelWidgetProps {
  studentName: string;
  studentId: string;
  onRewardClaimed?: (reward: { title: string; icon: string; type: string }) => void;
  onClose?: () => void;
}

const WHEEL_SLICES = [
  { id: '1', title: 'کلاه حصیری باغبانی', icon: '👒', color: '#FCD34D', type: 'accessory' },
  { id: '2', title: '۳ قطره شبنم حیات', icon: '💧', color: '#60A5FA', type: 'water' },
  { id: '3', title: 'پروانه‌ی طلایی باغچه', icon: '🦋', color: '#F472B6', type: 'friend' },
  { id: '4', title: 'بذر طلایی آفتاب', icon: '🌰', color: '#C084FC', type: 'seed' },
  { id: '5', title: 'گلدان سفالی خندان', icon: '🪴', color: '#4ADE80', type: 'pot' },
  { id: '6', title: 'تاج شکوفه‌های بهاری', icon: '👑', color: '#FB923C', type: 'accessory' },
];

export const RewardWheelWidget: React.FC<RewardWheelWidgetProps> = ({
  studentName,
  studentId,
  onRewardClaimed,
  onClose,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonReward, setWonReward] = useState<{ title: string; icon: string; type: string } | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    sound.playPlantClick(540);
    setIsSpinning(true);
    setWonReward(null);

    // Random slice (0 to 5)
    const winningIndex = Math.floor(Math.random() * WHEEL_SLICES.length);
    const sliceAngle = 360 / WHEEL_SLICES.length;
    // Extra 5 full rotations + alignment to pointer
    const extraRounds = 360 * 5;
    const targetAngle = extraRounds + (360 - winningIndex * sliceAngle - sliceAngle / 2);
    const nextTotalRotation = rotation + targetAngle;

    setRotation(nextTotalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = WHEEL_SLICES[winningIndex];
      setWonReward(chosen);
      sound.playJoyfulChime();

      eventBus.emit('SPIN_REWARD_AWARDED', {
        studentId,
        studentName,
        timestamp: Date.now(),
        data: chosen,
      });

      if (onRewardClaimed) {
        onRewardClaimed(chosen);
      }
    }, 3800);
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border-2 border-[#F59E0B]/50 p-6 shadow-2xl max-w-md w-full mx-auto text-center relative overflow-hidden space-y-5 animate-fade-in font-['Vazirmatn']">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>گردونهٔ پاداش و شگفتی کلاسی</span>
        </div>
        <h3 className="text-xl font-black text-amber-300">گردونهٔ شانس «{studentName}»</h3>
        <p className="text-xs text-slate-300 mt-1">
          به پاس انجام تکالیف و عادات مثبت کلاسی، یک شانس چرخاندن گردونه را داری! 🌟
        </p>
      </div>

      {/* Handcrafted Neon Frame & SVG Wheel */}
      <div className="relative w-64 h-64 mx-auto my-3 flex items-center justify-center">
        {/* Neon Outer Bulb Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.3)] pointer-events-none" />

        {/* Pointer Arrow at Top */}
        <div className="absolute -top-4 z-30 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]" />
        </div>

        {/* Spinning Disc */}
        <div
          className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl relative overflow-hidden transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '3.8s' : '0s',
            transitionTimingFunction: 'cubic-bezier(0.15, 0.85, 0.15, 1)',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {WHEEL_SLICES.map((slice, idx) => {
              const startAngle = (idx * 60 * Math.PI) / 180;
              const endAngle = ((idx + 1) * 60 * Math.PI) / 180;
              const x1 = 100 + 100 * Math.cos(startAngle);
              const y1 = 100 + 100 * Math.sin(startAngle);
              const x2 = 100 + 100 * Math.cos(endAngle);
              const y2 = 100 + 100 * Math.sin(endAngle);

              const pathData = `M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`;
              const midAngle = ((idx + 0.5) * 60 * Math.PI) / 180;
              const textX = 100 + 62 * Math.cos(midAngle);
              const textY = 100 + 62 * Math.sin(midAngle);

              return (
                <g key={slice.id}>
                  <path d={pathData} fill={slice.color} stroke="#1E1B4B" strokeWidth="2" />
                  <text
                    x={textX}
                    y={textY}
                    fill="#1E1B4B"
                    fontSize="20"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {slice.icon}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="26" fill="#1E1B4B" stroke="#F59E0B" strokeWidth="3" />
            <circle cx="100" cy="100" r="18" fill="#FACC15" />
            <text x="100" y="103" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold" fill="#1E1B4B">
              ★
            </text>
          </svg>
        </div>
      </div>

      {/* Result Card */}
      {wonReward && (
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-2 border-emerald-400 rounded-2xl text-xs font-bold text-emerald-200 animate-bounce flex items-center justify-center gap-2 shadow-xl">
          <span className="text-2xl">{wonReward.icon}</span>
          <span>تبریک! جایزه شگفت‌انگیز: <strong>«{wonReward.title}»</strong> با موفقیت دریافت شد! 🎉</span>
        </div>
      )}

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isSpinning
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-98'
        }`}
      >
        <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? 'در حال چرخش و کالیبراسیون شانس...' : 'بچرخون و جایزه بگیر! 🎲'}</span>
      </button>
    </div>
  );
};
