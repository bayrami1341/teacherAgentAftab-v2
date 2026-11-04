import React from 'react';
import { AppRole, PlatformModuleId } from '../types';
import {
  Maximize2,
  MessageCircleHeart,
  Printer,
  Volume2,
  VolumeX,
  Sparkles,
  WifiOff,
  Sliders,
  KeyRound,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  classNameTitle: string;
  activeRole: AppRole;
  onChangeRole: (role: AppRole) => void;
  activeModule?: PlatformModuleId;
  onChangeModule?: (mod: PlatformModuleId) => void;
  onEnterBoardMode: () => void;
  onOpenConversationModal: () => void;
  onOpenSimulatorModal: () => void;
  onOpenGuideModal: () => void;
  onOpenRoleModal: () => void;
  onOpenDeBonoModal?: () => void;
  onPrint: () => void;
  isShelterMode?: boolean;
  onToggleShelterMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classNameTitle,
  activeRole,
  onChangeRole,
  activeModule = 'javaneh_garden',
  onChangeModule,
  onEnterBoardMode,
  onOpenConversationModal,
  onOpenSimulatorModal,
  onOpenGuideModal,
  onOpenRoleModal,
  onPrint,
  isShelterMode,
  onToggleShelterMode,
  onOpenDeBonoModal,
}) => {
  const [muted, setMuted] = React.useState(sound.getMuted());

  const handleToggleSound = () => {
    const isM = sound.toggleMute();
    setMuted(isM);
    if (!isM) {
      sound.playPlantClick(520);
    }
  };

  return (
    <header className="no-print bg-[#FAF6ED] border-b border-[#EADFCF] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & School Context */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#7BA05B] flex items-center justify-center text-white shadow-sm ring-2 ring-[#7BA05B]/20">
                <span className="text-xl">🌿</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-[#2D2D2D] tracking-tight">
                    جوانه — پلتفرم یکپارچه مدارس
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EBF3E4] text-[#55783A] border border-[#D5E6C9]">
                    <Sparkles className="w-3 h-3 text-[#7BA05B]" />
                    {activeRole === 'owner' ? 'مدیریت کل' : activeRole === 'school' ? 'پنل مدرسه' : 'میزکار معلم'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#7A7A7A] mt-0.5">
                  <span className="font-medium text-[#465E32]">{classNameTitle}</span>
                  <span className="text-[#C8D9B5]">•</span>
                  <span className="inline-flex items-center gap-1 text-[#666666]">
                    <WifiOff className="w-3 h-3 text-[#7BA05B]" />
                    شبکه‌ی محلی / آفلاین
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Action toggle */}
            <div className="sm:hidden flex items-center gap-1">
              <button
                onClick={handleToggleSound}
                className="p-2 text-[#666] hover:text-[#2D2D2D] rounded-xl hover:bg-[#EFE8DA] transition-colors"
                title={muted ? 'روشن کردن صدا' : 'قطع صدا'}
                aria-label="تنظیمات صدا"
              >
                {muted ? <VolumeX className="w-4 h-4 text-[#A8A8A8]" /> : <Volume2 className="w-4 h-4 text-[#55783A]" />}
              </button>
            </div>
          </div>

          {/* Module & Role Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* If Teacher: show Module Selector (Javaneh Garden vs Teacher Assistant) */}
            {activeRole === 'teacher' && onChangeModule && (
              <div className="flex items-center bg-[#E5EEFB] p-1 rounded-2xl border border-[#BFDBFE]">
                <button
                  onClick={() => {
                    sound.playPlantClick(480);
                    onChangeModule('javaneh_garden');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === 'javaneh_garden'
                      ? 'bg-[#7BA05B] text-white shadow-xs'
                      : 'text-[#1E40AF] hover:text-[#1E3A8A]'
                  }`}
                >
                  <span>🌿</span>
                  <span>باغچه جوانه</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPlantClick(540);
                    onChangeModule('teacher_assistant');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === 'teacher_assistant'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#1E40AF] hover:text-[#1E3A8A]'
                  }`}
                >
                  <span>📐</span>
                  <span>دستیار معلم</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPlantClick(540);
                    onChangeModule('math_game');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === 'math_game'
                      ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-md ring-2 ring-amber-400/40'
                      : 'text-[#B45309] hover:text-[#92400E] font-bold'
                  }`}
                  title="پایگاه جامع بازی‌ها و تمرینات ریاضی پایه ۱ تا ۶ دبستان"
                >
                  <span>🎮</span>
                  <span>بازی‌های ریاضی (۱ تا ۶)</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPlantClick(540);
                    onChangeModule('rosha_v1');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === 'rosha_v1'
                      ? 'bg-[#BE185D] text-white shadow-xs'
                      : 'text-[#9D174D] hover:text-[#831843]'
                  }`}
                  title="موتور روشا: نگاشت قطعی ۹ دهان، ماشین وضعیت گره و کار عصرگاهی"
                >
                  <span>🌸</span>
                  <span>روشا v1.0</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPlantClick(540);
                    onChangeModule('teacher_widgets');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === 'teacher_widgets'
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-[#1E40AF] hover:text-[#1E3A8A]'
                  }`}
                  title="جعبه ابزار قدرتمند معلم: کتاب‌ساز، لیگ مسابقات، چرخ شانس، تقویم اجرایی و مشاور آوا"
                >
                  <span>🧰</span>
                  <span>جعبه ابزار</span>
                </button>
              </div>
            )}

            {/* Role Switcher: Teacher Garden vs Student Room or Owner/School */}
            <div className="flex items-center bg-[#EFE8DC] p-1 rounded-2xl border border-[#DCD0BC]">
              {activeRole === 'owner' ? (
                <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#2D2D2D] text-white flex items-center gap-1.5 shadow-xs">
                  <span>👑</span>
                  <span>مالک پلتفرم (مدیریت کل)</span>
                </span>
              ) : activeRole === 'school' ? (
                <span className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#7BA05B] text-white flex items-center gap-1.5 shadow-xs">
                  <span>🏫</span>
                  <span>پنل مدیر مدرسه</span>
                </span>
              ) : (
                <>
                  <button
                    onClick={() => {
                      sound.playPlantClick(480);
                      onChangeRole('teacher');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeRole === 'teacher'
                        ? 'bg-[#7BA05B] text-white shadow-xs'
                        : 'text-[#666] hover:text-[#2D2D2D]'
                    }`}
                  >
                    <span>👩‍🏫</span>
                    <span>معلم</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playPlantClick(540);
                      onChangeRole('student');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeRole === 'student'
                        ? 'bg-[#7BA05B] text-white shadow-xs'
                        : 'text-[#666] hover:text-[#2D2D2D]'
                    }`}
                  >
                    <span>🎒</span>
                    <span>دانش‌آموز</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap justify-end gap-2 w-full sm:w-auto">
            {/* Audio Toggle button */}
            <button
              onClick={handleToggleSound}
              className="hidden sm:inline-flex items-center justify-center p-2.5 text-[#555] hover:text-[#2D2D2D] bg-white border border-[#E0D5C3] rounded-xl hover:bg-[#F5EFE4] transition-colors shadow-2xs"
              title={muted ? 'روشن کردن صداهای طبیعی' : 'بی‌صدا کردن'}
              aria-label="تنظیم صدا"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-[#A8A8A8]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#55783A]" />
              )}
            </button>

            {/* Test Passcodes & Roles Modal Opener */}
            <button
              onClick={onOpenRoleModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-[#2D2D2D] bg-white hover:bg-[#F7F2E7] border border-[#DFD3BF] rounded-xl transition-all shadow-2xs hover:border-[#7BA05B] active:scale-95 cursor-pointer"
              title="ورود به نقش‌های مختلف، پسوردهای تستی و کدهای مخفی"
            >
              <KeyRound className="w-4 h-4 text-[#7BA05B]" />
              <span>کلید نقش‌ها 🔐</span>
            </button>

            {/* De Bono 6-Hat Audit Modal Button */}
            {onOpenDeBonoModal && (
              <button
                type="button"
                onClick={onOpenDeBonoModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-[#0F172A] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#93C5FD] rounded-xl transition-all shadow-2xs hover:border-[#2563EB] active:scale-95 cursor-pointer"
                title="تست ۶ باره برنامه با شش کلاه تفکر ادوارد دو بونو"
              >
                <span>🎩</span>
                <span className="hidden sm:inline">تست ۶ کلاه دو بونو</span>
              </button>
            )}

            {/* In-App Guide Button */}
            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#3A5328] bg-[#F1F6EC] hover:bg-[#E3EED9] border border-[#CFDFBE] rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="راهنمای تصویری و کاربری کامل بازی"
            >
              <span>📖</span>
              <span className="hidden sm:inline">راهنمای کاربری</span>
            </button>

            {/* Teacher-only Controls */}
            {activeRole === 'teacher' && (
              <>
                {/* Shelter / Hibernation Mode toggle button for crises */}
                {onToggleShelterMode && (
                  <button
                    onClick={onToggleShelterMode}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer ${
                      isShelterMode
                        ? 'bg-[#EBF3E4] text-[#345224] border-2 border-[#7BA05B] font-bold'
                        : 'bg-white hover:bg-[#F7F2E7] text-[#555] border border-[#DFD3BF]'
                    }`}
                    title="حالت تنفس آرام باغچه (پناهگاه و قطعی برق در بحران): توقف فرسایش گیاهان"
                  >
                    <span>{isShelterMode ? '🕊️' : '🛡️'}</span>
                    <span className="hidden lg:inline">{isShelterMode ? 'پناهگاه: فعال' : 'حالت پناهگاه'}</span>
                  </button>
                )}

                {/* Simulator tool button for teacher */}
                <button
                  onClick={onOpenSimulatorModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#4A6337] bg-[#EFF6E9] hover:bg-[#E3EED9] border border-[#CFDFBE] rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
                  title="آزمایش تغییر ریتم و عادات دانش‌آموزان"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#608742]" />
                  <span className="hidden md:inline">شبیه‌ساز ریتم روز</span>
                  <span className="md:hidden">شبیه‌ساز</span>
                </button>

                {/* Conversation Starter Button */}
                <button
                  onClick={onOpenConversationModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#2D2D2D] bg-white hover:bg-[#F7F2E7] border border-[#DFD3BF] rounded-xl transition-all shadow-2xs hover:border-[#C3D9AF] active:scale-95 cursor-pointer"
                >
                  <MessageCircleHeart className="w-4 h-4 text-[#E8A87C]" />
                  <span>گفت‌وگوی امروز</span>
                </button>

                {/* Classroom Board Mode Button */}
                <button
                  onClick={onEnterBoardMode}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#7BA05B] hover:bg-[#688D49] rounded-xl transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
                  title="پروژکتور و نمایش کلاسی"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>حالت تخته‌ای</span>
                </button>

                {/* Print Button */}
                <button
                  onClick={onPrint}
                  className="inline-flex items-center justify-center p-2.5 text-[#555] hover:text-[#2D2D2D] bg-white border border-[#E0D5C3] rounded-xl hover:bg-[#F5EFE4] transition-colors shadow-2xs cursor-pointer"
                  title="چاپ وضعیت باغچه کلاس"
                  aria-label="چاپ"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
