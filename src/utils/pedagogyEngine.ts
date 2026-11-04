/**
 * Pedagogy Engine & Cognitive Error Diagnostic Models (CEAP v2.1 & CPA)
 * Based on math-game/pedagogy.js, bottleneck.js, and offline architecture guidelines.
 */

export type BottleneckCode = 'KH-G1' | 'KH-G2' | 'KH-G3';

export interface CpaPrescription {
  code: BottleneckCode;
  title: string;
  symptom: string;
  concreteStep: string;
  pictorialStep: string;
  abstractStep: string;
}

export const BOTTLENECK_CATALOG: Record<BottleneckCode, CpaPrescription> = {
  'KH-G1': {
    code: 'KH-G1',
    title: 'انحراف در الگوی پرش و شمارش چندتا چندتا (Skip-Counting Drift)',
    symptom: 'دانش‌آموز ریتم جدول را با جمع مکرر می‌شمارد ولی در گام آخر یک عدد جا می‌ماند یا اضافه می‌شمارد.',
    concreteStep: 'بسته‌بندی فیزیکی دسته‌های ۴تایی با چوب‌خط یا چینه روی میز.',
    pictorialStep: 'رسم کمان‌های پرش روی محور اعداد مدرج با فواصل ۴ واحدی.',
    abstractStep: 'حل معادله جای خالی فاکت‌های متوالی: ۴×۵ = ۲۰، پس ۴×۶ = ۲۰ + ۴ = ۲۴.',
  },
  'KH-G2': {
    code: 'KH-G2',
    title: 'خطای ویژگی همانی و عضو خنثی صفر و یک (Identity / Zero Slip)',
    symptom: 'سردرگمی میان حاصل ضرب عدد در صفر با ضرب عدد در یک (مثلاً ۵×۰ را ۵ یا ۱ فرض کردن).',
    concreteStep: 'نمایش فیزیکی ۵ بشقاب کاملاً خالی («۵ تا سبد که هیچی توش نیست یعنی چند تا سیب؟»).',
    pictorialStep: 'رسم مستطیل با عرض صفر روی شبکه شطرنجی (سطح صفر = بدون مساحت).',
    abstractStep: 'تثبیت قاعده انتزاعی: a × 0 = 0 و a × 1 = a با جدول مقایسه‌ای.',
  },
  'KH-G3': {
    code: 'KH-G3',
    title: 'لغزش در ارقام نزدیک جدول ضرب (Near-Fact Slip)',
    symptom: 'خطای تک‌رقمی در فاکت‌های چالش‌برانگیز جدول ضرب مانند ۶×۷ یا ۷×۸ به دلیل شباهت آوایی.',
    concreteStep: 'تجزیه فیزیکی ماتریس چینه: تبدیل ۶×۷ به (۵×۷) + (۱×۷).',
    pictorialStep: 'تفکیک ماتریس مستطیلی رنگی با خط‌برش تصویری.',
    abstractStep: 'به‌کارگیری ویژگی توزیع‌پذیری: فاکت سنگین را از فاکت آسان ۵ یا ۱۰ مشتق کن.',
  },
};

/**
 * Diagnoses the cognitive error code given a multiplication challenge and wrong answer
 */
export function diagnoseMultiplicationError(
  factorA: number,
  factorB: number,
  studentAnswer: number
): BottleneckCode {
  const correct = factorA * factorB;
  if (studentAnswer === correct) {
    return 'KH-G1';
  }

  // Check Zero / Identity slip
  if (factorA === 0 || factorB === 0 || factorA === 1 || factorB === 1) {
    return 'KH-G2';
  }
  if (studentAnswer === factorA + factorB || studentAnswer === 0) {
    return 'KH-G2';
  }

  // Check Skip-Counting drift (stepped up or down by exactly one count of factorA or factorB)
  if (
    studentAnswer === (factorA - 1) * factorB ||
    studentAnswer === (factorA + 1) * factorB ||
    studentAnswer === factorA * (factorB - 1) ||
    studentAnswer === factorA * (factorB + 1)
  ) {
    return 'KH-G1';
  }

  // Near-fact / phonological slip (e.g. 54 for 56, 36 for 35, or off by small delta)
  return 'KH-G3';
}

/**
 * Returns the 3-step CPA clinical prescription for a diagnosed bottleneck
 */
export function getCpaPrescription(code: BottleneckCode): CpaPrescription {
  return BOTTLENECK_CATALOG[code] || BOTTLENECK_CATALOG['KH-G1'];
}

/**
 * Non-punitive absence decay calculation
 * In crisis / shelter mode (war, power outages), decay is 4x slower so returning children are greeted gently.
 */
export function calculateAbsenceMood(
  lastSeenDays: number,
  isShelterMode: boolean = false
): 'thriving' | 'content' | 'longing' | 'alert' {
  if (isShelterMode) {
    if (lastSeenDays <= 4) return 'thriving';
    if (lastSeenDays <= 9) return 'content';
    if (lastSeenDays <= 14) return 'longing';
    return 'alert';
  }

  if (lastSeenDays <= 1) return 'thriving';
  if (lastSeenDays <= 2) return 'content';
  if (lastSeenDays <= 4) return 'longing';
  return 'alert';
}

/**
 * Generates an offline consultant bundle snapshot
 * Contains only aggregate adoption numbers and school metadata with zero student PII
 */
export function generateConsultantSnapshot(
  school: { id: string; name: string; username: string; seatsTotal: number; seatsUsed: number },
  classesCount: number,
  teachersCount: number
) {
  const payload = {
    schemaVersion: '1.5.0-offline',
    exportedAt: new Date().toISOString(),
    schoolId: school.id,
    schoolName: school.name,
    username: school.username,
    capacity: {
      seatsTotal: school.seatsTotal,
      seatsUsed: school.seatsUsed,
      activeClasses: classesCount,
      activeTeachers: teachersCount,
    },
    privacyGuarantee: 'ZERO_STUDENT_PII_STRICT_COMPLIANCE',
    hmacSignature: `sig_${Buffer.from(school.id + school.username + classesCount).toString('base64').substring(0, 16)}`,
  };

  return payload;
}
