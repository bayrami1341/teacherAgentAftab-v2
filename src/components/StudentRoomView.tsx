import React, { useState, useMemo, useEffect } from 'react';
import { Plant, Mood } from '../types';
import { PlantSvg, ActingState } from './PlantSvg';
import { sound } from '../utils/audio';
import {
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Heart,
  Calendar,
  Archive,
  Palette,
  CheckCircle2,
  Check,
  Plus,
  Edit2,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from 'lucide-react';

import { RewardWheelWidget } from './RewardWheelWidget';
import { eventBus } from '../utils/eventBus';
import { WallBatteryHUD } from './PlantEnergyBattery';

interface StudentRoomViewProps {
  plants: Plant[];
  activeStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onCompleteHabit: (studentId: string, habitKey: string) => void;
  onCustomizePlant: (studentId: string, changes: Partial<Plant>) => void;
  onRenamePlant: (studentId: string, newName: string) => void;
  onPlantNewSeed: (studentId: string, newName: string) => void;
  onAddNewStudent: (childName: string, plantName: string) => void;
}

export const StudentRoomView: React.FC<StudentRoomViewProps> = ({
  plants,
  activeStudentId,
  onSelectStudent,
  onCompleteHabit,
  onCustomizePlant,
  onRenamePlant,
  onPlantNewSeed,
  onAddNewStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'habits' | 'closet' | 'week' | 'memories'>('habits');
  const [simulatedHour, setSimulatedHour] = useState<number>(6); // 6 AM default for wake up habit testing
  const [actingState, setActingState] = useState<ActingState>('normal');
  const [isJumping, setIsJumping] = useState(false);
  const [isControlBarOpen, setIsControlBarOpen] = useState(false); // Mobile accordion
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: string; emoji: string; left: number; delay: number }>>([]);
  const [dreamModalOpen, setDreamModalOpen] = useState(false);
  const [seedModalOpen, setSeedModalOpen] = useState(false);
  const [newSeedName, setNewSeedName] = useState('');
  const [renameMode, setRenameMode] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [newStudentModal, setNewStudentModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newPlantName, setNewPlantName] = useState('');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [mathAnswerFeedback, setMathAnswerFeedback] = useState<string | null>(null);
  const [wheelModalOpen, setWheelModalOpen] = useState(false);

  const student = useMemo(() => {
    return plants.find((p) => p.id === activeStudentId) || plants[0];
  }, [plants, activeStudentId]);

  // Initial resting state: if student plant is longing, alert, or has 0 completed habits today, show gentle waiting/sleepy posture
  useEffect(() => {
    const habitsCount = (student?.completedHabitsToday || []).length;
    if (student && (student.mood === 'alert' || student.mood === 'longing' || habitsCount === 0 || student.lastSeenDays >= 1)) {
      setActingState('sleepy');
    } else {
      setActingState('normal');
    }
  }, [student?.id, student?.mood, student?.completedHabitsToday?.length, student?.lastSeenDays]);

  // Decoupled EventBus Listener: React to spin reward awards from Layer 5 widgets
  useEffect(() => {
    const unsubscribe = eventBus.on('SPIN_REWARD_AWARDED', (event: any) => {
      if (event.studentId === student?.id) {
        sound.playJoyfulChime();
        triggerHearts('🌟');
      }
    });
    return () => unsubscribe();
  }, [student?.id]);

  if (!student) return null;

  // Sky & window theme according to simulated hour
  const skyTheme = useMemo(() => {
    if (simulatedHour >= 5 && simulatedHour < 8) {
      return {
        label: 'سحرگاه طلایی (۶:۳۰ صبح)',
        windowBg: 'linear-gradient(180deg, #FDE4C8 0%, #FFF7E4 100%)',
        roomBg: 'linear-gradient(180deg, #FAF4E6 0%, #F5EFE0 100%)',
        celestial: 'sunrise',
      };
    }
    if (simulatedHour >= 8 && simulatedHour < 16) {
      return {
        label: 'روز آفتابی (۱۲:۰۰ ظهر)',
        windowBg: 'linear-gradient(180deg, #CBE8F8 0%, #EFF9FE 100%)',
        roomBg: 'linear-gradient(180deg, #F7F9F2 0%, #EFECE0 100%)',
        celestial: 'sun',
      };
    }
    if (simulatedHour >= 16 && simulatedHour < 19) {
      return {
        label: 'عصر نارنجی (۱۷:۳۰ عصر)',
        windowBg: 'linear-gradient(180deg, #F6C6A5 0%, #FDE8D0 100%)',
        roomBg: 'linear-gradient(180deg, #F9F2E7 0%, #EFE6D5 100%)',
        celestial: 'sunset',
      };
    }
    return {
      label: 'شب پرستاره (۲۱:۰۰ شب)',
      windowBg: 'linear-gradient(180deg, #2C3E5A 0%, #4B6282 100%)',
      roomBg: 'linear-gradient(180deg, #EAE8DF 0%, #DFDDD2 100%)',
      celestial: 'moon',
    };
  }, [simulatedHour]);

  const showBanner = (text: string) => {
    setBannerNotice(text);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const triggerHearts = (emoji = '💚') => {
    const batch = Array.from({ length: 7 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      emoji: i % 2 === 0 ? emoji : '✨',
      left: 30 + Math.random() * 40,
      delay: i * 0.08,
    }));
    setFloatingHearts(batch);
    setTimeout(() => setFloatingHearts([]), 1600);
  };

  /**
   * Choreographed Character Acting Wake Sequence:
   * t=0ms: stretching tall (stretch sound)
   * t=300ms: yawning with wiggle & cute O-mouth (yawn sound)
   * t=650ms: apex celebratory jump, harmonic chime, floating hearts, synchronized banner
   * t=1400ms: lands softly
   * t=1900ms: wide sparkle smile
   * t=3200ms: returns to peaceful normal
   */
  // Differentiated Character Acting & Choreography for each of the 4 daily habits
  const triggerHabitChoreography = (
    habitKey: string,
    habitTitle: string,
    onApex?: () => void
  ) => {
    const currentCompleted = student.completedHabitsToday || [];
    const nextCompletedCount = Math.min(4, currentCompleted.includes(habitKey) ? currentCompleted.length : currentCompleted.length + 1);

    // 1. WAKE UP (☀️ بیدارباش سحرگاه): Stretch, Yawn, Sunrise Jump & Wake-Up Melody
    if (habitKey === 'wake') {
      setActingState('stretching');
      sound.playStretch();

      setTimeout(() => {
        setActingState('yawning');
        sound.playYawn();
      }, 300);

      setTimeout(() => {
        setActingState('celebrating');
        setIsJumping(true);
        sound.playGrowthWoodTap(student.stage);
        sound.playWakeUpMelody();
        sound.playBatteryCharge(nextCompletedCount);
        triggerHearts('☀️');
        if (onApex) onApex();

        const banner = nextCompletedCount === 4
          ? `🎉 شارژ ۱۰۰٪ کامل! «${student.plantName}» با طلوع آفتاب قد کشید و آخرین قطرهٔ انرژی جذب شد! ⚡💚`
          : `صبح بخیر! «${student.plantName}» با طلوع خورشید از خواب بیدار شد و ۲۵٪ شارژ انرژی گرفت! ☀️🌱`;
        showBanner(banner);
      }, 650);

      setTimeout(() => setIsJumping(false), 1400);
      setTimeout(() => setActingState('wide_smile'), 1900);
      setTimeout(() => setActingState('normal'), 3400);
      return;
    }

    // 2. BRUSH & WATER (🪥 مسواک و آبیاری): Refreshing Water Sway, Droplet Bubbles & Dewy Glow
    if (habitKey === 'brush') {
      sound.playPlantClick(580);
      setActingState('normal');

      setTimeout(() => {
        setActingState('water_refresh');
        setIsJumping(true);
        sound.playWaterSplash();
        sound.playGrowthWoodTap(student.stage);
        sound.playBatteryCharge(nextCompletedCount);
        triggerHearts('💧');
        if (onApex) onApex();

        const banner = nextCompletedCount === 4
          ? `🎉 شارژ ۱۰۰٪ کامل! دهان تمیز و گیاه سیراب شد؛ «${student.plantName}» در اوج شادابی و درخشش است! ⚡💧`
          : `به‌به! دهان تمیز و گیاه سیراب شد؛ قطره‌های شبنم روی برگ‌های «${student.plantName}» درخشید و ۲۵٪ شارژ شد! 🪥💧`;
        showBanner(banner);
      }, 250);

      setTimeout(() => setIsJumping(false), 1300);
      setTimeout(() => setActingState('wide_smile'), 1800);
      setTimeout(() => setActingState('normal'), 3200);
      return;
    }

    // 3. HOMEWORK & STUDY (✏️ مشق و تمرین درسی): Starry Insight Nod, Wisdom Chime & Curious Glow
    if (habitKey === 'homework') {
      sound.playPlantClick(480);
      setActingState('normal');

      setTimeout(() => {
        setActingState('studying');
        setIsJumping(true);
        sound.playStudyInspiration();
        sound.playGrowthWoodTap(student.stage);
        sound.playBatteryCharge(nextCompletedCount);
        triggerHearts('⭐');
        if (onApex) onApex();

        const banner = nextCompletedCount === 4
          ? `🎉 شارژ ۱۰۰٪ کامل! با انجام مشق و تمرین امروزت، «${student.plantName}» داناتر و پرانرژی‌ترین شد! ⚡📚`
          : `آفرین بر همتت! «${student.plantName}» با دیدن تمرین و تلاش امروزت با افتخار قد کشید و ۲۵٪ شارژ شد! ✏️✨`;
        showBanner(banner);
      }, 250);

      setTimeout(() => setIsJumping(false), 1400);
      setTimeout(() => setActingState('wide_smile'), 1900);
      setTimeout(() => setActingState('normal'), 3200);
      return;
    }

    // 4. BEDTIME & SLEEP (🌙 خواب و استراحت به‌موقع): Soothing Lullaby, Cozy Tuck-in & Dream Stars
    if (habitKey === 'sleep') {
      sound.playStretch();
      setActingState('stretching');

      setTimeout(() => {
        setActingState('tucking_in');
        sound.playBedtimeLullaby();
        sound.playGrowthWoodTap(student.stage);
        sound.playBatteryCharge(nextCompletedCount);
        triggerHearts('🌙');
        if (onApex) onApex();

        const banner = nextCompletedCount === 4
          ? `🎉 شارژ ۱۰۰٪ کامل! تمام کارهای خوب امروز انجام شد و «${student.plantName}» با دلی پر از شادی خوابید! ⚡🌙`
          : `شب آرام و پرستاره! «${student.plantName}» با آرامش سر روی برگ‌هایش گذاشت و آمادهٔ خواب شد 🌙💤`;
        showBanner(banner);
      }, 350);

      setTimeout(() => setActingState('sleepy'), 1600);
      return;
    }

    // Fallback general choreography
    triggerWakingChoreography(undefined, onApex);
  };

  // Plant wake-up and gentle pet choreography
  const triggerWakingChoreography = (customApexMessage?: string, onApex?: () => void) => {
    setActingState('stretching');
    sound.playStretch();

    setTimeout(() => {
      setActingState('yawning');
      sound.playYawn();
    }, 280);

    setTimeout(() => {
      setActingState('wide_smile');
      setIsJumping(true);
      sound.playGrowthWoodTap(student.stage);
      sound.playHabitSuccess();
      triggerHearts('🌿');
      if (onApex) onApex();

      const defaultMsg =
        student.mood === 'alert'
          ? `«${student.plantName}» بیدار شد، خمیازه‌ای کشید و با مهر به رویت خندید! 💚`
          : student.mood === 'longing'
          ? `«${student.plantName}» سرش را صاف کرد: «چقدر منتظرت بودم!» ✨`
          : `«${student.plantName}» بیدار شد، قد کشید و از لمس و توجهت شاداب شد! 🌸`;

      showBanner(customApexMessage || defaultMsg);
    }, 600);

    setTimeout(() => setIsJumping(false), 1300);
    setTimeout(() => setActingState('wide_smile'), 1800);
    setTimeout(() => setActingState('normal'), 3200);
  };

  // Touch & pet the plant
  const handleTouchPlant = () => {
    // Immediate tactile wood tap on touch
    sound.playWoodTap(student.stage <= 2 ? 440 : student.stage <= 4 ? 340 : 220);
    triggerWakingChoreography();
  };

  // Complete a habit with strict synchronization at apex, or handle friendly repeat click
  const handleHabit = (habitKey: string, habitTitle: string, isWakeRule: boolean) => {
    const completedList = student.completedHabitsToday || [];
    const isAlreadyDone = completedList.includes(habitKey);

    if (isAlreadyDone) {
      // Repeat click: playful differentiated reaction without duplicate reward
      sound.playGrowthWoodTap(student.stage);
      if (habitKey === 'brush') {
        sound.playWaterSplash();
        setActingState('water_refresh');
        triggerHearts('💧');
      } else if (habitKey === 'homework') {
        sound.playStudyInspiration();
        setActingState('studying');
        triggerHearts('⭐');
      } else if (habitKey === 'sleep') {
        sound.playBedtimeLullaby();
        setActingState('tucking_in');
        triggerHearts('🌙');
      } else {
        sound.playWakeUpMelody();
        setActingState('celebrating');
        triggerHearts('☀️');
      }

      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
        setActingState('wide_smile');
      }, 700);
      setTimeout(() => {
        setActingState('normal');
      }, 2000);

      showBanner(`عادت «${habitTitle}» امروز ثبت شده و گیاهت انرژی‌اش را گرفته! فردا دوباره شارژش می‌کنیم 🌱`);
      return;
    }

    if (isWakeRule && simulatedHour >= 7) {
      sound.playPlantClick(320);
      showBanner('خورشید زودتر از تو بیدار شده! ☀️ بیدارباش سحرگاه فقط قبل از ۷:۰۰ صبح ثبت می‌شود.');
      return;
    }

    triggerHabitChoreography(habitKey, habitTitle, () => {
      onCompleteHabit(student.id, habitKey);
    });
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameInput.trim().length < 2) return;
    onRenamePlant(student.id, renameInput.trim());
    setRenameMode(false);
    showBanner(`نام گیاه به «${renameInput.trim()}» تغییر یافت!`);
  };

  const handlePlantNewGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSeedName.trim().length < 2) return;
    sound.playJoyfulChime();
    onPlantNewSeed(student.id, newSeedName.trim());
    setSeedModalOpen(false);
    setNewSeedName('');
    showBanner(`نسل جدید با نام «${newSeedName.trim()}» کاشته شد! 🌸`);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChildName.trim().length < 2 || newPlantName.trim().length < 2) return;
    onAddNewStudent(newChildName.trim(), newPlantName.trim());
    setNewStudentModal(false);
    setNewChildName('');
    setNewPlantName('');
    showBanner('جوانه‌ی دانش‌آموز جدید با موفقیت کاشته شد! 🌱');
  };

  return (
    <div className="max-w-4xl mx-auto px-2.5 sm:px-4 py-3 space-y-3 font-['Vazirmatn']">
      {/* Collapsible Mobile & Desktop Control Bar (Student switcher + time simulator) */}
      <div className="bg-white border border-[#E8DFC9] rounded-2xl shadow-xs overflow-hidden">
        {/* Mobile Accordion Header */}
        <div className="sm:hidden px-3.5 py-2.5 flex items-center justify-between bg-[#FAF8F2] border-b border-[#E8DFC9]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D] truncate">
            <UserCheck className="w-4 h-4 text-[#7BA05B] shrink-0" />
            <span className="truncate">
              {student.childName} (گیاه «{student.plantName}»)
            </span>
            <span className="text-[10px] text-[#7A7A7A] shrink-0">
              • ساعت {simulatedHour}:۰۰
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsControlBarOpen((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#5A7A3F] bg-white px-2.5 py-1 rounded-lg border border-[#D8D0BC] cursor-pointer"
          >
            <span>{isControlBarOpen ? 'بستن' : 'تغییر'}</span>
            {isControlBarOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Accordion Content (Always visible on sm+, expandable on mobile) */}
        <div className={`${isControlBarOpen ? 'block' : 'hidden'} sm:block p-3 sm:p-3.5`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="student-picker" className="text-xs font-bold text-[#5A7A3F] shrink-0">
                🎒 انتخاب دانش‌آموز:
              </label>
              <select
                id="student-picker"
                value={student.id}
                onChange={(e) => {
                  onSelectStudent(e.target.value);
                  setIsControlBarOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF8F1] border border-[#C8D9B5] text-xs sm:text-sm font-semibold text-[#2D2D2D] outline-none focus:ring-2 focus:ring-[#7BA05B] max-w-full"
              >
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.childName} — گیاه «{p.plantName}» ({p.mood === 'thriving' ? 'شاداب' : p.mood === 'content' ? 'آرام' : p.mood === 'longing' ? 'دلتنگ' : 'بی‌تاب'})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setNewStudentModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-[#EBF3E4] hover:bg-[#DDECD3] text-[#4A6E2E] text-xs font-bold transition-colors cursor-pointer border border-[#CFDFBE]"
              >
                + جوانه‌ی جدید
              </button>
            </div>

            {/* Time of Day Simulation Buttons */}
            <div className="flex items-center gap-1.5 bg-[#F5F2E8] px-2.5 py-1 rounded-xl border border-[#E5DEC9] text-xs justify-between sm:justify-start">
              <span className="text-[#7A7A7A] ml-1 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                ساعت:
              </span>
              {[
                { h: 6, label: '۶ صبح (بیدارباش)' },
                { h: 12, label: 'ظهر' },
                { h: 18, label: 'عصر' },
                { h: 21, label: 'شب' },
              ].map((t) => (
                <button
                  key={t.h}
                  type="button"
                  onClick={() => setSimulatedHour(t.h)}
                  className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    simulatedHour === t.h
                      ? 'bg-[#7BA05B] text-white shadow-2xs font-bold'
                      : 'text-[#2D2D2D] hover:bg-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Student Room Card */}
      <div className="bg-white border border-[#E8DFC9] rounded-3xl shadow-xs">
        {/* STICKY PLANT SCENE (Never scrolls out of sight!) */}
        <div
          className="sticky top-[66px] sm:top-[68px] z-20 backdrop-blur-md rounded-t-3xl border-b border-[#E8DFC9] px-4 py-3 sm:py-4 transition-colors duration-700 shadow-xs"
          style={{ background: skyTheme.roomBg }}
        >
          {/* Window & Plant Frame */}
          <div className="max-w-md mx-auto relative flex flex-col items-center">
            {/* Game-style Wall Battery mounted on the room wall beside the window */}
            <div className="absolute top-1 sm:top-2 left-1.5 sm:left-3 z-20">
              <WallBatteryHUD
                completedHabits={student.completedHabitsToday || []}
                lastSeenDays={student.lastSeenDays}
              />
            </div>

            {/* Window */}
            <div
              className="w-36 h-30 sm:w-48 sm:h-38 rounded-t-full border-3 sm:border-4 border-[#D8C7A8] shadow-inner relative overflow-hidden transition-all duration-700"
              style={{ background: skyTheme.windowBg }}
            >
              {skyTheme.celestial === 'sunrise' && (
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F5B041] opacity-90 absolute bottom-2 right-6 shadow-lg animate-pulse" />
              )}
              {skyTheme.celestial === 'sun' && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F7DC6F] absolute top-3 right-6 shadow-md" />
              )}
              {skyTheme.celestial === 'sunset' && (
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E76F51] opacity-85 absolute bottom-2 left-6" />
              )}
              {skyTheme.celestial === 'moon' && (
                <>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FDFBF5] absolute top-3 left-6 shadow-sm" />
                  <span className="absolute top-2 right-8 text-[10px] text-white/80">✦</span>
                  <span className="absolute top-8 right-5 text-[9px] text-white/70">★</span>
                  <span className="absolute top-10 left-14 text-[10px] text-white/80">✧</span>
                </>
              )}

              {/* Wooden window frame grid */}
              <div className="absolute inset-x-0 top-1/2 h-1 bg-[#D8C7A8]" />
              <div className="absolute inset-y-0 left-1/2 w-1 bg-[#D8C7A8]" />
            </div>

            {/* Interactive Plant On Room Table */}
            <div className="relative -mt-18 sm:-mt-22 flex flex-col items-center z-10">
              {/* Floating hearts / particles during jump */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {floatingHearts.map((h) => (
                  <span
                    key={h.id}
                    style={{ left: `${h.left}%`, animationDelay: `${h.delay}s` }}
                    className="floating-heart absolute top-4 text-xl sm:text-2xl"
                  >
                    {h.emoji}
                  </span>
                ))}
              </div>

              {/* Dream bubble if plant had a dream */}
              {student.activeDream && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playPlantClick(520);
                    setDreamModalOpen(true);
                  }}
                  className="mb-1 px-3 py-0.5 rounded-full bg-white/95 hover:bg-white border border-[#C8D9B5] shadow-xs text-[11px] sm:text-xs font-bold text-[#4F7332] flex items-center gap-1.5 animate-bounce cursor-pointer"
                >
                  <Moon className="w-3 h-3 text-[#F5B041]" />
                  <span>دیشب خواب دیدم! (کلیک کن)</span>
                </button>
              )}

              {/* Plant Animated Mood Speech Bubble */}
              <div className="mb-2 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-[#C8D9B5] shadow-md text-xs font-bold text-[#2D2D2D] flex items-center gap-2 avatar-speech-bubble">
                <span className="text-base">
                  {student.mood === 'thriving' ? '🌟' : student.mood === 'content' ? '🌸' : student.mood === 'longing' ? '💧' : '🔔'}
                </span>
                <span>
                  {student.mood === 'thriving'
                    ? `«${student.plantName}» بسیار شاداب است و با انرژی به تو لبخند می‌زند!`
                    : student.mood === 'content'
                    ? `«${student.plantName}» در آرامش کامل است.`
                    : student.mood === 'longing'
                    ? `«${student.plantName}» دلتنگ توست! یک نوازش یا کار به او انرژی می‌دهد.`
                    : `«${student.plantName}» نیاز به توجه و تکمیل عادت‌های امروز دارد!`}
                </span>
              </div>

              {/* Plant Graphic with Character Acting & Real-Time CSS3 Mood Animation */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleTouchPlant}
                onKeyDown={(e) => e.key === 'Enter' && handleTouchPlant()}
                title="برای نوازش و بیدار کردن گیاه کلیک کن!"
                className={`cursor-pointer transition-transform duration-300 ${
                  isJumping
                    ? `plant-act-jump plant-bloom-stage-${student.stage}`
                    : student.mood === 'thriving'
                    ? 'avatar-mood-happy'
                    : student.mood === 'longing'
                    ? 'avatar-mood-longing'
                    : student.mood === 'alert'
                    ? 'avatar-mood-alert'
                    : 'hover:scale-105 active:scale-95'
                }`}
              >
                <PlantSvg
                  mood={student.mood}
                  stage={student.stage}
                  size={140}
                  actingState={actingState}
                  accessory={student.accessory}
                  potStyle={student.potStyle}
                  className={isJumping ? `plant-bloom-stage-${student.stage}` : ''}
                />
              </div>

              {/* Wooden Table Shelf */}
              <div className="w-48 sm:w-64 h-3 sm:h-3.5 bg-[#C8A986] rounded-full border-b-3 border-[#A88967] -mt-2.5 shadow-sm" />
            </div>
          </div>

          {/* Plant Identity, Companionship & Synchronized Story Banner */}
          <div className="mt-2 text-center">
            {!renameMode ? (
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#E5DEC9] shadow-2xs">
                <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D]">
                  {student.plantName}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EBF3E4] text-[#4A6E2E] font-semibold">
                  نسل {student.gen}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRenameInput(student.plantName);
                    setRenameMode(true);
                  }}
                  className="text-xs text-[#7A7A7A] hover:text-[#2D2D2D] p-0.5 cursor-pointer"
                  title="تغییر نام گیاه"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleRename} className="inline-flex items-center gap-2 bg-white p-1 rounded-xl border border-[#7BA05B]">
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="px-2.5 py-0.5 text-xs rounded-lg border border-[#E5DEC9] outline-none"
                  placeholder="نام جدید گیاه..."
                  autoFocus
                />
                <button type="submit" className="px-2.5 py-0.5 bg-[#7BA05B] text-white text-xs rounded-lg font-bold">
                  ثبت
                </button>
                <button
                  type="button"
                  onClick={() => setRenameMode(false)}
                  className="px-2 py-0.5 text-xs text-[#7A7A7A]"
                >
                  انصراف
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-1.5 text-[11px] sm:text-xs text-[#5A5A5A]">
              <span className="bg-white/85 px-2.5 py-0.5 rounded-full border border-[#E5DEC9]">
                🌱 مرحله {student.stage}
              </span>
              <span className="bg-white/85 px-2.5 py-0.5 rounded-full border border-[#E5DEC9]">
                💚 وضعیت: <strong>{student.mood === 'thriving' ? 'شاداب' : student.mood === 'content' ? 'آرام' : student.mood === 'longing' ? 'دلتنگ' : 'بی‌تاب (نیازمند توجه)'}</strong>
              </span>
              <span className="bg-white/85 px-2.5 py-0.5 rounded-full border border-[#E5DEC9]">
                ☀️ <strong>{student.growthDays} روز</strong> همراهی
              </span>
            </div>

            {/* Real-Time Interactive Plant Avatar Mood Control Bar (تغییر انیمیشن خلقی لحظه‌ای) */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-[#C8D9B5] shadow-xs text-xs font-bold">
              <span className="text-[11px] text-[#5A7A3F] px-1.5 font-bold">تغییر انیمیشن خلقی:</span>
              <button
                type="button"
                onClick={() => {
                  sound.playJoyfulChime();
                  triggerHearts('✨');
                  onCustomizePlant(student.id, { mood: 'thriving' });
                }}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  student.mood === 'thriving' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                🌟 شادی (Thriving)
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPlantClick(480);
                  onCustomizePlant(student.id, { mood: 'longing' });
                }}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  student.mood === 'longing' ? 'bg-[#0284C7] text-white shadow-xs font-black' : 'bg-sky-50 text-[#0369A1] hover:bg-sky-100'
                }`}
              >
                💧 دلتنگی (Longing)
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPlantClick(340);
                  onCustomizePlant(student.id, { mood: 'alert' });
                }}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  student.mood === 'alert' ? 'bg-[#E11D48] text-white shadow-xs font-black' : 'bg-rose-50 text-[#BE123C] hover:bg-rose-100'
                }`}
              >
                🔔 نیاز به توجه (Alert)
              </button>
            </div>

            {/* Stage 5 Seed Celebration Button */}
            {student.stage === 5 && (
              <div className="mt-1.5">
                <button
                  type="button"
                  onClick={() => setSeedModalOpen(true)}
                  className="px-3 py-1 rounded-full bg-[#FFF3D6] hover:bg-[#FEE9B5] text-[#7A5A1B] font-bold text-xs border border-[#E0BC5C] shadow-2xs transition-all cursor-pointer"
                >
                  🌰 «{student.plantName}» بذر طلایی داده! کاشتن نسل {student.gen + 1}
                </button>
              </div>
            )}
          </div>

          {/* Synchronized story notification banner */}
          {bannerNotice && (
            <div className="mt-2 max-w-md mx-auto p-2 sm:p-2.5 rounded-xl text-xs sm:text-sm text-center font-medium bg-white/95 border border-[#C8D9B5] text-[#2D2D2D] shadow-sm fade-in-modal">
              {bannerNotice}
            </div>
          )}
        </div>

        {/* 4 Tabs: Habits, Closet, Week, Memories with generous mobile padding and responsive labels */}
        <div className="bg-[#FAF8F2] border-b border-[#E5DEC9] px-2 sm:px-4 py-2 flex items-center justify-around gap-1 sm:gap-2">
          {[
            { id: 'habits', shortLabel: 'امروز', label: 'کارهای امروز', icon: '🌿' },
            { id: 'closet', shortLabel: 'تزئین', label: 'تزئین و گلدان‌ها', icon: '🎨' },
            { id: 'week', shortLabel: 'هفته', label: 'برگ‌های هفته', icon: '📅' },
            { id: 'memories', shortLabel: 'خاطرات', label: 'خاطرات و رویاها', icon: '📖' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playPlantClick(480);
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex-1 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap min-w-0 ${
                activeTab === tab.id
                  ? 'bg-[#7BA05B] text-white shadow-2xs'
                  : 'text-[#666] hover:bg-[#EFECE2]'
              }`}
            >
              <span className="text-sm sm:text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 bg-[#FDFBF5]">
          {/* TAB 1: 4 Daily Habits */}
          {activeTab === 'habits' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1 pb-1">
                <h3 className="text-sm sm:text-base font-bold text-[#2D2D2D] flex items-center gap-2">
                  <span>ریتم روزانه‌ی من و «{student.plantName}»</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EBF3E4] text-[#3E6523] border border-[#CDE3BD]">
                    {(student.completedHabitsToday || []).length} از ۴ کار انجام شده
                  </span>
                </h3>
                <span className="text-xs font-semibold text-[#5A7A3F]">
                  هر کار = ۲۵٪ شارژ انرژی باتری ⚡
                </span>
              </div>

              {/* Interactive 4-Action Control Console / Menu */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-[#E8DFC9] shadow-2xs">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#2D2D2D]">
                      🎮 کنسول کارهای روزانه
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3E4] text-[#3E6523] border border-[#CDE3BD]">
                      {(student.completedHabitsToday || []).length} از ۴ کار انجام شده
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5A7A3F]">
                    هر آیکون = ۲۵٪ شارژ باتری ⚡
                  </span>
                </div>

                {/* 4 Interactive Game-Style Icon Action Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {[
                    {
                      key: 'wake',
                      title: 'بیدارباش',
                      subtitle: 'پیش از ۷ صبح',
                      icon: '☀️',
                      isWake: true,
                    },
                    {
                      key: 'brush',
                      title: 'مسواک و آب',
                      subtitle: 'طراوت صبحگاهی',
                      icon: '🪥',
                      isWake: false,
                    },
                    {
                      key: 'homework',
                      title: 'مشق و تمرین',
                      subtitle: 'تکلیف مدرسه',
                      icon: '✏️',
                      isWake: false,
                    },
                    {
                      key: 'sleep',
                      title: 'خواب به‌موقع',
                      subtitle: 'آرامش شبانه',
                      icon: '🌙',
                      isWake: false,
                    },
                  ].map((habit) => {
                    const isDone = (student.completedHabitsToday || []).includes(habit.key);
                    return (
                      <button
                        key={habit.key}
                        type="button"
                        onClick={() => handleHabit(habit.key, habit.title, habit.isWake)}
                        className={`group relative p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 ${
                          isDone
                            ? 'bg-[#EBF7E7] border-[#72B056] text-[#2C571D] shadow-2xs hover:shadow-xs'
                            : 'bg-white hover:bg-[#FAF8F1] border-[#E2D8C3] hover:border-[#7BA05B] hover:shadow-md text-[#2D2D2D]'
                        }`}
                        title={
                          isDone
                            ? `عادت «${habit.title}» انجام و شارژ شده است`
                            : `برای ثبت عادت «${habit.title}» و شارژ ۲۵٪ کلیک کن`
                        }
                      >
                        {/* Top corner status indicator */}
                        <div className="absolute top-1.5 right-1.5">
                          {isDone ? (
                            <span className="w-4 h-4 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-2xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                              ۲۵٪+
                            </span>
                          )}
                        </div>

                        {/* Interactive animated icon token */}
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110 shadow-2xs ${
                            isDone ? 'bg-white/80 ring-2 ring-[#86EFAC]' : 'bg-[#FAF6EE]'
                          }`}
                        >
                          {habit.icon}
                        </div>

                        {/* Text labels */}
                        <div className="w-full">
                          <div className="text-xs sm:text-sm font-bold truncate">
                            {habit.title}
                          </div>
                          <div
                            className={`text-[10px] mt-0.5 font-medium truncate ${
                              isDone ? 'text-[#2E7D32] font-bold' : 'text-[#7A7A7A]'
                            }`}
                          >
                            {isDone ? 'شارژ شد ✓' : habit.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connected Math Game Module Shortcut */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE]/40 to-[#F0FDF4] border border-[#BFDBFE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                    🎲
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1E3A8A] flex items-center gap-1.5">
                      <span>ماژول همراه: چالش و بازی ریاضی هوشمند</span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#DBEAFE] text-[#1E40AF]">
                        متصل به جوانه
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#475569] mt-0.5">
                      با انجام چالش ضرب، تکلیف امروزت تکمیل می‌شود و گیاهت انرژی و برگ تازه می‌گیرد!
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPlantClick(540);
                      setMathModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                  >
                    <span>🎮 شروع بازی ریاضی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPlantClick(540);
                      setWheelModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                  >
                    <span>🎡 گردونهٔ شانس</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Closet & Permanent Unlocks */}
          {activeTab === 'closet' && (
            <div className="space-y-4">
              <p className="text-xs text-[#4F7332] bg-[#EFF6E9] p-3 rounded-xl border border-[#D1E3C4]">
                ✨ هرچه روزهای بیشتری کنار گیاهت باشی، یادگاری‌های بیشتری باز می‌شوند و برای همیشه (حتی در نسل‌های بعدی) مال تو می‌مانند!
              </p>

              <div>
                <h4 className="text-xs font-bold text-[#2D2D2D] mb-2">🪴 تغییر گلدان</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'terracotta', name: 'سفالی خندان', icon: '🪴' },
                    { id: 'strawberry', name: 'توت‌فرنگی خال‌خالی', icon: '🍓' },
                    { id: 'crystal', name: 'شیشه‌ای درخشان', icon: '💎' },
                    { id: 'cosmic', name: 'کیهانی ستاره‌دار', icon: '🌌' },
                    { id: 'sage', name: 'سبز مریم‌گلی', icon: '🍵' },
                    { id: 'clay', name: 'خاک رس سنتی', icon: '🎨' },
                    { id: 'sand', name: 'شنی کویری', icon: '🏺' },
                  ].map((pStyle) => (
                    <button
                      key={pStyle.id}
                      onClick={() => {
                        sound.playPlantClick(500);
                        onCustomizePlant(student.id, { potStyle: pStyle.id as any });
                        showBanner(`گلدان به «${pStyle.name}» تغییر کرد!`);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        student.potStyle === pStyle.id
                          ? 'bg-[#EBF3E4] border-[#7BA05B] font-bold shadow-2xs'
                          : 'bg-white hover:bg-[#FAF8F2] border-[#E5DEC9]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{pStyle.icon}</div>
                      <div className="text-xs text-[#2D2D2D]">{pStyle.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#2D2D2D] mb-2">🎀 اکسسوری و تزئین</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', name: 'بدون تزئین', icon: '✨' },
                    { id: 'ribbon', name: 'روبان صورتی', icon: '🎀' },
                    { id: 'dewdrop', name: 'قطره شبنم', icon: '💧' },
                    { id: 'ladybug', name: 'دوست کفشدوزک', icon: '🐞' },
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        sound.playPlantClick(500);
                        onCustomizePlant(student.id, { accessory: acc.id as any });
                        showBanner(`تزئین به «${acc.name}» تغییر کرد!`);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        (student.accessory || 'none') === acc.id
                          ? 'bg-[#EBF3E4] border-[#7BA05B] font-bold shadow-2xs'
                          : 'bg-white hover:bg-[#FAF8F2] border-[#E5DEC9]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{acc.icon}</div>
                      <div className="text-xs text-[#2D2D2D]">{acc.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Week Care Leaves (No Punitive Streaks) */}
          {activeTab === 'week' && (
            <div>
              <h3 className="text-sm font-bold text-[#2D2D2D] mb-1">
                برگ‌های همراهی این هفته
              </h3>
              <p className="text-xs text-[#7A7A7A] mb-4">
                هر روزی که به «{student.plantName}» سر بزنی، یک برگ سبز در تقویم شکوفا می‌شود. غیبت باعث سوختن یا جریمه برگ‌های قبلی نمی‌شود!
              </p>

              <div className="grid grid-cols-7 gap-2 text-center">
                {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'امروز'].map((day, idx) => {
                  const isDone = idx === 6 || idx === 0 || idx === 1 || idx === 3;
                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 ${
                        isDone
                          ? 'bg-[#F2F7ED] border-[#A5CC85]'
                          : 'bg-[#FAF8F2] border-[#E5DEC9]'
                      }`}
                    >
                      <span className="text-[11px] font-semibold text-[#5A5A5A]">{day}</span>
                      <span className="text-xl">{isDone ? '🌿' : '🌱'}</span>
                      <span className="text-[10px] text-[#7A7A7A]">
                        {isDone ? 'حضور سبز' : 'استراحت'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Memories & Dream Journal */}
          {activeTab === 'memories' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2D2D2D]">
                  دفتر خاطرات «{student.plantName}»
                </h3>
                <span className="text-[11px] text-[#4A6E2E] bg-[#EBF3E4] px-2.5 py-0.5 rounded-full">
                  خاطرات بین تمام نسل‌ها ماندگارند
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    icon: '🌱',
                    date: 'شروع دوستی',
                    text: `اولین روزی که «${student.plantName}» سر از خاک بیرون آورد و با ${student.childName} دوست شد.`,
                  },
                  ...(student.activeDream
                    ? [
                        {
                          icon: '🌙',
                          date: 'دیشب',
                          text: student.activeDream,
                        },
                      ]
                    : []),
                  {
                    icon: '🌧️',
                    date: 'هفته گذشته',
                    text: `در یک روز بارانی آرام، ساقه و برگ‌های «${student.plantName}» جوانه تازه‌ای زدند.`,
                  },
                ].map((mem, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#E5DEC9] flex items-start gap-3"
                  >
                    <span className="text-xl mt-0.5">{mem.icon}</span>
                    <div>
                      <span className="text-[10px] text-[#7A7A7A] block">{mem.date}</span>
                      <p className="text-xs sm:text-[13px] text-[#2D2D2D] mt-0.5 leading-relaxed">
                        {mem.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dream Narrative Modal */}
      {dreamModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 fade-in-modal"
          onClick={() => setDreamModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#FDFBF7] rounded-3xl border border-[#C8D9B5] p-6 text-center shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#F5F2F9] mx-auto flex items-center justify-center text-3xl mb-3">
              🌙
            </div>
            <h3 className="text-base font-bold text-[#4F7332] mb-2">
              رویای دیشبِ «{student.plantName}»
            </h3>
            <p className="text-xs sm:text-sm text-[#2D2D2D] leading-relaxed italic bg-white p-4 rounded-2xl border border-[#E5DEC9] mb-4">
              «{student.activeDream}»
            </p>
            <button
              onClick={() => setDreamModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#7BA05B] hover:bg-[#688D49] text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              چقدر رویای قشنگی! 💚
            </button>
          </div>
        </div>
      )}

      {/* Generational Seed Celebration Modal */}
      {seedModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 fade-in-modal"
          onClick={() => setSeedModalOpen(false)}
        >
          <form
            onSubmit={handlePlantNewGeneration}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#FDFBF7] rounded-3xl border-2 border-[#E6B85C] p-6 text-center shadow-2xl"
          >
            <div className="text-4xl mb-2">🌰✨</div>
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">
              آیین بذر و تولد نسل {student.gen + 1}
            </h3>
            <p className="text-xs text-[#666] leading-relaxed mb-4">
              «{student.plantName}» پس از {student.growthDays} روز همراهی با تو، به شکوفایی کامل رسید و یک بذر طلایی به جا گذاشت. خودش به بذرخانه‌ی کلاس می‌رود و تمام خاطرات و گلدان‌هایت برای نسل جدید باقی می‌ماند!
            </p>
            <input
              type="text"
              value={newSeedName}
              onChange={(e) => setNewSeedName(e.target.value)}
              placeholder="نام جوانه‌ی نسل جدید را چه می‌گذاری؟"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0BC] text-xs sm:text-sm mb-4 outline-none focus:ring-2 focus:ring-[#7BA05B]"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                کاشتن بذر جدید 🌱
              </button>
              <button
                type="button"
                onClick={() => setSeedModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#EFECE2] text-[#2D2D2D] text-xs font-semibold cursor-pointer"
              >
                فعلاً نه
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Student Modal */}
      {newStudentModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 fade-in-modal"
          onClick={() => setNewStudentModal(false)}
        >
          <form
            onSubmit={handleCreateStudent}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#FDFBF7] rounded-3xl border border-[#C8D9B5] p-6 shadow-2xl"
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">🌱🪴</div>
              <h3 className="text-base font-bold text-[#2D2D2D]">
                کاشتن جوانه‌ی جدید در باغچه‌ی کلاس
              </h3>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                دانه‌ات را در خاک بگذار و برایش یک اسم قشنگ انتخاب کن
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                  نام کودک:
                </label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="مثلاً: روشا"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D8D0BC] text-xs sm:text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                  نام گیاه:
                </label>
                <input
                  type="text"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  placeholder="مثلاً: بهارنارنج"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D8D0BC] text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                بکاریمش! 🌿
              </button>
              <button
                type="button"
                onClick={() => setNewStudentModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#EFECE2] text-[#2D2D2D] text-xs font-semibold cursor-pointer"
              >
                بستن
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Student Math Game Popup Modal */}
      {mathModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setMathModalOpen(false);
            setMathAnswerFeedback(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border-2 border-[#3B82F6] space-y-4"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-3xl shadow-sm">
              🎲
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E3A8A]">چالش ریاضی امروز</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                حاصل ضرب زیر را حدس بزن تا به «{student.plantName}» آب و نور هدیه دهی!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-2xl font-black text-[#0F172A]">
              ۵ × ۴ = ؟
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[15, 20, 25, 18].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (num === 20) {
                      sound.playJoyfulChime();
                      triggerHearts('⭐');
                      setMathAnswerFeedback('آفرین! پاسخ کاملاً درسته 🌟 گیاهت شاداب شد و تکلیف امروزت ثبت شد!');
                      handleHabit('homework', 'مشق و تمرین درسی', false);
                      setTimeout(() => {
                        setMathModalOpen(false);
                        setMathAnswerFeedback(null);
                      }, 1800);
                    } else {
                      sound.playGentlePluck(260);
                      setMathAnswerFeedback('دوباره فکر کن عزیزم! می‌تونی ۵ تا ۵ تا بشماری.');
                    }
                  }}
                  className="py-3 px-4 rounded-xl text-lg font-bold bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#1E293B] hover:text-[#2563EB] border border-[#CBD5E1] hover:border-[#3B82F6] transition-all cursor-pointer"
                >
                  {num}
                </button>
              ))}
            </div>

            {mathAnswerFeedback && (
              <p className="text-xs font-semibold p-2.5 rounded-xl bg-[#ECFDF5] border border-[#86EFAC] text-[#065F46] animate-fade-in">
                {mathAnswerFeedback}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                setMathModalOpen(false);
                setMathAnswerFeedback(null);
              }}
              className="text-xs text-[#64748B] hover:text-[#0F172A] font-medium"
            >
              بستن پنجره
            </button>
          </div>
        </div>
      )}

      {/* Wheel of Fortune Widget Modal */}
      {wheelModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setWheelModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full">
            <RewardWheelWidget
              studentId={student.id}
              studentName={student.childName}
              onRewardClaimed={(reward) => {
                showBanner(`🎉 هدیهٔ ${reward.title} باز شد و به کمد یادگاری‌هایت اضافه گشت!`);
                triggerHearts('✨');
                if (reward.icon === '👒') {
                  onCustomizePlant(student.id, { accessory: 'strawhat' });
                } else if (reward.icon === '👑') {
                  onCustomizePlant(student.id, { accessory: 'flower' });
                } else if (reward.icon === '🦋') {
                  onCustomizePlant(student.id, { accessory: 'ladybug' });
                } else if (reward.icon === '💧') {
                  onCustomizePlant(student.id, { accessory: 'dewdrop' });
                } else if (reward.icon === '🪴') {
                  onCustomizePlant(student.id, { potStyle: 'terracotta' });
                } else if (reward.icon === '🌰') {
                  onCustomizePlant(student.id, { accessory: 'ribbon' });
                }
              }}
              onClose={() => setWheelModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
