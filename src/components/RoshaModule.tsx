import React, { useState, useEffect, useRef } from 'react';
import {
  RoshaStage,
  RoshaMouth,
  TaskDefinition,
  RoshaEvent,
  ChildBottleneckState,
  matchDeterministicMouth,
  transitionBottleneckState,
  generateMorningReport,
  validateCartridgeRow,
  parseCartridgeCSV,
  convertRowToTask,
  toPersianDigits,
  toEnglishDigits,
  OutsourcingExcelRow,
  NULL_CODE,
} from '../utils/roshaEngine';
import { sound } from '../utils/audio';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  Download,
  Copy,
  ArrowRight,
  BookOpen,
  Upload,
  RefreshCw,
  FileText,
  Trash2,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

// ۳۳ تمرین رسمی و استاندارد ۶ پایه دبستان استخراج‌شده توسط سوپر گراک
const BASE_TASKS: TaskDefinition[] = [
  // ==========================================
  // پایه ۱ — الگوها و شمارش چندتا چندتا (گراک)
  // ==========================================
  {
    id: 'grok-g1-s1-1',
    grade: 1,
    chapter: 22,
    lesson: 'شمارش چهارتا چهارتا',
    stage: 'STAGE-1',
    factorA: 4,
    factorB: 3,
    expected: 12,
    promptText: 'در شمارش چهارتا چهارتا، عدد بعد از ۸ چیست؟',
    singleStepHint: 'یکی‌یکی جلو نرو. به اندازهٔ همان گام بپر.',
    expectedMouths: ['skip_count_error'],
  },
  {
    id: 'grok-g1-s1-2',
    grade: 1,
    chapter: 22,
    lesson: 'شمارش هفت‌تا هفت‌تا',
    stage: 'STAGE-1',
    factorA: 7,
    factorB: 2,
    expected: 14,
    promptText: 'در شمارش هفت‌تا هفت‌تا، عدد بعد از ۷ چیست؟',
    singleStepHint: 'یکی‌یکی جلو نرو. همان گام را دوباره بردار.',
    expectedMouths: ['skip_count_error'],
  },
  {
    id: 'grok-g1-s1-3',
    grade: 1,
    chapter: 22,
    lesson: 'شمارش هفت‌تا هفت‌تا',
    stage: 'STAGE-1',
    factorA: 7,
    factorB: 3,
    expected: 21,
    promptText: 'سومین عددِ شمارش هفت‌تا هفت‌تا، از ۷، چیست؟',
    singleStepHint: 'دو گام همان اندازه بردار. گام را یکی نکن.',
    expectedMouths: ['skip_count_error'],
  },
  {
    id: 'grok-g1-s1-4',
    grade: 1,
    chapter: 22,
    lesson: 'الگوی شش‌تا',
    stage: 'STAGE-1',
    factorA: 6,
    factorB: 3,
    expected: 18,
    promptText: 'در الگوی شش‌تا، عدد بعد از ۱۲ چیست؟',
    singleStepHint: 'یکی‌یکی جلو نرو. شش تا بپر.',
    expectedMouths: ['skip_count_error'],
  },
  {
    id: 'grok-g1-s1-5',
    grade: 1,
    chapter: 23,
    lesson: 'شمارش هشت‌تا هشت‌تا',
    stage: 'STAGE-1',
    factorA: 8,
    factorB: 2,
    expected: 16,
    promptText: 'در شمارش هشت‌تا هشت‌تا، عدد بعد از ۸ چیست؟',
    singleStepHint: 'یکی‌یکی جلو نرو. هشت تا بپر.',
    expectedMouths: ['skip_count_error'],
  },

  // ==========================================
  // پایه ۲
  // ==========================================
  {
    id: 'grok-g2-s3-1',
    grade: 2,
    chapter: 4,
    lesson: 'دسته‌های ده‌تایی',
    stage: 'STAGE-3',
    factorA: 9,
    factorB: 10,
    expected: 90,
    promptText: '۹ دستهٔ ده‌تایی چند تا است؟',
    singleStepHint: 'خود دسته‌ها را نشمار. هر دسته ده تا است.',
    expectedMouths: ['missing_tens'],
  },

  // پایه ۳ — مرحله ۱: دسته‌های مساوی و شمارش
  {
    id: 'grok-g3-s1-1',
    grade: 3,
    chapter: 4,
    lesson: 'دسته‌های مساوی',
    stage: 'STAGE-1',
    factorA: 3,
    factorB: 4,
    expected: 12,
    promptText: '۳ بسته، هر بسته ۴ تا. چند تا است؟',
    singleStepHint: 'دسته‌ها را کنار هم بچین. دو عدد را با هم جمع نکن.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'grok-g3-s1-2',
    grade: 3,
    chapter: 4,
    lesson: 'دسته‌های مساوی (۵تایی)',
    stage: 'STAGE-1',
    factorA: 4,
    factorB: 5,
    expected: 20,
    promptText: '۴ دستهٔ ۵تایی چند تا است؟',
    singleStepHint: 'پنج‌تا پنج‌تا پیش برو. دو عدد را با هم جمع نکن.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'grok-g3-s1-3',
    grade: 3,
    chapter: 4,
    lesson: 'دسته‌های مساوی (۷تایی)',
    stage: 'STAGE-1',
    factorA: 8,
    factorB: 7,
    expected: 56,
    promptText: '۸ دستهٔ ۷تایی چند تا است؟',
    singleStepHint: 'هفت‌تا هفت‌تا پیش برو. دو عدد را با هم جمع نکن.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'grok-g3-s1-4',
    grade: 3,
    chapter: 4,
    lesson: 'مفهوم چند برابر',
    stage: 'STAGE-1',
    factorA: 2,
    factorB: 3,
    expected: 6,
    promptText: 'حسین ۳ مهره دارد. علی ۲ برابر اوست. علی چند مهره دارد؟',
    singleStepHint: 'برابر یعنی همان دسته دوباره. دو عدد را با هم جمع نکن.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'grok-g3-s1-5',
    grade: 3,
    chapter: 4,
    lesson: 'شمارش جهشی روی محور',
    stage: 'STAGE-1',
    factorA: 7,
    factorB: 9,
    expected: 63,
    promptText: 'در شمارش نُه‌تا نُه‌تا، عدد بعد از ۵۴ چیست؟',
    singleStepHint: 'یکی‌یکی جلو نرو. به اندازهٔ همان گام بپر.',
    expectedMouths: ['skip_count_error'],
  },

  // پایه ۳ — مرحله ۲: شکستن و توزیع ضرب
  {
    id: 'grok-g3-s2-1',
    grade: 3,
    chapter: 4,
    lesson: 'شکستن عامل به ۵ و ۲',
    stage: 'STAGE-2',
    factorA: 5,
    factorB: 7,
    expected: 35,
    promptText: '۷ را به ۵ و ۲ بشکن و در ۵ ضرب کن.',
    singleStepHint: 'هر دو جزء را ضرب کن. یکی را رها نکن و جزءها را در هم ضرب نکن.',
    expectedMouths: ['half_split', 'missing_second_part'],
  },
  {
    id: 'grok-g3-s2-2',
    grade: 3,
    chapter: 4,
    lesson: 'شکستن عامل به ۵ و ۲',
    stage: 'STAGE-2',
    factorA: 8,
    factorB: 7,
    expected: 56,
    promptText: '۷ را به ۵ و ۲ بشکن و در ۸ ضرب کن.',
    singleStepHint: 'هر دو جزء را در ۸ ضرب کن. یکی را رها نکن.',
    expectedMouths: ['half_split', 'missing_second_part'],
  },

  // پایه ۳ — مرحله ۳: صفر، یک، ده‌تایی و عدد بزرگ‌تر
  {
    id: 'grok-g3-s3-1',
    grade: 3,
    chapter: 4,
    lesson: 'قاعده ضرب در یک',
    stage: 'STAGE-3',
    factorA: 1,
    factorB: 7,
    expected: 7,
    promptText: 'حاصل ۱ × ۷ را بنویس:',
    singleStepHint: 'ضرب در یک عدد را عوض نمی‌کند.',
    expectedMouths: ['one_mult_swapped'],
  },
  {
    id: 'grok-g3-s3-2',
    grade: 3,
    chapter: 8,
    lesson: 'قاعده ضرب در صفر',
    stage: 'STAGE-3',
    factorA: 18,
    factorB: 0,
    expected: 0,
    promptText: 'حاصل ۱۸ × ۰ را بنویس:',
    singleStepHint: 'هیچ دسته، تهی می‌ماند. عامل دیگر را به‌جای حاصل ننویس.',
    expectedMouths: ['zero_mult_cleared'],
  },
  {
    id: 'grok-g3-s3-3',
    grade: 3,
    chapter: 8,
    lesson: 'ضرب در ده و عدد بزرگ‌تر',
    stage: 'STAGE-3',
    factorA: 4,
    factorB: 23,
    expected: 92,
    promptText: 'حاصل ضرب ۴ × ۲۳ را بنویس:',
    singleStepHint: '۲۳ یعنی ۲۰ به‌علاوهٔ ۳. هر دو جزء را در ۴ ضرب کن.',
    expectedMouths: ['missing_second_part', 'missing_tens'],
  },
  {
    id: 'grok-g3-s3-4',
    grade: 3,
    chapter: 8,
    lesson: 'ارزش مکانی ده‌گان در ضرب',
    stage: 'STAGE-3',
    factorA: 21,
    factorB: 4,
    expected: 84,
    promptText: 'حاصل ضرب ۲۱ × ۴ را بنویس:',
    singleStepHint: 'دهگان را هم ضرب کن. فقط یکی‌ها کافی نیست.',
    expectedMouths: ['missing_tens'],
  },
  {
    id: 'grok-g3-s3-5',
    grade: 3,
    chapter: 8,
    lesson: 'مفهوم دوجین در ضرب',
    stage: 'STAGE-3',
    factorA: 4,
    factorB: 12,
    expected: 48,
    promptText: '۴ دوجین چند تا است؟',
    singleStepHint: 'دوجین را با ۴ جمع نکن. دستهٔ دوازده‌تایی را ۴ بار بچین.',
    expectedMouths: ['add_instead_of_mult'],
  },

  // پایه ۴ — مرحله ۱: هندسه و الگوهای ضرب
  {
    id: 'grok-g4-s1-1',
    grade: 4,
    chapter: 1,
    lesson: 'چند برابر ضلع مربع',
    stage: 'STAGE-1',
    factorA: 4,
    factorB: 4,
    expected: 16,
    promptText: '۴ بار ۴ چند می‌شود؟',
    singleStepHint: 'چهار بار دستهٔ چهارتایی. دو تا را با هم جمع نکن.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'grok-g4-s1-2',
    grade: 4,
    chapter: 1,
    lesson: 'ماشین ورودی-خروجی ضرب در دو',
    stage: 'STAGE-1',
    factorA: 2,
    factorB: 5,
    expected: 10,
    promptText: '۵ داخل ماشین ضرب‌در‌دو. بیرون چند می‌شود؟',
    singleStepHint: 'عدد را دو بار بگذار. ۲ را به آن اضافه نکن.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'grok-g4-s1-3',
    grade: 4,
    chapter: 1,
    lesson: 'محیط مثلث متساوی‌الاضلاع',
    stage: 'STAGE-1',
    factorA: 3,
    factorB: 2,
    expected: 6,
    promptText: 'ضلع مثلث ۲ است. محیط چند است؟',
    singleStepHint: 'سه ضلع برابر را بچین. ضلع را با ۳ جمع نکن.',
    expectedMouths: ['add_instead_of_mult'],
  },

  // ==========================================
  // پایه ۵ — کسر، مساحت، تناسب و درصد (گراک)
  // ==========================================
  {
    id: 'grok-g5-s1-1',
    grade: 5,
    chapter: 2,
    lesson: 'تکه‌های روبان',
    stage: 'STAGE-1',
    factorA: 3,
    factorB: 4,
    expected: 12,
    promptText: '۳ متر روبان است. هر تکه یک‌چهارم متر است. چند تکه می‌شود؟',
    singleStepHint: 'متر را با چهار جمع نکن. در هر متر چهار تکه بگذار.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'grok-g5-s1-2',
    grade: 5,
    chapter: 6,
    lesson: 'مساحت مثلث',
    stage: 'STAGE-1',
    factorA: 4,
    factorB: 5,
    expected: 20,
    promptText: 'مساحت مثلثی با قاعدهٔ ۸ سانتی‌متر و ارتفاع ۵ سانتی‌متر چند سانتی‌متر مربع است؟',
    singleStepHint: 'قاعده ضرب‌در ارتفاع تقسیم بر ۲. نصف حاصل ضرب (۴ × ۵) را حساب کن.',
    expectedMouths: ['half_split'],
  },
  {
    id: 'grok-g5-s2-1',
    grade: 5,
    chapter: 2,
    lesson: 'دو سوم کلاس',
    stage: 'STAGE-2',
    factorA: 2,
    factorB: 14,
    expected: 28,
    promptText: 'کلاس ۴۲ نفر است. دو سوم‌شان کتابخانه‌اند. چند نفرند؟',
    singleStepHint: 'اول سه قسمت کن. دو قسمت را بردار. نصف را برندار.',
    expectedMouths: ['half_split'],
  },
  {
    id: 'grok-g5-s2-2',
    grade: 5,
    chapter: 2,
    lesson: 'بسته‌های چای',
    stage: 'STAGE-2',
    factorA: 4,
    factorB: 5,
    expected: 20,
    promptText: '۴ کیلو چای در بسته‌های یک‌پنجم کیلو. چند بسته است؟',
    singleStepHint: 'هر کیلو را پنج بسته بگیر. خود عدد پنج را به‌جای همه ننویس.',
    expectedMouths: ['missing_second_part'],
  },
  {
    id: 'grok-g5-s2-3',
    grade: 5,
    chapter: 3,
    lesson: 'طول مستطیل',
    stage: 'STAGE-2',
    factorA: 5,
    factorB: 15,
    expected: 75,
    promptText: 'محیط مستطیل ۲۴۰ متر است و نسبت طول به عرض ۵ به ۳ است. طول مستطیل چند متر است؟',
    singleStepHint: 'اول محیط را نصف کن و به هشت قسمت تقسیم کن. پنج قسمت مال طول است.',
    expectedMouths: ['half_split'],
  },
  {
    id: 'grok-g5-s2-4',
    grade: 5,
    chapter: 5,
    lesson: 'ضرب اعداد اعشاری',
    stage: 'STAGE-2',
    factorA: 4,
    factorB: 7,
    expected: 28,
    promptText: 'حاصل ضرب ۰٫۴ × ۰٫۷ چند صدم می‌شود؟ (عدد صدم را بنویسید)',
    singleStepHint: 'ضرب ۴ × ۷ را انجام بده. تعداد اعشارها را به خاطر بسپار.',
    expectedMouths: ['missing_tens'],
  },
  {
    id: 'grok-g5-s3-1',
    grade: 5,
    chapter: 4,
    lesson: 'ده درصد تخفیف',
    stage: 'STAGE-3',
    factorA: 2,
    factorB: 10,
    expected: 20,
    promptText: 'از ۲۰۰ تومان، ۱۰ درصد کم می‌شود. مقدار تخفیف چند تومان است؟',
    singleStepHint: 'هر صد تومان ده تومان است. هر دو صد را حساب کن.',
    expectedMouths: ['missing_tens'],
  },
  {
    id: 'grok-g5-s3-2',
    grade: 5,
    chapter: 1,
    lesson: 'بسته‌های ۱۰ میلیونی',
    stage: 'STAGE-3',
    factorA: 5,
    factorB: 10,
    expected: 50,
    promptText: 'اگر هر ۱۰ میلیون یک بسته باشد، ۵ بسته چند میلیون می‌شود؟',
    singleStepHint: 'پنج بار ۱۰ میلیون را بشمار. صفرها را جا نینداز.',
    expectedMouths: ['missing_tens'],
  },

  // ==========================================
  // پایه ۶ — مضارب، هندسه، اعشار و تناسب (گراک)
  // ==========================================
  {
    id: 'grok-g6-s1-1',
    grade: 6,
    chapter: 1,
    lesson: 'مضرب پنج',
    stage: 'STAGE-1',
    factorA: 9,
    factorB: 5,
    expected: 45,
    promptText: 'نهمین مضرب ۵ چیست؟',
    singleStepHint: 'نُه بار پنج‌تا بپر. خود عدد نُه را ننویس.',
    expectedMouths: ['skip_count_error'],
  },
  {
    id: 'grok-g6-s1-2',
    grade: 6,
    chapter: 5,
    lesson: 'مساحت دایره با تقریب پی=۳',
    stage: 'STAGE-1',
    factorA: 16,
    factorB: 3,
    expected: 48,
    promptText: 'شعاع دایره‌ای ۴ سانتی‌متر است. با عدد پی تقریبی ۳، مساحت دایره چند سانتی‌متر مربع است؟',
    singleStepHint: 'شعاع را در خودش ضرب کن (۴ × ۴ = ۱۶)، سپس حاصل را ۳ برابر کن.',
    expectedMouths: ['skip_count_error'],
  },
  {
    id: 'grok-g6-s2-1',
    grade: 6,
    chapter: 1,
    lesson: 'چوب کبریت شکل',
    stage: 'STAGE-2',
    factorA: 4,
    factorB: 3,
    expected: 12,
    promptText: 'شکل چهارم چند چوب دارد، اگر چوب‌ها شمارهٔ شکل ضرب‌در ۳ باشند؟',
    singleStepHint: 'شماره را سه بار بگذار. خود شماره را ننویس.',
    expectedMouths: ['missing_second_part'],
  },
  {
    id: 'grok-g6-s2-2',
    grade: 6,
    chapter: 2,
    lesson: 'دو سوم بیست‌وچهار',
    stage: 'STAGE-2',
    factorA: 2,
    factorB: 8,
    expected: 16,
    promptText: 'دو سومِ ۲۴ چند است؟',
    singleStepHint: 'اول سه قسمت کن. دو قسمت را بردار. بر دو تقسیم نکن.',
    expectedMouths: ['half_split'],
  },
  {
    id: 'grok-g6-s2-3',
    grade: 6,
    chapter: 6,
    lesson: 'سهم دارو',
    stage: 'STAGE-2',
    factorA: 7,
    factorB: 4,
    expected: 28,
    promptText: 'دارو با نسبت ۷ و ۵ و ۳، روی هم ۶۰ گرم. سهم ۷ چند گرم است؟',
    singleStepHint: 'اول هر سه نسبت را با هم جمع کن. هر سه سهم را برابر نگیر.',
    expectedMouths: ['missing_second_part'],
  },
  {
    id: 'grok-g6-s2-4',
    grade: 6,
    chapter: 3,
    lesson: 'تقسیم عدد اعشاری بر اعشاری',
    stage: 'STAGE-2',
    factorA: 6,
    factorB: 1,
    expected: 6,
    promptText: 'حاصل تقسیم ۳٫۶ بر ۰٫۶ چند می‌شود؟',
    singleStepHint: 'هر دو عدد را ۱۰ برابر کن تا اعشار از بین برود (۳۶ تقسیم بر ۶).',
    expectedMouths: ['missing_second_part'],
  },
  {
    id: 'grok-g6-s3-1',
    grade: 6,
    chapter: 1,
    lesson: 'آبِ نان',
    stage: 'STAGE-3',
    factorA: 2,
    factorB: 1000,
    expected: 2000,
    promptText: 'هفته‌ای ۲ کیلو نان. هر کیلو بیش از ۱۰۰۰ لیتر آب. در هفته بیش از چند لیتر است؟',
    singleStepHint: 'هر دو کیلو را حساب کن. فقط یک کیلو را ننویس.',
    expectedMouths: ['missing_second_part'],
  },
  {
    id: 'grok-g6-s3-2',
    grade: 6,
    chapter: 3,
    lesson: 'ضرب در صد',
    stage: 'STAGE-3',
    factorA: 41,
    factorB: 10,
    expected: 410,
    promptText: '۲٫۴ به‌علاوهٔ ۱٫۷، بعد ضرب در ۱۰۰. حاصل چیست؟',
    singleStepHint: 'اول جمع کن. دو بار ده برابر کن، نه یک بار.',
    expectedMouths: ['missing_tens'],
  },
  {
    id: 'grok-g6-s3-3',
    grade: 6,
    chapter: 6,
    lesson: 'درصد سود',
    stage: 'STAGE-3',
    factorA: 150,
    factorB: 20,
    expected: 3000,
    promptText: 'کتاب ۱۵٬۰۰۰ تومان است. ۲۰ درصد سود چند تومان است؟',
    singleStepHint: 'بیست را به قیمت نچسبان. اول قیمت را صد قسمت کن.',
    expectedMouths: ['concat_digits'],
  },
  {
    id: 'grok-g6-s3-4',
    grade: 6,
    chapter: 7,
    lesson: 'تقریب و تخمین ضرب',
    stage: 'STAGE-3',
    factorA: 5,
    factorB: 50,
    expected: 250,
    promptText: 'طول ۵ زمین ۴۸ متری با تقریب گرد کردن ده‌گان تقریباً چند متر است؟',
    singleStepHint: 'اول ۴۸ را به ۵۰ گرد کن، سپس در ۵ ضرب کن.',
    expectedMouths: ['missing_tens'],
  },
];

