// ============================================================================
// Math Curriculum Engine & Dynamic Question Generator
// Iranian Elementary Syllabus: Grades 1 to 6
// Strictly Pedagogy-Compliant (Grade 1 HAS NO MULTIPLICATION)
// ============================================================================

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface QuestionItem {
  id: string;
  grade: GradeLevel;
  chapter: number;
  chapterTitle: string;
  topic: string;
  questionText: string;
  visualType?: 'tally' | 'fractions' | 'clock' | 'sudoku' | 'angle' | 'integers' | 'cake_slice' | 'circuit' | 'place_value';
  visualData?: any;
  correctAnswer: string | number;
  options: (string | number)[];
  explanationFa: string;
  cognitiveErrorCode?: string;
  remedyHintFa?: string;
}

// Helper to shuffle options and ensure correct answer is included
function createOptions(correct: number | string, distractors: (number | string)[]): (number | string)[] {
  const set = new Set<string | number>();
  set.add(correct);
  for (const d of distractors) {
    if (d !== correct) set.add(d);
    if (set.size === 4) break;
  }
  // If we still don't have 4 options, generate numeric offsets if correct is a number
  if (typeof correct === 'number') {
    let offset = 1;
    while (set.size < 4) {
      const candidate: number = (correct as number) + offset;
      if (candidate > 0 && candidate !== correct) set.add(candidate);
      offset = offset > 0 ? -offset : -offset + 1;
    }
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

// ----------------------------------------------------------------------------
// EXTENSIVE CURRICULUM QUESTION BANK (30 STATIC HIGH-FIDELITY PROBLEMS)
// ----------------------------------------------------------------------------
export const STATIC_CURRICULUM_BANK: Record<GradeLevel, QuestionItem[]> = {
  1: [
    {
      id: 'g1-1',
      grade: 1,
      chapter: 1,
      chapterTitle: 'فصل ۱: شمارش و الگوهای اولیه',
      topic: 'چوب‌خط و دسته‌های ۵تایی',
      questionText: 'تعداد چوب‌خط‌های مقابل چند تا است؟ (||||  ||||  |||)',
      visualType: 'tally',
      visualData: { groupsOf5: 2, singles: 3 },
      correctAnswer: 13,
      options: [13, 12, 15, 10],
      explanationFa: '۲ دسته ۵تایی برابر ۱۰ است، به همراه ۳ چوب‌خط منفرد می‌شود ۱۳.',
      remedyHintFa: 'شمارش ۵تا۵تا: ۵، ۱۰ و سپس ۱۱، ۱۲، ۱۳.'
    },
    {
      id: 'g1-2',
      grade: 1,
      chapter: 2,
      chapterTitle: 'فصل ۲: مفهوم جمع تا ۱۰',
      topic: 'جمع‌های ترکیبی ملموس',
      questionText: 'حاصل عبارت ۴ + ۵ چند می‌شود؟',
      correctAnswer: 9,
      options: [9, 8, 10, 7],
      explanationFa: '۴ به اضافه ۵ برابر ۹ است.',
      remedyHintFa: 'از روی انگشتان یا چوب‌خط بشمار.'
    },
    {
      id: 'g1-3',
      grade: 1,
      chapter: 3,
      chapterTitle: 'فصل ۳: جدول شگفت‌انگیز (سودوکو ۴×۴)',
      topic: 'الگوی سطر و ستون',
      questionText: 'در سطر جدول شگفت‌انگیز [ ۲ | ۴ | ۱ | ؟ ] چه عددی قرار می‌گیرد؟',
      visualType: 'sudoku',
      visualData: { row: [2, 4, 1, null] },
      correctAnswer: 3,
      options: [3, 2, 1, 4],
      explanationFa: 'در سودوکوی ۴×۴، اعداد ۱ تا ۴ باید بدون تکرار قرار گیرند. عدد ۳ غایب بود.',
      remedyHintFa: 'عددی که در این سطر وجود ندارد ۳ است.'
    },
    {
      id: 'g1-4',
      grade: 1,
      chapter: 4,
      chapterTitle: 'فصل ۴: خواندن ساعت‌های تمام',
      topic: 'ساعت دیجیتال و عقربه‌ای',
      questionText: 'عقربه کوچک روی ۷ و عقربه بزرگ روی ۱۲ است. ساعت چند است؟',
      visualType: 'clock',
      visualData: { hour: 7, minute: 0 },
      correctAnswer: 'ساعت ۷',
      options: ['ساعت ۷', 'ساعت ۱۲', 'ساعت ۶', 'ساعت ۸'],
      explanationFa: 'وقتی عقربه بزرگ روی ۱۲ است، عقربه کوچک ساعت دقیق را نشان می‌دهد.',
      remedyHintFa: 'عقربه کوتاه نشان‌دهنده ساعت است.'
    },
    {
      id: 'g1-5',
      grade: 1,
      chapter: 5,
      chapterTitle: 'فصل ۵: ارزش مکانی (دهگان و یکان)',
      topic: 'بسته‌های ده‌تایی',
      questionText: '۱ بسته ده‌تایی و ۶ یکی برابر با چه عددی است؟',
      visualType: 'place_value',
      visualData: { tens: 1, ones: 6 },
      correctAnswer: 16,
      options: [16, 61, 10, 26],
      explanationFa: '۱۰ + ۶ = ۱۶.',
      remedyHintFa: 'دهگان سمت چپ و یکان سمت راست قرار می‌گیرد.'
    },
    {
      id: 'g1-6',
      grade: 1,
      chapter: 6,
      chapterTitle: 'فصل ۶: تفریق تا ۲۰',
      topic: 'کاهش و باقی‌مانده',
      questionText: 'اگر از ۱۵ سیب، ۴ تا را برداریم چند سیب باقی می‌ماند؟',
      correctAnswer: 11,
      options: [11, 12, 10, 19],
      explanationFa: '۱۵ - ۴ = ۱۱.',
      remedyHintFa: 'از ۱۵ چهار واحد به عقب بشمار: ۱۴، ۱۳، ۱۲، ۱۱.'
    }
  ],
  2: [
    {
      id: 'g2-1',
      grade: 2,
      chapter: 1,
      chapterTitle: 'فصل ۱: ارزش مکانی (صدگان، دهگان، یکان)',
      topic: 'ساخت اعداد ۳ رقمی',
      questionText: 'عدد «چهارصد و پنجاه و سه» از چند صدگان، دهگان و یکان تشکیل شده است؟',
      correctAnswer: '۴ صدگان، ۵ دهگان، ۳ یکان',
      options: ['۴ صدگان، ۵ دهگان، ۳ یکان', '۳ صدگان، ۵ دهگان، ۴ یکان', '۵ صدگان، ۴ دهگان، ۳ یکان', '۴ صدگان، ۳ دهگان، ۵ یکان'],
      explanationFa: 'عدد ۴۵۳ از ۴ صدتا، ۵ دهتا و ۳ یکی ساخته شده است.',
      remedyHintFa: 'به ترتیب از چپ: صدگان، دهگان، یکان.'
    },
    {
      id: 'g2-2',
      grade: 2,
      chapter: 2,
      chapterTitle: 'فصل ۲: جمع فرآیندی دو رقمی',
      topic: 'جمع‌های مرحله‌ای',
      questionText: 'حاصل جمع فرآیندی ۴۶ + ۳۳ کدام است؟',
      correctAnswer: 79,
      options: [79, 76, 89, 69],
      explanationFa: 'ابتدا دهگان‌ها: ۴۰ + ۳۰ = ۷۰، سپس یکان‌ها: ۶ + ۳ = ۹، حاصل کل: ۷۹.',
      remedyHintFa: 'ابتدا دهگان‌ها را با هم جمع کن.'
    },
    {
      id: 'g2-3',
      grade: 2,
      chapter: 3,
      chapterTitle: 'فصل ۳: اشکال هندسی و کاشی‌کاری',
      topic: 'خواص پنج‌ضلعی',
      questionText: 'یک پنج‌ضلعی دارای چند گوشه (زاویه) و چند ضلع است؟',
      correctAnswer: '۵ ضلع و ۵ گوشه',
      options: ['۵ ضلع و ۵ گوشه', '۵ ضلع و ۶ گوشه', '۶ ضلع و ۵ گوشه', '۴ ضلع و ۵ گوشه'],
      explanationFa: 'در پنج‌ضلعی تعداد ضلع‌ها و گوشه‌ها برابر ۵ است.',
      remedyHintFa: 'نام شکل نشان‌دهنده تعداد ضلع‌هاست.'
    },
    {
      id: 'g2-4',
      grade: 2,
      chapter: 4,
      chapterTitle: 'فصل ۴: مفهوم کسر (نیم و ربع)',
      topic: 'بخش‌های مساوی',
      questionText: 'یک پیتزا به ۴ قسمت مساوی تقسیم شده و ۱ قسمت آن خورده شده است. چه کسری خورده شده؟',
      visualType: 'fractions',
      visualData: { numerator: 1, denominator: 4 },
      correctAnswer: '۱/۴ (یک‌چهارم)',
      options: ['۱/۴ (یک‌چهارم)', '۱/۲ (یک‌دوم)', '۳/۴ (سه‌چهارم)', '۱/۳ (یک‌سوم)'],
      explanationFa: '۱ بخش از ۴ بخش مساوی برابر ۱/۴ یا ربع است.',
      remedyHintFa: 'صورت کسر تعداد بخش‌های خورده شده و مخرج کل بخش‌هاست.'
    },
    {
      id: 'g2-5',
      grade: 2,
      chapter: 5,
      chapterTitle: 'فصل ۵: شمارش چندتاچندتا',
      topic: 'دسته‌بندی‌های تکراری',
      questionText: '۳ دسته ۵تایی مدادرنگی کلاً چند مداد می‌شود؟',
      correctAnswer: 15,
      options: [15, 10, 20, 12],
      explanationFa: '۵ + ۵ + ۵ = ۱۵.',
      remedyHintFa: '۵تا۵تا سه بار بشمار: ۵، ۱۰، ۱۵.'
    }
  ],
  3: [
    {
      id: 'g3-1',
      grade: 3,
      chapter: 1,
      chapterTitle: 'فصل ۱: الگوها و الگوی پرشی',
      topic: 'شمارش ۸تا۸تا',
      questionText: 'الگو را ادامه دهید: ۸، ۱۶، ۲۴، ۳۲، ؟',
      correctAnswer: 40,
      options: [40, 38, 42, 36],
      explanationFa: 'الگوی پرشی ۸تا۸تا است. ۳۲ + ۸ = ۴۰.',
      remedyHintFa: 'به هر عدد ۸ واحد اضافه می‌شود.'
    },
    {
      id: 'g3-2',
      grade: 3,
      chapter: 2,
      chapterTitle: 'فصل ۲: جدول ضرب',
      topic: 'ضرب‌های پایه',
      questionText: 'حاصل ضرب ۷ × ۸ کدام است؟',
      correctAnswer: 56,
      options: [56, 48, 64, 54],
      explanationFa: '۷ × ۸ برابر ۵۶ است.',
      remedyHintFa: 'یادت باشد: ۵ × ۸ = ۴۰، دو ۸تایی دیگر اضافه می‌شود ۱۶ + ۴۰ = ۵۶.'
    },
    {
      id: 'g3-3',
      grade: 3,
      chapter: 3,
      chapterTitle: 'فصل ۳: مقایسه کسرها',
      topic: 'کسرهای با مخرج برابر',
      questionText: 'کدام کسر بزرگتر است؟ ۳/۷ یا ۵/۷؟',
      visualType: 'fractions',
      visualData: { f1: [3, 7], f2: [5, 7] },
      correctAnswer: '۵/۷',
      options: ['۵/۷', '۳/۷', 'هر دو برابرند', 'قابل مقایسه نیست'],
      explanationFa: 'وقتی مخرج‌ها برابرند، کسری که صورت بزرگتری دارد، بزرگتر است.',
      remedyHintFa: '۵ قسمت از ۷ قسمت بیشتر از ۳ قسمت از ۷ قسمت است.'
    },
    {
      id: 'g3-4',
      grade: 3,
      chapter: 4,
      chapterTitle: 'فصل ۴: محیط و مساحت',
      topic: 'مساحت مستطیل',
      questionText: 'مساحت یک مستطیل با طول ۶ سانتی‌متر و عرض ۴ سانتی‌متر چقدر است؟',
      correctAnswer: 24,
      options: [24, 20, 10, 36],
      explanationFa: 'مساحت مستطیل = طول × عرض = ۶ × ۴ = ۲۴ سانتی‌متر مربع.',
      remedyHintFa: 'فرمول مساحت مستطیل: طول ضربدر عرض.'
    },
    {
      id: 'g3-5',
      grade: 3,
      chapter: 5,
      chapterTitle: 'فصل ۵: آمار و نمودار ستونی',
      topic: 'بررسی داده‌های نمودار',
      questionText: 'در یک نمودار ستونی، ستون سیب ۱۰ و ستون پرتقال ۶ است. سیب چند تا بیشتر از پرتقال است؟',
      correctAnswer: 4,
      options: [4, 16, 6, 3],
      explanationFa: '۱۰ - ۶ = ۴.',
      remedyHintFa: 'اختلاف دو مقدار را با تفریق به دست آور.'
    }
  ],
  4: [
    {
      id: 'g4-1',
      grade: 4,
      chapter: 1,
      chapterTitle: 'فصل ۱: ارزش مکانی میلیون',
      topic: 'خواندن اعداد بزرگ',
      questionText: 'در عدد ۷,۳۵۰,۲۱۰ ارزش مکانی رقم ۳ چیست؟',
      correctAnswer: 'صدگان هزار',
      options: ['صدگان هزار', 'دهگان هزار', 'میلیون', 'یکان هزار'],
      explanationFa: 'رقم ۳ در مرتبه صدگان هزار جای دارد (۳۰۰,۰۰۰).',
      remedyHintFa: 'از سمت راست سه رقم سه رقم جدا کن.'
    },
    {
      id: 'g4-2',
      grade: 4,
      chapter: 2,
      chapterTitle: 'فصل ۲: اعداد مخلوط',
      topic: 'تبدیل کسر بزرگتر از واحد به مخلوط',
      questionText: 'کسر ۹/۴ برابر کدام عدد مخلوط است؟',
      visualType: 'fractions',
      visualData: { numerator: 9, denominator: 4 },
      correctAnswer: '۲ و ۱/۴',
      options: ['۲ و ۱/۴', '۲ و ۲/۴', '۱ و ۵/۴', '۳ و ۱/۴'],
      explanationFa: '۹ تقسیم بر ۴ می‌شود ۲ با باقی‌مانده ۱، پس ۲ واحد کامل و ۱/۴.',
      remedyHintFa: '۹ را بر ۴ تقسیم کن.'
    },
    {
      id: 'g4-3',
      grade: 4,
      chapter: 3,
      chapterTitle: 'فصل ۳: تقسیم چکشی با باقی‌مانده',
      topic: 'محاسبه خارج‌قسمت',
      questionText: 'خارج‌قسمت و باقی‌مانده تقسیم ۳۸ بر ۵ کدام است؟',
      correctAnswer: 'خارج قسم = ۷، باقی‌مانده = ۳',
      options: [
        'خارج قسم = ۷، باقی‌مانده = ۳',
        'خارج قسم = ۶، باقی‌مانده = ۸',
        'خارج قسم = ۷، باقی‌مانده = ۰',
        'خارج قسم = ۸، باقی‌مانده = ۲'
      ],
      explanationFa: '۵ × ۷ = ۳۵ و ۳۸ - ۳۵ = ۳.',
      remedyHintFa: 'نزدیک‌ترین مضرب ۵ به ۳۸، ۳۵ است.'
    },
    {
      id: 'g4-4',
      grade: 4,
      chapter: 4,
      chapterTitle: 'فصل ۴: شناخت زوایا',
      topic: 'زاویه حاده و منفرجه',
      questionText: 'زاویه‌ای که اندازه آن ۱۲۰ درجه باشد چه نوع زاویه‌ای است؟',
      visualType: 'angle',
      visualData: { degrees: 120 },
      correctAnswer: 'زاویه باز (منفرجه)',
      options: ['زاویه باز (منفرجه)', 'زاویه تند (حاده)', 'زاویه راست (قائمه)', 'زاویه نیم‌صفحه'],
      explanationFa: 'زاویه‌های بین ۹۰ تا ۱۸۰ درجه را زاویه باز یا منفرجه می‌گویند.',
      remedyHintFa: 'بزرگتر از ۹۰ درجه یعنی باز.'
    },
    {
      id: 'g4-5',
      grade: 4,
      chapter: 5,
      chapterTitle: 'فصل ۵: مساحت مثلث و متوازی‌الاضلاع',
      topic: 'مساحت مثلث',
      questionText: 'مساحت مثلثی با قاعده ۸ سانتی‌متر و ارتفاع ۵ سانتی‌متر چند سانتی‌متر مربع است؟',
      correctAnswer: 20,
      options: [20, 40, 13, 25],
      explanationFa: 'مساحت مثلث = (قاعده × ارتفاع) ÷ ۲ = (۸ × ۵) ÷ ۲ = ۴۰ ÷ ۲ = ۲۰.',
      remedyHintFa: 'فرمول: (قاعده × ارتفاع) تقسیم بر ۲.'
    }
  ],
  5: [
    {
      id: 'g5-1',
      grade: 5,
      chapter: 1,
      chapterTitle: 'فصل ۱: نسبت‌های مساوی',
      topic: 'تناسب و نسبت',
      questionText: 'نسبت ۳ به ۴ مساوی چه کسری با مخرج ۱۶ است؟',
      correctAnswer: '۱۲/۱۶',
      options: ['۱۲/۱۶', '۹/۱۶', '۱۰/۱۶', '۱۵/۱۶'],
      explanationFa: 'مخرج ۴ در ۴ ضرب شده، صورت ۳ هم در ۴ ضرب می‌شود = ۱۲.',
      remedyHintFa: 'صورت و مخرج را در یک عدد ضرب کن.'
    },
    {
      id: 'g5-2',
      grade: 5,
      chapter: 2,
      chapterTitle: 'فصل ۲: ضرب کسرها',
      topic: 'محاسبه ضرب کسری',
      questionText: 'حاصل ۳/۵ × ۲/۳ کدام است؟ (پس از ساده‌کردن)',
      visualType: 'fractions',
      visualData: { f1: [3, 5], f2: [2, 3] },
      correctAnswer: '۲/۵',
      options: ['۲/۵', '۶/۱۵', '۵/۸', '۱/۵'],
      explanationFa: '۳/۵ × ۲/۳ = ۶/۱۵ که با ساده کردن بر ۳ می‌شود ۲/۵.',
      remedyHintFa: 'عدد ۳ در صورت و مخرج با هم ساده می‌شوند.'
    },
    {
      id: 'g5-3',
      grade: 5,
      chapter: 3,
      chapterTitle: 'فصل ۳: درصد و تخفیف',
      topic: 'محاسبه درصد',
      questionText: '۲۵٪ از ۲۰۰,۰۰۰ تومان چقدر می‌شود؟',
      correctAnswer: '۵۰,۰۰۰ تومان',
      options: ['۵۰,۰۰۰ تومان', '۲۵,۰۰۰ تومان', '۱۰۰,۰۰۰ تومان', '۷۵,۰۰۰ تومان'],
      explanationFa: '۲۵٪ یعنی یک‌چهارم. ۲۰۰,۰۰۰ ÷ ۴ = ۵۰,۰۰۰ تومان.',
      remedyHintFa: '۲۵٪ همان ۱/۴ مقدار کل است.'
    },
    {
      id: 'g5-4',
      grade: 5,
      chapter: 4,
      chapterTitle: 'فصل ۴: اعداد اعشاری',
      topic: 'جمع اعداد اعشاری',
      questionText: 'حاصل ۴.۲۵ + ۳.۶ کدام است؟',
      correctAnswer: 7.85,
      options: [7.85, 7.31, 7.61, 8.85],
      explanationFa: '۴.۲۵ + ۳.۶۰ = ۷.۸۵.',
      remedyHintFa: 'ممیزها را زیر هم بگذار.'
    },
    {
      id: 'g5-5',
      grade: 5,
      chapter: 5,
      chapterTitle: 'فصل ۵: حجم و گنجایش',
      topic: 'تبدیل واحد حجم',
      questionText: '۳.۵ لیتر برابر چند سانتی‌متر مکعب (سی‌سی) است؟',
      correctAnswer: 3500,
      options: [3500, 350, 35000, 35],
      explanationFa: 'هر ۱ لیتر = ۱۰۰۰ سانتی‌متر مکعب، پس ۳.۵ × ۱۰۰۰ = ۳۵۰۰.',
      remedyHintFa: 'در ۱۰۰۰ ضرب کن.'
    }
  ],
  6: [
    {
      id: 'g6-1',
      grade: 6,
      chapter: 1,
      chapterTitle: 'فصل ۱: الگوی عددی و بخش‌پذیری',
      topic: 'بخش‌پذیری بر ۳ و ۹',
      questionText: 'کدام‌یک از اعداد زیر بر ۹ بخش‌پذیر است؟',
      correctAnswer: 729,
      options: [729, 542, 613, 804],
      explanationFa: 'مجموع ارقام ۷۲۹ برابر ۷ + ۲ + ۹ = ۱۸ است که بر ۹ بخش‌پذیر است.',
      remedyHintFa: 'مجموع ارقام باید بر ۹ بخش‌پذیر باشد.'
    },
    {
      id: 'g6-2',
      grade: 6,
      chapter: 2,
      chapterTitle: 'فصل ۲: اعداد صحیح',
      topic: 'جمع و تفریق علامت‌دار',
      questionText: 'حاصل عبارت (-۸) + (+۱۲) کدام است؟',
      visualType: 'integers',
      visualData: { start: -8, shift: 12 },
      correctAnswer: +4,
      options: [+4, -4, +20, -20],
      explanationFa: 'از ۸- روی محور ۱۲ واحد به راست می‌رویم تا به ۴+ برسیم.',
      remedyHintFa: 'چون علامت‌ها مخالف است، از هم کم کن و علامت بزرگتر را قرار بده.'
    },
    {
      id: 'g6-3',
      grade: 6,
      chapter: 3,
      chapterTitle: 'فصل ۳: تقسیم اعشاری',
      topic: 'حذف ممیز مقسوم‌علیه',
      questionText: 'حاصل ۴.۵ ÷ ۰.۵ کدام است؟',
      correctAnswer: 9,
      options: [9, 0.9, 90, 0.09],
      explanationFa: 'هر دو عدد را در ۱۰ ضرب می‌کنیم: ۴۵ ÷ ۵ = ۹.',
      remedyHintFa: 'ضرب در ۱۰ برای حذف اعشار.'
    },
    {
      id: 'g6-4',
      grade: 6,
      chapter: 4,
      chapterTitle: 'فصل ۴: دستگاه مختصات',
      topic: 'مختصات نقطه',
      questionText: 'مختصات نقطه‌ای که ۵ واحد روی محور افقی و ۲ واحد روی محور عمودی بالا می‌رود کدام است؟',
      correctAnswer: '[۵ , ۲]',
      options: ['[۵ , ۲]', '[۲ , ۵]', '[۷ , ۰]', '[۳ , ۳]'],
      explanationFa: 'در دستگاه مختصات [x , y] ابتدا مولفه افقی x=۵ و سپس عمودی y=۲ قرار می‌گیرد.',
      remedyHintFa: 'اول افقی (راست)، دوم عمودی (بالا).'
    },
    {
      id: 'g6-5',
      grade: 6,
      chapter: 5,
      chapterTitle: 'فصل ۵: مساحت دایره',
      topic: 'محاسبه مساحت دایره',
      questionText: 'مساحت دایره‌ای با شعاع ۵ سانتی‌متر چند سانتی‌متر مربع است؟ (عدد پی ≈ ۳.۱۴)',
      correctAnswer: 78.5,
      options: [78.5, 31.4, 15.7, 100],
      explanationFa: 'مساحت دایره = شعاع × شعاع × ۳.۱۴ = ۵ × ۵ × ۳.۱۴ = ۲۵ × ۳.۱۴ = ۷۸.۵.',
      remedyHintFa: 'شعاع × شعاع × ۳.۱۴.'
    }
  ]
};

// ----------------------------------------------------------------------------
// PROCEDURAL MATH QUESTION GENERATOR FOR INFINITE REPLAYABILITY
// ----------------------------------------------------------------------------
export function generateDynamicQuestion(grade: GradeLevel): QuestionItem {
  const timeId = Math.random().toString(36).substring(2, 7);

  if (grade === 1) {
    // Grade 1: STRICTLY NO MULTIPLICATION!
    const subType = Math.floor(Math.random() * 4);
    if (subType === 0) {
      // Tally Counting (groups of 5)
      const g5 = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const s = Math.floor(Math.random() * 4) + 1;  // 1 to 4
      const ans = g5 * 5 + s;
      return {
        id: `dyn-g1-tally-${timeId}`,
        grade: 1,
        chapter: 1,
        chapterTitle: 'فصل ۱: شمارش و الگوهای اولیه',
        topic: 'چوب‌خط‌های ترکیبی',
        questionText: `تعداد چوب‌خط‌های مقابل چند تا است؟ (${'|||| '.repeat(g5)} ${'|'.repeat(s)})`,
        visualType: 'tally',
        visualData: { groupsOf5: g5, singles: s },
        correctAnswer: ans,
        options: createOptions(ans, [ans - 1, ans + 2, ans + 5]),
        explanationFa: `${g5} دسته ۵تایی برابر ${g5 * 5} و ${s} چوب‌خط منفرد برابر ${ans} است.`
      };
    } else if (subType === 1) {
      // Addition within 15
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 7) + 1;
      const ans = a + b;
      return {
        id: `dyn-g1-add-${timeId}`,
        grade: 1,
        chapter: 2,
        chapterTitle: 'فصل ۲: جمع و تفریق تا ۲۰',
        topic: 'جمع‌های ملموس',
        questionText: `حاصل عبارت ${a} + ${b} چند است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [ans + 1, ans - 1, ans + 2]),
        explanationFa: `${a} به اضافه ${b} برابر ${ans} است.`
      };
    } else if (subType === 2) {
      // Clock full hours
      const h = Math.floor(Math.random() * 12) + 1;
      const ans = `ساعت ${h}`;
      return {
        id: `dyn-g1-clock-${timeId}`,
        grade: 1,
        chapter: 4,
        chapterTitle: 'فصل ۴: ساعت و زمان',
        topic: 'خواندن ساعت عقربه‌ای',
        questionText: `عقربه کوچک روی ${h} و عقربه بزرگ روی ۱۲ است. ساعت چند است؟`,
        visualType: 'clock',
        visualData: { hour: h, minute: 0 },
        correctAnswer: ans,
        options: createOptions(ans, [`ساعت ${(h % 12) + 1}`, `ساعت ${h === 1 ? 12 : h - 1}`, 'ساعت ۱۲']),
        explanationFa: `عقربه کوتاه روی ${h} قرار دارد، بنابراین ساعت ${h} است.`
      };
    } else {
      // Place Value tens and ones
      const tens = 1;
      const ones = Math.floor(Math.random() * 9) + 1;
      const ans = tens * 10 + ones;
      return {
        id: `dyn-g1-place-${timeId}`,
        grade: 1,
        chapter: 5,
        chapterTitle: 'فصل ۵: ارزش مکانی',
        topic: 'دسته‌های ده‌تایی و یکی',
        questionText: `${tens} بسته ده‌تایی و ${ones} یکی برابر با چه عددی است؟`,
        visualType: 'place_value',
        visualData: { tens, ones },
        correctAnswer: ans,
        options: createOptions(ans, [ones * 10 + tens, ans + 10, 10 + ones + 2]),
        explanationFa: `۱۰ + ${ones} = ${ans}.`
      };
    }
  }

  if (grade === 2) {
    const subType = Math.floor(Math.random() * 3);
    if (subType === 0) {
      // 3-digit place value
      const h = Math.floor(Math.random() * 7) + 2;
      const t = Math.floor(Math.random() * 8) + 1;
      const o = Math.floor(Math.random() * 9) + 1;
      const ans = `${h} صدگان، ${t} دهگان، ${o} یکان`;
      const num = h * 100 + t * 10 + o;
      return {
        id: `dyn-g2-pv-${timeId}`,
        grade: 2,
        chapter: 1,
        chapterTitle: 'فصل ۱: ارزش مکانی صدگان',
        topic: 'اجزای اعداد سه رقمی',
        questionText: `عدد ${num} شامل چه اجزایی است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [
          `${o} صدگان، ${t} دهگان، ${h} یکان`,
          `${t} صدگان، ${h} دهگان، ${o} یکان`,
          `${h} صدگان، ${o} دهگان، ${t} یکان`
        ]),
        explanationFa: `در عدد ${num}، رقم صدگان ${h}، دهگان ${t} و یکان ${o} است.`
      };
    } else if (subType === 1) {
      // Process addition
      const a = Math.floor(Math.random() * 40) + 20;
      const b = Math.floor(Math.random() * 30) + 15;
      const ans = a + b;
      return {
        id: `dyn-g2-add-${timeId}`,
        grade: 2,
        chapter: 2,
        chapterTitle: 'فصل ۲: جمع و تفریق فرآیندی',
        topic: 'جمع‌های دو رقمی',
        questionText: `حاصل جمع فرآیندی ${a} + ${b} کدام است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [ans + 10, ans - 5, ans + 2]),
        explanationFa: `دهگان‌ها: ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${Math.floor(a/10)*10 + Math.floor(b/10)*10}، یکان‌ها: ${a%10} + ${b%10} = ${(a%10)+(b%10)}، کل = ${ans}.`
      };
    } else {
      // Basic groups
      const g = Math.floor(Math.random() * 4) + 2;
      const count = Math.floor(Math.random() * 4) + 2;
      const ans = g * count;
      return {
        id: `dyn-g2-group-${timeId}`,
        grade: 2,
        chapter: 5,
        chapterTitle: 'فصل ۵: شمارش و دسته‌بندی',
        topic: 'تعداد کل اشیاء',
        questionText: `اگر ${g} دسته ${count} تایی سیب داشته باشیم، کلاً چند سیب داریم؟`,
        correctAnswer: ans,
        options: createOptions(ans, [ans + count, ans - 1, g + count]),
        explanationFa: `${g} دسته ${count}تایی برابر با ${ans} است.`
      };
    }
  }

  if (grade === 3) {
    const subType = Math.floor(Math.random() * 3);
    if (subType === 0) {
      // Multiplication table
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = a * b;
      return {
        id: `dyn-g3-mult-${timeId}`,
        grade: 3,
        chapter: 2,
        chapterTitle: 'فصل ۲: جدول ضرب',
        topic: 'ضرب اعداد تک‌رقمی',
        questionText: `حاصل ضرب ${a} × ${b} کدام است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [ans + a, ans - b, (a + 1) * b]),
        explanationFa: `${a} ضربدر ${b} برابر با ${ans} است.`
      };
    } else if (subType === 1) {
      // Skip counting
      const step = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      const start = step * 2;
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const ans = start + step * 4;
      return {
        id: `dyn-g3-skip-${timeId}`,
        grade: 3,
        chapter: 1,
        chapterTitle: 'فصل ۱: الگوهای پرشی',
        topic: `شمارش ${step}تا${step}تا`,
        questionText: `الگوی عددی مقابل را ادامه دهید: ${seq.join('، ')}، ؟`,
        correctAnswer: ans,
        options: createOptions(ans, [ans - 2, ans + step, ans + 1]),
        explanationFa: `الگوی پرشی ${step}تا${step}تا است. ${seq[3]} + ${step} = ${ans}.`
      };
    } else {
      // Rectangle Area
      const l = Math.floor(Math.random() * 6) + 4;
      const w = Math.floor(Math.random() * 5) + 2;
      const ans = l * w;
      return {
        id: `dyn-g3-area-${timeId}`,
        grade: 3,
        chapter: 4,
        chapterTitle: 'فصل ۴: محیط و مساحت',
        topic: 'مساحت مستطیل',
        questionText: `مساحت مستطیلی با طول ${l} سانتی‌متر و عرض ${w} سانتی‌متر چند سانتی‌متر مربع است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [l + w, (l + w) * 2, ans + l]),
        explanationFa: `مساحت مستطیل = طول × عرض = ${l} × ${w} = ${ans}.`
      };
    }
  }

  if (grade === 4) {
    const subType = Math.floor(Math.random() * 3);
    if (subType === 0) {
      // Triangle Area
      const b = (Math.floor(Math.random() * 5) + 2) * 2; // Even base
      const h = Math.floor(Math.random() * 6) + 3;
      const ans = (b * h) / 2;
      return {
        id: `dyn-g4-tri-${timeId}`,
        grade: 4,
        chapter: 5,
        chapterTitle: 'فصل ۵: مساحت اشکال',
        topic: 'مساحت مثلث',
        questionText: `مساحت مثلثی با قاعده ${b} سانتی‌متر و ارتفاع ${h} سانتی‌متر چقدر است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [b * h, ans + 4, ans - 2]),
        explanationFa: `مساحت مثلث = (قاعده × ارتفاع) ÷ ۲ = (${b} × ${h}) ÷ ۲ = ${ans}.`
      };
    } else if (subType === 1) {
      // Division with remainder
      const div = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const q = Math.floor(Math.random() * 6) + 4;   // 4 to 9
      const rem = Math.floor(Math.random() * (div - 1)) + 1; // 1 to div-1
      const num = div * q + rem;
      const ans = `خارج قسم = ${q}، باقی‌مانده = ${rem}`;
      return {
        id: `dyn-g4-div-${timeId}`,
        grade: 4,
        chapter: 3,
        chapterTitle: 'فصل ۳: تقسیم با باقی‌مانده',
        topic: 'تقسیم چکشی',
        questionText: `خارج‌قسمت و باقی‌مانده تقسیم ${num} بر ${div} کدام است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [
          `خارج قسم = ${q - 1}، باقی‌مانده = ${rem + div}`,
          `خارج قسم = ${q}، باقی‌مانده = ۰`,
          `خارج قسم = ${q + 1}، باقی‌مانده = ${rem}`
        ]),
        explanationFa: `${div} × ${q} = ${div * q} و ${num} - ${div * q} = ${rem}.`
      };
    } else {
      // Mixed fractions
      const d = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const whole = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const numRem = Math.floor(Math.random() * (d - 1)) + 1;
      const totalNum = whole * d + numRem;
      const ans = `${whole} و ${numRem}/${d}`;
      return {
        id: `dyn-g4-mixed-${timeId}`,
        grade: 4,
        chapter: 2,
        chapterTitle: 'فصل ۲: اعداد مخلوط',
        topic: 'تبدیل کسر بزرگتر از واحد',
        questionText: `کسر ${totalNum}/${d} برابر با کدام عدد مخلوط است؟`,
        visualType: 'fractions',
        visualData: { numerator: totalNum, denominator: d },
        correctAnswer: ans,
        options: createOptions(ans, [
          `${whole} و ${(numRem % d) + 1}/${d}`,
          `${whole + 1} و ${numRem}/${d}`,
          `۱ و ${totalNum - d}/${d}`
        ]),
        explanationFa: `${totalNum} تقسیم بر ${d} می‌شود ${whole} با باقی‌مانده ${numRem}.`
      };
    }
  }

  if (grade === 5) {
    const subType = Math.floor(Math.random() * 3);
    if (subType === 0) {
      // Percentage
      const pct = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const total = (Math.floor(Math.random() * 5) + 1) * 100000; // 100k to 500k
      const ansNum = (total * pct) / 100;
      const ans = `${ansNum.toLocaleString('fa-IR')} تومان`;
      return {
        id: `dyn-g5-pct-${timeId}`,
        grade: 5,
        chapter: 3,
        chapterTitle: 'فصل ۳: درصد و تخفیف',
        topic: 'محاسبه درصد تخفیف',
        questionText: `کالایی به قیمت ${total.toLocaleString('fa-IR')} تومان دارای ${pct}٪ تخفیف است. مبلغ تخفیف چقدر است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [
          `${(ansNum / 2).toLocaleString('fa-IR')} تومان`,
          `${(ansNum * 1.5).toLocaleString('fa-IR')} تومان`,
          `${(total - ansNum).toLocaleString('fa-IR')} تومان`
        ]),
        explanationFa: `${pct}٪ از ${total.toLocaleString('fa-IR')} برابر با (${pct} ÷ ۱۰۰) × ${total} = ${ansNum.toLocaleString('fa-IR')} تومان است.`
      };
    } else if (subType === 1) {
      // Decimal Addition
      const a1 = (Math.floor(Math.random() * 50) + 10) / 10;
      const a2 = (Math.floor(Math.random() * 40) + 5) / 100;
      const ans = parseFloat((a1 + a2).toFixed(2));
      return {
        id: `dyn-g5-dec-${timeId}`,
        grade: 5,
        chapter: 4,
        chapterTitle: 'فصل ۴: اعداد اعشاری',
        topic: 'جمع اعداد اعشاری',
        questionText: `حاصل عبارت ${a1} + ${a2} کدام است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [
          parseFloat((ans + 0.1).toFixed(2)),
          parseFloat((ans - 0.2).toFixed(2)),
          parseFloat((ans + 1).toFixed(2))
        ]),
        explanationFa: `با قرار دادن ممیزها زیر هم: ${a1} + ${a2} = ${ans}.`
      };
    } else {
      // Capacity Liters to cm3
      const liters = (Math.floor(Math.random() * 8) + 1) * 0.5;
      const ans = liters * 1000;
      return {
        id: `dyn-g5-vol-${timeId}`,
        grade: 5,
        chapter: 5,
        chapterTitle: 'فصل ۵: حجم و گنجایش',
        topic: 'تبدیل واحد گنجایش',
        questionText: `${liters} لیتر آب برابر با چند سانتی‌متر مکعب است؟`,
        correctAnswer: ans,
        options: createOptions(ans, [ans / 10, ans * 10, ans + 500]),
        explanationFa: `هر ۱ لیتر = ۱۰۰۰ سانتی‌متر مکعب، پس ${liters} × ۱۰۰۰ = ${ans}.`
      };
    }
  }

  // Grade 6
  const subType = Math.floor(Math.random() * 3);
  if (subType === 0) {
    // Divisibility
    const ans = [45, 90, 135, 180, 225, 270][Math.floor(Math.random() * 6)];
    return {
      id: `dyn-g6-div-${timeId}`,
      grade: 6,
      chapter: 1,
      chapterTitle: 'فصل ۱: بخش‌پذیری',
      topic: 'بخش‌پذیری همزمان بر ۳ و ۵',
      questionText: `کدام‌یک از اعداد زیر هم بر ۳ و هم بر ۵ بخش‌پذیر است؟`,
      correctAnswer: ans,
      options: createOptions(ans, [ans + 2, ans + 4, ans - 1]),
      explanationFa: `عدد ${ans} یکانش ۰ یا ۵ است (بخش‌پذیر بر ۵) و مجموع ارقامش بر ۳ بخش‌پذیر است.`
    };
  } else if (subType === 1) {
    // Integer line arithmetic
    const start = -Math.floor(Math.random() * 6) - 2; // -2 to -7
    const shift = Math.floor(Math.random() * 10) + 4; // 4 to 13
    const ansNum = start + shift;
    const ans = ansNum > 0 ? `+${ansNum}` : `${ansNum}`;
    return {
      id: `dyn-g6-int-${timeId}`,
      grade: 6,
      chapter: 2,
      chapterTitle: 'فصل ۲: اعداد صحیح',
      topic: 'جمع روی محور اعداد',
      questionText: `حاصل عبارت (${start}) + (+${shift}) کدام است؟`,
      visualType: 'integers',
      visualData: { start, shift },
      correctAnswer: ans,
      options: createOptions(ans, [
        ansNum > 0 ? `-${ansNum}` : `+${Math.abs(ansNum)}`,
        `+${shift - start}`,
        `-${shift + Math.abs(start)}`
      ]),
      explanationFa: `از ${start} روی محور تعداد ${shift} واحد به سمت راست حرکت کرده و به ${ans} می‌رسیم.`
    };
  } else {
    // Circle Area
    const r = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const ans = parseFloat((r * r * 3.14).toFixed(2));
    return {
      id: `dyn-g6-circle-${timeId}`,
      grade: 6,
      chapter: 5,
      chapterTitle: 'فصل ۵: مساحت دایره',
      topic: 'محاسبه مساحت با عدد پی ۳.۱۴',
      questionText: `مساحت دایره‌ای با شعاع ${r} سانتی‌متر چند سانتی‌متر مربع است؟ (عدد پی ≈ ۳.۱۴)`,
      correctAnswer: ans,
      options: createOptions(ans, [
        parseFloat((r * 2 * 3.14).toFixed(2)),
        parseFloat((ans + 10).toFixed(2)),
        parseFloat((r * r * 3).toFixed(2))
      ]),
      explanationFa: `مساحت دایره = شعاع × شعاع × ۳.۱۴ = ${r} × ${r} × ۳.۱۴ = ${ans}.`
    };
  }
}

// Get mixed list of questions for a specific grade
export function getQuestionsForGrade(grade: GradeLevel, count: number = 10): QuestionItem[] {
  const staticList = STATIC_CURRICULUM_BANK[grade] || STATIC_CURRICULUM_BANK[3];
  const list = [...staticList];
  
  // Fill remaining count with dynamic generated questions
  while (list.length < count) {
    list.push(generateDynamicQuestion(grade));
  }
  return list;
}
