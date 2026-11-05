import React, { useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, Sprout, Calculator, ShieldCheck,
  Building2, Receipt, LifeBuoy, ChevronRight, ChevronLeft, Sparkles, School, Lock, Layers
} from 'lucide-react';
import { UserRole } from '../core/security/security-gatekeeper';

export interface AppShellProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  schoolName?: string;
  activeNavId: string;
  onNavSelect: (navId: string) => void;
  children: React.ReactNode;
}

interface NavItem { id: string; label: string; icon: React.ComponentType<{ className?: string }>; }

export const AppShell: React.FC<AppShellProps> = ({
  currentRole, onRoleChange, schoolName = 'دبستان هوشمند نمونه آفتاب',
  activeNavId, onNavSelect, children
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const getNavItemsForRole = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'TEACHER':
        return [
          { id: 'teacher-studio', label: 'استودیوی کلاس زنده', icon: LayoutDashboard },
          { id: 'teacher-tools', label: 'کارگاه و ابزارهای فعال', icon: Sprout },
          { id: 'teacher-observations', label: 'دفترچه مشاهدات کلاسی', icon: BookOpen }
        ];
      case 'STUDENT':
        return [
          { id: 'student-arena', label: 'میز چالش و تمرین من', icon: Sparkles },
          { id: 'student-math', label: 'بازی‌های ریاضی روشا', icon: Calculator }
        ];
      case 'SCHOOL_MANAGER':
        return [
          { id: 'manager-overview', label: 'نمای کلی آموزشگاه', icon: LayoutDashboard },
          { id: 'manager-roster', label: 'کلاس‌ها و روسترینگ سیدا', icon: Users },
          { id: 'manager-finance', label: 'قرارداد و امور مالی', icon: Receipt },
          { id: 'manager-tickets', label: 'میز امداد و پشتیبانی', icon: LifeBuoy }
        ];
      case 'SUPER_ADMIN':
        return [
          { id: 'admin-metrics', label: 'پایش پلتفرم آفتاب', icon: Building2 },
          { id: 'admin-license', label: 'مدیریت لایسنس و ابزارها', icon: Lock },
          { id: 'admin-security', label: 'ممیزی امنیتی و وقایع', icon: ShieldCheck }
        ];
    }
  };

  const navItems = getNavItemsForRole(currentRole);

  const roleLabels: Record<UserRole, { title: string; badgeClass: string }> = {
    TEACHER: { title: 'آموزگار کلاس', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    STUDENT: { title: 'دانش‌آموز (صندلی)', badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    SCHOOL_MANAGER: { title: 'مدیریت آموزشگاه', badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    SUPER_ADMIN: { title: 'مالک سامانه', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans" dir="rtl">
      <aside className={`relative flex flex-col justify-between border-l border-slate-800/80 bg-[#0c1322] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div>
          <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md">
                <Layers className="h-5 w-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold tracking-tight text-white">سامانه آفتاب</span>
                  <span className="text-[10px] text-slate-400">نسخه ۲.۵ مینیمال</span>
                </div>
              )}
            </div>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
          <nav className="space-y-1.5 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavId === item.id;
              return (
                <button key={item.id} onClick={() => onNavSelect(item.id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${isActive ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700/60' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'}`}>
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-slate-800/80 p-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 p-2.5 text-[11px] text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {!isCollapsed && <span className="truncate">آماده‌به‌کار (PWA آفلاین)</span>}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#090d16] px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <School className="h-4 w-4 text-slate-400" />
              <span>{schoolName}</span>
            </div>
            <span className="h-4 w-px bg-slate-800"></span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${roleLabels[currentRole].badgeClass}`}>
              {roleLabels[currentRole].title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[11px] text-slate-400">تغییر نمای نقش:</label>
            <select value={currentRole} onChange={(e) => onRoleChange(e.target.value as UserRole)} className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-slate-700 focus:outline-none">
              <option value="TEACHER">آموزگار کلاس</option>
              <option value="STUDENT">دانش‌آموز (صندلی)</option>
              <option value="SCHOOL_MANAGER">مدیر آموزشگاه</option>
              <option value="SUPER_ADMIN">مالک سامانه</option>
            </select>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-[#090d16]">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