// بسته آماده ۶ پایه برای تزریق نمونه
const SIX_GRADE_DEMO_TASKS: TaskDefinition[] = [
  ...BASE_TASKS,
  {
    id: 'task-g1-s1-1',
    stage: 'STAGE-1',
    grade: 1,
    chapter: 3,
    lesson: 'الگوی شمارش ۲ تا ۲ تا',
    factorA: 2,
    factorB: 3,
    expected: 6,
    promptText: '۲ بسته ۳ تایی چند تا می‌شود؟',
    singleStepHint: '۲ تا بسته را با انگشتانت بشمار.',
    expectedMouths: ['add_instead_of_mult'],
  },
  {
    id: 'task-g2-s1-1',
    stage: 'STAGE-1',
    grade: 2,
    chapter: 5,
    lesson: 'دسته‌بندی و جمع‌های مساوی',
    factorA: 3,
    factorB: 5,
    expected: 15,
    promptText: '۳ تا ۵ تا چند می‌شود؟',
    singleStepHint: 'سه دسته ۵تایی را کنار هم بگذار.',
    expectedMouths: ['skip_count_error'],
  },
  {
    id: 'task-g4-s2-1',
    stage: 'STAGE-2',
    grade: 4,
    chapter: 3,
    lesson: 'ضرب دو رقمی در دو رقمی',
    factorA: 4,
    factorB: 12,
    expected: 48,
    promptText: 'حاصل ضرب ۴ × ۱۲ را بنویس:',
    singleStepHint: '۱۲ را به ۱۰ و ۲ بشکن و ۴ را در هر دو ضرب کن.',
    expectedMouths: ['missing_tens'],
  },
  {
    id: 'task-g5-s2-1',
    stage: 'STAGE-2',
    grade: 5,
    chapter: 2,
    lesson: 'مفهوم مساحت و ضرب',
    factorA: 6,
    factorB: 8,
    expected: 48,
    promptText: 'مستطیلی به ابعاد ۶ در ۸ چند واحد مساحت دارد؟',
    singleStepHint: '۶ را به ۵ و ۱ بشکن یا جدول ضرب ۸تایی را مرور کن.',
    expectedMouths: ['half_split'],
  },
  {
    id: 'task-g6-s3-1',
    stage: 'STAGE-3',
    grade: 6,
    chapter: 3,
    lesson: 'محاسبات کسری و نسبتی',
    factorA: 8,
    factorB: 9,
    expected: 72,
    promptText: 'حاصل ضرب ۸ × ۹ را بنویس:',
    singleStepHint: 'از ضرب ۸ × ۱۰ کمک بگیر و یک ۸تا کم کن.',
    expectedMouths: ['skip_count_error'],
  },
];

