import React, { useState, useMemo } from 'react';
import {
  Users,
  MessageSquare,
  Share2,
  Plus,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  BookOpen,
  Gamepad2,
  Volume2,
  Search,
  Send,
  Star,
  Check,
  Sprout,
  Tag,
  SlidersHorizontal,
  GraduationCap,
  RotateCcw,
  BookMarked,
} from 'lucide-react';
import { sound } from '../utils/audio';

export interface QAPost {
  id: string;
  authorName: string;
  authorSchool: string;
  grade: number; // 1 to 6, 0 for all
  subject: string; // ریاضی, فارسی, علوم, اختلالات, عمومی, etc.
  category: string;
  questionTitle: string;
  content: string;
  likes: number;
  repliesCount: number;
  timeAgo: string;
  isAnswered: boolean;
  replies: { id: string; author: string; role: string; text: string; likes: number; timeAgo: string }[];
}

export interface Workgroup {
  id: string;
  title: string;
  subject: string;
  category: string;
  grade: number; // 1 to 6
  leadTeacher: string;
  membersCount: number;
  description: string;
  activeProject: string;
  joined: boolean;
}

export interface SharedResource {
  id: string;
  title: string;
  type: 'book' | 'game' | 'dictation' | 'homework';
  authorTeacher: string;
  downloads: number;
  rating: number;
  grade: number;
  subject: string;
  description: string;
  category: string;
}

const GRADE_OPTIONS = [
  { label: 'همه پایه‌ها', value: 0 },
  { label: 'پایه اول', value: 1 },
  { label: 'پایه دوم', value: 2 },
  { label: 'پایه سوم', value: 3 },
  { label: 'پایه چهارم', value: 4 },
  { label: 'پایه پنجم', value: 5 },
  { label: 'پایه ششم', value: 6 },
];

const SUBJECT_OPTIONS = [
  'همه دروس و موضوعات',
  'ریاضی و هندسه',
  'فارسی و املا',
  'علوم تجربی',
  'گیمیفیکیشن و بازی‌آموزی',
  'اختلالات یادگیری',
  'مشاوره و روانشناسی',
];

