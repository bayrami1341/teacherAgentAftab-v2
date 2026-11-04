import React, { useState } from 'react';
import { Plant } from '../types';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  HelpCircle,
  FolderCheck,
  Bell,
  Check,
  Trash2,
  Share2,
  Sparkles,
  Users,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ClassroomCalendarWidgetProps {
  plants: Plant[];
  onSyncEventToStudents?: (eventTitle: string, eventDate: string) => void;
}

export type EventCategory = 'qa_session' | 'project_deadline' | 'general_event' | 'parent_meeting';

export interface ClassroomEvent {
  id: string;
  title: string;
  category: EventCategory;
  dateJalali: string;
  timeStr: string;
  description: string;
  isSyncedToStudents: boolean;
  completed: boolean;
  targetScope: 'all' | 'specific_group';
}

export const ClassroomCalendarWidget: React.FC<ClassroomCalendarWidgetProps> = ({
  plants,
  onSyncEventToStudents,
}) => {
  const [events, setEvents] = useState<ClassroomEvent[]>([
    {
      id: 'e-1',
      title: 'زنگ پرسش و پاسخ و رفع اشکال کسرها',
      category: 'qa_session',
      dateJalali: '۱۴۰۳/۰۸/۱۲',
      timeStr: '۱۰:۳۰',
      description: 'رفع اشکال ضرب کسرها و معکوس کردن کسر دوم با استفاده از وایت‌برد آنلاین گروهی',
      isSyncedToStudents: true,
      completed: false,
      targetScope: 'all',
    },
    {
      id: 'e-2',
      title: 'مهلت تحویل پروژه روزنامه‌دیواری نسبت و تناسب',
      category: 'project_deadline',
      dateJalali: '۱۴۰۳/۰۸/۱۶',
      timeStr: '۱۸:۰۰',
      description: 'پروژه دستی و کاردستی گروهی نسبت ۵ به ۳ و درصد تخفیف‌های خریدهای روزمره',
      isSyncedToStudents: true,
      completed: false,
      targetScope: 'all',
    },
    {
      id: 'e-3',
      title: 'جلسه صمیمی هم‌اندیشی با اولیا درباره بهداشت خواب',
      category: 'parent_meeting',
      dateJalali: '۱۴۰۳/۰۸/۲۰',
      timeStr: '۱۶:۰۰',
      description: 'گفت‌وگو پیرامون ریتم خواب سحرگاهی و تاثیر آن بر شادابی گیاه جوانه',
      isSyncedToStudents: true,
      completed: true,
      targetScope: 'all',
    },
  ]);

  // Form State
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<EventCategory>('qa_session');
  const [dateInput, setDateInput] = useState('۱۴۰۳/۰۸/۱۵');
  const [timeInput, setTimeInput] = useState('۱۰:۰۰');
  const [descInput, setDescInput] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | EventCategory>('all');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    sound.playJoyfulChime();

    const newEv: ClassroomEvent = {
      id: `e-${Date.now()}`,
      title: titleInput.trim(),
      category: categoryInput,
      dateJalali: dateInput,
      timeStr: timeInput,
      description: descInput.trim() || 'رویداد ثبت‌شده توسط معلم کلاس',
      isSyncedToStudents: true, // Auto synced to student app!
      completed: false,
      targetScope: 'all',
    };

    setEvents([newEv, ...events]);
    setTitleInput('');
    setDescInput('');

    if (onSyncEventToStudents) {
      onSyncEventToStudents(newEv.title, newEv.dateJalali);
    }

    setSyncToast(`رویداد «${newEv.title}» با موفقیت ثبت شد و به تقویم تمام دانش‌آموزان افزوده‌شد 🟢`);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const toggleEventComplete = (id: string) => {
    sound.playPlantClick(520);
    setEvents(events.map((ev) => (ev.id === id ? { ...ev, completed: !ev.completed } : ev)));
  };

  const handleDeleteEvent = (id: string) => {
    sound.playPlantClick(380);
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const filteredEvents = events.filter((ev) =>
    activeCategoryFilter === 'all' ? true : ev.category === activeCategoryFilter
  );

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-6 text-right dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white text-2xl shadow-md ring-4 ring-[#0284C7]/20">
            📅
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                ابزارک «تقویم اجرایی کلاس» (Classroom Executive Calendar)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] text-[10px] font-bold border border-[#BAE6FD]">
                همگام‌سازی خودکار با دانش‌آموزان
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              ثبت زنگ‌های پرسش و پاسخ، مهلت پروژه‌های کلاسی و رویدادهای تقویمی با ارسال آنی به تقویم تمام کودکان
            </p>
          </div>
        </div>

        {/* Sync Auto Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>اتصال زنده به تقویم PWA دانش‌آموزان 🟢</span>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="p-3 bg-[#0F172A] text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 animate-fade-in border border-white/20">
          <Sparkles className="w-4 h-4 text-[#FDE047]" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Event Add Form */}
      <form onSubmit={handleAddEvent} className="bg-[#F0F9FF] p-4 sm:p-5 rounded-2xl border border-[#BAE6FD] space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Title Input */}
          <div className="sm:col-span-6 space-y-1">
            <label className="font-bold text-[#0369A1] block">عنوان رویداد یا زنگ کلاسی:</label>
            <input
              type="text"
              placeholder="مثلاً: زنگ پرسش و پاسخ رفع اشکال تقسیم کسرها"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#93C5FD] bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-[#0284C7]"
            />
          </div>

          {/* Category Select */}
          <div className="sm:col-span-3 space-y-1">
            <label className="font-bold text-[#0369A1] block">نوع رویداد:</label>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value as EventCategory)}
              className="w-full p-2.5 rounded-xl border border-[#93C5FD] bg-white text-xs font-bold outline-none cursor-pointer"
            >
              <option value="qa_session">❓ زنگ پرسش و پاسخ</option>
              <option value="project_deadline">⏱️ مهلت پروژه کلاسی</option>
              <option value="general_event">📅 رویداد عمومی کلاسی</option>
              <option value="parent_meeting">👥 جلسه صمیمی اولیا</option>
            </select>
          </div>

          {/* Date Input */}
          <div className="sm:col-span-3 space-y-1">
            <label className="font-bold text-[#0369A1] block">تاریخ (هجری شمسی):</label>
            <input
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#93C5FD] bg-white text-xs font-bold outline-none text-center"
            />
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-1">
          <label className="font-bold text-[#0369A1] block">توضیحات و راهنمای کوتاه دانش‌آموزان:</label>
          <input
            type="text"
            placeholder="مثلاً: وسایل لازم: طلق شفاف، قیچی و خط‌کش برای آزمایش مساحت"
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#93C5FD] bg-white text-xs font-medium outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span>ثبت و همگام‌سازی خودکار با تقویم تمام دانش‌آموزان</span>
        </button>
      </form>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#F1F5F9]">
        {[
          { id: 'all', label: 'همه رویدادها' },
          { id: 'qa_session', label: '❓ زنگ پرسش و پاسخ' },
          { id: 'project_deadline', label: '⏱️ مهلت پروژه‌ها' },
          { id: 'parent_meeting', label: '👥 جلسات اولیا' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveCategoryFilter(tab.id as any);
              sound.playPlantClick(480);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategoryFilter === tab.id
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              ev.completed ? 'bg-[#F8FAFC] border-[#CBD5E1] opacity-75' : 'bg-white border-[#BAE6FD] shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleEventComplete(ev.id)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center border cursor-pointer shrink-0 mt-0.5 transition-colors ${
                  ev.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                {ev.completed && <Check className="w-4 h-4" />}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`font-black text-xs sm:text-sm ${ev.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}>
                    {ev.title}
                  </h4>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      ev.category === 'qa_session'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : ev.category === 'project_deadline'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-sky-100 text-sky-800 border-sky-200'
                    }`}
                  >
                    {ev.category === 'qa_session'
                      ? 'زنگ پرسش و پاسخ'
                      : ev.category === 'project_deadline'
                      ? 'مهلت پروژه کلاسی'
                      : 'رویداد عمومی'}
                  </span>
                </div>

                <p className="text-[11px] text-[#475569] leading-relaxed">{ev.description}</p>

                <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                  <span>📅 تاریخ: {ev.dateJalali}</span>
                  <span>⏱️ ساعت {ev.timeStr}</span>
                  {ev.isSyncedToStudents && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      همگام‌شده با تمام دانش‌آموزان
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDeleteEvent(ev.id)}
              className="p-2 text-[#94A3B8] hover:text-rose-600 rounded-xl transition-colors cursor-pointer shrink-0"
              title="حذف رویداد"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