const INITIAL_CHILDREN = [
  { id: 'c-1', name: 'علی' },
  { id: 'c-2', name: 'سارا' },
  { id: 'c-3', name: 'امیرعلی' },
  { id: 'c-4', name: 'روژان' },
  { id: 'c-5', name: 'کیان' },
];

export const RoshaModule: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  // Navigation: Morning (Teacher) or Evening (Student)
  const [activeView, setActiveView] = useState<'morning_teacher' | 'evening_student'>('evening_student');
  const [selectedStage, setSelectedStage] = useState<RoshaStage>('STAGE-1');
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [activeChildId, setActiveChildId] = useState<string>('c-1');
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [givenAnswer, setGivenAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [taskSuccess, setTaskSuccess] = useState<boolean>(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const fuseInputRef = useRef<HTMLInputElement>(null);
  const [outsourcingModalOpen, setOutsourcingModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'prompt_spec' | 'upload_register'>('upload_register');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Cartridge tasks state with persistence
  const [allTasks, setAllTasks] = useState<TaskDefinition[]>(() => {
    try {
      const stored = localStorage.getItem('rosha_custom_tasks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const baseIds = new Set(BASE_TASKS.map((t) => t.id));
          const customOnly = parsed.filter((t: TaskDefinition) => !baseIds.has(t.id) && !t.id.startsWith('task-g'));
          return [...BASE_TASKS, ...customOnly];
        }
      }
    } catch {
      // fallback
    }
    return BASE_TASKS;
  });

  // State for CSV upload & auto-registration
  const [rawCsvInput, setRawCsvInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{
    validRows: OutsourcingExcelRow[];
    invalidRows: Array<{ rowNumber: number; line: string; errors: string[] }>;
  } | null>(null);

  // Bottleneck states for all children in memory
  const [childStates, setChildStates] = useState<Record<string, ChildBottleneckState>>({
    'c-1': {
      lastNoteMouth: null,
      repeatCount: 0,
      status: 'clear',
      activeBottleneck: null,
      lastTaskId: null,
      history: [],
      completedToday: false,
    },
    'c-2': {
      lastNoteMouth: null,
      repeatCount: 0,
      status: 'clear',
      activeBottleneck: null,
      lastTaskId: null,
      history: [],
      completedToday: false,
    },
    'c-3': {
      lastNoteMouth: null,
      repeatCount: 0,
      status: 'clear',
      activeBottleneck: null,
      lastTaskId: null,
      history: [],
      completedToday: false,
    },
    'c-4': {
      lastNoteMouth: null,
      repeatCount: 0,
      status: 'clear',
      activeBottleneck: null,
      lastTaskId: null,
      history: [],
      completedToday: false,
    },
    'c-5': {
      lastNoteMouth: null,
      repeatCount: 0,
      status: 'clear',
      activeBottleneck: null,
      lastTaskId: null,
      history: [],
      completedToday: false,
    },
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter tasks for current grade and stage
  const matchingTasks = allTasks.filter(
    (t) => t.stage === selectedStage && (t.grade ? t.grade === selectedGrade : selectedGrade === 3)
  );

  const safeIndex = activeTaskIndex >= matchingTasks.length ? 0 : activeTaskIndex;

  // Child sees ONE task for the selected stage and grade (fallback if none)
  const currentTask: TaskDefinition = matchingTasks[safeIndex] || {
    id: `fallback-${selectedStage}`,
    stage: selectedStage,
    grade: selectedGrade,
    factorA: 3,
    factorB: 4,
    expected: 12,
    promptText: `حاصل ضرب ۳ × ۴ (پایه ${selectedGrade}):`,
    singleStepHint: 'بسته‌های مساوی را مجسم کن.',
  };

  const activeChild = INITIAL_CHILDREN.find((c) => c.id === activeChildId) || INITIAL_CHILDREN[0];
  const activeChildState = childStates[activeChildId];

  // Navigation handlers for tasks
  const handleNextTask = () => {
    if (safeIndex < matchingTasks.length - 1) {
      setActiveTaskIndex((prev) => prev + 1);
      setGivenAnswer('');
      setShowHint(false);
      setTaskSuccess(false);
      setLastAnswerCorrect(null);
      sound.playPlantClick(540);
      setTimeout(() => fuseInputRef.current?.focus(), 50);
    } else {
      showToast('به آخرین تمرین این مرحله رسیدید! آفرین 🌟');
    }
  };

  const handlePrevTask = () => {
    if (safeIndex > 0) {
      setActiveTaskIndex((prev) => prev - 1);
      setGivenAnswer('');
      setShowHint(false);
      setTaskSuccess(false);
      setLastAnswerCorrect(null);
      sound.playPlantClick(480);
      setTimeout(() => fuseInputRef.current?.focus(), 50);
    }
  };

  const handleKeypadPress = (digit: string) => {
    sound.playPlantClick(450);
    if (navigator.vibrate) navigator.vibrate(12);
    setGivenAnswer((prev) => toPersianDigits(prev + digit));
    setTaskSuccess(false);
    setLastAnswerCorrect(null);
  };

  const handleKeypadBackspace = () => {
    sound.playPlantClick(380);
    if (navigator.vibrate) navigator.vibrate(12);
    setGivenAnswer((prev) => prev.slice(0, -1));
    setTaskSuccess(false);
    setLastAnswerCorrect(null);
  };

  const handleKeypadClear = () => {
    sound.playPlantClick(300);
    if (navigator.vibrate) navigator.vibrate(15);
    setGivenAnswer('');
    setTaskSuccess(false);
    setLastAnswerCorrect(null);
  };

  // Submit student response in Evening View
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!givenAnswer.trim()) {
      // If user pressed Enter with empty input and previous was correct, go to next task!
      if (taskSuccess) {
        handleNextTask();
      }
      return;
    }

    sound.playPlantClick(520);

    const event: RoshaEvent = {
      childId: activeChildId,
      classId: `class-${selectedGrade}A`,
      stage: selectedStage,
      taskId: currentTask.id,
      given: givenAnswer.trim(),
      assisted: showHint,
      at: Date.now(),
    };

    const matchedMouth = matchDeterministicMouth(currentTask, givenAnswer.trim());
    const nextState = transitionBottleneckState(
      activeChildState || {
        lastNoteMouth: null,
        repeatCount: 0,
        status: 'clear',
        activeBottleneck: null,
        lastTaskId: null,
        history: [],
        completedToday: false,
      },
      event,
      matchedMouth
    );

    setChildStates((prev) => ({
      ...prev,
      [activeChildId]: nextState,
    }));

    const numericGiven = parseInt(toEnglishDigits(givenAnswer.trim()), 10);
    const isCorrect = numericGiven === currentTask.expected;

    if (isCorrect) {
      sound.playJoyfulChime();
      if (navigator.vibrate) navigator.vibrate([20, 40, 30]);
      setTaskSuccess(true);
      setLastAnswerCorrect(true);
      showToast('آفرین! فیوز با موفقیت متصل شد و جریان برقرار گشت. ⚡ برای تمرین بعدی کلید Enter ↵ را بزنید.');
    } else if (matchedMouth !== NULL_CODE) {
      sound.playGentlePluck(280);
      if (navigator.vibrate) navigator.vibrate(25);
      setTaskSuccess(false);
      setLastAnswerCorrect(false);
      showToast(
        nextState.status === 'open_bottleneck'
          ? 'پاسخ ثبت شد. این گره مفهومی در پرونده صبح معلم ثبت شد.'
          : 'فیوز متصل نشد؛ به راهنمای کارگاه دقت کن و دوباره تلاش کن.'
      );
    } else {
      sound.playGentlePluck(280);
      if (navigator.vibrate) navigator.vibrate(20);
      setTaskSuccess(false);
      setLastAnswerCorrect(false);
      showToast('فیوز در جای خود ننشست. مقدار را بررسی کن و دوباره امتحان کن.');
    }
  };

  // Keyboard navigation listener for PC/Desktop users
  useEffect(() => {
    if (activeView !== 'evening_student' || outsourcingModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT';

      if (e.key === 'Enter') {
        // If task was already completed successfully or answer is empty: Enter goes to NEXT!
        if (taskSuccess || !givenAnswer.trim()) {
          e.preventDefault();
          handleNextTask();
        }
      } else if (!isInput) {
        if (e.key === 'ArrowLeft' || e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          handleNextTask();
        } else if (e.key === 'ArrowRight' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          handlePrevTask();
        } else if (e.key === 'h' || e.key === 'H' || e.key === '؟' || e.key === '?') {
          e.preventDefault();
          setShowHint((prev) => !prev);
          sound.playGentlePluck(350);
        } else if (e.key === 'Escape') {
          setGivenAnswer('');
          setShowHint(false);
          setTaskSuccess(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, outsourcingModalOpen, taskSuccess, givenAnswer, safeIndex, matchingTasks.length]);

  // Handle CSV file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawCsvInput(text);
        const parsed = parseCartridgeCSV(text);
        setValidationResult(parsed);
        sound.playPlantClick(600);
      }
    };
    reader.readAsText(file);
  };

  // Validate raw text
  const handleValidateRawText = () => {
    if (!rawCsvInput.trim()) {
      showToast('لطفاً ابتدا متن یا فایل CSV را وارد کنید.');
      return;
    }
    const parsed = parseCartridgeCSV(rawCsvInput);
    setValidationResult(parsed);
    sound.playJoyfulChime();
    showToast(`بررسی انجام شد: ${parsed.validRows.length} ردیف معتبر و ${parsed.invalidRows.length} ردیف نامعتبر.`);
  };

  // Auto-register valid rows into task bank
  const handleRegisterValidTasks = () => {
    if (!validationResult || validationResult.validRows.length === 0) {
      showToast('هیچ ردیف معتبری برای ثبت یافت نشد.');
      return;
    }

    const newTasks = validationResult.validRows.map((row, idx) => convertRowToTask(row, allTasks.length + idx));
    const updated = [...allTasks, ...newTasks];
    setAllTasks(updated);
    try {
      localStorage.setItem('rosha_custom_tasks', JSON.stringify(updated));
    } catch {
      // ignore
    }

    sound.playJoyfulChime();
    showToast(`${newTasks.length} درس جدید با موفقیت در مخزن دروس سامانه ثبت شد! ✓`);
    setValidationResult(null);
    setRawCsvInput('');
    setOutsourcingModalOpen(false);
  };

  // Inject 6-Grade demo tasks
  const handleInjectSixGradeDemo = () => {
    setAllTasks(SIX_GRADE_DEMO_TASKS);
    try {
      localStorage.setItem('rosha_custom_tasks', JSON.stringify(SIX_GRADE_DEMO_TASKS));
    } catch {
      // ignore
    }
    sound.playJoyfulChime();
    showToast('بسته تمرینی استاندارد ۶ پایه با موفقیت تزریق شد! 🌱');
  };

  // Reset to default
  const handleResetTasks = () => {
    setAllTasks(BASE_TASKS);
    try {
      localStorage.removeItem('rosha_custom_tasks');
    } catch {
      // ignore
    }
    sound.playPlantClick(400);
    showToast('مخزن دروس به دروس پایه پیش‌فرض بازنشانی شد.');
  };

  // Generate 3-column morning report
  const morningReport = generateMorningReport(INITIAL_CHILDREN, childStates);

  // SuperGrok outsourcing prompt
  const superGrokPrompt = `[دستورالعمل استخراج و استانداردسازی محتوای آموزشی ۶ پایه ریاضی دبستان برای سوپر گراک]

شما دستیار ارشد تألیف و پژوهش برنامه درسی ریاضیات ابتدایی ایران (پایه‌های اول تا ششم دبستان) هستید.
وظیفه: طراحی محتوای آموزشی ساختاریافته به همراه تمارین گلوگاهی هر درس و نگاشت دقیق به ساختار شناختی استاندارد در قالب یک جدول CSV سازگار با اکسل.

سرستون‌های استاندارد فایل اکسل / CSV (دقیقاً ۱۴ ستون):
1. grade: شماره پایه (۱ تا ۶)
2. chapter: شماره فصل کتاب درسی
3. lesson: عنوان درس رسمی آموزش و پرورش
4. title: عنوان تخصصی و کاربردی تمرین
5. instructional_content: محتوای آموزشی، مدل شهودی و مفهوم کلیدی یادگیری درس
6. difficulty_level: سطح دشواری (یکی از این مقادیر: آسان | متوسط | پیشرفته)
7. exercise_type: نوع تمرین (یکی از این مقادیر: مفهومی | مجسم-تصویری | الگویابی | کلامی-مسئله | رویه‌ای-محاسباتی | کاربردی)
8. stage: کد مرحله فرآیندی (STAGE-1 دسته‌ها و الگو، STAGE-2 شکستن و توزیع، STAGE-3 صفر و یک و ده‌گان)
9. factorA: عدد عامل اول (یا گام پرش)
10. factorB: عدد عامل دوم (یا تعداد گام‌ها)
11. expected: حاصل قطعی و درست (حاصل ضرب factorA × factorB)
12. promptText: صورت سؤال تمرین با زبان روان و کودکانه
13. singleStepHint: حداکثر ۱ پله تذکر مفهومی (قانون طلایی: به هیچ وجه عدد حاصل expected نباید در این متن لو برود!)
14. expectedMouths: کد خطاهای شناختی هدف (جدا شده با سیمیکولن: add_instead_of_mult;skip_count_error;half_split;missing_second_part;zero_mult_cleared;one_mult_swapped;missing_tens;concat_digits;concat_final_sum)

قوانین حیاتی اعتبارسنجی:
- خروجی را فقط در قالب یک بلاک کد CSV استاندارد با سرستون‌های انگلیسی یا فارسی ارائه دهید.
- ارقام در ستون‌های عددی به انگلیسی تایپ شوند.
- مقدار expected باید دقیقاً برابر با حاصل ضرب factorA × factorB باشد.
- هیچ متنی پیش از بلاک کد یا بعد از آن ننویسید تا مستقیماً قابل ذخیره در فایل CSV باشد.`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 p-4 text-right" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-2xl shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FDE047]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Rosha v1.0 Title & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-white/90 rounded-3xl border border-[#CBD5E1] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#BE185D] to-[#F43F5E] flex items-center justify-center text-white text-2xl shadow-md">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-[#0F172A]">نسخهٔ روشا v1.0 — موتور قطعی ۹ دهان ضرب</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold border border-[#A7F3D0]">
                ایزوله و آفلاین
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              تشخیص قطعی بدون تخمین و مدل زبانی • ماشین وضعیت گره دو خطایی • گزارش ۳ ستونی صبح معلم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOutsourcingModalOpen(true)}
            className="px-3.5 py-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold rounded-xl border border-[#93C5FD] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>بارگذاری و قالب اکسل برون‌سپاری</span>
          </button>
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="px-3 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به جوانه</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Active Grade & Stage Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveView('evening_student');
              sound.playPlantClick(480);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'evening_student'
                ? 'bg-[#1E293B] text-white shadow-md'
                : 'bg-white text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            🌙 کار عصر دانش‌آموز (فقط ۱ کار)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('morning_teacher');
              sound.playJoyfulChime();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'morning_teacher'
                ? 'bg-[#1E293B] text-white shadow-md'
                : 'bg-white text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            ☀️ گزارش صبح معلم (۳ ستونی)
          </button>
          <a
            href="/bazi-kart.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center gap-1.5 shadow-xs border border-amber-400"
            title="باز کردن میزکار دانش‌آموز (bazi-kart.html)"
          >
            <span>🎴</span>
            <span>میزکار کودک (بازی کارت)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Grade & Stage Radios */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Grade Selector */}
          <div className="flex items-center gap-1 text-xs font-bold text-[#64748B]">
            <span>پایه:</span>
            {[1, 2, 3, 4, 5, 6].map((g) => {
              const count = allTasks.filter((t) => t.grade === g).length;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setSelectedGrade(g);
                    const gradeTasks = allTasks.filter((t) => t.grade === g);
                    if (gradeTasks.length > 0 && !gradeTasks.some((t) => t.stage === selectedStage)) {
                      setSelectedStage(gradeTasks[0].stage);
                    }
                    setActiveTaskIndex(0);
                    sound.playPlantClick(450 + g * 20);
                  }}
                  className={`px-2 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedGrade === g
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
                  }`}
                  title={`پایه ${g} (${count} تمرین استاندارد)`}
                >
                  <span>{toPersianDigits(g)}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1 rounded-full ${selectedGrade === g ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                      {toPersianDigits(count)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-[#CBD5E1]" />

          {/* Teacher's 3 Strict Radio Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#64748B] font-bold ml-1">مرحله کلاسی:</span>
            <button
              type="button"
              onClick={() => {
                setSelectedStage('STAGE-1');
                setActiveTaskIndex(0);
                sound.playPlantClick(440);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                selectedStage === 'STAGE-1'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-white text-[#0369A1] border border-[#BAE6FD] hover:bg-[#F0F9FF]'
              }`}
            >
              <span>۱. دسته‌ها (یک‌رقم)</span>
              {(() => {
                const c = allTasks.filter((t) => (t.grade === selectedGrade || (!t.grade && selectedGrade === 3)) && t.stage === 'STAGE-1').length;
                return c > 0 ? (
                  <span className={`text-[10px] px-1 rounded-full ${selectedStage === 'STAGE-1' ? 'bg-sky-800 text-white' : 'bg-sky-100 text-sky-800'}`}>
                    {toPersianDigits(c)}
                  </span>
                ) : null;
              })()}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStage('STAGE-2');
                setActiveTaskIndex(0);
                sound.playPlantClick(480);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                selectedStage === 'STAGE-2'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-white text-[#6D28D9] border border-[#DDD6FE] hover:bg-[#F5F3FF]'
              }`}
            >
              <span>۲. شکستن و توزیع</span>
              {(() => {
                const c = allTasks.filter((t) => (t.grade === selectedGrade || (!t.grade && selectedGrade === 3)) && t.stage === 'STAGE-2').length;
                return c > 0 ? (
                  <span className={`text-[10px] px-1 rounded-full ${selectedStage === 'STAGE-2' ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-800'}`}>
                    {toPersianDigits(c)}
                  </span>
                ) : null;
              })()}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStage('STAGE-3');
                setActiveTaskIndex(0);
                sound.playPlantClick(520);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                selectedStage === 'STAGE-3'
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'bg-white text-[#B45309] border border-[#FDE68A] hover:bg-[#FFFBEB]'
              }`}
            >
              <span>۳. صفر، یک و بزرگ‌تر</span>
              {(() => {
                const c = allTasks.filter((t) => (t.grade === selectedGrade || (!t.grade && selectedGrade === 3)) && t.stage === 'STAGE-3').length;
                return c > 0 ? (
                  <span className={`text-[10px] px-1 rounded-full ${selectedStage === 'STAGE-3' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    {toPersianDigits(c)}
                  </span>
                ) : null;
              })()}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: Evening Student Task (کار عصر دانش‌آموز - فقط ۱ کار)   */}
      {/* ============================================================== */}
      {activeView === 'evening_student' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E2E8F0] shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B]">نام دانش‌آموز:</span>
              <select
                value={activeChildId}
                onChange={(e) => {
                  setActiveChildId(e.target.value);
                  setGivenAnswer('');
                  setShowHint(false);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] outline-none"
              >
                {INITIAL_CHILDREN.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {matchingTasks.length > 1 && (
                <div className="flex items-center gap-1 bg-[#F8FAFC] px-2 py-1 rounded-xl border border-[#CBD5E1] text-[11px] font-bold">
                  <button
                    type="button"
                    disabled={safeIndex === 0}
                    onClick={() => {
                      setActiveTaskIndex((prev) => Math.max(0, prev - 1));
                      setGivenAnswer('');
                      setShowHint(false);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] disabled:opacity-30 cursor-pointer hover:bg-[#F1F5F9]"
                  >
                    « قبلی
                  </button>
                  <span className="text-[#64748B] px-1">
                    تمرین {safeIndex + 1} از {matchingTasks.length}
                  </span>
                  <button
                    type="button"
                    disabled={safeIndex >= matchingTasks.length - 1}
                    onClick={() => {
                      setActiveTaskIndex((prev) => Math.min(matchingTasks.length - 1, prev + 1));
                      setGivenAnswer('');
                      setShowHint(false);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] disabled:opacity-30 cursor-pointer hover:bg-[#F1F5F9]"
                  >
                    بعدی »
                  </button>
                </div>
              )}
              <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] font-bold">
                پایه {toPersianDigits(currentTask.grade || selectedGrade)} • {currentTask.lesson || 'تمرین ضرب'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-bold">
                {currentTask.stage}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARTOON POWER PLANT WORKSHOP CONTAINER (کارگاه نیروگاه)     */}
          {/* ========================================================= */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFFDF5] via-[#FFFBEB] to-[#FEF3C7]/40 border-3 border-[#FDE68A] shadow-[0_10px_25px_rgba(245,158,11,0.15)] space-y-6 overflow-hidden">
            {/* 4 Corner Mechanical Rivets/Bolts */}
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-600 border border-amber-700/80 shadow-inner flex items-center justify-center text-[8px] font-mono text-amber-900 select-none">
              🔩
            </div>
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-600 border border-amber-700/80 shadow-inner flex items-center justify-center text-[8px] font-mono text-amber-900 select-none">
              🔩
            </div>
            <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-600 border border-amber-700/80 shadow-inner flex items-center justify-center text-[8px] font-mono text-amber-900 select-none">
              🔩
            </div>
            <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-600 border border-amber-700/80 shadow-inner flex items-center justify-center text-[8px] font-mono text-amber-900 select-none">
              🔩
            </div>

            {/* Industrial Power Pipe Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-dashed border-[#FCD34D]/80">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center text-xs font-black shadow-xs">
                  ⚡
                </span>
                <span className="text-xs font-black text-[#78350F]">
                  کارگاه نیروگاه یادگیری • واحد تأمین انرژی ذهن
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#92400E]">
                <span className="inline-flex items-center gap-1 bg-[#FEF08A] px-2 py-0.5 rounded-full border border-[#FDE047]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  جریان برق متصل
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-[#FDE68A]">
                  {toPersianDigits(220)} ولت
                </span>
              </div>
            </div>

            {/* Math Prompt Display (Fixed HTML Tag Bug & Amber Highlight Box) */}
            <div className="text-center py-2 space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-bold">
                🔧 چالش تک‌گامی تعمیر نیروگاه • فقط ۱ کار بدون حواس‌پرتی
              </div>

              {/* Enhanced Prompt Display */}
              <div className="py-2">
                {(() => {
                  const raw = currentTask.promptText || '';
                  // ۱. رفع باگ تگ HTML: استخراج محتوا و حذف تگ‌های <span class="q">
                  const cleanHtml = raw.replace(/<span[^>]*class=["']?q["']?[^>]*>(.*?)<\/span>/gi, '$1');
                  // ۲. فارسی‌سازی کامل تمام ارقام
                  const persianText = toPersianDigits(cleanHtml);
                  // ۳. تفکیک علامت سؤال یا مجهول برای نمایش به صورت کارت برجسته کهربایی
                  const tokens = persianText.split(/([؟?]|\[\s*[؟?]\s*\])/g);

                  return (
                    <div className="flex flex-wrap items-center justify-center gap-2 text-2xl sm:text-3xl md:text-4xl font-black text-[#451A03] tracking-wide leading-relaxed">
                      {tokens.map((token, idx) => {
                        const isQuestionBox = token === '؟' || token === '?' || token.includes('؟') || token.includes('?');
                        if (isQuestionBox && token.trim().length > 0) {
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center justify-center px-4 py-1.5 mx-1.5 rounded-2xl bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#EAB308] text-[#78350F] font-black text-2xl sm:text-3xl shadow-[0_5px_0_#B45309,0_10px_20px_rgba(245,158,11,0.4)] border-2 border-[#FEF08A] ring-4 ring-[#FEF9C3] animate-bounce select-none"
                              title="جعبهٔ مجهول"
                            >
                              ؟
                            </span>
                          );
                        }
                        return <span key={idx}>{token}</span>;
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Power Plant Form: Fuse Dock, Mobile Keypad & 3D Spring Push Button */}
            <form onSubmit={handleSubmitAnswer} className="max-w-md mx-auto space-y-4">
              {/* محفظهٔ قرار دادن فیوز / باتری */}
              <div className="relative p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-[#78350F] via-[#92400E] to-[#451A03] border-4 border-[#F59E0B] shadow-[0_8px_0_#78350F,0_15px_25px_rgba(180,83,9,0.35)] space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#FDE047] font-mono px-2 pb-1.5 border-b border-amber-700/70">
                  <span className="flex items-center gap-1">⚡ <span>[+] ترمینال مثبت</span></span>
                  <span className="text-[11px] bg-amber-950/90 px-3 py-0.5 rounded-md border border-amber-500/50 text-amber-200 shadow-xs">
                    محفظه قرار دادن فیوز
                  </span>
                  <span className="flex items-center gap-1"><span>قطب منفی [-]</span> ⚡</span>
                </div>

                <div className="relative flex items-center">
                  <input
                    ref={fuseInputRef}
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={givenAnswer}
                    onChange={(e) => {
                      setGivenAnswer(toPersianDigits(e.target.value));
                      setTaskSuccess(false);
                      setLastAnswerCorrect(null);
                    }}
                    placeholder="عدد فیوز را بنویس یا از کیپد بزن..."
                    className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-[#1C1917] border-2 border-amber-500/80 text-center text-3xl sm:text-4xl font-black text-[#FDE047] placeholder-amber-700/60 placeholder:text-sm sm:placeholder:text-base placeholder:tracking-normal placeholder:font-normal outline-none shadow-inner tracking-widest focus:ring-4 focus:ring-amber-400/50 focus:border-amber-300 transition-all font-mono"
                  />
                </div>
              </div>

              {/* کیپد لمسی ارقام کارگاه (برای تبلت و موبایل اندروید/آیفون، و کلیک آسان در کامپیوتر) */}
              <div className="p-3 bg-[#FEF3C7]/90 rounded-2xl border-2 border-[#FDE68A] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#92400E] px-1">
                  <span>کیپد لمسی کارگاه:</span>
                  <span className="text-[10px] text-amber-700">لمسی یا کیبورد فیزیکی</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="py-3 sm:py-3.5 rounded-xl bg-white text-[#78350F] text-xl sm:text-2xl font-black border-2 border-amber-300 hover:bg-amber-50 active:translate-y-1 active:shadow-none shadow-[0_3px_0_#D97706] transition-all cursor-pointer flex items-center justify-center select-none"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleKeypadClear}
                    className="py-3 sm:py-3.5 rounded-xl bg-amber-100 text-[#92400E] text-xs font-black border-2 border-amber-300 hover:bg-amber-200 active:translate-y-1 active:shadow-none shadow-[0_3px_0_#B45309] transition-all cursor-pointer flex items-center justify-center select-none"
                  >
                    پاک‌کردن
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('۰')}
                    className="py-3 sm:py-3.5 rounded-xl bg-white text-[#78350F] text-xl sm:text-2xl font-black border-2 border-amber-300 hover:bg-amber-50 active:translate-y-1 active:shadow-none shadow-[0_3px_0_#D97706] transition-all cursor-pointer flex items-center justify-center select-none"
                  >
                    ۰
                  </button>
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    className="py-3 sm:py-3.5 rounded-xl bg-amber-100 text-[#92400E] text-base font-black border-2 border-amber-300 hover:bg-amber-200 active:translate-y-1 active:shadow-none shadow-[0_3px_0_#B45309] transition-all cursor-pointer flex items-center justify-center select-none"
                    title="حذف آخرین رقم"
                  >
                    ⌫
                  </button>
                </div>
              </div>

              {/* بنر موفقیت و کلید رفتن به تمرین بعدی با Enter */}
              {taskSuccess && (
                <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50 to-emerald-100/70 border-2 border-emerald-400 text-center space-y-2.5 animate-fade-in shadow-xs">
                  <div className="flex items-center justify-center gap-2 text-emerald-900 font-black text-sm sm:text-base">
                    <span className="text-2xl animate-bounce">⚡</span>
                    <span>فیوز متصل شد و جریان با موفقیت برقرار گشت!</span>
                    <span className="text-2xl">🌟</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextTask}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-[#10B981] via-[#059669] to-[#047857] hover:from-[#34D399] hover:to-[#059669] text-white font-black text-base shadow-[0_6px_0_#065F46,0_12px_20px_rgba(5,150,105,0.35)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
                  >
                    <span>⚡ رفتن به تمرین بعدی</span>
                    <span className="text-xs bg-emerald-900/40 px-2.5 py-0.5 rounded-md font-mono hidden sm:inline">Enter ↵</span>
                    <span className="text-xl">»</span>
                  </button>
                </div>
              )}

              {/* دکمهٔ اصلی ثبت و اتصال جریان */}
              {!taskSuccess && (
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-[#10B981] via-[#059669] to-[#047857] hover:from-[#34D399] hover:to-[#059669] text-white text-base sm:text-lg font-black border-2 border-[#6EE7B7] shadow-[0_8px_0_#065F46,0_15px_25px_rgba(5,150,105,0.4)] active:translate-y-2 active:shadow-[0_2px_0_#065F46] transition-all duration-75 cursor-pointer flex items-center justify-center gap-2 select-none group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">⚡</span>
                  <span>اتصال فیوز و ثبت نهایی جریان</span>
                  <span className="text-xs bg-emerald-900/40 px-2 py-0.5 rounded-md font-mono hidden sm:inline">Enter ↵</span>
                </button>
              )}

              {/* ناوبری سریع قبلی / بعدی زیر فرم */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={handlePrevTask}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold disabled:opacity-30 cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>« قبلی</span>
                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">(→)</span>
                </button>

                <span className="text-stone-500 font-bold text-[11px]">
                  تمرین {toPersianDigits(safeIndex + 1)} از {toPersianDigits(matchingTasks.length)}
                </span>

                <button
                  type="button"
                  disabled={safeIndex >= matchingTasks.length - 1}
                  onClick={handleNextTask}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold disabled:opacity-30 cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>بعدی »</span>
                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">(Enter / ←)</span>
                </button>
              </div>

              {/* آچار راهنمای مکانیکی کارگاه (۱ پله تذکر مفهومی) */}
              <div className="text-center pt-1">
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowHint(true);
                      sound.playGentlePluck(350);
                    }}
                    className="text-xs text-[#92400E] hover:text-[#78350F] font-bold bg-[#FEF08A] hover:bg-[#FDE047] px-3.5 py-1.5 rounded-xl border border-[#FCD34D] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>🔧 آچار راهنمای کارگاهی (کلید H)</span>
                  </button>
                ) : (
                  <div className="p-4 bg-white/95 rounded-2xl border-2 border-[#FCD34D] text-xs text-[#78350F] font-bold shadow-xs animate-fade-in text-right space-y-1">
                    <div className="flex items-center gap-1.5 text-[#B45309] font-black text-xs pb-1 border-b border-[#FEF3C7]">
                      <span>🔧 دستورالعمل تک‌مرحله‌ای تنظیم فیوز:</span>
                    </div>
                    <p className="leading-relaxed text-[#92400E] text-[12px] pt-1">
                      {toPersianDigits(currentTask.singleStepHint)}
                    </p>
                  </div>
                )}
              </div>

              {/* راهنمای کلیدهای میانبر در کامپیوتر */}
              <div className="hidden sm:flex items-center justify-center gap-3 text-[11px] text-[#92400E] font-medium pt-1">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] shadow-2xs font-mono text-[10px]">Enter ↵</kbd>
                  <span>ثبت و بعدی</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] shadow-2xs font-mono text-[10px]">← / →</kbd>
                  <span>تمرین بعدی / قبلی</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] shadow-2xs font-mono text-[10px]">H</kbd>
                  <span>آچار راهنما</span>
                </span>
              </div>
            </form>

            {/* Internal Transparent State Peek (برای معلم و ناظر، نه کودک) */}
            <div className="pt-4 border-t-2 border-dashed border-[#FDE68A] flex flex-wrap items-center justify-between text-[11px] text-[#78350F]">
              <div>
                <strong>وضعیت داخلی «{activeChild.name}»:</strong>{' '}
                {activeChildState?.status === 'clear' && <span className="text-[#059669] font-bold">روان و بدون گره (Clear)</span>}
                {activeChildState?.status === 'note' && (
                  <span className="text-[#D97706] font-bold">یادداشت ثبت شده (Note - خطای اول)</span>
                )}
                {activeChildState?.status === 'open_bottleneck' && (
                  <span className="text-[#DC2626] font-black">گره باز شده (Open Bottleneck)</span>
                )}
              </div>
              <div>
                تعداد تکرار خطای آشنا: {toPersianDigits(activeChildState?.repeatCount || 0)} بار • کل رخدادها:{' '}
                {toPersianDigits(activeChildState?.history.length || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: Teacher Morning Report (صبحانه معلم - ۳ ستونی)          */}
      {/* ============================================================== */}
      {activeView === 'morning_teacher' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#0F172A]">صبحانه معلم:</span>{' '}
              <span className="text-xs text-[#64748B]">
                گزارش وضعیت دیشب کلاس در ۳ ستون ایزوله (بدون درصد، رتبه و زمان سنجی).
              </span>
            </div>
            <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-lg">
              پایه {toPersianDigits(selectedGrade)} • {selectedStage}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: نیامده (Unvisited) */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>
                  <span>نیامده ({morningReport.unvisited.length})</span>
                </div>
                <span className="text-[10px] text-[#64748B]">بدون فعالیت دیشب</span>
              </div>

              {morningReport.unvisited.length === 0 ? (
                <p className="text-xs text-[#64748B] text-center py-4">همه دانش‌آموزان وارد شده‌اند.</p>
              ) : (
                <div className="space-y-2">
                  {morningReport.unvisited.map((row) => (
                    <div key={row.childId} className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
                      <div className="font-bold text-[#0F172A] mb-0.5">{row.childName}</div>
                      <p className="text-[#64748B] text-[11px] leading-relaxed">{row.sentence}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: مانده (Stuck in open bottleneck) */}
            <div className="bg-white rounded-3xl border-2 border-[#FECACA] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#FEE2E2]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#DC2626]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                  <span>مانده ({morningReport.stuck.length})</span>
                </div>
                <span className="text-[10px] text-[#DC2626] font-semibold bg-[#FEF2F2] px-2 py-0.5 rounded-full">
                  نیازمند گره‌گشایی
                </span>
              </div>

              {morningReport.stuck.length === 0 ? (
                <p className="text-xs text-[#10B981] text-center py-4 font-semibold">
                  هیچ دانش‌آموزی در گره تکراری نمانده است! 🌿
                </p>
              ) : (
                <div className="space-y-2">
                  {morningReport.stuck.map((row) => (
                    <div key={row.childId} className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FCA5A5] text-xs">
                      <div className="font-bold text-[#991B1B] mb-1 flex items-center justify-between">
                        <span>{row.childName}</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                      </div>
                      <p className="text-[#7F1D1D] text-[11px] leading-relaxed">{row.sentence}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: تمام (Completed) */}
            <div className="bg-white rounded-3xl border border-[#BBF7D0] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#DCFCE7]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#16A34A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
                  <span>تمام ({morningReport.completed.length})</span>
                </div>
                <span className="text-[10px] text-[#16A34A]">موفق و روان</span>
              </div>

              {morningReport.completed.length === 0 ? (
                <p className="text-xs text-[#94A3B8] text-center py-4">هنوز پاسخی ثبت نشده است.</p>
              ) : (
                <div className="space-y-2">
                  {morningReport.completed.map((row) => (
                    <div key={row.childId} className="p-3 bg-[#F0FDF4] rounded-xl border border-[#86EFAC] text-xs">
                      <div className="font-bold text-[#14532D] mb-0.5">{row.childName}</div>
                      <p className="text-[#166534] text-[11px] leading-relaxed">{row.sentence}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SuperGrok Outsourcing Prompt & Auto-Registration Pipeline */}
      {/* ============================================================== */}
      {outsourcingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setOutsourcingModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white rounded-3xl p-6 shadow-2xl border border-[#CBD5E1] space-y-4 text-right max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-[#2563EB]" />
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    الگوی استاندارد برون‌سپاری ۶ پایه و ثبت خودکار در سیستم
                  </h3>
                  <span className="text-xs text-[#64748B]">
                    تحویل پرامپت به هوش مصنوعی (SuperGrok) و بارگذاری مستقیم فایل خروجی
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOutsourcingModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
              <button
                type="button"
                onClick={() => setModalTab('upload_register')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'upload_register'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>بارگذاری و ثبت خودکار فایل اکسل / CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('prompt_spec')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'prompt_spec'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>پرامپت و مشخصات استاندارد ۱۴ ستون (SuperGrok)</span>
              </button>
            </div>

            {/* TAB 1: Upload & Auto-Register Pipeline */}
            {modalTab === 'upload_register' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] text-xs text-[#1E40AF] leading-relaxed">
                  🚀 <strong>مراحل کار:</strong> فایل خروجی سوپر گراک (CSV) را بارگذاری کنید یا متن جدول را در کادر زیر
                  قرار دهید. سیستم به صورت خودکار ردیف‌ها را اعتبارسنجی کرده و پس از تأیید در مخزن محتوای سامانه ثبت
                  می‌نماید.
                </div>

                {/* Download Template Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-[#CBD5E1]">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-[#2563EB]" />
                    <span>الگوهای استاندارد اکسل (CSV) جهت تحویل به گراک:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="/templates/SUPER_GROK_CURRICULUM_TEMPLATE.csv"
                      download="SUPER_GROK_CURRICULUM_TEMPLATE.csv"
                      className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold rounded-xl border border-[#BFDBFE] transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>الگوی استاندارد (انگلیسی)</span>
                    </a>
                    <a
                      href="/templates/SUPER_GROK_CURRICULUM_TEMPLATE_FA.csv"
                      download="SUPER_GROK_CURRICULUM_TEMPLATE_FA.csv"
                      className="px-3 py-1.5 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] text-xs font-bold rounded-xl border border-[#BBF7D0] transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>الگوی کاملاً فارسی (CSV)</span>
                    </a>
                  </div>
                </div>

                {/* Upload or Drop File */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 border-2 border-dashed border-[#CBD5E1] rounded-2xl text-center hover:bg-[#F8FAFC] transition-colors">
                    <Upload className="w-6 h-6 text-[#2563EB] mx-auto mb-2" />
                    <span className="block text-xs font-bold text-[#0F172A] mb-1">انتخاب فایل CSV یا متنی از رایانه</span>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-[#64748B] file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2563EB] file:text-white cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                    <div>
                      <span className="block text-xs font-bold text-[#0F172A] mb-1">عملیات سریع دمو و بازنشانی:</span>
                      <p className="text-[11px] text-[#64748B] mb-3">
                        تزریق نمونه دروس ۶ پایه یا پاکسازی دروس سفارشی
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleInjectSixGradeDemo}
                        className="flex-1 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        تزریق دروس ۶ پایه (دمو)
                      </button>
                      <button
                        type="button"
                        onClick={handleResetTasks}
                        className="py-2 px-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#DC2626] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        title="بازنشانی به حالت پیش‌فرض"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Text Paste Area */}
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    یا متن CSV خروجی را مستقیماً اینجا جای‌گذاری (Paste) کنید:
                  </label>
                  <textarea
                    value={rawCsvInput}
                    onChange={(e) => setRawCsvInput(e.target.value)}
                    rows={5}
                    placeholder="grade,chapter,lesson,stage,factorA,factorB,expected,promptText,singleStepHint,expectedMouths..."
                    className="w-full p-3 rounded-2xl bg-[#F8FAFC] text-xs font-mono border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                  />
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={handleValidateRawText}
                      className="px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>بررسی و اعتبارسنجی خودکار</span>
                    </button>
                  </div>
                </div>

                {/* Validation Results Report */}
                {validationResult && (
                  <div className="p-4 bg-white rounded-2xl border border-[#CBD5E1] space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] font-bold">
                          ✓ {validationResult.validRows.length} ردیف کاملاً استاندارد و معتبر
                        </span>
                        {validationResult.invalidRows.length > 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#DC2626] font-bold">
                            ✕ {validationResult.invalidRows.length} ردیف دارای خطای اعتبارسنجی
                          </span>
                        )}
                      </div>

                      {validationResult.validRows.length > 0 && (
                        <button
                          type="button"
                          onClick={handleRegisterValidTasks}
                          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>ثبت خودکار دروس معتبر در سیستم ({validationResult.validRows.length} درس)</span>
                        </button>
                      )}
                    </div>

                    {/* Invalid Rows Warnings */}
                    {validationResult.invalidRows.length > 0 && (
                      <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FECACA] text-xs text-[#991B1B] space-y-1">
                        <strong>موارد نیازمند اصلاح در فایل:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {validationResult.invalidRows.slice(0, 5).map((inv, idx) => (
                            <li key={idx}>
                              سطر {inv.rowNumber}: {inv.errors.join(' • ')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Preview Table of Valid Rows */}
                    {validationResult.validRows.length > 0 && (
                      <div className="max-h-48 overflow-y-auto border border-[#E2E8F0] rounded-xl">
                        <table className="w-full text-right text-[11px]">
                          <thead className="bg-[#F8FAFC] text-[#64748B] font-bold sticky top-0 border-b border-[#E2E8F0]">
                            <tr>
                              <th className="p-2">پایه</th>
                              <th className="p-2">درس</th>
                              <th className="p-2">مرحله</th>
                              <th className="p-2">عامل‌ها</th>
                              <th className="p-2">حاصل</th>
                              <th className="p-2">تذکر تک‌پله‌ای</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E8F0]">
                            {validationResult.validRows.map((r, i) => (
                              <tr key={i} className="hover:bg-[#F8FAFC]">
                                <td className="p-2 font-bold">{r.grade}</td>
                                <td className="p-2">{r.lesson}</td>
                                <td className="p-2">{r.stage}</td>
                                <td className="p-2 font-mono">
                                  {r.factorA} × {r.factorB}
                                </td>
                                <td className="p-2 font-bold text-[#2563EB] font-mono">{r.expected}</td>
                                <td className="p-2 text-[#475569]">{r.singleStepHint}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Prompt Spec for SuperGrok */}
            {modalTab === 'prompt_spec' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] text-xs text-[#1E40AF] leading-relaxed">
                  💡 <strong>راهنما:</strong> این متن پرامپت را کپی کرده و به SuperGrok تحویل دهید. مدل زبانی دقیقاً
                  جدول اکسل را با ۱۰ ستون استاندارد تولید خواهد کرد.
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#475569]">متن پرامپت آمادهٔ کپی برای SuperGrok:</label>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPlantClick(520);
                        navigator.clipboard.writeText(superGrokPrompt);
                        setCopiedPrompt(true);
                        setTimeout(() => setCopiedPrompt(false), 2500);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-bold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedPrompt ? 'کپی شد! ✓' : 'کپی پرامپت'}</span>
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={superGrokPrompt}
                    rows={8}
                    className="w-full p-3 rounded-2xl bg-[#0F172A] text-[#38BDF8] text-xs font-mono leading-relaxed outline-none border border-[#1E293B]"
                  />
                </div>

                {/* 14 Columns Table Specification */}
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] mb-1.5">
                    شرح ۱۴ ستون استاندارد خروجی اکسل / CSV (شامل ۷ ستون آموزشی و ۷ ستون عملیاتی):
                  </h4>
                  <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl max-h-72 overflow-y-auto">
                    <table className="w-full text-right text-[11px]">
                      <thead className="bg-[#F8FAFC] text-[#64748B] font-bold border-b border-[#E2E8F0] sticky top-0">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">نام ستون (English)</th>
                          <th className="p-2">عنوان فارسی</th>
                          <th className="p-2">نوع داده</th>
                          <th className="p-2">توضیح و نمونه</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        <tr className="bg-blue-50/40">
                          <td className="p-2 font-bold text-blue-700">۱</td>
                          <td className="p-2 font-mono font-bold text-blue-900">grade</td>
                          <td className="p-2 font-bold">پایه</td>
                          <td className="p-2">عدد ۱ تا ۶</td>
                          <td className="p-2">پایه تحصیلی (مثال: ۳)</td>
                        </tr>
                        <tr className="bg-blue-50/40">
                          <td className="p-2 font-bold text-blue-700">۲</td>
                          <td className="p-2 font-mono font-bold text-blue-900">chapter</td>
                          <td className="p-2 font-bold">فصل</td>
                          <td className="p-2">عدد صحیح</td>
                          <td className="p-2">شماره فصل کتاب درسی (مثال: ۴)</td>
                        </tr>
                        <tr className="bg-blue-50/40">
                          <td className="p-2 font-bold text-blue-700">۳</td>
                          <td className="p-2 font-mono font-bold text-blue-900">lesson</td>
                          <td className="p-2 font-bold">درس</td>
                          <td className="p-2">متن</td>
                          <td className="p-2">عنوان درس رسمی کتاب (مثال: مفهوم ضرب)</td>
                        </tr>
                        <tr className="bg-blue-50/40">
                          <td className="p-2 font-bold text-blue-700">۴</td>
                          <td className="p-2 font-mono font-bold text-blue-900">title</td>
                          <td className="p-2 font-bold">عنوان</td>
                          <td className="p-2">متن</td>
                          <td className="p-2">موضوع تخصصی تمرین (مثال: مدل‌سازی آرایه‌ای)</td>
                        </tr>
                        <tr className="bg-blue-50/40">
                          <td className="p-2 font-bold text-blue-700">۵</td>
                          <td className="p-2 font-mono font-bold text-blue-900">instructional_content</td>
                          <td className="p-2 font-bold">محتوای آموزشی</td>
                          <td className="p-2">متن مفهومی</td>
                          <td className="p-2">شرح مدل شهودی و هدف آموزشی کلیدی</td>
                        </tr>
                        <tr className="bg-blue-50/40">
                          <td className="p-2 font-bold text-blue-700">۶</td>
                          <td className="p-2 font-mono font-bold text-blue-900">difficulty_level</td>
                          <td className="p-2 font-bold">سطح دشواری</td>
                          <td className="p-2">آسان | متوسط | پیشرفته</td>
                          <td className="p-2">درجه پیچیدگی شناختی مسئله</td>
                        </tr>
                        <tr className="bg-blue-50/40">
                          <td className="p-2 font-bold text-blue-700">۷</td>
                          <td className="p-2 font-mono font-bold text-blue-900">exercise_type</td>
                          <td className="p-2 font-bold">نوع تمرین</td>
                          <td className="p-2">دسته‌بندی پداگوژیک</td>
                          <td className="p-2">مفهومی، مجسم-تصویری، الگویابی، رویه‌ای، کلامی</td>
                        </tr>
                        <tr>
                          <td className="p-2">۸</td>
                          <td className="p-2 font-mono font-bold">stage</td>
                          <td className="p-2">مرحله</td>
                          <td className="p-2 font-mono">STAGE-1..3</td>
                          <td className="p-2">کد مرحله فرآیندی پلتفرم</td>
                        </tr>
                        <tr>
                          <td className="p-2">۹</td>
                          <td className="p-2 font-mono font-bold">factorA</td>
                          <td className="p-2">عامل اول</td>
                          <td className="p-2">عدد صحیح</td>
                          <td className="p-2">عامل اول ضرب / گام پرش</td>
                        </tr>
                        <tr>
                          <td className="p-2">۱۰</td>
                          <td className="p-2 font-mono font-bold">factorB</td>
                          <td className="p-2">عامل دوم</td>
                          <td className="p-2">عدد صحیح</td>
                          <td className="p-2">عامل دوم ضرب / تعداد گام‌ها</td>
                        </tr>
                        <tr>
                          <td className="p-2">۱۱</td>
                          <td className="p-2 font-mono font-bold">expected</td>
                          <td className="p-2">حاصل</td>
                          <td className="p-2">عدد صحیح</td>
                          <td className="p-2">حاصل دقیق factorA × factorB</td>
                        </tr>
                        <tr>
                          <td className="p-2">۱۲</td>
                          <td className="p-2 font-mono font-bold">promptText</td>
                          <td className="p-2">صورت تمرین</td>
                          <td className="p-2">متن روان</td>
                          <td className="p-2">صورت مسأله برای دانش‌آموز</td>
                        </tr>
                        <tr>
                          <td className="p-2">۱۳</td>
                          <td className="p-2 font-mono font-bold">singleStepHint</td>
                          <td className="p-2">تذکر تک‌مرحله‌ای</td>
                          <td className="p-2 text-[#BE123C] font-semibold">تذکر مفهومی</td>
                          <td className="p-2 text-[#BE123C]">حداکثر ۱ پله تذکر اکیداً بدون لو دادن عدد حاصل</td>
                        </tr>
                        <tr>
                          <td className="p-2">۱۴</td>
                          <td className="p-2 font-mono font-bold">expectedMouths</td>
                          <td className="p-2">دهان خطا</td>
                          <td className="p-2 font-mono text-[10px]">کدهای سیمیکولن</td>
                          <td className="p-2 font-mono text-[10px]">add_instead_of_mult;skip_count_error</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playJoyfulChime();
                      const csvContent = `grade,chapter,lesson,stage,factorA,factorB,expected,promptText,singleStepHint,expectedMouths\n3,4,مفهوم دسته‌ها,STAGE-1,3,4,12,حاصل ضرب ۳ × ۴ را بنویس:,۳ دستهٔ ۴تایی را مجسم کن.,add_instead_of_mult;skip_count_error\n3,4,شکستن عامل‌ها,STAGE-2,7,6,42,حاصل ضرب ۷ × ۶ با شکستن ۷ به ۵ و ۲:,هم ۵ و هم ۲ را در ۶ ضرب کن.,half_split;missing_second_part\n3,4,ضرب عدد بزرگ‌تر,STAGE-3,3,14,42,حاصل ضرب ۳ × ۱۴:,۱۴ یعنی ۱۰ به علاوه ۴.,missing_tens;concat_digits;concat_final_sum\n1,3,شمارش دسته‌ای,STAGE-1,2,3,6,۲ بسته ۳تایی چند تاست؟,بسته‌ها را کنار هم بگذار.,add_instead_of_mult\n4,3,ضرب دو رقمی,STAGE-2,4,12,48,حاصل ۴ × ۱۲:,۱۲ را به ۱۰ و ۲ بشکن.,missing_tens`;
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'rosha-standard-template.csv';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود قالب اکسل (CSV) ۱۰ ستونه آماده</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setOutsourcingModalOpen(false)}
                className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
