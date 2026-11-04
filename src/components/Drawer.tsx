import React, { useEffect, useState } from 'react';
import { Plant } from '../types';
import { PlantSvg } from './PlantSvg';
import { sound } from '../utils/audio';
import { aiBrain } from '../AIBrain';
import {
  X,
  Moon,
  Calendar,
  Sparkles,
  Heart,
  MessageSquare,
  Clock,
  Send,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

interface DrawerProps {
  plant: Plant | null;
  onClose: () => void;
  onSendTeacherNudge: (plantId: string) => void;
  onJumpToStudentRoom?: (plantId: string) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  plant,
  onClose,
  onSendTeacherNudge,
  onJumpToStudentRoom,
}) => {
  const [nudgeSent, setNudgeSent] = useState(false);
  const [customSuggestion, setCustomSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setNudgeSent(plant?.teacherNudgeSent || false);
    setCustomSuggestion(null);
  }, [plant]);

  const handleGenerateNewSuggestion = async () => {
    if (!plant || isGenerating) return;
    setIsGenerating(true);
    sound.playPlantClick(540);
    const newPrompt = await aiBrain.generateResponse({
      studentName: plant.childName,
      plantName: plant.plantName,
      mood: plant.mood,
      absenceDays: plant.lastSeenDays,
      dream: plant.activeDream,
    });
    setCustomSuggestion(newPrompt);
    setIsGenerating(false);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!plant) return null;

  // Stage labels
  const stageLabels: Record<number, string> = {
    1: 'دانه و جوانه کوچک (مرحله ۱)',
    2: 'جوانه دوبرگی (مرحله ۲)',
    3: 'نهال جوان و سرسبز (مرحله ۳)',
    4: 'بوته پربرگ (مرحله ۴)',
    5: 'شکوفا و بارور (مرحله ۵)',
  };

  // Human absence status text
  const getAbsenceText = (days: number) => {
    if (days === 0) return 'امروز دیده';
    if (days === 1) return '۱ روزه ندیده';
    return `${days} روزه ندیده`;
  };

  // Conversation suggestion tailored to plant state
  const getSuggestion = (p: Plant) => {
    if (p.activeDream) {
      return `می‌تونی ازش بپرسی دیشب گیاهش چه خوابی دیده.`;
    }
    if (p.mood === 'alert') {
      return `ایلیا یا روژان ممکن است به دلیل قطعی اینترنت، مشغله خانوادگی یا بیماری فرصت نکرده باشند. به جای پرسیدن "چرا تکلیف نفرستادی؟"، بگو: «امروز گیاهت توی باغچه چشم به راهت بود؛ گفتم حالت رو بپرسم ببینم همه‌چیز خوبه؟»`;
    }
    if (p.mood === 'longing') {
      return `یک یادآوری ساده و پرمهر کافی است: «امروز ${p.childName} عزیز، گیاه "${p.plantName}" برگ‌هاش یکم دلتنگ نوازشت بودن؛ بعد از کلاست یه سر بهش بزن!»`;
    }
    if (p.stage === 5) {
      return `گیاه به مرحله شکوفایی و بذردهی رسیده! می‌تونی در کلاس ازش بخوای اسم نسل بعدیش رو انتخاب کنه یا برات تعریف کنه گیاهش رو چطوری پرورش داده.`;
    }
    return `می‌تونی ازش بپرسی دیشب گیاهش چه خوابی دیده، یا با هم به برگ‌های تازه‌اش سر بزنید.`;
  };

  const handleNudge = () => {
    sound.playCareDrop();
    setNudgeSent(true);
    onSendTeacherNudge(plant.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs transition-opacity fade-in-modal no-print"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Drawer Container */}
      <div
        className="w-full max-w-2xl bg-[#FDFBF7] rounded-t-3xl border-t border-[#E8DFC9] p-5 sm:p-7 shadow-2xl max-h-[85vh] overflow-y-auto slide-up-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle line */}
        <div className="w-12 h-1.5 bg-[#DED6C4] rounded-full mx-auto mb-4" />

        {/* 1. Header: Plant Name, Child Name, Generation, Close */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EFE7D8]">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-20 bg-[#FAF6EE] rounded-2xl border border-[#EADBCA] p-1 flex items-center justify-center shadow-2xs">
              <PlantSvg
                mood={plant.mood}
                stage={plant.stage}
                size={70}
                accessory={plant.accessory}
                potStyle={plant.potStyle}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="drawer-title" className="text-xl font-bold text-[#2D2D2D]">
                  گیاه «{plant.plantName}»
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#695844]">
                  نسل {plant.gen}
                </span>
              </div>
              <p className="text-sm text-[#5B6D4C] font-medium mt-1">
                دانش‌آموز: <span className="font-bold text-[#2D2D2D]">{plant.childName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#777] hover:text-[#2D2D2D] hover:bg-[#EFE7D8] rounded-full transition-colors cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body details */}
        <div className="space-y-4 py-4">
          {/* Status & Growth Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* Status (Absence duration) */}
            <div className="bg-[#FAF6EE] border border-[#EFE7D8] p-3 rounded-xl flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#7BA05B] shrink-0" />
              <div>
                <span className="text-[11px] text-[#8C8C8C] block">وضعیت حضور</span>
                <span className="text-xs font-semibold text-[#2D2D2D]">
                  {getAbsenceText(plant.lastSeenDays)}
                </span>
              </div>
            </div>

            {/* Growth Days */}
            <div className="bg-[#FAF6EE] border border-[#EFE7D8] p-3 rounded-xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#7BA05B] shrink-0" />
              <div>
                <span className="text-[11px] text-[#8C8C8C] block">مدت همراهی</span>
                <span className="text-xs font-semibold text-[#2D2D2D]">
                  {plant.growthDays} روز با هم
                </span>
              </div>
            </div>

            {/* Stage */}
            <div className="col-span-2 sm:col-span-1 bg-[#FAF6EE] border border-[#EFE7D8] p-3 rounded-xl flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#7BA05B] shrink-0" />
              <div>
                <span className="text-[11px] text-[#8C8C8C] block">مرحله‌ی رشد</span>
                <span className="text-xs font-semibold text-[#2D2D2D]">
                  {stageLabels[plant.stage]}
                </span>
              </div>
            </div>
          </div>

          {/* Last Habit Completed */}
          {plant.lastHabitCompleted && (
            <div className="flex items-center gap-2 text-xs text-[#526941] bg-[#EFF6E9] p-3 rounded-xl border border-[#D5E6C9]">
              <BookOpen className="w-4 h-4 text-[#7BA05B] shrink-0" />
              <span>
                آخرین ریتم ثبت‌شده: <strong className="font-bold">{plant.lastHabitCompleted}</strong>
              </span>
            </div>
          )}

          {/* Recent Dream (اگر فعال است) */}
          {plant.activeDream && (
            <div className="bg-[#FAF5ED] border border-[#EBDDC8] p-4 rounded-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#9C6D38] mb-1.5">
                <Moon className="w-4 h-4 text-[#F5B041]" />
                <span>رویای دیشب گیاه</span>
              </div>
              <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed italic">
                «{plant.activeDream}»
              </p>
              <div className="text-[11px] text-[#8C8070] mt-2">
                رویاها با مراقبت منظم کودک و در لحظات خاص شکوفا می‌شوند.
              </div>
            </div>
          )}

          {/* Pedagogical Conversation Starter Hint with AIBrain integration */}
          <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3B4E2B]">
                <MessageSquare className="w-4 h-4 text-[#7BA05B]" />
                <span>پیشنهاد جمله‌ی شروع گفت‌وگو برای معلم:</span>
              </div>

              {/* Offline AIBrain Regeneration Button */}
              <button
                onClick={handleGenerateNewSuggestion}
                disabled={isGenerating}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4A6E2E] hover:text-[#2E4A1A] bg-[#EBF3E4] hover:bg-[#DDECD3] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#CFDFC0]"
                title="تولید هوشمند پیشنهاد جدید از بانک عبارات محلی و کاملاً آفلاین"
              >
                <RefreshCw className={`w-3 h-3 text-[#5A823B] ${isGenerating ? 'animate-spin' : ''}`} />
                <span>ایده‌ی دیگر (AIBrain آفلاین)</span>
              </button>
            </div>
            <p className="text-xs sm:text-[13px] text-[#3D4736] leading-relaxed">
              {customSuggestion || getSuggestion(plant)}
            </p>
          </div>

          {/* Interactive Teacher Action: Send Gentle Nudge & Jump to Student Room */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              onClick={handleNudge}
              disabled={nudgeSent}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                nudgeSent
                  ? 'bg-[#EBF3E4] text-[#4A6E2E] border border-[#D0E4C1]'
                  : 'bg-[#7BA05B] hover:bg-[#688D49] text-white shadow-xs active:scale-95'
              }`}
            >
              {nudgeSent ? (
                <>
                  <Heart className="w-4 h-4 fill-current text-[#4A6E2E]" />
                  <span>نوازش و سلام ارسال شد ✨</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ارسال نوازش مهربانانه</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onJumpToStudentRoom && (
                <button
                  onClick={() => onJumpToStudentRoom(plant.id)}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#EFECE2] hover:bg-[#E2DEC9] text-[#2D2D2D] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  🎒 ورود به اتاق گیاه {plant.childName}
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#DED6C4] text-xs sm:text-sm font-medium text-[#666] hover:bg-[#EFE7D8] transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