const PRESET_QA: QAPost[] = [
  {
    id: 'qa-1',
    authorName: 'خانم رضایی',
    authorSchool: 'دبستان شهید بهشتی - ناحیه ۲',
    grade: 5,
    subject: 'ریاضی و هندسه',
    category: 'روش تدریس کسرها',
    questionTitle: 'چطور کسر و اعشار را بدون حفظ فرمول به دانش‌آموزان بدفهمی‌دار منتقل کنیم؟',
    content: 'در کلاس پنجم چند دانش‌آموز در درک مفهوم نسبت و تبدیل کسر به اعشار دچار اشتباه شناختی می‌شوند. چه دست‌سازه‌ها یا ابزارک‌هایی پیشنهاد می‌کنید؟',
    likes: 18,
    repliesCount: 2,
    timeAgo: '۲ ساعت پیش',
    isAnswered: true,
    replies: [
      {
        id: 'rep-1',
        author: 'آقای مهدوی (سرگروه ریاضی)',
        role: 'معلم نمونه کشوری',
        text: 'استفاده از طلق‌های شفاف رنگی و ابزارک بازی‌ساز وصل کردنی عالی جواب میده! با نمایش مساحت رنگی بگذارید خودشون معادل ۰٫۴ با ۲/۵ را کشف کنند.',
        likes: 12,
        timeAgo: '۱ ساعت پیش',
      },
      {
        id: 'rep-2',
        author: 'خانم حسینی',
        role: 'مدرس پایه پنجم',
        text: 'ترکیب وایت‌برد تعاملی با نوار کسر پلاستیکی دست‌ساز هم انگیزه بچه‌ها را خیلی بالا می‌بره.',
        likes: 5,
        timeAgo: '۴۵ دقیقه پیش',
      },
    ],
  },
  {
    id: 'qa-2',
    authorName: 'آقای حسینی',
    authorSchool: 'دبستان رشد نو',
    grade: 4,
    subject: 'ریاضی و هندسه',
    category: 'ارزشیابی توصیفی',
    questionTitle: 'بهترین روش برای اجرای بدون استرس آزمون‌های گروهی ریاضی چیست؟',
    content: 'می‌خواهیم در پایه چهارم لیگ کلاسی برگزار کنیم به طوری که دانش‌آموزان قوی‌تر به ضعفا کمک کنند اما احساس رقابت منفی ایجاد نشود.',
    likes: 14,
    repliesCount: 1,
    timeAgo: 'دیروز',
    isAnswered: true,
    replies: [
      {
        id: 'rep-3',
        author: 'خانم کریمی',
        role: 'معلم پایه چهارم',
        text: 'از ابزارک «لیگ کلاسی و چرخ شانس» استفاده کنید. امتیازدهی بر اساس میانگین پیشرفت گروهی باشه، نه نمره‌های فردی.',
        likes: 9,
        timeAgo: '۵ ساعت پیش',
      },
    ],
  },
  {
    id: 'qa-3',
    authorName: 'خانم دکتـر احمدی',
    authorSchool: 'دبستان جوانه دانایی',
    grade: 3,
    subject: 'گیمیفیکیشن و بازی‌آموزی',
    category: 'بازی‌های آموزشی',
    questionTitle: 'چگونه از الگوریتم بازی ماروپله در تثبیت جدول ضرب استفاده کنیم؟',
    content: 'طراحی بازی‌های رومیزی یا ابزارک‌های دیجیتال تیراندازی و مارپله تا چه حد در یادگیری پایدار جدول ضرب پایه سوم موثر است؟',
    likes: 22,
    repliesCount: 1,
    timeAgo: '۳ روز پیش',
    isAnswered: false,
    replies: [
      {
        id: 'rep-4',
        author: 'آقای علوی',
        role: 'پژوهشگر بازی‌های آموزشی',
        text: 'در ابزارک بازی‌ساز درسی سامانه، مود ماروپله و تیراندازی دقیقاً همین کارکرد را به صورت تعاملی پوشش می‌دهند.',
        likes: 15,
        timeAgo: '۲ روز پیش',
      },
    ],
  },
  {
    id: 'qa-4',
    authorName: 'آقای صابری',
    authorSchool: 'دبستان مهر آفرین',
    grade: 2,
    subject: 'فارسی و املا',
    category: 'اختلالات یادگیری',
    questionTitle: 'راهکارهای مواجهه با اختلال دیکته‌نویسی و قرینه‌نویسی حروف در پایه دوم؟',
    content: 'دانش‌آموزی دارم که حروف «ب» و «پ» را وارونه می‌نویسد. چه ابزار صوتی یا تمرین شنیداری بیشترین تاثیر را در اصلاح تمرکز او دارد؟',
    likes: 11,
    repliesCount: 1,
    timeAgo: '۴ روز پیش',
    isAnswered: true,
    replies: [
      {
        id: 'rep-5',
        author: 'خانم دکتر صادقی',
        role: 'مشاور اختلالات یادگیری',
        text: 'استفاده از ابزارک دیکته‌گو هوشمند با تکرار ضبط صدای معلم با سرعت ۰٫۷۵x بسیار مفید است.',
        likes: 8,
        timeAgo: '۳ روز پیش',
      },
    ],
  },
  {
    id: 'qa-5',
    authorName: 'خانم مرادی',
    authorSchool: 'دبستان آفتاب دانش',
    grade: 6,
    subject: 'علوم تجربی',
    category: 'آزمایش‌های تعاملی',
    questionTitle: 'بهترین روش برای آموزش ملموس لایه‌های زمین و زلزله‌شناسی در پایه ششم؟',
    content: 'دانش‌آموزان در تحلیل مفاهیم زمین‌شناسی پایه ششم دچار ابهام هستند. چه شبیه‌سازی یا آزمایش‌های جذابی پیشنهاد می‌کنید؟',
    likes: 16,
    repliesCount: 1,
    timeAgo: '۵ روز پیش',
    isAnswered: false,
    replies: [
      {
        id: 'rep-6',
        author: 'آقای دکتر نوری',
        role: 'سرگروه علوم تجربی',
        text: 'استفاده از ژله‌های سه‌بعدی لایه‌ای و ابزارک انیمیشن‌ساز علوم بهترین بازخورد را داشته است.',
        likes: 10,
        timeAgo: '۴ روز پیش',
      },
    ],
  },
];

