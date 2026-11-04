import React, { useEffect } from 'react';
import { X, Sun, Moon, Sparkles, BookOpen, Clock, Heart, RotateCcw } from 'lucide-react';
import { Plant } from '../types';
import { sound } from '../utils/audio';

interface ClassroomSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  plants: Plant[];
  onSimulateWakeUp: (plantId: string) => void;
  onSimulateHomework: (plantId: string) => void;
  onSimulateTimePass: (days: number) => void;
  onResetGarden: () => void;
}

export const ClassroomSimulatorModal: React.FC<ClassroomSimulatorModalProps> = ({
  isOpen,
  onClose,
  plants,
  onSimulateWakeUp,
  onSimulateHomework,
  onSimulateTimePass,
  onResetGarden,
}) => {
  const [selectedId, setSelectedId] = React.useState<string>(plants[0]?.id || '');

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

  const currentPlant = plants.find((p) => p.id === selectedId) || plants[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs fade-in-modal no-print"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="simulator-modal-title"
    >
      <div
        className="w-full max-w-xl bg-[#FDFBF7] rounded-3xl border border-[#E8DFC9] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE7D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EBF3E4] flex items-center justify-center text-[#55783A]">
              <Sparkles className="w-5 h-5 text-[#7BA05B]" />
            </div>
            <div>
              <h3 id="simulator-modal-title" className="text-lg font-bold text-[#2D2D2D]">
                شبیه‌ساز ریتم روز و عادات دانش‌آموزان
              </h3>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                تست زنده واکنش عاطفی گیاه به خواب، بیداری و انجام تکالیف در ایام غیرحضوری
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

        {/* Content */}
        <div className="space-y-5 my-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Target Student Selector */}
          <div>
            <label className="text-xs font-semibold text-[#4A4A4A] block mb-1.5">
              انتخاب دانش‌آموز برای شبیه‌سازی:
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#D5C9B3] bg-white text-xs sm:text-sm font-medium text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#7BA05B]"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  گیاه «{p.plantName}» — دانش‌آموز: {p.childName} (حالت: {p.mood}، {p.lastSeenDays} روز غیبت)
                </option>
              ))}
            </select>
          </div>

          {/* Action 1: Morning Habit (Wake Up < 7:00 AM) */}
          <div className="bg-[#FAF6EE] border border-[#EADBCA] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C5D39]">
                <Sun className="w-4 h-4 text-[#F5B041]" />
                <span>بیدارباش سحرگاهی (قبل از ساعت ۷ صبح)</span>
              </div>
              <p className="text-[11px] text-[#666] mt-1 leading-relaxed">
                کودک سر وقت بیدار شده و روزش را با سلام به گیاه آغاز کرده است.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playPlantClick(580);
                if (currentPlant) onSimulateWakeUp(currentPlant.id);
              }}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              ثبت بیدارباش امروز
            </button>
          </div>

          {/* Action 2: Homework Done */}
          <div className="bg-[#FAF6EE] border border-[#EADBCA] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#44662B]">
                <BookOpen className="w-4 h-4 text-[#7BA05B]" />
                <span>انجام تکالیف و ارسال به معلم</span>
              </div>
              <p className="text-[11px] text-[#666] mt-1 leading-relaxed">
                تکالیف درسی در اسکای‌روم یا شاد کامل شد؛ گیاه شاداب (Thriving) می‌شود.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playCareDrop();
                if (currentPlant) onSimulateHomework(currentPlant.id);
              }}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-[#5A7A3F] hover:bg-[#496531] text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              ثبت انجام تکلیف
            </button>
          </div>

          {/* Action 3: Time passage (Simulate 2 days of absence / offline) */}
          <div className="bg-[#FFF8F3] border border-[#F0D5C1] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#B05B28]">
                <Clock className="w-4 h-4 text-[#E8A87C]" />
                <span>شبیه‌سازی گذر زمان (+۲ روز غیبت)</span>
              </div>
              <p className="text-[11px] text-[#7A6455] mt-1 leading-relaxed">
                برق یا اینترنت قطع شده یا دانش‌آموز غایب بوده است؛ گیاه به حالت دلتنگ (Longing) می‌رود.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playPlantClick(340);
                onSimulateTimePass(2);
              }}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-[#E8A87C] hover:bg-[#D49366] text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              +۲ روز گذشت زمان
            </button>
          </div>

          {/* Reset Garden to Initial Mock */}
          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => {
                sound.playPlantClick(440);
                onResetGarden();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#2D2D2D] p-1.5 rounded-lg hover:bg-[#EFE7D8] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی به حالت پیش‌فرض کلاس</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#EFE7D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#D5C9B3] text-xs sm:text-sm font-semibold text-[#2D2D2D] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
          >
            بستن شبیه‌ساز
          </button>
        </div>
      </div>
    </div>
  );
};
