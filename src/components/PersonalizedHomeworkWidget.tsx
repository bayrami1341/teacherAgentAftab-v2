import React, { useState, useMemo } from 'react';
import { Plant, Mood } from '../types';
import {
  BookOpen,
  Send,
  Sparkles,
  Clock,
  Plus,
  CheckCircle2,
  BookMarked,
  SlidersHorizontal,
  GraduationCap,
  Target,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PersonalizedHomeworkWidgetProps {
  plants: Plant[];
  onAssignHomework?: (studentId: string, homeworkTitle: string) => void;
}

interface AssignedTask {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  bookPage: string;
  taskTitle: string;
  bottleneckReason: string;
  assignedDate: string;
  dueDate: string;
  status: 'assigned' | 'completed' | 'reviewed';
  personalTeacherNote: string;
}

interface MathCurriculumPage {
  grade: number;
  chapterTitle: string;
  pageRange: string;
  bottleneckName: string;
  suggestedExercise: string;
}

const MATH_TEXTBOOK_MAPPING: MathCurriculumPage[] = [
  // Grade 1
  {
    grade: 1,
    chapterTitle: 'فصل ۲: الگویابی و چوب‌خط',
    pageRange: 'صفحه ۱۵ تا ۲۴',
    bottleneckName: 'عدم درک دسته‌بندی ۵تایی چوب‌خط‌ها',
    suggestedExercise: 'رسم ۳ دسته ۵تایی چوب‌خط با رنگ‌های مختلف و شمردن ۵تا ۵تا در دفتر',
  },
  {
    grade: 1,
    chapterTitle: 'فصل ۵: جدول ارزش مکانی',
    pageRange: 'صفحه ۸۰ تا ۹۵',
    bottleneckName: 'اشتباه در تفکیک یکی و دهتایی',
    suggestedExercise: 'ساخت دو دسته ۱۰تایی با چوب‌کبرک یا شکل‌های دست‌ساز در منزل',
  },
  // Grade 2
  {
    grade: 2,
    chapterTitle: 'فصل ۲: جمع و تفریق دو رقمی',
    pageRange: 'صفحه ۱۸ تا ۳۰',
    bottleneckName: 'ده‌برتن اشتباه در جمع فرآیندی',
    suggestedExercise: 'حل ۴ تمرین جمع تکنیکی با رسم جدول دهتایی و یکی با رنگ مجزا',
  },
  {
    grade: 2,
    chapterTitle: 'فصل ۴: ساخت شکل‌های هندسی',
    pageRange: 'صفحه ۱۰۵ تا ۱۲۰',
    bottleneckName: 'اشتباه بین ضلع و زاویه در چندضلعی‌ها',
    suggestedExercise: 'کشیدن مثلث و مربع و مشخص کردن رأس‌ها با نقطه قرمز و ضلع‌ها با خط سبز',
  },
  // Grade 3
  {
    grade: 3,
    chapterTitle: 'فصل ۴: ضرب و تقسیم',
    pageRange: 'صفحه ۶۵ تا ۸۰',
    bottleneckName: 'اشتباه در درک مفهوم تقسیم مساوی روی شکل',
    suggestedExercise: 'تقسیم ۱۲ دایره به ۴ دسته مساوی روی شکل و نوشتن عبارت‌های ضرب و تقسیم مربوطه',
  },
  {
    grade: 3,
    chapterTitle: 'فصل ۶: محیط و مساحت',
    pageRange: 'صفحه ۱۱۰ تا ۱۲۵',
    bottleneckName: 'خلط بین تعریف دور تا دور (محیط) و سطح داخل (مساحت)',
    suggestedExercise: 'محاسبه محیط و مساحت مربعی به ضلع ۴ سانتی‌متر با دو رنگ مجزا',
  },
  // Grade 4
  {
    grade: 4,
    chapterTitle: 'فصل ۲: کسرها و اعداد مخلوط',
    pageRange: 'صفحه ۲۸ تا ۴۵',
    bottleneckName: 'عدم مساوی تقسیم کردن واحد کامل در کسر',
    suggestedExercise: 'رسم دو نوار کسری هم‌اندازه و نمایش معادل کسر ۲/۳ با ۴/۶ روی شکل',
  },
  {
    grade: 4,
    chapterTitle: 'فصل ۳: ضرب دو رقم در دو رقم',
    pageRange: 'صفحه ۴۸ تا ۶۵',
    bottleneckName: 'جا انداختن صفر ارزش مکانی در سطر دوم ضرب',
    suggestedExercise: 'حل ۲ ضرب تکنیکی با قرار دادن صفر دهگان با مداد رنگی زرد',
  },
  // Grade 5
  {
    grade: 5,
    chapterTitle: 'فصل ۲: کسرها و ضرب کسر در کسر',
    pageRange: 'صفحه ۲۲ تا ۴۰',
    bottleneckName: 'اشتباه در ساده‌کردن کسرها پیش از ضرب',
    suggestedExercise: 'محاسبه ضرب ۲/۳ × ۳/۴ همراه با ساده کردن صورت و مخرج قبل از محاسبه',
  },
  {
    grade: 5,
    chapterTitle: 'فصل ۳: نسبت، تناسب و درصد',
    pageRange: 'صفحه ۵۸ تا ۷۸',
    bottleneckName: 'تشخیص اشتباه کل در جدول تناسب',
    suggestedExercise: 'حل مسئله درصد تخفیف ۳۰٪ برای کالای ۱۰۰ هزار تومانی با رسم جدول ۳ خانه‌ای',
  },
  {
    grade: 5,
    chapterTitle: 'فصل ۵: مساحت مثلث و متوازی‌الاضلاع',
    pageRange: 'صفحه ۹۲ تا ۱۱۰',
    bottleneckName: 'اشتباه در تشخیص ارتفاع عمود بر قاعده',
    suggestedExercise: 'رسم ارتفاع مثلث با گونیا و رنگ‌آمیزی قاعده مرتبط با همان ارتفاع',
  },
  // Grade 6
  {
    grade: 6,
    chapterTitle: 'فصل ۲: اعداد اعشاری و تقسیم اعشاری',
    pageRange: 'صفحه ۱۶ تا ۳۵',
    bottleneckName: 'جابجایی ممیز در ضرب و تقسیم در ۱۰ و ۱۰۰',
    suggestedExercise: 'انتقال ممیز در ۳ شماره تقسیم اعشاری و چک کردن با ممیز شناور',
  },
  {
    grade: 6,
    chapterTitle: 'فصل ۵: مساحت دایره و زاویه‌ها',
    pageRange: 'صفحه ۹۰ تا ۱۲۰',
    bottleneckName: 'ضرب شعاع در ۲ به جای ضرب شعاع در خودش (شعاع × شعاع × ۳٫۱۴)',
    suggestedExercise: 'محاسبه مساحت دایره به شعاع ۵ با نوشتن صریح فرمول (۵ × ۵ × ۳٫۱۴ = ۷۸٫۵)',
  },
];

export const PersonalizedHomeworkWidget: React.FC<PersonalizedHomeworkWidgetProps> = ({
  plants,
  onAssignHomework,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(plants[0]?.id || 'p-15');
  const [selectedGrade, setSelectedGrade] = useState<number>(5);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [customTeacherNote, setCustomTeacherNote] = useState<string>('دوست گلم، این تمرین کوتاه برای شادابی بیشتر جوانه قشنگت توی اتاقته!');

  const [assignedList, setAssignedList] = useState<AssignedTask[]>([
    {
      id: 'h-1',
      studentId: 'p-15',
      studentName: 'علی',
      grade: 5,
      bookPage: 'صفحه ۲۲ تا ۴۰ کتاب ریاضی پنجم',
      taskTitle: 'محاسبه ضرب ۲/۳ × ۳/۴ همراه با ساده کردن کسرها روی شکل',
      bottleneckReason: 'اشتباه در ساده‌کردن کسرها پیش از ضرب',
      assignedDate: 'امروز ۱۰:۱۵',
      dueDate: 'فردا صبح',
      status: 'assigned',
      personalTeacherNote: 'علی جان، با خوندن این دو سوال کوتاه، گلدونت تو باغچه یه شادابی تازه می‌گیره!',
    },
    {
      id: 'h-2',
      studentId: 'c-2',
      studentName: 'سارا',
      grade: 6,
      bookPage: 'صفحه ۹۰ تا ۱۲۰ کتاب ریاضی ششم',
      taskTitle: 'محاسبه مساحت دایره به شعاع ۵ با فرمول شعاع × شعاع × ۳٫۱۴',
      bottleneckReason: 'ضرب شعاع در ۲ به جای ضرب شعاع در خودش',
      assignedDate: 'دیروز',
      dueDate: 'امروز عصر',
      status: 'completed',
      personalTeacherNote: 'سارا عزیز، آفرین به دقت بالات در حل مسئله دیروز.',
    },
  ]);

  const selectedStudent = plants.find((p) => p.id === selectedStudentId) || plants[0] || {
    id: 'p-15',
    childName: 'علی',
    plantName: 'جوانه',
    mood: 'longing' as Mood,
  };

  // Filtered chapters for current grade
  const gradeChapters = useMemo(() => {
    return MATH_TEXTBOOK_MAPPING.filter((m) => m.grade === selectedGrade);
  }, [selectedGrade]);

  const activeChapter = gradeChapters[selectedChapterIdx] || gradeChapters[0] || MATH_TEXTBOOK_MAPPING[0];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playJoyfulChime();

    const newTask: AssignedTask = {
      id: `h-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.childName,
      grade: selectedGrade,
      bookPage: `${activeChapter.pageRange} (کتاب ریاضی پایه ${selectedGrade})`,
      taskTitle: activeChapter.suggestedExercise,
      bottleneckReason: activeChapter.bottleneckName,
      assignedDate: 'امروز',
      dueDate: 'فردا صبح',
      status: 'assigned',
      personalTeacherNote: customTeacherNote || 'موفق باشی عزیز من!',
    };

    setAssignedList([newTask, ...assignedList]);
    if (onAssignHomework) {
      onAssignHomework(selectedStudent.id, activeChapter.suggestedExercise);
    }
  };

  return (
    <div className="bg-[#FAF8F2] rounded-3xl p-5 sm:p-6 border border-[#E5DEC9] shadow-xs space-y-6 text-right dir-rtl font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DEC9]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#7BA05B] flex items-center justify-center text-white text-2xl shadow-xs ring-4 ring-[#7BA05B]/15 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#2D372E]">
                کشف گلوگاه‌های درسی و ارجاع صفحه‌به‌صفحه تمرینات ریاضی
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] text-[11px] font-bold border border-[#C8D9B5]">
                ریاضی پایه ۱ تا ۶ دبستان
              </span>
            </div>
            <p className="text-xs text-[#5C6B5E] mt-0.5">
              شناسایی ریشه اشتباهات شناختی بر اساس صفحات کتاب درسی • ارجاع تمرینات هدفمند به اتاق دانش‌آموز
            </p>
          </div>
        </div>
      </div>

      {/* Assignment Generator Form */}
      <form onSubmit={handleAssign} className="bg-white p-5 rounded-2xl border border-[#E5DEC9] space-y-4 text-xs shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Select Student */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2D372E] flex items-center gap-1">
              <span>۱. انتخاب دانش‌آموز:</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-[#FAF8F2] font-bold text-[#2D372E] outline-none focus:border-[#7BA05B] cursor-pointer"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.childName} (گیاه «{p.plantName}»)
                </option>
              ))}
            </select>
          </div>

          {/* Select Grade */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2D372E] flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#7BA05B]" />
              <span>۲. پایه تحصیلی ریاضی:</span>
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(Number(e.target.value));
                setSelectedChapterIdx(0);
              }}
              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-[#FAF8F2] font-bold text-[#2D372E] outline-none focus:border-[#7BA05B] cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={g}>
                  کتاب ریاضی پایه {g} دبستان
                </option>
              ))}
            </select>
          </div>

          {/* Select Chapter & Page Range */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2D372E] flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-[#7BA05B]" />
              <span>۳. فصل و صفحه کتاب درسی:</span>
            </label>
            <select
              value={selectedChapterIdx}
              onChange={(e) => setSelectedChapterIdx(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-[#FAF8F2] font-bold text-[#2D372E] outline-none focus:border-[#7BA05B] cursor-pointer"
            >
              {gradeChapters.map((ch, idx) => (
                <option key={idx} value={idx}>
                  {ch.chapterTitle} ({ch.pageRange})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diagnostic Bottleneck Card */}
        {activeChapter && (
          <div className="bg-[#FAF6ED] p-4 rounded-xl border border-[#E5DEC9] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#5A7A3F] flex items-center gap-1 text-xs">
                <Zap className="w-4 h-4 text-[#7BA05B]" />
                <span>گلوگاه شناختی کشف‌شده در این بخش:</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] border border-[#C8D9B5]">
                {activeChapter.pageRange}
              </span>
            </div>
            <p className="font-bold text-[#2D372E] text-xs">«{activeChapter.bottleneckName}»</p>
            <div className="pt-1 border-t border-[#E5DEC9]/60 text-xs">
              <span className="font-bold text-[#5C6B5E]">تمرین جبرانی پیشنهادی: </span>
              <span className="text-[#2D372E] font-medium">{activeChapter.suggestedExercise}</span>
            </div>
          </div>
        )}

        {/* Teacher Note */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#2D372E]">۴. یادداشت صمیمی و انگیزشی معلم برای ارسال تکلیف:</label>
          <textarea
            rows={2}
            value={customTeacherNote}
            onChange={(e) => setCustomTeacherNote(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-[#FAF8F2] text-xs font-semibold outline-none focus:border-[#7BA05B]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>ارسال تکلیف به اتاق «{selectedStudent.childName}»</span>
        </button>
      </form>

      {/* Assigned Tasks History List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#5C6B5E] flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#7BA05B]" />
          <span>لیست تکالیف ارجاع‌شده اخیر:</span>
        </h4>

        <div className="space-y-2.5">
          {assignedList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#E5DEC9] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-[#2D372E]">{item.studentName}:</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] text-[10px] font-bold border border-[#C8D9B5]">
                    {item.bookPage}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'completed'
                        ? 'bg-[#F3F7EE] text-[#5A7A3F] border border-[#C8D9B5]'
                        : 'bg-[#FAF6ED] text-[#92400E] border border-[#FDE68A]'
                    }`}
                  >
                    {item.status === 'completed' ? 'انجام‌شده ✓' : 'در انتظار انجام'}
                  </span>
                </div>
                <p className="font-bold text-xs text-[#2D372E]">{item.taskTitle}</p>
                <p className="text-[11px] text-[#5C6B5E]">
                  علت ارجاع: {item.bottleneckReason} • مهلت: {item.dueDate}
                </p>
                <p className="text-[11px] text-[#5A7A3F] italic font-medium">
                  💬 یادداشت معلم: «{item.personalTeacherNote}»
                </p>
              </div>

              <div className="text-[10px] text-[#94A3B8] shrink-0">
                تاریخ ارسال: {item.assignedDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

