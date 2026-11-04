import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Printer,
  Edit3,
  Layers,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  RefreshCw,
  CheckSquare,
  Square,
  Type,
  Calculator,
  ShieldCheck,
  Zap,
  Info,
  Share2,
} from 'lucide-react';
import { sound } from '../utils/audio';

export interface BookItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  steps: string;
  alternative: string;
  responsible: string;
  readTime: number;
  actionTime: number;
  status: 'draft' | 'published';
  grade: number;
}

export interface BookMeta {
  schoolName: string;
  bookTitle: string;
  subtitle: string;
  aboutSchool: string;
}

const DEFAULT_META: BookMeta = {
  schoolName: 'دبستان و دبیرستان نمونه آفتاب و جوانه',
  bookTitle: 'راهنمای یادگیری و بسته‌های آموزشی غیرحضوری',
  subtitle: 'کتابچه تعاملی بسته‌های کوتاه یادگیری، تمرینات کلاسی و پیوستگی با اولیا',
  aboutSchool: 'این کتابچه جهت شفافیت در برنامه‌های آموزشی، آرامش خانواده‌ها و تثبیت پایداری یادگیری دانش‌آموزان تدوین شده است.',
};

const SAMPLE_ITEMS: BookItem[] = [
  {
    id: 'item-1',
    title: 'آموزش ریاضی: جمع و ضرب کسرها و محاسبات مساحت به روش ساده در منزل',
    category: 'ریاضیات و هوش عددی',
    summary: 'روش حل گام‌به‌گام تمرین‌های کسر و توان در دفتر بدون نیاز به اتصال دائم اینترنت.',
    body: 'در روزهایی که دسترسی به کلاس آنلاین ممکن نیست، تدریس ریاضی باید گام‌به‌گام و ملموس باشد.\nبرای جمع دو کسر هم‌مخرج مانند ۲⁄۵ و ۱⁄۵، کافی است صورت‌ها را با هم جمع کنیم تا حاصل برابر با ۳⁄۵ شود.\nبرای محاسبه مساحت مربع با ضلع ۴، مساحت برابر با ۱۶ واحد خواهد بود (۴² = ۱۶) و جذر آن برابر با ۴ است (√۱۶ = ۴).\nدانش‌آموزان عزیز می‌توانند تمرین‌ها را با مداد در دفتر خود حل نمایند.',
    steps: '۱. مبحث کسرها را با کشیدن یک شکل دایره‌ای ساده در دفتر رسم کنید.\n۲. تمرین جمع کسر ۳⁄۷ + ۲⁄۷ = ۵⁄۷ را محاسبه نمایید.\n۳. مسئله مساحت مربع با ضلع ۵ را حل کنید (۵² = ۲۵).\n۴. پاسخ تمرینات را آماده و در جلسه بعدی بررسی کنید.',
    alternative: 'اگر به اینترنت دسترسی نداشتید، تمرین‌ها را روی برگه بنویسید و در اولین جلسه حضوری به معلم تحویل دهید.',
    responsible: 'معلم ریاضی',
    readTime: 3,
    actionTime: 15,
    status: 'published',
    grade: 5,
  },
  {
    id: 'item-2',
    title: 'مسیر رسمی اطلاع‌رسانی کلاسی و تکالیف هوشمند در روزهای تعطیل',
    category: 'ارتباط با خانواده',
    summary: 'پیام رسمی مدرسه تنها از یک کانال مشخص و با تایید مدیریت منتشر می‌شود.',
    body: 'در زمان تعطیلی‌های ناگهانی، ایجاد چند کانال پیام‌رسانی باعث سردرگمی خانواده‌ها می‌شود. مدرسه تمام اخبار موثق، ساعت شروع کلاس‌ها و تکالیف را در سامانه تعاملی یا پیام‌رسان رسمی قرار می‌دهد. در هر پیام، تاریخ، ساعت انتشار و زمان پیام بعدی به روشنی اعلام خواهد شد.',
    steps: '۱. تنها به اطلاعیه‌های کانال رسمی مدرسه استناد کنید.\n۲. پیامک اضطراری مدرسه برای موارد قطعی اینترنت فعال است.\n۳. زیر هر اطلاعیه، نام مسئول تاییدکننده درج می‌شود.',
    alternative: 'در صورت قطعی اینترنت، پیامک خلاصه برنامه به شماره سرپرست دانش‌آموز ارسال خواهد شد.',
    responsible: 'مدیریت مدرسه',
    readTime: 2,
    actionTime: 5,
    status: 'published',
    grade: 4,
  },
  {
    id: 'item-3',
    title: 'آرامش‌بخشی و مراقبت از حال روحی دانش‌آموزان در خانه',
    category: 'بهداشت روان و مشاور آوا',
    summary: 'در شرایط تنش یا تعطیلات طولانی، گفت‌وگو و ایجاد حس امنیت مهم‌ترین اولویت است.',
    body: 'اخبار و استرس جامعه بر ذهن فرزندان اثر می‌گذارد. پیشنهاد می‌شود هر روز دقایقی را به صحبت صمیمانه، احوال‌پرسی و شنیدن صحبت‌های دانش‌آموز اختصاص دهید و از انتقال نگرانی‌ها و اخبار منفی در فضای مطالعه پرهیز فرمایید.',
    steps: '۱. روز را با احوال‌پرسی صمیمی و آرامش‌بخش آغاز کنید.\n۲. از بازخوانی اخبار استرس‌زا در حضور دانش‌آموز خودداری کنید.\n۳. میان ساعت‌های مطالعه در خانه، فرصت استراحت و بازی در نظر بگیرید.',
    alternative: 'می‌توانید پیام صوتی کوتاه از صحبت‌های محبت‌آمیز معلم را برای دانش‌آموز پخش کنید.',
    responsible: 'مشاور مدرسه',
    readTime: 3,
    actionTime: 10,
    status: 'published',
    grade: 3,
  },
];