const PRESET_WORKGROUPS: Workgroup[] = [
  {
    id: 'wg-1',
    title: 'کارگروه تخصصی تولید محتوای خلاقانه کسر و اعشار (پایه پنجم و ششم)',
    subject: 'ریاضی و هندسه',
    category: 'روش تدریس کسرها',
    grade: 5,
    leadTeacher: 'دکتر امینی (سرگروه استانی)',
    membersCount: 24,
    description: 'تالیف جزوات تعاملی، معماهای انیمیشنی و آزمون‌های گروهی برای تمام مدارس منطقه.',
    activeProject: 'پروژه تدوین کتاب‌ساز چالش‌های هوش عددی ۱۴۰۴',
    joined: true,
  },
  {
    id: 'wg-2',
    title: 'تیم پژوهشی مدیریت اختلالات یادگیری ریاضی و بدفهمی‌های شناختی',
    subject: 'اختلالات یادگیری',
    category: 'مدیریت بدفهمی',
    grade: 4,
    leadTeacher: 'خانم دکتر صادقی',
    membersCount: 31,
    description: 'تحلیل خطاهای شناختی دانش‌آموزان و ارائه تکالیف جبرانی شخصی‌سازی‌شده.',
    activeProject: 'طراحی ۲۰۰ تمپلیت جبرانی هدفمند در ابزارک تکالیف',
    joined: false,
  },
  {
    id: 'wg-3',
    title: 'حلقه علمی گیمیفیکیشن و بازی‌های درسی دبستان',
    subject: 'گیمیفیکیشن و بازی‌آموزی',
    category: 'طراحی سناریو بازی',
    grade: 3,
    leadTeacher: 'استاد کاظمی',
    membersCount: 42,
    description: 'تولید مراحل بازی‌های وصل کردنی، مارپله و پازل‌های درسی کلاسی.',
    activeProject: 'بانک ۴۰ مرحله بازی پازل مفهومی علوم و ریاضی',
    joined: false,
  },
  {
    id: 'wg-4',
    title: 'کارگروه دیکته‌گویی و روان‌خوانی فارسی پایه اول و دوم',
    subject: 'فارسی و املا',
    category: 'مهارت‌های زبانی',
    grade: 2,
    leadTeacher: 'خانم رضایی (معلم نمونه)',
    membersCount: 28,
    description: 'تولید فایل‌های صوتی استاندارد با لهجه فارسی معیار برای ابزارک دیکته‌گو.',
    activeProject: 'تکمیل ۱۰۰ متل و دیکته صوتی آموزشی',
    joined: false,
  },
  {
    id: 'wg-5',
    title: 'تیم تخصصی آزمایشگاه خلاق علوم پایه پنجم و ششم',
    subject: 'علوم تجربی',
    category: 'آموزش کاوشگری',
    grade: 6,
    leadTeacher: 'آقای مهندس کریمی',
    membersCount: 19,
    description: 'طراحی آزمایش‌های کم‌هزینه و وسایل دست‌ساز آزمایشگاهی برای کلاس درس.',
    activeProject: 'کتابچه ۳۰ آزمایش جذاب فیزیک و شیمی ابتدایی',
    joined: false,
  },
];

const PRESET_RESOURCES: SharedResource[] = [
  {
    id: 'res-1',
    title: 'کتاب‌ساز کامل چالش‌های مساحت و محیط پایه پنجم',
    type: 'book',
    authorTeacher: 'خانم معلم مهدوی',
    downloads: 142,
    rating: 4.9,
    grade: 5,
    subject: 'ریاضی و هندسه',
    description: 'شامل ۳۲ تمرین گام‌به‌گام مساحت مثلث، لوزی و متوازی‌الاضلاع همراه با پاسخ‌نامه.',
    category: 'روش تدریس کسرها',
  },
  {
    id: 'res-2',
    title: 'بازی تیراندازی به هدف‌های جدول ضرب ۶ تا ۹',
    type: 'game',
    authorTeacher: 'آقای کاظمی',
    downloads: 210,
    rating: 5.0,
    grade: 4,
    subject: 'گیمیفیکیشن و بازی‌آموزی',
    description: 'بازی آمادگی سریع جدول ضرب برای اجرا در ابزارک بازی‌ساز درسی.',
    category: 'گیمیفیکیشن',
  },
  {
    id: 'res-3',
    title: 'دیکته صوتی ارزش مکانی و اعداد میلیارد پایه چهارم',
    type: 'dictation',
    authorTeacher: 'خانم رضایی',
    downloads: 98,
    rating: 4.8,
    grade: 4,
    subject: 'فارسی و املا',
    description: 'شامل ۱۰ جمله دیکته عددی استاندارد با صدای ضبط‌شده معلم.',
    category: 'اختلالات یادگیری',
  },
];

export const TeacherCommunityWorkgroupWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qa_forum' | 'workgroups' | 'resource_bank'>('qa_forum');

  // Multi-dimensional Filters
  const [selectedGrade, setSelectedGrade] = useState<number>(0); // 0 = all grades
  const [selectedSubject, setSelectedSubject] = useState<string>('همه دروس و موضوعات');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Q&A State
  const [qaPosts, setQaPosts] = useState<QAPost[]>(PRESET_QA);
  const [selectedQaId, setSelectedQaId] = useState<string | null>(null);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newQuestionSubject, setNewQuestionSubject] = useState('ریاضی و هندسه');
  const [newQuestionCategory, setNewQuestionCategory] = useState('روش تدریس');
  const [newQuestionGrade, setNewQuestionGrade] = useState(5);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Workgroups State
  const [workgroups, setWorkgroups] = useState<Workgroup[]>(PRESET_WORKGROUPS);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('ریاضی و هندسه');
  const [newGroupGrade, setNewGroupGrade] = useState(5);

  // Resources State
  const [resources] = useState<SharedResource[]>(PRESET_RESOURCES);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Filter Reset Check
  const hasActiveFilters = selectedGrade !== 0 || selectedSubject !== 'همه دروس و موضوعات' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    sound.playPlantClick(400);
    setSelectedGrade(0);
    setSelectedSubject('همه دروس و موضوعات');
    setSearchQuery('');
  };

  // Filtered Q&A Posts
  const filteredQaPosts = useMemo(() => {
    return qaPosts.filter((post) => {
      const matchesGrade = selectedGrade === 0 || post.grade === selectedGrade;
      const matchesSubject =
        selectedSubject === 'همه دروس و موضوعات' || post.subject === selectedSubject;
      const matchesSearch =
        !searchQuery.trim() ||
        post.questionTitle.includes(searchQuery) ||
        post.content.includes(searchQuery) ||
        post.authorName.includes(searchQuery);
      return matchesGrade && matchesSubject && matchesSearch;
    });
  }, [qaPosts, selectedGrade, selectedSubject, searchQuery]);

  // Filtered Workgroups
  const filteredWorkgroups = useMemo(() => {
    return workgroups.filter((group) => {
      const matchesGrade = selectedGrade === 0 || group.grade === selectedGrade;
      const matchesSubject =
        selectedSubject === 'همه دروس و موضوعات' || group.subject === selectedSubject;
      const matchesSearch =
        !searchQuery.trim() ||
        group.title.includes(searchQuery) ||
        group.description.includes(searchQuery);
      return matchesGrade && matchesSubject && matchesSearch;
    });
  }, [workgroups, selectedGrade, selectedSubject, searchQuery]);

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesGrade = selectedGrade === 0 || res.grade === selectedGrade;
      const matchesSubject =
        selectedSubject === 'همه دروس و موضوعات' || res.subject === selectedSubject;
      const matchesSearch =
        !searchQuery.trim() ||
        res.title.includes(searchQuery) ||
        res.description.includes(searchQuery);
      return matchesGrade && matchesSubject && matchesSearch;
    });
  }, [resources, selectedGrade, selectedSubject, searchQuery]);

  // Q&A Actions
  const handleLikeQA = (id: string) => {
    sound.playPlantClick(520);
    setQaPosts(
      qaPosts.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
  };

  const handleAddReply = (qaId: string) => {
    if (!replyText.trim()) return;
    sound.playJoyfulChime();
    setQaPosts(
      qaPosts.map((q) => {
        if (q.id === qaId) {
          return {
            ...q,
            repliesCount: q.repliesCount + 1,
            replies: [
              ...q.replies,
              {
                id: `rep-${Date.now()}`,
                author: 'شما (معلم کلاسی)',
                role: 'آموزگار همکار',
                text: replyText.trim(),
                likes: 1,
                timeAgo: 'همین الان',
              },
            ],
          };
        }
        return q;
      })
    );
    setReplyText('');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;

    sound.playJoyfulChime();
    const created: QAPost = {
      id: `qa-${Date.now()}`,
      authorName: 'شما (معلم کلاسی)',
      authorSchool: 'مدرسه شما',
      grade: newQuestionGrade,
      subject: newQuestionSubject,
      category: newQuestionCategory,
      questionTitle: newQuestionTitle.trim(),
      content: newQuestionContent.trim(),
      likes: 1,
      repliesCount: 0,
      timeAgo: 'همین الان',
      isAnswered: false,
      replies: [],
    };

    setQaPosts([created, ...qaPosts]);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    setShowNewQuestionModal(false);
  };

  // Workgroup Actions
  const handleToggleJoinGroup = (groupId: string) => {
    sound.playJoyfulChime();
    setWorkgroups(
      workgroups.map((g) => {
        if (g.id === groupId) {
          const nextJoined = !g.joined;
          return {
            ...g,
            joined: nextJoined,
            membersCount: nextJoined ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
  };

  const handleCreateWorkgroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;

    sound.playJoyfulChime();
    const created: Workgroup = {
      id: `wg-${Date.now()}`,
      title: newGroupTitle.trim(),
      subject: newGroupSubject,
      category: 'کارگروه همکاري',
      grade: newGroupGrade,
      leadTeacher: 'شما (معلم مسئول)',
      membersCount: 1,
      description: 'کارگروه تخصصی هم‌افزایی معلمین برای توسعه روش‌های نوآورانه تدریس',
      activeProject: 'پروژه جدید تدوین محتوای کلاسی',
      joined: true,
    };

    setWorkgroups([created, ...workgroups]);
    setNewGroupTitle('');
    setShowNewGroupModal(false);
  };

  // Resource Import
  const handleImportResource = (res: SharedResource) => {
    sound.playJoyfulChime();
    setImportStatus(`محتوای «${res.title}» با موفقیت در ابزارک‌های شما بارگذاری شد! 🌱`);
    setTimeout(() => setImportStatus(null), 3500);
  };

  return (
    <div className="w-full bg-[#FAF8F2] rounded-3xl border border-[#E5DEC9] p-6 shadow-xs space-y-6 text-right dir-rtl font-sans" dir="rtl">
      {/* Header Banner - Javaneh Minimal Aesthetic */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#E5DEC9]/60">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#7BA05B] text-white flex items-center justify-center text-xl shadow-xs ring-4 ring-[#7BA05B]/15 shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] border border-[#C8D9B5]">
                شبکه معلمان • فیلتر پایه و موضوع درسی
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#2D372E] mt-0.5">
              تالار گفت‌وگو و انجمن هم‌اندیشی معلمین (Teacher Community Hub)
            </h3>
            <p className="text-xs text-[#5C6B5E] mt-0.5">
              دسترسی سریع به گروه‌های کاری، پرسش‌ها و فایل‌های آموزشی بر اساس پایه تحصیلی و موضوع تخصصی
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF6ED] p-1.5 rounded-2xl border border-[#E5DEC9]">
          <button
            type="button"
            onClick={() => setActiveTab('qa_forum')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'qa_forum'
                ? 'bg-[#7BA05B] text-white shadow-xs'
                : 'text-[#5C6B5E] hover:text-[#2D372E] hover:bg-white/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>گفت‌وگو و پرسش‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workgroups')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'workgroups'
                ? 'bg-[#7BA05B] text-white shadow-xs'
                : 'text-[#5C6B5E] hover:text-[#2D372E] hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>گروه‌های کاری ({filteredWorkgroups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resource_bank')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'resource_bank'
                ? 'bg-[#7BA05B] text-white shadow-xs'
                : 'text-[#5C6B5E] hover:text-[#2D372E] hover:bg-white/60'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>بانک تجربه‌ها</span>
          </button>
        </div>
      </div>

      {/* Notice Banner if imported */}
      {importStatus && (
        <div className="p-3.5 bg-[#F3F7EE] border border-[#C8D9B5] text-[#5A7A3F] rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#7BA05B] shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* DUAL FILTER PANEL: Grade Level & Subject Matter */}
      <div className="space-y-4 bg-white/90 p-4 rounded-2xl border border-[#E5DEC9] shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF6ED]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D372E]">
            <SlidersHorizontal className="w-4 h-4 text-[#7BA05B]" />
            <span>پالایش تخصصی گفتگوها و گروه‌های کاری:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1 bg-[#FAF6ED] hover:bg-[#E5DEC9]/50 text-[#5C6B5E] text-[11px] font-bold rounded-xl border border-[#E5DEC9] transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#7BA05B]" />
                <span>پاکسازی فیلترها</span>
              </button>
            )}

            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-[#5C6B5E] absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجو در عنوان یا متن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-1.5 bg-[#FAF8F2] border border-[#E5DEC9] rounded-xl text-xs text-[#2D372E] placeholder-[#94A3B8] outline-none focus:border-[#7BA05B] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 1: Filter by Grade Level (پایه تحصیلی) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5A7A3F]">
            <GraduationCap className="w-3.5 h-3.5 text-[#7BA05B]" />
            <span>فیلتر پایه تحصیلی:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {GRADE_OPTIONS.map((g) => {
              const isSelected = selectedGrade === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => {
                    sound.playPlantClick(500 + g.value * 20);
                    setSelectedGrade(g.value);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#7BA05B] text-white shadow-xs ring-2 ring-[#7BA05B]/30'
                      : 'bg-[#FAF8F2] text-[#5C6B5E] border border-[#E5DEC9] hover:bg-[#F3F7EE] hover:text-[#5A7A3F]'
                  }`}
                >
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Filter by Subject Matter (موضوع درسی) */}
        <div className="space-y-2 pt-1 border-t border-[#FAF6ED]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5A7A3F]">
            <BookMarked className="w-3.5 h-3.5 text-[#7BA05B]" />
            <span>فیلتر موضوع / درس آموزشی:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {SUBJECT_OPTIONS.map((sub) => {
              const isSelected = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    sound.playPlantClick(480);
                    setSelectedSubject(sub);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#5A7A3F] text-white shadow-xs ring-2 ring-[#5A7A3F]/30'
                      : 'bg-[#FAF8F2] text-[#5C6B5E] border border-[#E5DEC9] hover:bg-[#F3F7EE] hover:text-[#5A7A3F]'
                  }`}
                >
                  <Tag className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#7BA05B]'}`} />
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: Q&A FORUM */}
      {activeTab === 'qa_forum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#2D372E] text-sm flex items-center gap-2">
              <span>لیست پرسش‌ها و گفتگوهای آموزشی</span>
              <span className="text-xs text-[#5C6B5E] font-normal">({filteredQaPosts.length} مورد)</span>
            </h4>

            <button
              type="button"
              onClick={() => setShowNewQuestionModal(true)}
              className="px-4 py-2 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>طرح پرسش یا چالش جدید</span>
            </button>
          </div>

          {/* Minimal Question Cards */}
          <div className="space-y-3">
            {filteredQaPosts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E5DEC9] text-xs text-[#5C6B5E] space-y-2">
                <p>هیچ پرسش یا مبحثی با این ترکیب پایه تحصیلی و موضوع درسی یافت نشد.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 bg-[#7BA05B] text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>نمایش همه مباحث</span>
                </button>
              </div>
            ) : (
              filteredQaPosts.map((q) => {
                const isExpanded = selectedQaId === q.id;
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-[#E5DEC9] p-5 shadow-2xs hover:border-[#7BA05B]/60 transition-all space-y-3"
                  >
                    {/* Header line with Grade & Subject badges */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-[#FAF6ED]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] text-[11px] font-bold border border-[#C8D9B5] flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-[#7BA05B]" />
                          <span>پایه {q.grade === 0 ? 'همه‌پایه‌ها' : q.grade}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6ED] text-[#2D372E] text-[11px] font-bold border border-[#E5DEC9]">
                          📖 {q.subject} • {q.category}
                        </span>
                        <span className="text-[11px] font-semibold text-[#5C6B5E]">
                          {q.authorName} <span className="text-[#94A3B8]">({q.authorSchool})</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] font-medium">{q.timeAgo}</span>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm text-[#2D372E] leading-snug">{q.questionTitle}</h3>
                      <p className="text-xs text-[#5C6B5E] leading-relaxed">{q.content}</p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#FAF6ED] text-xs">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleLikeQA(q.id)}
                          className="flex items-center gap-1.5 text-[#5C6B5E] hover:text-[#7BA05B] font-bold cursor-pointer transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-[#7BA05B]" />
                          <span>مفید بود ({q.likes})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            sound.playPlantClick(440);
                            setSelectedQaId(isExpanded ? null : q.id);
                          }}
                          className="flex items-center gap-1.5 text-[#5A7A3F] hover:text-[#2D372E] font-bold cursor-pointer transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>پاسخ‌ها ({q.replies.length})</span>
                        </button>
                      </div>

                      {q.isAnswered && (
                        <span className="text-[10px] text-[#5A7A3F] bg-[#F3F7EE] px-2.5 py-0.5 rounded-full font-bold border border-[#C8D9B5] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#7BA05B]" />
                          <span>پاسخ تأیید شده معلمین</span>
                        </span>
                      )}
                    </div>

                    {/* Expanded Replies Section */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#E5DEC9] space-y-3 bg-[#FAF8F2] p-4 rounded-xl">
                        <h4 className="text-xs font-bold text-[#2D372E] flex items-center gap-1.5">
                          <Sprout className="w-3.5 h-3.5 text-[#7BA05B]" />
                          <span>راهکارهای پیشنهادی همکاران:</span>
                        </h4>

                        {q.replies.map((rep) => (
                          <div key={rep.id} className="p-3 bg-white rounded-xl border border-[#E5DEC9] space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#5A7A3F]">
                                {rep.author} — <span className="text-[10px] text-[#7BA05B] font-normal">{rep.role}</span>
                              </span>
                              <span className="text-[10px] text-[#94A3B8]">{rep.timeAgo}</span>
                            </div>
                            <p className="text-[#3D4A3E] leading-relaxed font-medium">{rep.text}</p>
                          </div>
                        ))}

                        {/* Reply Form */}
                        <div className="flex gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="تجربه یا راهکار کاربردی خود را بنویسید..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 p-2 rounded-xl border border-[#E5DEC9] text-xs font-semibold bg-white outline-none focus:border-[#7BA05B]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReply(q.id)}
                            className="px-4 py-2 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>ثبت پاسخ</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WORKGROUPS */}
      {activeTab === 'workgroups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-[#2D372E] text-sm">گروه‌های کاری تخصصی معلمین:</h4>
              <p className="text-xs text-[#5C6B5E] mt-0.5">
                فیلتر بر اساس پایه تحصیلی و موضوع درسی فعال است ({filteredWorkgroups.length} گروه کاری آماده همکاری)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewGroupModal(true)}
              className="px-4 py-2 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تشکیل گروه کاری جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkgroups.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-[#E5DEC9] text-xs text-[#5C6B5E] space-y-2">
                <p>هیچ گروه کاری با پایه تحصیلی یا موضوع انتخابی پیدا نشد.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 bg-[#7BA05B] text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>نمایش تمام گروه‌های کاری</span>
                </button>
              </div>
            ) : (
              filteredWorkgroups.map((wg) => (
                <div key={wg.id} className="bg-white rounded-2xl border border-[#E5DEC9] p-5 space-y-4 shadow-2xs hover:border-[#7BA05B]/60 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] text-[10px] font-bold border border-[#C8D9B5] flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-[#7BA05B]" />
                          <span>پایه {wg.grade}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF6ED] text-[#2D372E] text-[10px] font-bold border border-[#E5DEC9]">
                          📖 {wg.subject}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5C6B5E] font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#7BA05B]" />
                        <span>{wg.membersCount} عضو فعال</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#2D372E] mt-1">{wg.title}</h3>
                    <p className="text-xs text-[#5C6B5E] leading-relaxed">{wg.description}</p>
                  </div>

                  <div className="bg-[#FAF6ED] p-3 rounded-xl border border-[#E5DEC9] text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#5A7A3F] block">پروژه فعال گروه:</span>
                    <span className="font-bold text-[#2D372E] block">{wg.activeProject}</span>
                    <span className="text-[10px] text-[#5C6B5E] block">سرپرست گروه: {wg.leadTeacher}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleJoinGroup(wg.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      wg.joined
                        ? 'bg-[#F3F7EE] text-[#5A7A3F] border border-[#C8D9B5]'
                        : 'bg-[#7BA05B] text-white hover:bg-[#5A7A3F]'
                    }`}
                  >
                    {wg.joined ? <Check className="w-4 h-4 text-[#7BA05B]" /> : <Plus className="w-4 h-4" />}
                    <span>{wg.joined ? 'عضو این گروه کاری هستید' : 'عضویت و هم‌افزایی در گروه'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SHARED RESOURCE BANK */}
      {activeTab === 'resource_bank' && (
        <div className="space-y-4">
          <div className="pb-1">
            <h4 className="font-bold text-[#2D372E] text-sm">بانک اشتراک‌گذاری ابزارک‌ها و محتواهای کلاسی همکاران:</h4>
            <p className="text-xs text-[#5C6B5E] mt-0.5">
              محتواها و بازی‌های تألیف‌شده بر اساس پایه تحصیلی و موضوع آموزشی انتخابی ({filteredResources.length} منبع)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredResources.length === 0 ? (
              <div className="col-span-3 p-8 text-center bg-white rounded-2xl border border-[#E5DEC9] text-xs text-[#5C6B5E] space-y-2">
                <p>هیچ فایل یا منبع آموزشی با پایه و درس انتخابی یافت نشد.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 bg-[#7BA05B] text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>نمایش تمام منابع</span>
                </button>
              </div>
            ) : (
              filteredResources.map((res) => {
                const getIcon = () => {
                  switch (res.type) {
                    case 'book': return <BookOpen className="w-4 h-4 text-[#7BA05B]" />;
                    case 'game': return <Gamepad2 className="w-4 h-4 text-[#5A7A3F]" />;
                    case 'dictation': return <Volume2 className="w-4 h-4 text-[#7BA05B]" />;
                    default: return <Sparkles className="w-4 h-4 text-amber-600" />;
                  }
                };

                return (
                  <div key={res.id} className="bg-white rounded-2xl border border-[#E5DEC9] p-4 space-y-3 shadow-2xs hover:border-[#7BA05B]/60 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {getIcon()}
                          <span className="text-[11px] font-bold text-[#5C6B5E]">پایه {res.grade} • {res.subject}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{res.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-xs text-[#2D372E] line-clamp-1">{res.title}</h3>
                      <p className="text-[11px] text-[#5C6B5E] leading-relaxed line-clamp-2">{res.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#FAF6ED] space-y-2">
                      <span className="text-[10px] text-[#94A3B8] block">مؤلف: {res.authorTeacher} • {res.downloads} دانلود</span>
                      <button
                        type="button"
                        onClick={() => handleImportResource(res)}
                        className="w-full py-2 bg-[#F3F7EE] hover:bg-[#C8D9B5]/40 text-[#5A7A3F] text-xs font-bold rounded-xl border border-[#C8D9B5] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>وارد کردن به ابزارک‌های من</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal 1: New Question */}
      {showNewQuestionModal && (
        <div className="fixed inset-0 bg-[#2D372E]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#FAF8F2] rounded-3xl border border-[#E5DEC9] max-w-lg w-full p-6 space-y-4 shadow-xl text-right dir-rtl font-sans" dir="rtl">
            <h3 className="font-bold text-base text-[#2D372E] flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#7BA05B]" />
              <span>طرح پرسش یا چالش جدید در تالار:</span>
            </h3>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#2D372E]">پایه تحصیلی:</label>
                  <select
                    value={newQuestionGrade}
                    onChange={(e) => setNewQuestionGrade(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] font-semibold bg-white outline-none"
                  >
                    {GRADE_OPTIONS.filter(g => g.value > 0).map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2D372E]">موضوع / درس:</label>
                  <select
                    value={newQuestionSubject}
                    onChange={(e) => setNewQuestionSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] font-semibold bg-white outline-none"
                  >
                    {SUBJECT_OPTIONS.filter(s => s !== 'همه دروس و موضوعات').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">عنوان سوال:</label>
                <input
                  type="text"
                  placeholder="مثلاً: راهکار تثبیت مفهوم کسر متقابل در پایه پنجم"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] font-semibold bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">شرح کامل چالش یا پرسش:</label>
                <textarea
                  rows={3}
                  placeholder="توضیحات و بدفهمی‌های مشاهده‌شده در کلاس..."
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] font-semibold bg-white outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  انتشار سوال
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-4 py-2.5 bg-[#FAF6ED] text-[#5C6B5E] border border-[#E5DEC9] font-bold rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: New Workgroup */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-[#2D372E]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#FAF8F2] rounded-3xl border border-[#E5DEC9] max-w-lg w-full p-6 space-y-4 shadow-xl text-right dir-rtl font-sans" dir="rtl">
            <h3 className="font-bold text-base text-[#2D372E] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#7BA05B]" />
              <span>تشکیل گروه کاری جدید:</span>
            </h3>

            <form onSubmit={handleCreateWorkgroup} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#2D372E]">پایه تحصیلی هدف:</label>
                  <select
                    value={newGroupGrade}
                    onChange={(e) => setNewGroupGrade(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] font-semibold bg-white outline-none"
                  >
                    {GRADE_OPTIONS.filter(g => g.value > 0).map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2D372E]">موضوع / درس تخصصی:</label>
                  <select
                    value={newGroupSubject}
                    onChange={(e) => setNewGroupSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] font-semibold bg-white outline-none"
                  >
                    {SUBJECT_OPTIONS.filter(s => s !== 'همه دروس و موضوعات').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">نام گروه کاری:</label>
                <input
                  type="text"
                  placeholder="مثلاً: تیم پژوهشی بازی‌سازی ریاضی پایه پنجم"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] font-semibold bg-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  ایجاد و انتشار گروه
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewGroupModal(false)}
                  className="px-4 py-2.5 bg-[#FAF6ED] text-[#5C6B5E] border border-[#E5DEC9] font-bold rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


