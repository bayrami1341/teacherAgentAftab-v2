import React, { useState } from 'react';
import { School, PlatformModuleId } from '../types';
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  SlidersHorizontal,
  X,
  Calendar,
  Lock,
  ArrowRight,
  Package,
  GraduationCap,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface OwnerPanelProps {
  schools: School[];
  onUpdateSchools: (updated: School[]) => void;
  onExitToApp: () => void;
}

export const OwnerPanel: React.FC<OwnerPanelProps> = ({
  schools,
  onUpdateSchools,
  onExitToApp,
}) => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [newSchoolModal, setNewSchoolModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSeats, setNewSeats] = useState(150);
  const [newEndDate, setNewEndDate] = useState('۱۴۰۴/۰۴/۰۱');
  const [newSchoolType, setNewSchoolType] = useState<'school' | 'solo_teacher'>('school');
  const [typeFilter, setTypeFilter] = useState<'all' | 'school' | 'solo_teacher'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Aggregated Stats
  const totalSchools = schools.length;
  const totalSeats = schools.reduce((acc, s) => acc + s.seatsTotal, 0);
  const activeSchools = schools.filter((s) => s.status === 'active').length;
  const suspendedSchools = schools.filter((s) => s.status === 'suspended').length;
  const expiredSchools = schools.filter((s) => s.status === 'expired').length;

  // Actions in Drawer
  const handleIncreaseSeats = (schoolId: string, amount: number) => {
    sound.playJoyfulChime();
    const updated = schools.map((s) =>
      s.id === schoolId ? { ...s, seatsTotal: s.seatsTotal + amount } : s
    );
    onUpdateSchools(updated);
    if (selectedSchool && selectedSchool.id === schoolId) {
      setSelectedSchool({ ...selectedSchool, seatsTotal: selectedSchool.seatsTotal + amount });
    }
    showToast(`سهمیه مدرسه با موفقیت ${amount} عدد افزایش یافت.`);
  };

  const handleToggleModule = (schoolId: string, moduleId: PlatformModuleId) => {
    sound.playPlantClick(520);
    const updated = schools.map((s) => {
      if (s.id === schoolId) {
        const current = s.enabledModules || ['javaneh_garden'];
        const has = current.includes(moduleId);
        const next = has ? current.filter((m) => m !== moduleId) : [...current, moduleId];
        return { ...s, enabledModules: next };
      }
      return s;
    });
    onUpdateSchools(updated);
    if (selectedSchool && selectedSchool.id === schoolId) {
      const current = selectedSchool.enabledModules || ['javaneh_garden'];
      const has = current.includes(moduleId);
      const next = has ? current.filter((m) => m !== moduleId) : [...current, moduleId];
      setSelectedSchool({ ...selectedSchool, enabledModules: next });
    }
    showToast('مجوز دسترسی به ماژول‌های پلتفرم برای این مدرسه به‌روزرسانی شد.');
  };

  const handleToggleStatus = (schoolId: string) => {
    sound.playPlantClick(480);
    const updated = schools.map((s) => {
      if (s.id === schoolId) {
        const nextStatus = s.status === 'active' ? 'suspended' : 'active';
        return { ...s, status: nextStatus as 'active' | 'suspended' };
      }
      return s;
    });
    onUpdateSchools(updated);
    if (selectedSchool && selectedSchool.id === schoolId) {
      const nextStatus = selectedSchool.status === 'active' ? 'suspended' : 'active';
      setSelectedSchool({ ...selectedSchool, status: nextStatus as 'active' | 'suspended' });
    }
    showToast(`وضعیت مدرسه با موفقیت تغییر کرد.`);
  };

  const handleRenewSubscription = (schoolId: string) => {
    sound.playJoyfulChime();
    const updated = schools.map((s) =>
      s.id === schoolId
        ? { ...s, endDate: '۱۴۰۴/۰۷/۰۱', status: 'active' as const }
        : s
    );
    onUpdateSchools(updated);
    if (selectedSchool && selectedSchool.id === schoolId) {
      setSelectedSchool({ ...selectedSchool, endDate: '۱۴۰۴/۰۷/۰۱', status: 'active' });
    }
    showToast('اشتراک مدرسه تا پاییز ۱۴۰۴ با موفقیت تمدید شد.');
  };

  // Add new school
  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim() || !newUsername.trim()) return;

    const newSch: School = {
      id: `sch-${Date.now()}`,
      name: newSchoolName.trim(),
      username: newUsername.trim(),
      type: newSchoolType,
      startDate: '۱۴۰۳/۰۸/۰۱',
      endDate: newEndDate,
      seatsTotal: Number(newSeats),
      seatsUsed: 0,
      status: 'active',
      enabledModules:
        newSchoolType === 'solo_teacher'
          ? ['javaneh_garden', 'teacher_assistant', 'math_game']
          : ['javaneh_garden', 'teacher_assistant'],
    };

    onUpdateSchools([newSch, ...schools]);
    sound.playJoyfulChime();
    setNewSchoolModal(false);
    setNewSchoolName('');
    setNewUsername('');
    setNewPassword('');
    setNewSchoolType('school');
    setNewSeats(150);
    showToast(
      newSchoolType === 'solo_teacher'
        ? `معلم خصوصی «${newSch.name}» (مدرسه تک‌نفره) با موفقیت ثبت شد.`
        : `مدرسه «${newSch.name}» با موفقیت در لایه ۱ پلتفرم ثبت شد.`
    );
  };

  const filteredSchools = schools.filter((s) => {
    if (typeFilter === 'all') return true;
    const t = s.type || 'school';
    return t === typeFilter;
  });
  const soloTeacherCount = schools.filter((s) => s.type === 'solo_teacher').length;
  const regularSchoolCount = schools.filter((s) => (s.type || 'school') === 'school').length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D2D2D] font-['Vazirmatn'] py-6 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2D2D2D] text-white px-5 py-2.5 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#7BA05B]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header: Super Minimal & Secure */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2D2D2D] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#7BA05B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#1E293B]">
                  جوانه — پنل مالک پلتفرم (مدیریت کل)
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
                  لایه‌ی ۱ از ۶
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                مدیریت کلان مدارس، صدور سهمیه (Seats) و پایش اشتراک‌ها • محیط امن بدون اطلاعات فردی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setNewSchoolModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ ثبت مدرسه جدید</span>
            </button>
            <button
              onClick={onExitToApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              <span>بازگشت به برنامه</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 1 — Overall System Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="text-xs font-medium">تعداد کل مدارس</span>
              <Building2 className="w-4 h-4 text-[#64748B]" />
            </div>
            <div className="text-2xl font-black text-[#1E293B]">{totalSchools}</div>
            <span className="text-[11px] text-[#7BA05B] font-medium mt-1 inline-block">
              {activeSchools} مدرسه فعال
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="text-xs font-medium">مجموع سهمیه‌ها (Seats)</span>
              <Users className="w-4 h-4 text-[#7BA05B]" />
            </div>
            <div className="text-2xl font-black text-[#1E293B]">{totalSeats.toLocaleString('fa-IR')}</div>
            <span className="text-[11px] text-[#64748B] mt-1 inline-block">
              ظرفیت مجاز کل سیستم
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="text-xs font-medium">مدارس فعال</span>
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="text-2xl font-black text-[#10B981]">{activeSchools}</div>
            <span className="text-[11px] text-[#64748B] mt-1 inline-block">
              دارای اشتراک معتبر
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="text-xs font-medium">تعلیق یا منقضی</span>
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-black text-[#F59E0B]">{suspendedSchools + expiredSchools}</div>
            <span className="text-[11px] text-[#64748B] mt-1 inline-block">
              {suspendedSchools} تعلیق • {expiredSchools} منقضی
            </span>
          </div>
        </div>

        {/* Card 2 — Schools Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#7BA05B]" />
              <h2 className="text-base font-bold text-[#1E293B]">لیست مستأجرهای ثبت‌شده</h2>
              <span className="text-xs text-[#64748B]">({filteredSchools.length} از {schools.length})</span>
            </div>

            {/* Filter Tabs for Tenant Type: All / School / Solo Teacher */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-white text-[#1E293B] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                همه ({schools.length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('school')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  typeFilter === 'school'
                    ? 'bg-white text-[#1E293B] shadow-2xs font-bold'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <span>🏫 مدارس</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E2E8F0]">
                  {regularSchoolCount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('solo_teacher')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  typeFilter === 'solo_teacher'
                    ? 'bg-white text-[#92400E] shadow-2xs font-bold'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#D97706]" />
                <span>معلمان خصوصی</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FEF3C7] text-[#92400E]">
                  {soloTeacherCount}
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-[#F8FAFC] text-[#64748B] text-xs font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4">نام مرکز / معلم</th>
                  <th className="py-3 px-4">نوع مستأجر</th>
                  <th className="py-3 px-4">نام کاربری</th>
                  <th className="py-3 px-4">تاریخ شروع</th>
                  <th className="py-3 px-4">تاریخ پایان</th>
                  <th className="py-3 px-4">تعداد سهمیه (Seats)</th>
                  <th className="py-3 px-4">وضعیت</th>
                  <th className="py-3 px-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredSchools.map((school) => {
                  const isSolo = school.type === 'solo_teacher';
                  return (
                    <tr key={school.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#1E293B]">
                        <div className="flex items-center gap-1.5">
                          <span>{school.name}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mt-1 font-normal text-[11px]">
                          {(school.enabledModules || ['javaneh_garden']).map((mod) => (
                            <span
                              key={mod}
                              className={`px-1.5 py-0.2 rounded-md ${
                                mod === 'javaneh_garden'
                                  ? 'bg-[#EBF3E4] text-[#4F7335]'
                                  : mod === 'teacher_assistant'
                                  ? 'bg-[#EFF6FF] text-[#1E40AF]'
                                  : 'bg-[#F3E8FF] text-[#6B21A8]'
                              }`}
                            >
                              {mod === 'javaneh_garden' ? '🌿 جوانه' : mod === 'teacher_assistant' ? '📐 دستیار معلم' : '🎲 ریاضی'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isSolo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                            <GraduationCap className="w-3 h-3 text-[#D97706]" />
                            معلم خصوصی (تک‌نفره)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                            🏫 مدرسه عادی
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] font-mono text-xs">{school.username}</td>
                      <td className="py-3.5 px-4 text-[#64748B] text-xs">{school.startDate}</td>
                      <td className="py-3.5 px-4 text-[#64748B] text-xs">{school.endDate}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#1E293B]">{school.seatsTotal}</span>
                        <span className="text-xs text-[#64748B] mr-1">({school.seatsUsed} استفاده شده)</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {school.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                            فعال
                          </span>
                        ) : school.status === 'suspended' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                            تعلیق شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B]">
                            منقضی شده
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedSchool(school)}
                          className="px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          مدیریت
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer: Manage Single School */}
      {selectedSchool && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-end animate-fade-in"
          onClick={() => setSelectedSchool(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1E293B]">{selectedSchool.name}</h3>
                    {selectedSchool.type === 'solo_teacher' ? (
                      <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A] flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-[#D97706]" />
                        معلم خصوصی (تک‌نفره)
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                        🏫 مدرسه سازمانی
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#64748B]">نام کاربری: {selectedSchool.username}</span>
                </div>
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="p-2 text-[#64748B] hover:text-[#1E293B] rounded-xl hover:bg-[#F1F5F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 my-6">
                {/* Seat capacity management */}
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#475569]">ظرفیت سهمیه (Seats):</span>
                    <span className="text-base font-black text-[#1E293B]">{selectedSchool.seatsTotal} سهمیه</span>
                  </div>
                  <div className="text-xs text-[#64748B]">
                    سهمیه‌های مصرف‌شده توسط مدرسه: {selectedSchool.seatsUsed} سهمیه
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleIncreaseSeats(selectedSchool.id, 25)}
                      className="flex-1 py-2 bg-white hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] border border-[#CBD5E1] rounded-xl transition-colors"
                    >
                      + ۲۵ سهمیه
                    </button>
                    <button
                      onClick={() => handleIncreaseSeats(selectedSchool.id, 50)}
                      className="flex-1 py-2 bg-white hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] border border-[#CBD5E1] rounded-xl transition-colors"
                    >
                      + ۵۰ سهمیه
                    </button>
                    <button
                      onClick={() => handleIncreaseSeats(selectedSchool.id, 100)}
                      className="flex-1 py-2 bg-[#7BA05B] hover:bg-[#688D49] text-xs font-bold text-white rounded-xl transition-colors"
                    >
                      + ۱۰۰ سهمیه
                    </button>
                  </div>
                </div>

                {/* Module Entitlements - Centralized SaaS Hub */}
                <div className="p-4 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E40AF] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#2563EB]" />
                      <span>ماژول‌های فعال اشتراک (SaaS App Entitlements):</span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#3B82F6] bg-white px-2 py-0.5 rounded-full border border-[#DBEAFE]">
                      {(selectedSchool.enabledModules || ['javaneh_garden']).length} ماژول مجاز
                    </span>
                  </div>

                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    با کلیک روی هر ماژول، دسترسی مدرسه و تمام کلاس‌های آن به ابزار مربوطه باز یا بسته می‌شود. هزینه بر اساس ترکیب ماژول‌ها محاسبه می‌گردد.
                  </p>

                  <div className="space-y-2 pt-1">
                    {[
                      {
                        id: 'javaneh_garden' as const,
                        name: 'نگهبان گیاه («جوانه»)',
                        subtitle: 'ریتم زیستی و مراقبت عاطفی',
                        icon: '🌿',
                        price: '۱۵,۰۰۰ تومان/صندلی',
                      },
                      {
                        id: 'teacher_assistant' as const,
                        name: 'دستیار معلم ابتدایی',
                        subtitle: 'ارزشیابی توصیفی و کاربرگ‌ساز',
                        icon: '📐',
                        price: '۲۰,۰۰۰ تومان/صندلی',
                      },
                      {
                        id: 'math_game' as const,
                        name: 'بازی و چالش ریاضی هوشمند',
                        subtitle: 'محاسبات ذهنی و جدول ضرب پویا',
                        icon: '🎲',
                        price: '۱۲,۰۰۰ تومان/صندلی',
                      },
                    ].map((mod) => {
                      const isEnabled = (selectedSchool.enabledModules || ['javaneh_garden']).includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => handleToggleModule(selectedSchool.id, mod.id)}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                            isEnabled
                              ? 'bg-white border-[#3B82F6] font-bold text-[#1E3A8A] shadow-xs'
                              : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#64748B] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-right">
                            <span className="text-base">{mod.icon}</span>
                            <div>
                              <div>{mod.name}</div>
                              <div className="text-[10px] text-[#64748B] font-normal">{mod.subtitle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#64748B] hidden sm:inline">{mod.price}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                isEnabled ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#E2E8F0] text-[#94A3B8]'
                              }`}
                            >
                              {isEnabled ? 'فعال ✓' : 'قفل'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subscription management */}
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
                  <span className="text-xs font-bold text-[#475569] block">تمدید تاریخ اشتراک:</span>
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>انقضای فعلی: {selectedSchool.endDate}</span>
                    <span className="font-semibold text-[#10B981]">وضعیت: {selectedSchool.status === 'active' ? 'فعال' : 'تعلیق'}</span>
                  </div>
                  <button
                    onClick={() => handleRenewSubscription(selectedSchool.id)}
                    className="w-full mt-2 py-2.5 bg-white hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] border border-[#CBD5E1] rounded-xl transition-colors"
                  >
                    تمدید خودکار تا پاییز ۱۴۰۴
                  </button>
                </div>

                {/* Suspend or Activate */}
                <div className="p-4 bg-[#FEF2F2] rounded-2xl border border-[#FEE2E2] space-y-2">
                  <span className="text-xs font-bold text-[#991B1B] block">مدیریت دسترسی و لایسنس:</span>
                  <p className="text-xs text-[#7F1D1D] leading-relaxed">
                    با تعلیق مدرسه، دسترسی موقتاً مسدود می‌شود اما داده‌های کلاسی بدون آسیب باقی می‌مانند.
                  </p>
                  <button
                    onClick={() => handleToggleStatus(selectedSchool.id)}
                    className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors ${
                      selectedSchool.status === 'active'
                        ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white'
                        : 'bg-[#10B981] hover:bg-[#059669] text-white'
                    }`}
                  >
                    {selectedSchool.status === 'active' ? 'تعلیق موقت این مدرسه' : 'فعال‌سازی مجدد مدرسه'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedSchool(null)}
              className="w-full py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-xs font-bold rounded-xl transition-colors"
            >
              بستن کشو
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create New School */}
      {newSchoolModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNewSchoolModal(false)}
        >
          <form
            onSubmit={handleCreateSchool}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#7BA05B]" />
                <span>ثبت مدرسه جدید در پلتفرم</span>
              </h3>
              <button
                type="button"
                onClick={() => setNewSchoolModal(false)}
                className="text-[#64748B] hover:text-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Tenant Type Selector: School vs Solo Teacher */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">نوع مستأجر در پلتفرم:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewSchoolType('school');
                      if (newSeats === 25) setNewSeats(150);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2 ${
                      newSchoolType === 'school'
                        ? 'bg-[#EBF3E4] border-[#7BA05B] text-[#1E293B] font-bold shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#64748B] hover:bg-white'
                    }`}
                  >
                    <span className="text-base">🏫</span>
                    <div>
                      <div className="text-xs">مدرسه عادی</div>
                      <div className="text-[10px] text-[#64748B] font-normal">چند کلاس و کادر آموزشی</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewSchoolType('solo_teacher');
                      if (newSeats === 150) setNewSeats(25);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2 ${
                      newSchoolType === 'solo_teacher'
                        ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] font-bold shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#64748B] hover:bg-white'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-[#D97706] shrink-0" />
                    <div>
                      <div className="text-xs">معلم خصوصی</div>
                      <div className="text-[10px] text-[#64748B] font-normal">مدرسه تک‌نفره (Solo)</div>
                    </div>
                  </button>
                </div>
                <p className="text-[10px] text-[#64748B] mt-1 leading-normal">
                  {newSchoolType === 'solo_teacher'
                    ? '💡 طبق سند معماری z.ai: معلم خصوصی به عنوان یک مستأجر تک‌کلاسه ثبت می‌شود تا نیاز به بازتعریف ساختار مدرسه نباشد.'
                    : '🏢 مناسب مدارس دولتی و غیردولتی با چند پایه تحصیلی و دسترسی‌های مجزای معلمان.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  {newSchoolType === 'solo_teacher' ? 'نام کلاس / معلم:' : 'نام مدرسه:'}
                </label>
                <input
                  type="text"
                  required
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  placeholder={newSchoolType === 'solo_teacher' ? 'مثلاً: کلاس خصوصی ریاضی استاد بیات' : 'مثلاً: دبستان آفتاب'}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#7BA05B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">نام کاربری اختصاصی:</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder={newSchoolType === 'solo_teacher' ? 'مثلاً: bayat_math' : 'مثلاً: aftab_school'}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#7BA05B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">رمز عبور اولیه:</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#7BA05B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">تعداد سهمیه اولیه:</label>
                  <input
                    type="number"
                    min="10"
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#7BA05B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">تاریخ انقضای اشتراک:</label>
                  <input
                    type="text"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#7BA05B]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                ثبت و تخصیص سهمیه
              </button>
              <button
                type="button"
                onClick={() => setNewSchoolModal(false)}
                className="px-4 py-2.5 bg-[#F1F5F9] text-[#475569] text-xs font-bold rounded-xl transition-colors"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