export const TeacherBookBuilderWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'editor' | 'reader' | 'settings'>('library');

  // Book State
  const [meta, setMeta] = useState<BookMeta>(DEFAULT_META);
  const [items, setItems] = useState<BookItem[]>(SAMPLE_ITEMS);
  const [activeItemId, setActiveItemId] = useState<string>(SAMPLE_ITEMS[0].id);

  // Student Reader State
  const [readerFontSize, setReaderFontSize] = useState<number>(16);
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({});

  const activeItem = items.find((i) => i.id === activeItemId) || items[0];

  // Persian Number Convertor
  const toPersianDigits = (str: string | number) => {
    if (str === null || str === undefined) return '';
    const digits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/[0-9]/g, (d) => digits[parseInt(d, 10)]);
  };

  // Text Cleaner & Formatter
  const cleanPersianText = (str: string) => {
    if (!str) return '';
    let s = String(str);
    s = s.replace(/\[کسر:\s*([^/]+?)\s*\/\s*(.+?)\]/gi, '$1⁄$2');
    s = s.replace(/\[توان:\s*([^^]+?)\s*\^\s*(.+?)\]/gi, '$1²');
    s = s.replace(/\[رادیکال:\s*(.+?)\]/gi, '√$1');
    return s;
  };

  const handleAutoFormatText = () => {
    if (!activeItem) return;
    sound.playJoyfulChime();
    const updated = items.map((it) => {
      if (it.id === activeItem.id) {
        return {
          ...it,
          title: toPersianDigits(it.title).replace(/\bمی\s+([^\s]+)/g, 'می\u200C$1'),
          summary: toPersianDigits(it.summary).replace(/\bمی\s+([^\s]+)/g, 'می\u200C$1'),
          body: toPersianDigits(it.body).replace(/\bمی\s+([^\s]+)/g, 'می\u200C$1'),
          steps: toPersianDigits(it.steps),
          alternative: toPersianDigits(it.alternative),
        };
      }
      return it;
    });
    setItems(updated);
  };

  const handleInsertMathSnippet = (field: 'body' | 'steps', snippet: string) => {
    if (!activeItem) return;
    sound.playPlantClick(500);
    const updated = items.map((it) => {
      if (it.id === activeItem.id) {
        return {
          ...it,
          [field]: (it[field] || '') + snippet,
        };
      }
      return it;
    });
    setItems(updated);
  };

  const handleCreateNewItem = () => {
    sound.playJoyfulChime();
    const newItem: BookItem = {
      id: `item-${Date.now()}`,
      title: 'بسته آموزشی جدید',
      category: 'آموزش و یادگیری',
      summary: 'خلاصه یک‌جمله‌ای برای مطالعه فوری دانش‌آموز',
      body: 'متن کامل توضیحات درس و نکات آموزشی...',
      steps: '۱. گام اول تمرین\n۲. گام دوم محاسبات\n۳. تحویل کار به معلم',
      alternative: 'در صورت عدم دسترسی آنلاین، تمرینات را در دفتر بنویسید.',
      responsible: 'معلم کلاس',
      readTime: 3,
      actionTime: 15,
      status: 'published',
      grade: 5,
    };
    setItems([newItem, ...items]);
    setActiveItemId(newItem.id);
    setActiveTab('editor');
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) return;
    sound.playPlantClick(300);
    const filtered = items.filter((i) => i.id !== id);
    setItems(filtered);
    setActiveItemId(filtered[0].id);
  };

  const handleToggleStepCheck = (stepKey: string) => {
    sound.playPlantClick(600);
    setCheckedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  // Export Standalone Interactive HTML File
  const handleExportHtmlBook = () => {
    sound.playJoyfulChime();
    const publishedItems = items.filter((i) => i.status === 'published');

    let articlesHtml = '';
    publishedItems.forEach((item, idx) => {
      const stepLines = item.steps.split(/\r?\n/).filter((l) => l.trim().length > 0);
      let stepsListHtml = '';
      stepLines.forEach((s, sIdx) => {
        const cleanS = s.replace(/^\s*[-*•\d.)]+\s*/, '');
        stepsListHtml += `<li style="margin-bottom:8px; display:flex; align-items:flex-start; gap:8px;">
          <input type="checkbox" style="width:16px; height:16px; accent-color:#059669; cursor:pointer; margin-top:3px;" onchange="this.nextElementSibling.style.textDecoration=this.checked?'line-through':'none'" />
          <span style="font-size:0.9em; line-height:1.6;">${cleanS}</span>
        </li>`;
      });

      articlesHtml += `<article style="background:#ffffff; border:1px solid #E5DEC9; border-radius:18px; padding:22px; margin-bottom:20px; box-shadow:0 2px 10px rgba(0,0,0,0.02);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.75em;">
          <span style="background:#F3F7EE; color:#5A7A3F; padding:2px 10px; border-radius:999px; font-weight:700; border:1px solid #C8D9B5;">🌱 ${item.category} • پایه ${item.grade}</span>
          <span style="color:#64748B;">مسئول: ${item.responsible} • زمان مطالعه: ${item.readTime} دقیقه</span>
        </div>
        <h2 style="font-size:1.15em; font-weight:900; color:#2D372E; margin-bottom:10px;">${cleanPersianText(item.title)}</h2>
        ${item.summary ? `<div style="background:#FAF6ED; border-right:3px solid #7BA05B; padding:10px 14px; border-radius:8px; font-size:0.85em; font-weight:600; color:#2D372E; margin-bottom:14px;">✦ ${cleanPersianText(item.summary)}</div>` : ''}
        <div style="font-size:0.88em; line-height:1.8; color:#3D4A3E; margin-bottom:16px; white-space:pre-wrap;">${cleanPersianText(item.body)}</div>
        ${stepLines.length ? `<div style="background:#FAF8F2; border:1px solid #E5DEC9; border-radius:12px; padding:14px; margin-bottom:14px;"><div style="font-weight:800; font-size:0.82em; color:#2D372E; margin-bottom:8px;">✓ مراحل اقدام دانش‌آموز:</div><ul style="list-style:none; padding:0; margin:0;">${stepsListHtml}</ul></div>` : ''}
        ${item.alternative ? `<div style="background:#FFF7ED; border:1px solid #FED7AA; border-radius:8px; padding:10px 12px; font-size:0.78em; color:#9A3412;"><strong>🔄 در صورت قطعی اینترنت:</strong> ${cleanPersianText(item.alternative)}</div>` : ''}
      </article>`;
    });

    const fullHtml = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.bookTitle} | ${meta.schoolName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800;900&display=swap');
    body { font-family: 'Vazirmatn', system-ui, Tahoma, sans-serif; background: #FAF8F2; color: #2D372E; margin: 0; padding: 20px; direction: rtl; line-height: 1.75; }
    .container { max-width: 800px; margin: 0 auto; }
    .header-strip { background: #ffffff; border: 1px solid #E5DEC9; border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-strip">
      <div style="font-size:0.85em; font-weight:800; color:#5A7A3F;">${meta.schoolName}</div>
      <h1 style="font-size:1.35em; font-weight:900; margin:6px 0; color:#2D372E;">${meta.bookTitle}</h1>
      <p style="font-size:0.85em; color:#5C6B5E; margin:0;">${meta.subtitle}</p>
      <div style="margin-top:12px; font-size:0.72em; background:#F3F7EE; color:#5A7A3F; border:1px solid #C8D9B5; display:inline-block; padding:3px 10px; border-radius:999px; font-weight:700;">✓ ۱۰۰٪ آفلاین و مستقل از اینترنت</div>
    </div>
    ${articlesHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.schoolName}-${meta.bookTitle}.html`.replace(/\s+/g, '-');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Required Checklist Validation
  const reqChecklist = [
    { label: '۱. عنوان بسته', done: Boolean(activeItem?.title?.trim()) },
    { label: '۲. خلاصه پیام', done: Boolean(activeItem?.summary?.trim()) },
    { label: '۳. مراحل اقدام', done: Boolean(activeItem?.steps?.trim()) },
    { label: '۴. شرح و راهنما', done: Boolean(activeItem?.body?.trim()) },
    { label: '۵. راهکار جایگزین', done: Boolean(activeItem?.alternative?.trim()) },
  ];
  const completedReqCount = reqChecklist.filter((r) => r.done).length;

  return (
    <div className="w-full bg-[#FAF8F2] rounded-3xl border border-[#E5DEC9] p-6 shadow-xs space-y-6 text-right dir-rtl font-sans" dir="rtl">
      {/* Header Banner - Javaneh & Aftab Aesthetic */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#E5DEC9]/60">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#7BA05B] text-white flex items-center justify-center text-xl shadow-xs ring-4 ring-[#7BA05B]/15 shrink-0">
            ☀️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] border border-[#C8D9B5]">
                ابزارک کتاب‌ساز آفتاب و جوانه
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#2D372E] mt-0.5">
              کارگاه تألیف کتابچه تعاملی و راهنمای مدرسه (Interactive Book Studio)
            </h3>
            <p className="text-xs text-[#5C6B5E] mt-0.5">
              ساخت بسته‌های یادگیری، ویراستاری ارقام ریاضی، مطالعه تعاملی دانش‌آموز و خروجی HTML آفلاین
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportHtmlBook}
            className="px-4 py-2 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل کتابچه (HTML مستقل)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#FAF6ED] p-1.5 rounded-2xl border border-[#E5DEC9]">
        <button
          type="button"
          onClick={() => {
            setActiveTab('library');
            sound.playPlantClick(480);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'library'
              ? 'bg-[#7BA05B] text-white shadow-xs'
              : 'text-[#5C6B5E] hover:text-[#2D372E] hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📚 مخزن بسته‌ها ({items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('editor');
            sound.playPlantClick(480);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-[#7BA05B] text-white shadow-xs'
              : 'text-[#5C6B5E] hover:text-[#2D372E] hover:bg-white/60'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>✏️ ویرایش بسته</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('reader');
            sound.playPlantClick(480);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'reader'
              ? 'bg-[#7BA05B] text-white shadow-xs'
              : 'text-[#5C6B5E] hover:text-[#2D372E] hover:bg-white/60'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>📖 مطالعه تعاملی دانش‌آموز</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('settings');
            sound.playPlantClick(480);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#7BA05B] text-white shadow-xs'
              : 'text-[#5C6B5E] hover:text-[#2D372E] hover:bg-white/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>⚙️ شناسنامه کتاب</span>
        </button>
      </div>

      {/* TAB 1: LIBRARY (مخزن بسته‌ها) */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#2D372E] text-sm">لیست بسته‌های آموزشی ثبت‌شده:</h4>
            <button
              type="button"
              onClick={handleCreateNewItem}
              className="px-3.5 py-1.5 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ایجاد بسته‌ی آموزشی جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item) => {
              const isSelected = activeItemId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-4 space-y-3 transition-all flex flex-col justify-between shadow-2xs ${
                    isSelected ? 'border-[#7BA05B] ring-2 ring-[#7BA05B]/20' : 'border-[#E5DEC9] hover:border-[#7BA05B]/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] text-[10px] font-bold border border-[#C8D9B5]">
                        🌱 {item.category} • پایه {item.grade}
                      </span>
                      <span className="text-[10px] text-[#5A7A3F] font-bold">
                        {item.status === 'published' ? '✓ آماده انتشار' : 'پیش‌نویس'}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-[#2D372E] line-clamp-2">{item.title}</h3>
                    <p className="text-[11px] text-[#5C6B5E] leading-relaxed line-clamp-2">{item.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-[#FAF6ED] flex items-center justify-between text-[11px]">
                    <span className="text-[#94A3B8]">مسئول: {item.responsible}</span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPlantClick(450);
                        setActiveItemId(item.id);
                        setActiveTab('editor');
                      }}
                      className="px-3 py-1 bg-[#F3F7EE] hover:bg-[#C8D9B5]/40 text-[#5A7A3F] font-bold rounded-lg border border-[#C8D9B5] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>ویرایش</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EDITOR (ویرایش بسته و ابزار ریاضی) */}
      {activeTab === 'editor' && activeItem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Editor Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5DEC9] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF6ED]">
              <h4 className="font-bold text-sm text-[#2D372E]">ویرایش محتوای بسته آموزشی</h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoFormatText}
                  className="px-2.5 py-1 bg-[#F3F7EE] hover:bg-[#C8D9B5]/40 text-[#5A7A3F] text-[11px] font-bold rounded-lg border border-[#C8D9B5] transition-all cursor-pointer flex items-center gap-1"
                >
                  <Type className="w-3 h-3" />
                  <span>ویراستاری ارقام و نیم‌فاصله</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(activeItem.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="حذف این بسته"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checklist Bar */}
            <div className="bg-[#FAF6ED] p-3 rounded-xl border border-[#E5DEC9] text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-[#5A7A3F]">
                <span>چک‌لیست کیفیت استاندارد آفتاب:</span>
                <span>{toPersianDigits(completedReqCount)} از ۵ تکمیل شده</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {reqChecklist.map((r, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      r.done
                        ? 'bg-[#F3F7EE] text-[#5A7A3F] border-[#C8D9B5]'
                        : 'bg-white text-[#94A3B8] border-[#E5DEC9]'
                    }`}
                  >
                    {r.done ? '✓ ' : '○ '}
                    {r.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Math Tool Snippets Bar */}
            <div className="bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A] text-xs space-y-1.5">
              <span className="font-bold text-[#92400E] block">✏️ درج سریع فرمول‌ها و کسر ریاضی:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleInsertMathSnippet('body', ' ۲⁄۵ ')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  ۲⁄۵ کسر
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMathSnippet('body', ' ² ')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  ² توان
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMathSnippet('body', ' √۱۶ ')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  √۱۶ رادیکال
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMathSnippet('body', '\u200C')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  + نیم‌فاصله
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">عنوان بسته آموزشی:</label>
                <input
                  type="text"
                  value={activeItem.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setItems(items.map((it) => (it.id === activeItem.id ? { ...it, title: val } : it)));
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#2D372E]">دسته‌بندی موضوعی:</label>
                  <input
                    type="text"
                    value={activeItem.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItems(items.map((it) => (it.id === activeItem.id ? { ...it, category: val } : it)));
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2D372E]">پایه تحصیلی:</label>
                  <select
                    value={activeItem.grade}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setItems(items.map((it) => (it.id === activeItem.id ? { ...it, grade: val } : it)));
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white outline-none font-semibold cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={g} value={g}>پایه {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">خلاصه یک‌جمله‌ای پیام:</label>
                <textarea
                  rows={2}
                  value={activeItem.summary}
                  onChange={(e) => {
                    const val = e.target.value;
                    setItems(items.map((it) => (it.id === activeItem.id ? { ...it, summary: val } : it)));
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white outline-none font-semibold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">توضیحات و راهنمای کامل درس:</label>
                <textarea
                  rows={5}
                  value={activeItem.body}
                  onChange={(e) => {
                    const val = e.target.value;
                    setItems(items.map((it) => (it.id === activeItem.id ? { ...it, body: val } : it)));
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white outline-none font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">مراحل اقدام دانش‌آموز (هر مورد در یک خط):</label>
                <textarea
                  rows={4}
                  value={activeItem.steps}
                  onChange={(e) => {
                    const val = e.target.value;
                    setItems(items.map((it) => (it.id === activeItem.id ? { ...it, steps: val } : it)));
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white outline-none font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2D372E]">🔄 راهکار جایگزین در قطعی اینترنت:</label>
                <input
                  type="text"
                  value={activeItem.alternative}
                  onChange={(e) => {
                    const val = e.target.value;
                    setItems(items.map((it) => (it.id === activeItem.id ? { ...it, alternative: val } : it)));
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E5DEC9] bg-white outline-none font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Card Pane */}
          <div className="lg:col-span-5 space-y-3 sticky top-6">
            <h4 className="font-bold text-xs text-[#5C6B5E]">پیش‌نمایش زنده کارت کتاب:</h4>

            <div className="bg-white rounded-2xl border border-[#E5DEC9] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#FAF6ED]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] text-[11px] font-bold border border-[#C8D9B5]">
                  🌱 {activeItem.category} • پایه {activeItem.grade}
                </span>
                <span className="text-[10px] text-[#94A3B8]">مسئول: {activeItem.responsible}</span>
              </div>

              <h3 className="font-bold text-sm text-[#2D372E]">{cleanPersianText(activeItem.title)}</h3>

              {activeItem.summary && (
                <div className="bg-[#FAF6ED] p-2.5 rounded-xl border-r-4 border-[#7BA05B] text-xs font-semibold text-[#2D372E]">
                  ✦ {cleanPersianText(activeItem.summary)}
                </div>
              )}

              <p className="text-xs text-[#3D4A3E] leading-relaxed whitespace-pre-wrap">
                {cleanPersianText(activeItem.body)}
              </p>

              {activeItem.steps && (
                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#E5DEC9] space-y-2 text-xs">
                  <span className="font-bold text-[#2D372E] block">✓ فهرست مراحل اقدام:</span>
                  <div className="space-y-1">
                    {activeItem.steps.split(/\r?\n/).filter(Boolean).map((st, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[#3D4A3E]">
                        <span className="w-4 h-4 rounded-full bg-white border border-[#C8D9B5] text-[#5A7A3F] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {toPersianDigits(idx + 1)}
                        </span>
                        <span>{st.replace(/^\s*[-*•\d.)]+\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeItem.alternative && (
                <div className="bg-[#FFF7ED] p-2.5 rounded-xl border border-[#FED7AA] text-[11px] text-[#9A3412]">
                  <strong>🔄 راهکار جایگزین:</strong> {activeItem.alternative}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT INTERACTIVE READER (مطالعه تعاملی دانش‌آموز) */}
      {activeTab === 'reader' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] text-center space-y-2 shadow-2xs">
            <span className="text-xs font-bold text-[#5A7A3F] block">{meta.schoolName}</span>
            <h2 className="text-xl font-black text-[#2D372E]">{meta.bookTitle}</h2>
            <p className="text-xs text-[#5C6B5E]">{meta.subtitle}</p>

            <div className="pt-3 flex items-center justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setReaderFontSize(Math.max(13, readerFontSize - 2))}
                className="px-2.5 py-1 bg-[#FAF6ED] rounded-lg border border-[#E5DEC9] font-bold cursor-pointer"
              >
                الف-
              </button>
              <span className="text-[11px] text-[#5C6B5E]">اندازه قلم ({readerFontSize}px)</span>
              <button
                type="button"
                onClick={() => setReaderFontSize(Math.min(22, readerFontSize + 2))}
                className="px-2.5 py-1 bg-[#FAF6ED] rounded-lg border border-[#E5DEC9] font-bold cursor-pointer"
              >
                الف+
              </button>
            </div>
          </div>

          <div className="space-y-4" style={{ fontSize: `${readerFontSize}px` }}>
            {items.filter((i) => i.status === 'published').map((item, itemIdx) => {
              const stepLines = item.steps.split(/\r?\n/).filter(Boolean);
              return (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-[#E5DEC9] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#FAF6ED]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F3F7EE] text-[#5A7A3F] font-bold border border-[#C8D9B5]">
                      🌱 {item.category} • پایه {item.grade}
                    </span>
                    <span className="text-[#94A3B8]">زمان مطالعه: {toPersianDigits(item.readTime)} دقیقه</span>
                  </div>

                  <h3 className="font-bold text-base text-[#2D372E]">{cleanPersianText(item.title)}</h3>

                  {item.summary && (
                    <div className="bg-[#FAF6ED] p-3 rounded-xl border-r-4 border-[#7BA05B] text-xs font-semibold text-[#2D372E]">
                      ✦ {cleanPersianText(item.summary)}
                    </div>
                  )}

                  <div className="text-xs text-[#3D4A3E] leading-relaxed whitespace-pre-wrap">
                    {cleanPersianText(item.body)}
                  </div>

                  {stepLines.length > 0 && (
                    <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#E5DEC9] space-y-2 text-xs">
                      <span className="font-bold text-[#2D372E] block">✓ چک‌لیست مراحل اقدام دانش‌آموز:</span>
                      <div className="space-y-2">
                        {stepLines.map((st, sIdx) => {
                          const key = `${itemIdx}-${sIdx}`;
                          const isDone = Boolean(checkedSteps[key]);
                          const cleanSt = st.replace(/^\s*[-*•\d.)]+\s*/, '');
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleToggleStepCheck(key)}
                              className={`w-full text-right p-2 rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
                                isDone
                                  ? 'bg-[#F3F7EE] border-[#C8D9B5] text-[#5A7A3F] line-through'
                                  : 'bg-white border-[#E5DEC9] text-[#2D372E]'
                              }`}
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-[#7BA05B] shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-[#94A3B8] shrink-0" />
                              )}
                              <span>{cleanSt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {item.alternative && (
                    <div className="bg-[#FFF7ED] p-2.5 rounded-xl border border-[#FED7AA] text-xs text-[#9A3412]">
                      <strong>🔄 راهکار جایگزین در شرایط قطع شبکه:</strong> {item.alternative}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS (شناسنامه و هویت کتاب) */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-[#E5DEC9] space-y-4 text-xs shadow-2xs">
          <h4 className="font-bold text-sm text-[#2D372E]">شناسنامه و هویت کتابچه مدرسه:</h4>

          <div className="space-y-1">
            <label className="font-bold text-[#2D372E]">نام مدرسه / مجتمع آموزشی:</label>
            <input
              type="text"
              value={meta.schoolName}
              onChange={(e) => setMeta({ ...meta, schoolName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] outline-none font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2D372E]">عنوان اصلی کتابچه:</label>
            <input
              type="text"
              value={meta.bookTitle}
              onChange={(e) => setMeta({ ...meta, bookTitle: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] outline-none font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2D372E]">زیرعنوان کتابچه:</label>
            <input
              type="text"
              value={meta.subtitle}
              onChange={(e) => setMeta({ ...meta, subtitle: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] outline-none font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2D372E]">پیام و توضیحات درباره مدرسه جهت مطالعه اولیا:</label>
            <textarea
              rows={3}
              value={meta.aboutSchool}
              onChange={(e) => setMeta({ ...meta, aboutSchool: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E5DEC9] outline-none font-semibold resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playJoyfulChime();
                setActiveTab('reader');
              }}
              className="w-full py-2.5 bg-[#7BA05B] hover:bg-[#5A7A3F] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              ذخیره و مشاهده کتابچه نهایی
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
