import { OwnerLicensePanel } from './components/owner/OwnerLicensePanel';
import { ToolsCatalog } from './components/tools/ToolsCatalog';
import React, { useState, useEffect, useCallback } from 'react';
import { ClassData, Plant, Mood, AppRole, School, ClassroomInfo, TeacherInfo, PlatformModuleId } from './types';
import {
  generateCleanTestClass,
  generateMockClass,
  initialSchools,
  initialSchoolClasses,
  initialSchoolTeachers,
} from './utils/mockData';
import { sound } from './utils/audio';
import { dataBridge } from './lib/services/data-bridge';
import { auditLogger } from './lib/audit/audit-logger';

// Visual Components
import { Header } from './components/Header';
import { RadarCard } from './components/RadarCard';
import { Garden } from './components/Garden';
import { SeedBank } from './components/SeedBank';
import { Drawer } from './components/Drawer';
import { BoardMode } from './components/BoardMode';
import { ConversationModal } from './components/ConversationModal';
import { ClassroomSimulatorModal } from './components/ClassroomSimulatorModal';
import { StudentRoomView } from './components/StudentRoomView';
import { GuideModal } from './components/GuideModal';
import { PrintView } from './components/PrintView';
import { OwnerPanel } from './components/OwnerPanel';
import { SchoolPanel } from './components/SchoolPanel';
import { RoleLoginModal } from './components/RoleLoginModal';
import { TeacherAssistantModule } from './components/TeacherAssistantModule';
import { RoshaModule } from './components/RoshaModule';
import { DeBonoHatModal } from './components/DeBonoHatModal';
import { TeacherWidgetsHub } from './components/TeacherWidgetsHub';
import { EmotionalRhythmChartWidget } from './components/EmotionalRhythmChartWidget';

// Phase 4 Workspaces & Modals
import { FinancialLedgerModal } from './components/FinancialLedgerModal';
import { SupportTicketingWorkspace } from './components/SupportTicketingWorkspace';
import { RosterUploadWorkspace } from './components/RosterUploadWorkspace';
import { MicroInterventionForm } from './components/MicroInterventionForm';

