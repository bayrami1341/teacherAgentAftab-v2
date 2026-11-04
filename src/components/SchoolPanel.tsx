import React, { useState } from 'react';
import { ClassroomInfo, TeacherInfo } from '../types';
import {
  School as SchoolIcon,
  GraduationCap,
  Users,
  QrCode,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Download,
  Copy,
  FileText,
  X,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { generateConsultantSnapshot } from '../utils/pedagogyEngine';

interface SchoolPanelProps {
  schoolName: string;
  totalSeats: number;
  usedSeats: number;
  classes: ClassroomInfo[];
  teachers: TeacherInfo[];
  onAddClass: (newClass: ClassroomInfo) => void;
  onAddTeacher: (newTeacher: TeacherInfo) => void;
  onExitToApp: () => void;
}

export const SchoolPanel: React.FC<SchoolPanelProps> = ({
  schoolName,
  totalSeats,
  usedSeats,
  classes,
  teachers,
  onAddClass,
  onAddTeacher,
  onExitToApp,
}) => {
  const [newTeacherModal, setNewTeacherModal] = useState(false);
  const [newClassModal, setNewClassModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [consultantModal, setConsultantModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // New Teacher form state
  const [tName, setTName] = useState('');
  const [tUsername, setTUsername] = useState('');

  // New Class form state
  const [cName, setCName] = useState('');
  const [cTeacher, setCTeacher] = useState(teachers[0]?.name || '');

  const availableSeats = totalSeats - usedSeats;

  const snapshotData = generateConsultantSnapshot(
    {
      id: 'sch-current',
      name: schoolName,
      username: 'beheshti_sch',
      seatsTotal: totalSeats,
      seatsUsed: usedSeats,
    },
    classes.length,
    teachers.length
  );

  const handleCopySnapshot = () => {
    sound.playPlantClick(520);
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(snapshotData, null, 2));
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSnapshot = () => {
    sound.playJoyfulChime();
    const blob = new Blob([JSON.stringify(snapshotData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultant-snapshot-${schoolName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tUsername.trim()) return;

    onAddTeacher({
      id: `t-${Date.now()}`,
      name: tName.trim(),
      username: tUsername.trim(),
      assignedClasses: [],
      status: 'active',
    });
    sound.playJoyfulChime();
    setNewTeacherModal(false);
    setTName('');
    setTUsername('');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;

    onAddClass({
      id: `c-${Date.now()}`,
      name: cName.trim(),
      teacherName: cTeacher,
      studentCount: 0,
      activeModules: ['javaneh_garden', 'teacher_assistant'],
    });
    sound.playJoyfulChime();
    setNewClassModal(false);
    setCName('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF5] text-[#2D2D2D] font-['Vazirmatn'] py-6 px-4 sm:px-6 lg:px-8">
      {/* Notice popup if clicking view classroom */}
      {infoNotice && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setInfoNotice(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-2xl border border-[#C8D9B5] space-y-4"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EBF3E4] text-[#55783A] flex items-center justify-center text-2xl">
              🌿
            </div>
            <h3 className="text-base font-bold text-[#2D2D2D]">دسترسی کلاسی</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              {infoNotice}
            </p>
            <button
              onClick={() => setInfoNotice(null)}
              className="w-full py-2.5 bg-[#7BA05B] hover:bg-[#688D49] text-white text-sm font-bold rounded-xl transition-colors"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header: School Panel */}
        <div className="bg-white border border-[#E8DFC9] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#7BA05B] flex items-center justify-center text-white shadow-xs">
              <SchoolIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#2D2D2D]">
                  جوانه — پنل مدرسه
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF3E4] text-[#465E32] border border-[#C8D9B5]">
                  لایه‌ی ۲ از ۶
                </span>
              </div>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                مدرسه: <strong className="text-[#2D2D2D]">{schoolName}</strong> • مدیریت کلاس‌ها، معلم‌ها و ظرفیت سهمیه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setQrModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF8F2] text-[#465E32] border border-[#C8D9B5] text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#7BA05B]" />
              <span>تولید QR سهمیه‌های آزاد</span>
            </button>

            <button
              onClick={onExitToApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EFE8DC] hover:bg-[#E2D8C6] text-[#2D2D2D] text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              <span>خروج / بازگشت به برنامه</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modules Entitlement Summary Banner */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <div className="text-xs font-bold text-[#1E40AF]">
                ماژول‌های فعال اشتراک این مدرسه در پلتفرم یکپارچه:
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF3E4] text-[#4F7335] border border-[#C8D9B5]">
                  🌿 نگهبان گیاه («جوانه»)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#1E40AF] border border-[#93C5FD]">
                  📐 دستیار معلم ابتدایی
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#6B21A8] border border-[#D8B4FE]">
                  🎲 بازی و چالش ریاضی
                </span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#64748B] bg-white px-3 py-1 rounded-xl border border-[#CBD5E1]">
            تمدید یکپارچه تا: ۱۴۰۴/۰۴/۰۱
          </span>
        </div>

        {/* Card 1 — Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8DFC9] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#7A7A7A] mb-1">
              <span className="text-xs font-medium">کلاس‌های فعال</span>
              <GraduationCap className="w-4 h-4 text-[#7BA05B]" />
            </div>
            <div className="text-2xl font-black text-[#2D2D2D]">{classes.length}</div>
            <span className="text-[11px] text-[#7A7A7A] mt-1 inline-block">کلاس تحت پوشش</span>
          </div>

          <div className="bg-white border border-[#E8DFC9] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#7A7A7A] mb-1">
              <span className="text-xs font-medium">معلمان</span>
              <Users className="w-4 h-4 text-[#7BA05B]" />
            </div>
            <div className="text-2xl font-black text-[#2D2D2D]">{teachers.length}</div>
            <span className="text-[11px] text-[#7A7A7A] mt-1 inline-block">همکار فعال</span>
          </div>

          <div className="bg-white border border-[#E8DFC9] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#7A7A7A] mb-1">
              <span className="text-xs font-medium">کل سهمیه‌ها (Seats)</span>
              <ShieldCheck className="w-4 h-4 text-[#7BA05B]" />
            </div>
            <div className="text-2xl font-black text-[#2D2D2D]">{totalSeats}</div>
            <span className="text-[11px] text-[#7A7A7A] mt-1 inline-block">اختصاص‌یافته توسط مالک</span>
          </div>

          <div className="bg-white border border-[#E8DFC9] p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#7A7A7A] mb-1">
              <span className="text-xs font-medium">سهمیه‌های مصرف‌شده / آزاد</span>
              <span className="text-xs font-bold text-[#7BA05B]">{availableSeats} آزاد</span>
            </div>
            <div className="text-2xl font-black text-[#2D2D2D]">{usedSeats} <span className="text-sm font-normal text-[#7A7A7A]">/ {availableSeats}</span></div>
            <span className="text-[11px] text-[#55783A] mt-1 inline-block">
              {availableSeats > 0 ? `${availableSeats} سهمیه آماده تخصیص` : 'ظرفیت تکمیل'}
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF6ED] p-3.5 rounded-2xl border border-[#E8DFC9]">
          <div className="text-xs text-[#55783A] font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#7BA05B]" />
            <span>قانون حفظ حریم خصوصی: نام دانش‌آموزان و جزئیات احوالات گیاهان تنها در دست معلم کلاس است.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPlantClick(500);
                setConsultantModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] text-xs font-semibold rounded-xl border border-[#BFDBFE] transition-colors cursor-pointer"
              title="خروجی امن بدون داده‌های شناسنامه‌ای کودک برای تحویل با فلش به مشاور"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>خروجی بسته مشاور (آفلاین)</span>
            </button>
            <button
              onClick={() => setNewTeacherModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#F2ECE1] text-[#2D2D2D] text-xs font-semibold rounded-xl border border-[#D5CABC] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#7BA05B]" />
              <span>+ ساخت معلم جدید</span>
            </button>
            <button
              onClick={() => setNewClassModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ساخت کلاس جدید</span>
            </button>
          </div>
        </div>

        {/* Card 2 & Card 3 — Side by Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 2: Classes Table */}
          <div className="bg-white border border-[#E8DFC9] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E8DFC9] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#2D2D2D] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#7BA05B]" />
                <span>لیست کلاس‌ها ({classes.length} کلاس)</span>
              </h2>
              <span className="text-xs text-[#7A7A7A]">سال تحصیلی ۱۴۰۳-۱۴۰۴</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF8F2] text-[#7A7A7A] font-bold border-b border-[#E8DFC9]">
                  <tr>
                    <th className="py-2.5 px-3">نام کلاس</th>
                    <th className="py-2.5 px-3">معلم مسئول</th>
                    <th className="py-2.5 px-3">تعداد دانش‌آموز</th>
                    <th className="py-2.5 px-3 text-center">مشاهده</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DC]">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-[#FAF8F2] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#2D2D2D]">{cls.name}</td>
                      <td className="py-3 px-3 text-[#555]">{cls.teacherName}</td>
                      <td className="py-3 px-3 text-[#2D2D2D] font-medium">{cls.studentCount} دانش‌آموز</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() =>
                            setInfoNotice(
                              `برای مشاهده‌ی باغچه‌ی کلاس «${cls.name}»، از ربات بله مدرسه استفاده کنید یا با حساب کاربری معلم (${cls.teacherName}) وارد شوید.`
                            )
                          }
                          className="px-2.5 py-1 bg-[#F2EDE2] hover:bg-[#E5DEC9] text-[#2D2D2D] text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          مشاهده
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Teachers List */}
          <div className="bg-white border border-[#E8DFC9] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E8DFC9] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#2D2D2D] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7BA05B]" />
                <span>لیست معلم‌ها ({teachers.length} معلم)</span>
              </h2>
              <span className="text-xs text-[#7A7A7A]">دسترسی کلاسی</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#FAF8F2] text-[#7A7A7A] font-bold border-b border-[#E8DFC9]">
                  <tr>
                    <th className="py-2.5 px-3">نام معلم</th>
                    <th className="py-2.5 px-3">نام‌کاربری</th>
                    <th className="py-2.5 px-3">کلاس‌های مسئول</th>
                    <th className="py-2.5 px-3 text-center">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DC]">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF8F2] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#2D2D2D]">{t.name}</td>
                      <td className="py-3 px-3 text-[#7A7A7A] font-mono">{t.username}</td>
                      <td className="py-3 px-3 text-[#555]">
                        {t.assignedClasses.join('، ') || 'بدون کلاس'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF3E4] text-[#465E32]">
                          فعال
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: New Teacher */}
      {newTeacherModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNewTeacherModal(false)}
        >
          <form
            onSubmit={handleCreateTeacher}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
              <h3 className="text-base font-bold text-[#2D2D2D]">ساخت معلم جدید</h3>
              <button
                type="button"
                onClick={() => setNewTeacherModal(false)}
                className="text-[#7A7A7A] hover:text-[#2D2D2D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#555] mb-1">نام و نام‌خانوادگی معلم:</label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder="مثلاً: خانم حیدری"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#D5CABC] focus:outline-none focus:border-[#7BA05B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555] mb-1">نام کاربری اختصاصی:</label>
                <input
                  type="text"
                  required
                  value={tUsername}
                  onChange={(e) => setTUsername(e.target.value)}
                  placeholder="مثلاً: heidari_t"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#D5CABC] focus:outline-none focus:border-[#7BA05B]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                افزودن معلم
              </button>
              <button
                type="button"
                onClick={() => setNewTeacherModal(false)}
                className="px-4 py-2.5 bg-[#EFE8DC] text-[#2D2D2D] text-xs font-bold rounded-xl transition-colors"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: New Class */}
      {newClassModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNewClassModal(false)}
        >
          <form
            onSubmit={handleCreateClass}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
              <h3 className="text-base font-bold text-[#2D2D2D]">ساخت کلاس جدید</h3>
              <button
                type="button"
                onClick={() => setNewClassModal(false)}
                className="text-[#7A7A7A] hover:text-[#2D2D2D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#555] mb-1">نام کلاس:</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="مثلاً: پنجم ب"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#D5CABC] focus:outline-none focus:border-[#7BA05B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555] mb-1">معلم مسئول کلاس:</label>
                <select
                  value={cTeacher}
                  onChange={(e) => setCTeacher(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#D5CABC] focus:outline-none focus:border-[#7BA05B]"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                ساخت کلاس
              </button>
              <button
                type="button"
                onClick={() => setNewClassModal(false)}
                className="px-4 py-2.5 bg-[#EFE8DC] text-[#2D2D2D] text-xs font-bold rounded-xl transition-colors"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: QR Code for Available Seats */}
      {qrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setQrModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-6 text-center shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
              <h3 className="text-base font-bold text-[#2D2D2D]">کارت QR سهمیه‌های آزاد</h3>
              <button
                onClick={() => setQrModal(false)}
                className="text-[#7A7A7A] hover:text-[#2D2D2D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E8DFC9] flex flex-col items-center">
              {/* Clean SVG Vector QR simulation */}
              <div className="w-48 h-48 bg-white p-3 rounded-xl border border-[#D5CABC] shadow-xs flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#2D2D2D]">
                  {/* Position detection markers */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="12" width="12" height="12" fill="currentColor" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="76" y="12" width="12" height="12" fill="currentColor" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="76" width="12" height="12" fill="currentColor" />

                  {/* Random pattern data cells */}
                  <rect x="38" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="52" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="42" y="24" width="16" height="6" fill="currentColor" />

                  <rect x="10" y="38" width="6" height="16" fill="currentColor" />
                  <rect x="22" y="42" width="14" height="8" fill="currentColor" />

                  <rect x="44" y="44" width="12" height="12" rx="3" fill="#7BA05B" />

                  <rect x="68" y="38" width="10" height="10" fill="currentColor" />
                  <rect x="84" y="44" width="8" height="14" fill="currentColor" />

                  <rect x="38" y="68" width="8" height="18" fill="currentColor" />
                  <rect x="52" y="74" width="14" height="8" fill="currentColor" />
                  <rect x="74" y="68" width="18" height="18" fill="currentColor" />
                </svg>
              </div>

              <div className="mt-3 text-xs text-[#555]">
                <span className="font-bold text-[#2D2D2D]">دبستان شهید بهشتی</span> • ظرفیت باقیمانده: {availableSeats} دانش‌آموز
              </div>
              <p className="text-[11px] text-[#7A7A7A] mt-1">
                دانش‌آموز با دوربین گوشی/تبلت اسکن کرده و مستقیماً وارد صفحه‌ی کاشت دانه می‌شود.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playPlantClick(520);
                window.print();
              }}
              className="w-full py-2.5 bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              چاپ کارت QR برای اولیا و دانش‌آموزان
            </button>
          </div>
        </div>
      )}

      {/* Modal: Consultant Snapshot Export (Offline USB Transfer) */}
      {consultantModal && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setConsultantModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#CBD5E1] space-y-4 text-right"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-xl">
                  📦
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    خروجی بسته مشاور و مالک (اسنپ‌شات آفلاین)
                  </h3>
                  <span className="text-[11px] text-[#64748B]">
                    پروتکل امن انتقال آفلاین با فلش‌مموری (USB) طبق بند ۸.۴ معماری
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConsultantModal(false)}
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl flex items-center gap-2 text-xs text-[#065F46] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>
                <strong>تضمین ۱۰۰٪ حریم خصوصی:</strong> این فایل هیچ‌گونه مشخصات شناسنامه‌ای، نام فردی یا نمرات کودک را ندارد و صرفاً شامل نرخ پذیرش کلاسی و امضای اعتبارسنجی است.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">
                محتوای بسته JSON امضاشده با HMAC:
              </label>
              <pre className="p-3 bg-[#0F172A] text-[#38BDF8] rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48 text-left dir-ltr">
                {JSON.stringify(snapshotData, null, 2)}
              </pre>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopySnapshot}
                className="flex-1 py-2.5 bg-white hover:bg-[#F1F5F9] text-[#1E293B] text-xs font-bold rounded-xl border border-[#CBD5E1] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#64748B]" />
                <span>{copied ? 'کپی شد! ✓' : 'کپی متن JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSnapshot}
                className="flex-1 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>دانلود فایل snapshot.json</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
