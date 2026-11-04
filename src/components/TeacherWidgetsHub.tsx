import React, { useState } from 'react';
import { Plant } from '../types';
import {
  BookOpen,
  Trophy,
  Sparkles,
  Calendar as CalendarIcon,
  RotateCcw,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Mic,
  Award,
  BarChart3,
  Layers,
  Settings,
  Share2,
  Download,
  Upload,
  FileSpreadsheet,
  Zap,
  Users,
  Star,
  Printer,
  Bell,
  Heart,
  HelpCircle,
  Copy,
  Check,
  Gamepad2,
  Volume2,
  Palette,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { RewardWheelWidget } from './RewardWheelWidget';
import { AvaAdvisorWidget } from './AvaAdvisorWidget';
import { EmotionalRhythmChartWidget } from './EmotionalRhythmChartWidget';
import { PersonalizedHomeworkWidget } from './PersonalizedHomeworkWidget';
import { CollaborativeWhiteboardWidget } from './CollaborativeWhiteboardWidget';
import { StudentProfilePassportWidget } from './StudentProfilePassportWidget';
import { ClassroomCalendarWidget } from './ClassroomCalendarWidget';
import { EducationalGameBuilderWidget } from './EducationalGameBuilderWidget';
import { SmartDictationWidget } from './SmartDictationWidget';
import { TeacherCommunityWorkgroupWidget } from './TeacherCommunityWorkgroupWidget';
import { TeacherBookBuilderWidget } from './TeacherBookBuilderWidget';

interface TeacherWidgetsHubProps {
  plants: Plant[];
  onRewardHabit?: (studentId: string, habitKey: string) => void;
  onSendTeacherNudge?: (plantId: string) => void;
  onExitToGarden?: () => void;
}

// Mock Custom Books Created by Teacher
interface CustomBook {
  id: string;
  title: string;
  grade: number;
  chapterCount: number;
  exercisesCount: number;
  lastUpdated: string;
}

// Mock Tournament / League
interface ClassLeague {
  id: string;
  name: string;
  teams: { name: string; score: number; color: string; membersCount: number }[];
  status: 'active' | 'upcoming' | 'finished';
  currentRound: string;
}

// Mock Calendar Reminder Event
interface CalendarEvent {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  category: 'exam' | 'homework' | 'event' | 'meeting';
  completed: boolean;
}

export const TeacherWidgetsHub: React.FC<TeacherWidgetsHubProps> = ({
  plants,
  onRewardHabit,
  onSendTeacherNudge,
  onExitToGarden,
}) => {
  const [activeWidget, setActiveWidget] = useState<
    | 'community_network'
    | 'personalized_homework'
    | 'group_whiteboard'
    | 'student_profile'
    | 'book_builder'
    | 'game_builder'
    | 'dictation'
    | 'league_creator'
    | 'reward_wheel'
    | 'calendar'
    | 'ava_advisor'
    | 'analytics_chart'
  >('community_network');

  // Custom Books State
  const [customBooks, setCustomBooks] = useState<CustomBook[]>([
    { id: 'b-1', title: 'تمرینات ویژه کسر و مساحت پایه پنجم', grade: 5, chapterCount: 4, exercisesCount: 32, lastUpdated: 'دیروز' },
    { id: 'b-2', title: 'چالش معماهای عددی و الگویابی پایه چهارم', grade: 4, chapterCount: 3, exercisesCount: 24, lastUpdated: '۳ روز پیش' },
  ]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookGrade, setNewBookGrade] = useState(5);

  // League Creator State
  const [leagues, setLeagues] = useState<ClassLeague[]>([
    {
      id: 'l-1',
      name: 'جام بهاری ریاضی و هوش کلاسی',
      status: 'active',
      currentRound: 'دور دوم — معماهای اعشار',
      teams: [
        { name: 'تیم سبز (سروهای سرزنده)', score: 320, color: 'bg-emerald-500', membersCount: 5 },
        { name: 'تیم طلایی (جوانه‌های امید)', score: 310, color: 'bg-amber-500', membersCount: 5 },
        { name: 'تیم آبی (دریاهای دانایی)', score: 295, color: 'bg-sky-500', membersCount: 5 },
      ],
    },
  ]);

// Add New Book
  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;
    sound.playJoyfulChime();
    const created: CustomBook = {
      id: `b-${Date.now()}`,
      title: newBookTitle.trim(),
      grade: newBookGrade,
      chapterCount: 1,
      exercisesCount: 12,
      lastUpdated: 'امروز',
    };
    setCustomBooks([created, ...customBooks]);
    setNewBookTitle('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-right dir-rtl" dir="rtl">
      {/* Top Banner: Suite Navigation */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E3A8A] text-white rounded-3xl p-6 shadow-md border border-[#334155]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-3xl shadow-lg ring-4 ring-[#10B981]/30 shrink-0">
              🧰
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  جعبه ابزار قدرتمند معلم (Teacher Widgets Suite)
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#22C55E]/20 text-[#4ADE80] border border-[#22C55E]/30">
                  ۹ ابزارک یکپارچه
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                ارجاع تکالیف شخصی • وایت‌برد آنلاین گروهی • پروفایل و دستاوردها • کتاب‌ساز • لیگ مسابقات • چرخ شانس • تقویم • مشاور آوا • تحلیل بصری
              </p>
            </div>
          </div>

          {onExitToGarden && (
            <button
              type="button"
              onClick={onExitToGarden}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>🌿</span>
              <span>بازگشت به باغچه</span>
            </button>
          )}
        </div>

        {/* Widgets Hub Grid Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mt-6 pt-5 border-t border-white/10">
          {[
            { id: 'community_network', label: 'شبکه و انجمن معلمان', icon: Users, badge: 'تعاملی' },
            { id: 'dictation', label: 'دیکته‌گوی هوشمند', icon: Volume2, badge: 'صوتی' },
            { id: 'game_builder', label: 'بازی‌ساز درسی', icon: Gamepad2, badge: '۴ مدل' },
            { id: 'personalized_homework', label: 'ارجاع تکالیف شخصی', icon: Zap, badge: 'هدفمند' },
            { id: 'group_whiteboard', label: 'وایت‌برد گروهی', icon: Palette, badge: 'تعاملی' },
            { id: 'student_profile', label: 'پروفایل و دستاوردها', icon: Award, badge: 'مدال‌ها' },
            { id: 'book_builder', label: 'کتاب‌ساز شخصی', icon: BookOpen, badge: 'تألیف' },
            { id: 'league_creator', label: 'لیگ و مسابقه', icon: Trophy, badge: 'گروهی' },
            { id: 'reward_wheel', label: 'چرخ شانس', icon: RotateCcw, badge: 'پاداش' },
            { id: 'calendar', label: 'تقویم اجرایی', icon: CalendarIcon, badge: 'یادآور' },
            { id: 'ava_advisor', label: 'مشاور آوا', icon: Mic, badge: 'صوتی' },
            { id: 'analytics_chart', label: 'تحلیل بصری', icon: BarChart3, badge: 'نمودار' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeWidget === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveWidget(item.id as any);
                  sound.playPlantClick(480);
                }}
                className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-white text-[#0F172A] border-white shadow-lg scale-102 font-black'
                    : 'bg-white/5 text-[#CBD5E1] border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-normal">
                    {item.badge}
                  </span>
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WIDGET: TEACHERS COLLABORATIVE NETWORK & WORKGROUPS (شبکه و انجمن معلمان) */}
      {activeWidget === 'community_network' && (
        <TeacherCommunityWorkgroupWidget />
      )}

      {/* WIDGET: SMART DICTATION ENGINE (دیکته‌گوی هوشمند درسی) */}
      {activeWidget === 'dictation' && (
        <SmartDictationWidget />
      )}

      {/* WIDGET 0: EDUCATIONAL GAME BUILDER (بازی‌ساز درسی با ۴ مدل) */}
      {activeWidget === 'game_builder' && (
        <EducationalGameBuilderWidget />
      )}

      {/* WIDGET 1: CUSTOM BOOK BUILDER (کتاب‌ساز شخصی معلم) */}
      {activeWidget === 'book_builder' && (
        <TeacherBookBuilderWidget />
      )}

      {/* WIDGET 2: CLASSROOM LEAGUE & ARENA (طراحی و اجرای لیگ کلاسی) */}
      {activeWidget === 'league_creator' && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                <span>طراحی و اجرای لیگ مسابقات گروهی کلاسی (Classroom Arena League)</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                رقابت گروهی اخلاقی بدون رتبه‌بندی عددی تحقیرآمیز فردی • تقویت همکاری تیمی دانش‌آموزان
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ساخت لیگ مسابقه جدید</span>
            </button>
          </div>

          {/* Active League Board */}
          {leagues.map((leg) => (
            <div key={leg.id} className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#FCD34D]">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h4 className="font-black text-base text-[#78350F]">{leg.name}</h4>
                    <span className="text-xs text-[#92400E]">{leg.currentRound}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full text-xs font-bold">
                  لیگ فعال کلاسی
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {leg.teams.map((t, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-[#FDE68A] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${t.color}`} />
                        <span className="font-bold text-xs sm:text-sm text-[#0F172A]">{t.name}</span>
                      </div>
                      <span className="font-black text-sm text-[#B45309]">{t.score} امتیاز</span>
                    </div>

                    <div className="text-[11px] text-[#64748B]">
                      {t.membersCount} دانش‌آموز • همکاری در حل چالش‌های روز
                    </div>

                    <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${t.color}`} style={{ width: `${Math.min(100, (t.score / 400) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WIDGET 3: GAMIFICATION REWARD WHEEL (چرخ شانس و پاداش) */}
      {activeWidget === 'reward_wheel' && (
        <RewardWheelWidget
          studentName={plants[0]?.childName || 'دانش‌آموز کلاسی'}
          studentId={plants[0]?.id || 'std-1'}
          onRewardClaimed={(reward) => {
            sound.playJoyfulChime();
          }}
        />
      )}

      {/* WIDGET 4: CLASSROOM EXECUTIVE CALENDAR (تقویم اجرایی و یادآور) */}
      {activeWidget === 'calendar' && (
        <ClassroomCalendarWidget plants={plants} />
      )}

      {/* WIDGET 7: PERSONALIZED HOMEWORK (ارجاع تکالیف شخصی) */}
      {activeWidget === 'personalized_homework' && (
        <PersonalizedHomeworkWidget plants={plants} />
      )}

      {/* WIDGET 8: GROUP WHITEBOARD (وایت‌برد گروهی) */}
      {activeWidget === 'group_whiteboard' && (
        <CollaborativeWhiteboardWidget />
      )}

      {/* WIDGET 9: STUDENT PROFILE & PASSPORT (پروفایل و دستاوردها) */}
      {activeWidget === 'student_profile' && (
        <StudentProfilePassportWidget plants={plants} />
      )}

      {/* WIDGET 5: AVA ADVISOR (مشاور آوا) */}
      {activeWidget === 'ava_advisor' && (
        <AvaAdvisorWidget plants={plants} onSendNudge={onSendTeacherNudge} />
      )}

      {/* WIDGET 6: RECHARTS VISUAL ANALYTICS (تحلیل بصری) */}
      {activeWidget === 'analytics_chart' && (
        <EmotionalRhythmChartWidget plants={plants} />
      )}
    </div>
  );
};