// Icons
import {
  ShieldCheck,
  Lock,
  Unlock,
  RefreshCw,
  Receipt,
  FileSpreadsheet,
  LifeBuoy,
  Sprout,
  Users,
  Monitor,
  Heart,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export type MainTab = 'javaneh_garden' | 'super_admin' | 'rostering' | 'support_tickets';

export default function App() {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MainTab>('javaneh_garden');
  const [activeRole, setActiveRole] = useState<AppRole>('teacher');
  const [activeModule, setActiveModule] = useState<PlatformModuleId>('javaneh_garden');
  const [activeStudentId, setActiveStudentId] = useState<string>('p-15');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  // Modals & Safety States
  const [boardMode, setBoardMode] = useState(false);
  const [conversationModal, setConversationModal] = useState(false);
  const [simulatorModal, setSimulatorModal] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deBonoModalOpen, setDeBonoModalOpen] = useState(false);
  const [seedBankOpen, setSeedBankOpen] = useState(false);
  const [financialLedgerOpen, setFinancialLedgerOpen] = useState(false);

  // Projector Safety Mode (90-second Auto Lock)
  const [isSafeMode, setIsSafeMode] = useState(true);
  const [isProjectorLocked, setIsProjectorLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(90);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-tenant State
  const [schools, setSchools] = useState<School[]>(() => dataBridge.getSchools());
  const [schoolClasses, setSchoolClasses] = useState<ClassroomInfo[]>(initialSchoolClasses);
  const [schoolTeachers, setSchoolTeachers] = useState<TeacherInfo[]>(initialSchoolTeachers);

  // Initial Data Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setClassData(generateCleanTestClass());
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Listen to Data Bridge changes
  useEffect(() => {
    const unsubscribe = dataBridge.subscribe(() => {
      setSchools(dataBridge.getSchools());
    });
    return unsubscribe;
  }, []);

  // 90-Second Projector Safety Auto-Lock Countdown
  useEffect(() => {
    if (!isSafeMode || isProjectorLocked) return;

    const timer = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          setIsProjectorLocked(true);
          sound.playPlantClick(300);
          auditLogger.logSecurityLicense('PROJECTOR_AUTO_LOCKED_90S', {
            reason: 'Inactivity threshold 90 seconds reached',
          });
          return 90;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSafeMode, isProjectorLocked]);

  // Keyboard Emergency ESC Shortcut for Immediate Lock & Event Reset
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsProjectorLocked(true);
      setBoardMode(false);
      setConversationModal(false);
      setSimulatorModal(false);
      setGuideModalOpen(false);
      setRoleModalOpen(false);
      setDeBonoModalOpen(false);
      setFinancialLedgerOpen(false);
      sound.playPlantClick(250);
      setToastMessage('🔒 قفل اضطراری پروجکتور با کلید ESC فعال گردید.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Reset to Demo Sandbox
  const handleResetToSandbox = () => {
    sound.playJoyfulChime();
    dataBridge.resetToDemoSandbox();
    setClassData(generateCleanTestClass());
    setSelectedPlant(null);
    setIsProjectorLocked(false);
    setLockCountdown(90);
    showToast('🎮 کل سیستم با داده‌های استاندارد «دبستان نمونه آفتاب» بازنشانی شد.');
  };

  // Re-calculate radar summary dynamically whenever plants state changes
  const updateClassWithPlants = (newPlants: Plant[]) => {
    if (!classData) return;

    const alertPlants = newPlants.filter((p) => p.mood === 'alert');
    const longingPlants = newPlants.filter((p) => p.mood === 'longing');
    const thrivingPlants = newPlants.filter((p) => p.mood === 'thriving');

    const score = (thrivingPlants.length * 1.0 + (newPlants.length - longingPlants.length - alertPlants.length) * 0.75 + longingPlants.length * 0.45) / newPlants.length;
    const healthPercentage = Math.round(score * 100);

    let overall: 'good' | 'mixed' | 'needs_care' = 'mixed';
    let overallMessage = 'امروز حال باغچه متوسط است. چند گیاه چشم‌به‌راه مراقبت دوستانشان هستند.';

    if (healthPercentage >= 70) {
      overall = 'good';
      overallMessage = 'امروز حال باغچه خوب است؛ بیشتر گیاهان سرزنده و پرانرژی‌اند. 🌿';
    } else if (healthPercentage < 40) {
      overall = 'needs_care';
      overallMessage = 'امروز باغچه نیاز به توجه دارد؛ گیاهان چشم‌انتظار همراهی و دیدارند.';
    }

    const needsAttentionPlants = [...alertPlants, ...longingPlants].slice(0, 3);
    const needsAttention = needsAttentionPlants.map((p) => ({
      plantId: p.id,
      childName: p.childName,
      plantName: p.plantName,
      mood: p.mood as 'longing' | 'alert',
      lastSeenDays: p.lastSeenDays,
      hint:
        p.mood === 'alert'
          ? `یک احوالپرسی مهربانانه در پیام‌رسان؛ بپرس اوضاع چطوره و یادآوری کن گیاهش چشم‌به‌راهه.`
          : `می‌تونی فردا صبح ازش بپرسی دیشب گیاهش چه خوابی دیده و با هم بهش سر بزنید.`,
    }));

    setClassData({
      ...classData,
      plants: newPlants,
      radar: {
        ...classData.radar,
        overall,
        overallMessage,
        healthPercentage,
        needsAttentionCount: needsAttention.length,
        needsAttention,
      },
    });

    if (selectedPlant) {
      const updatedSelected = newPlants.find((p) => p.id === selectedPlant.id);
      if (updatedSelected) {
        setSelectedPlant(updatedSelected);
      }
    }
  };

  const handleSelectPlantById = (plantId: string) => {
    if (!classData) return;
    const plant = classData.plants.find((p) => p.id === plantId);
    if (plant) {
      sound.playDrawerOpen();
      setSelectedPlant(plant);
    }
  };

  const handleSendTeacherNudge = (plantId: string) => {
    if (!classData) return;
    const newPlants = classData.plants.map((p) => {
      if (p.id === plantId) {
        return {
          ...p,
          teacherNudgeSent: true,
        };
      }
      return p;
    });
    updateClassWithPlants(newPlants);
    showToast(`نوازش مهربانانه معلم برای «${selectedPlant?.childName}» ارسال شد ✨`);
  };

  const handleCompleteStudentHabit = (studentId: string, habitKey: string) => {
    if (!classData) return;
    const newPlants = classData.plants.map((p) => {
      if (p.id === studentId) {
        const habitsToday = p.completedHabitsToday || [];
        if (habitsToday.includes(habitKey)) {
          return p;
        }

        const nextStage = p.stage < 5 && p.growthDays >= 22 ? ((p.stage + 1) as 1 | 2 | 3 | 4 | 5) : p.stage;
        let dream = p.activeDream;
        if (p.lastSeenDays >= 2 && !dream) {
          dream = 'دیشب خواب دیدم برگشتی و پنجره‌ی اتاق را باز کردی؛ چقدر دلم برایت تنگ شده بود!';
        }
        return {
          ...p,
          lastSeenDays: 0,
          mood: 'thriving' as Mood,
          growthDays: p.growthDays + 1,
          stage: nextStage,
          activeDream: dream,
          completedHabitsToday: [...habitsToday, habitKey],
          lastHabitCompleted:
            habitKey === 'wake'
              ? 'بیدارباش سحرگاه (۶:۳۰ صبح)'
              : habitKey === 'homework'
              ? 'تکلیف درسی امروز'
              : habitKey === 'brush'
              ? 'مسواک و آبیاری صبح'
              : 'آماده‌ی خواب و استراحت',
        };
      }
      return p;
    });
    updateClassWithPlants(newPlants);
  };

  const handleCustomizePlant = (studentId: string, changes: Partial<Plant>) => {
    if (!classData) return;
    const newPlants = classData.plants.map((p) => (p.id === studentId ? { ...p, ...changes } : p));
    updateClassWithPlants(newPlants);
  };

  const handleRenamePlant = (studentId: string, newName: string) => {
    if (!classData) return;
    const newPlants = classData.plants.map((p) => (p.id === studentId ? { ...p, plantName: newName } : p));
    updateClassWithPlants(newPlants);
  };

  const handlePlantNewSeed = (studentId: string, newName: string) => {
    if (!classData) return;
    let oldPlantArchive: Plant | null = null;
    const newPlants = classData.plants.map((p) => {
      if (p.id === studentId) {
        oldPlantArchive = {
          ...p,
          id: `seed-${Date.now()}`,
          archived: true,
        };
        return {
          ...p,
          plantName: newName,
          gen: p.gen + 1,
          stage: 1 as const,
          growthDays: 1,
          mood: 'thriving' as Mood,
          lastSeenDays: 0,
          activeDream: null,
          completedHabitsToday: [],
        };
      }
      return p;
    });

    const newSeedBank = oldPlantArchive ? [oldPlantArchive, ...classData.seedBank] : classData.seedBank;
    setClassData({
      ...classData,
      plants: newPlants,
      seedBank: newSeedBank,
    });
  };

  const handleAddNewStudent = (childName: string, plantName: string) => {
    if (!classData) return;
    const newId = `p-${Date.now()}`;
    const newPlant: Plant = {
      id: newId,
      childName,
      plantName,
      gen: 1,
      stage: 1,
      growthDays: 1,
      lastSeenDays: 0,
      mood: 'thriving',
      activeDream: null,
      memoriesCount: 1,
      archived: false,
      potStyle: 'terracotta',
      accessory: 'none',
      randomOffset: Math.floor(Math.random() * 15),
      completedHabitsToday: [],
    };
    const updated = [newPlant, ...classData.plants];
    updateClassWithPlants(updated);
    setActiveStudentId(newId);
  };

  const handleSimulateWakeUp = (plantId: string) => {
    handleCompleteStudentHabit(plantId, 'wake');
    showToast(`بیدارباش سحرگاهی ثبت شد! گیاه شاداب شد 🌱`);
  };

  const handleSimulateHomework = (plantId: string) => {
    handleCompleteStudentHabit(plantId, 'homework');
    showToast(`انجام تکلیف ثبت شد! ریتم روزانه کودک پایدار است 🌿`);
  };

  const handleToggleShelterMode = () => {
    if (!classData) return;
    const nextShelter = !classData.isShelterMode;
    sound.playJoyfulChime();
    setClassData({
      ...classData,
      isShelterMode: nextShelter,
    });
    showToast(
      nextShelter
        ? '🕊️ حالت تنفس آرام باغچه (پناهگاه) فعال شد؛ فرسایش گیاهان در ایام بحران متوقف شد'
        : '🌿 باغچه به وضعیت ریتم عادی برگشت'
    );
  };

  const handleSimulateTimePass = (days: number) => {
    if (!classData) return;
    const isShelter = classData.isShelterMode;
    const newPlants = classData.plants.map((p) => {
      const newLastSeen = p.lastSeenDays + days;
      let newMood: Mood = p.mood;
      if (isShelter) {
        newMood = p.mood === 'alert' ? 'longing' : p.mood;
      } else {
        if (newLastSeen >= 4) {
          newMood = 'alert';
        } else if (newLastSeen >= 2) {
          newMood = 'longing';
        } else if (newLastSeen >= 1) {
          newMood = 'content';
        }
      }
      return {
        ...p,
        lastSeenDays: newLastSeen,
        mood: newMood,
        completedHabitsToday: days > 0 ? [] : p.completedHabitsToday,
      };
    });
    updateClassWithPlants(newPlants);
    showToast(`${days} روز گذشت زمان شبیه‌سازی شد${isShelter ? ' (محافظت پناهگاه فعال است)' : ''}.`);
  };

  const handleResetGarden = () => {
    setClassData(generateCleanTestClass());
    setSelectedPlant(null);
    showToast('باغچه به حالت تمیز آزمایشی بازنشانی شد.');
  };

  const handleSelectRole = (role: AppRole, studentId?: string) => {
    setActiveRole(role);
    if (studentId) {
      setActiveStudentId(studentId);
    }
  };

  const handleExecuteCheatCode = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toLowerCase();

    if (clean === 'clean') {
      setClassData(generateCleanTestClass());
      setActiveRole('teacher');
      return { success: true, message: 'باغچه پاک‌سازی شد؛ فضای تمیز با ۳ دانش‌آموز نمونه آماده شد.' };
    }

    if (clean === 'demo20') {
      setClassData(generateMockClass());
      setActiveRole('teacher');
      return { success: true, message: '۲۰ گیاه شبیه‌سازی‌شده (دمو کامل) با موفقیت بارگذاری شدند.' };
    }

    if (clean === 'shelter') {
      handleToggleShelterMode();
      return { success: true, message: 'وضعیت محافظت پناهگاه در شرایط بحران تغییر یافت.' };
    }

    if (clean === 'revive') {
      if (!classData) return { success: false, message: 'باغچه هنوز بارگذاری نشده است.' };
      const revived = classData.plants.map((p) => ({
        ...p,
        mood: 'thriving' as Mood,
        lastSeenDays: 0,
      }));
      updateClassWithPlants(revived);
      return { success: true, message: 'تمام گیاهان کلاس فوراً شاداب و سرزنده شدند! ✨' };
    }

    return { success: false, message: 'کد مخفی شناسایی نشد.' };
  };

  return (
    <div className="min-h-screen bg-[#FDFBF5] text-[#2D2D2D] flex flex-col font-['Vazirmatn',system-ui,sans-serif] selection:bg-[#C8D9B5] selection:text-[#2D2D2D] dir-rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#354826] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-[#526D3C] animate-in fade-in zoom-in duration-150">
          <Heart className="w-4 h-4 text-[#A7D481] fill-current" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Tailwind Top Bar: Projector Safety & Master Demo Sandbox Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md z-40">
        
        {/* Left: Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => { setActiveTab('javaneh_garden'); sound.playPlantClick(500); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'javaneh_garden' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            🌱 پیشخوان کلاسی جوانه
          </button>
          
          <button
            onClick={() => { setActiveTab('super_admin'); sound.playPlantClick(520); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'super_admin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            🛡️ پنل سوپرادمین آفتاب
          </button>

          <button
            onClick={() => { setActiveTab('rostering'); sound.playPlantClick(540); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rostering' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-300" />
            📥 درگاه روسترینگ مدرسه
          </button>

          <button
            onClick={() => { setActiveTab('support_tickets'); sound.playPlantClick(560); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'support_tickets' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-cyan-300" />
            🎫 مرکز پشتیبانی و تیکتینگ
          </button>
        </div>

        {/* Center: Role Switcher & Projector Safety */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1 rounded-xl border border-slate-700/50">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400">نقش:</span>
            <select
              value={activeRole}
              onChange={(e) => handleSelectRole(e.target.value as AppRole)}
              className="bg-transparent text-slate-100 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="owner" className="bg-slate-900">👑 سوپرادمین آفتاب</option>
              <option value="school" className="bg-slate-900">🏫 مدیر مدرسه</option>
              <option value="teacher" className="bg-slate-900">👩‍🏫 معلم کلاسی</option>
              <option value="student" className="bg-slate-900">🎒 دانش‌آموز</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1 rounded-xl border border-slate-700/50">
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <button
              onClick={() => {
                const next = !isSafeMode;
                setIsSafeMode(next);
                if (!next) setIsProjectorLocked(false);
                showToast(next ? '🛡️ حالت ایمن پروجکتور (قفل ۹۰ ثانیه) فعال شد' : 'حالت ایمن غیرفعال شد');
              }}
              className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1"
            >
              {isSafeMode ? (
                <>
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>ایمن ({isProjectorLocked ? 'قفل' : `${lockCountdown}s`})</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3 text-amber-400" />
                  <span>آزاد</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Master Sandbox Reset & Ledger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFinancialLedgerOpen(true)}
            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            دفتر معین مالی
          </button>

          <button
            onClick={handleResetToSandbox}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            🎮 بارگذاری سندباکس دمو
          </button>
        </div>
      </div>

      {/* Main Header Component */}
      <Header
        classNameTitle={classData?.className || 'کلاس سوم الف'}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        activeModule={activeModule}
        onChangeModule={setActiveModule}
        onEnterBoardMode={() => setBoardMode(true)}
        onOpenConversationModal={() => setConversationModal(true)}
        onOpenSimulatorModal={() => setSimulatorModal(true)}
        onOpenGuideModal={() => setGuideModalOpen(true)}
        onOpenRoleModal={() => setRoleModalOpen(true)}
        onOpenDeBonoModal={() => setDeBonoModalOpen(true)}
        onPrint={() => window.print()}
        isShelterMode={classData?.isShelterMode}
        onToggleShelterMode={handleToggleShelterMode}
      />

      {/* Conditional Active Tab Body */}
      {isProjectorLocked ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4 bg-slate-900/95 text-slate-200">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">پروجکتور کلاس به علت عدم فعالیت قفل شد</h2>
          <p className="text-xs text-slate-400 max-w-md">
            جهت حفظ حریم خصوصی پرونده بالینی دانش‌آموزان، صفحه‌نمایش قفل شده است. برای باز کردن کلید Esc یا دکمه بازگشایی را فشار دهید.
          </p>
          <button
            onClick={() => {
              setIsProjectorLocked(false);
              setLockCountdown(90);
              sound.playJoyfulChime();
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
          >
            بازگشایی قفل پروجکتور
          </button>
        </div>
      ) : activeTab === 'super_admin' ? (
        <main className="no-print flex-1">
          <OwnerPanel
            schools={schools}
            onUpdateSchools={(updated) => {
              setSchools(updated);
              dataBridge.getSchools();
            }}
            onExitToApp={() => setActiveTab('javaneh_garden')}
          />
        </main>
      ) : activeTab === 'rostering' ? (
        <main className="no-print flex-1 py-4">
          <RosterUploadWorkspace schoolId="sch-aftab-demo" />
        </main>
      ) : activeTab === 'support_tickets' ? (
        <main className="no-print flex-1 py-4">
          <SupportTicketingWorkspace />
        </main>
      ) : activeRole === 'student' && classData ? (
        <main className="no-print flex-1 py-4">
          <StudentRoomView
            plants={classData.plants}
            activeStudentId={activeStudentId}
            onSelectStudent={setActiveStudentId}
            onCompleteHabit={handleCompleteStudentHabit}
            onCustomizePlant={handleCustomizePlant}
            onRenamePlant={handleRenamePlant}
            onPlantNewSeed={handlePlantNewSeed}
            onAddNewStudent={handleAddNewStudent}
          />
        </main>
      ) : activeModule === 'rosha_v1' ? (
        <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <RoshaModule onExit={() => setActiveModule('javaneh_garden')} />
        </main>
      ) : activeModule === 'teacher_widgets' ? (
        <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TeacherWidgetsHub
            plants={classData?.plants || []}
            onRewardHabit={handleCompleteStudentHabit}
            onSendTeacherNudge={handleSendTeacherNudge}
            onExitToGarden={() => setActiveModule('javaneh_garden')}
          />
        </main>
      ) : activeModule === 'teacher_assistant' || activeModule === 'math_game' ? (
        <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TeacherAssistantModule
            classNameTitle={classData?.className || 'کلاس سوم الف'}
            plants={classData?.plants || []}
            onSendTeacherNudge={handleSendTeacherNudge}
            onRewardHabit={(sid, hKey) => {
              handleCompleteStudentHabit(sid, hKey);
              showToast('تکلیف ریاضی با موفقیت انجام شد؛ گیاه در باغچه شاداب گشت!');
            }}
            onExitToGarden={() => setActiveModule('javaneh_garden')}
          />
        </main>
      ) : (
        <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Diagnostic Micro-Intervention Form Protection */}
          <MicroInterventionForm
            deskCode="DESK-03"
            childName="علی"
            onSave={() => showToast('مداخله بالینی با موفقیت در لاگ FERPA ثبت شد.')}
          />

          {/* Shelter Mode Banner if active */}
          {classData?.isShelterMode && (
            <div className="bg-[#EBF3E4] border border-[#A5CC85] rounded-2xl p-3.5 px-4 text-xs sm:text-sm text-[#2F4D1E] flex items-center justify-between shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🕊️</span>
                <div>
                  <span className="font-bold">حالت تنفس آرام باغچه (پناهگاه و شرایط بحران) فعال است:</span>
                  <span className="mr-1 text-[#4A6E32]">
                    سرعت فرسایش و استرس غیبت گیاهان متوقف شده تا دانش‌آموزان با خاطری آسوده بازگردند.
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggleShelterMode}
                className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-[#F2F7EE] rounded-lg border border-[#A5CC85] text-[#2F4D1E] cursor-pointer"
              >
                پایان وضعیت بحران
              </button>
            </div>
          )}

          {/* Radar Card */}
          {classData && (
            <RadarCard
              radar={classData.radar}
              onSelectPlantById={handleSelectPlantById}
            />
          )}

          {/* Visual Analytics Widget */}
          <EmotionalRhythmChartWidget plants={classData?.plants || []} />

          {/* Living Garden */}
          <Garden
            plants={classData?.plants || []}
            loading={loading}
            selectedPlantId={selectedPlant?.id}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
          />

          {/* Seed Bank */}
          {classData && classData.seedBank && classData.seedBank.length > 0 && (
            <SeedBank
              seedBank={classData.seedBank}
              isOpen={seedBankOpen}
              onToggle={() => setSeedBankOpen(!seedBankOpen)}
              onSelectSeed={(seed) => setSelectedPlant(seed)}
            />
          )}

          {/* Footer */}
          <footer className="text-center py-6 text-xs text-[#7A7A7A] space-y-1.5 border-t border-[#EFE8DC]">
            <p className="font-medium text-[#5A7A3F]">
              «این باغچه برای مراقبت و گفت‌وگو است، نه رتبه‌بندی یا ایجاد گناه.»
            </p>
            <p className="text-[11px] text-[#999999]">
              منبع حقیقت احساس: مدت غیبت واقعی • سازگار با شبکه محلی و مدارس غیرحضوری ایران
            </p>
          </footer>
        </main>
      )}

      {/* Financial Ledger Modal */}
      <FinancialLedgerModal
        isOpen={financialLedgerOpen}
        onClose={() => setFinancialLedgerOpen(false)}
        schoolId="sch-aftab-demo"
      />

      {/* Role Selection Modal */}
      <RoleLoginModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        currentRole={activeRole}
        onSelectRole={handleSelectRole}
        onExecuteCheatCode={handleExecuteCheatCode}
      />

      {/* Slide-Up Bottom Sheet Drawer */}
      <Drawer
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onSendTeacherNudge={handleSendTeacherNudge}
        onJumpToStudentRoom={(id) => {
          setActiveStudentId(id);
          setSelectedPlant(null);
          setActiveRole('student');
        }}
      />

      {/* Fullscreen Classroom Whiteboard */}
      {boardMode && classData && (
        <BoardMode
          plants={classData.plants}
          radar={classData.radar}
          classNameTitle={classData.className}
          onExit={() => setBoardMode(false)}
        />
      )}

      {/* Conversation Modal */}
      {classData && (
        <ConversationModal
          isOpen={conversationModal}
          onClose={() => setConversationModal(false)}
          radar={classData.radar}
          plants={classData.plants}
        />
      )}

      {/* Classroom Simulator Modal */}
      {classData && (
        <ClassroomSimulatorModal
          isOpen={simulatorModal}
          onClose={() => setSimulatorModal(false)}
          plants={classData.plants}
          onSimulateWakeUp={handleSimulateWakeUp}
          onSimulateHomework={handleSimulateHomework}
          onSimulateTimePass={handleSimulateTimePass}
          onResetGarden={handleResetGarden}
        />
      )}

      {/* In-App Visual Guide Modal */}
      <GuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      {/* Edward de Bono 6-Hat Audit Modal */}
      <DeBonoHatModal
        isOpen={deBonoModalOpen}
        onClose={() => setDeBonoModalOpen(false)}
      />

      {/* Printable Report View */}
      {classData && <PrintView classData={classData} />}
                {/* --- بخش جدید: مدیریت پلتفرم و لایسنس --- */}
          <div className="p-6 bg-slate-950 mt-10 border-t border-slate-700" dir="rtl">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">مدیریت پلتفرم (پنل مالک)</h1>
            <OwnerLicensePanel />
            
            <div className="mt-12">
              <h2 className="text-xl font-bold text-emerald-400 mb-4 text-center">کاتالوگ ابزارهای مدرسه</h2>
              <ToolsCatalog tenantId="sch-demo-aftab" userRole="SUPER_ADMIN" />
            </div>
          </div>
    </div>
  );
}
