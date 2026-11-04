/**
 * Rosha Engine v1.0 (موتور روشا — نگاشت قطعی دهان‌های ضرب و گلوگاه‌های ۶ پایه دبستان)
 * Based on technical specification & Iranian Elementary Math Curriculum Standards.
 */

export type RoshaStage = 'STAGE-1' | 'STAGE-2' | 'STAGE-3';

export type RoshaMouth =
  // STAGE-1 (دسته‌ها و جدول یک‌رقم)
  | 'add_instead_of_mult'
  | 'skip_count_error'
  // STAGE-2 (جابه‌جایی و شکستن)
  | 'half_split'
  | 'missing_second_part'
  // STAGE-3 (صفر، یک، ضرب در ۱۰، عدد بزرگ‌تر)
  | 'zero_mult_cleared'
  | 'one_mult_swapped'
  | 'missing_tens'
  | 'concat_digits'
  | 'concat_final_sum'
  // پایه ۵ (گلوگاه‌های شناختی ۱۴۰۴)
  | 'comp_time_base100'
  | 'frac_div_no_invert'
  | 'mixed_add_sub_whole'
  | 'prop_table_additive'
  | 'percent_total_row_slip'
  | 'rot_vs_ref_center'
  | 'dec_point_sum_digits'
  | 'volume_capacity_mismatch'
  // پایه ۶ (گلوگاه‌های شناختی ۱۴۰۴)
  | 'circle_area_as_peri'
  | 'dec_div_shift_slip'
  | 'coord_xy_inversion'
  | 'int_sub_dir_error'
  | 'order_ops_left_right';

export const NULL_CODE = 'NULL_CODE' as const;
export type MatchResult = RoshaMouth | typeof NULL_CODE;

export interface RoshaEvent {
  childId: string;
  classId: string;
  stage: RoshaStage;
  taskId: string;
  given: string | number;
  assisted: boolean;
  at: number;
}

export interface TaskDefinition {
  id: string;
  stage: RoshaStage;
  factorA: number;
  factorB: number;
  expected: number;
  promptText: string;
  singleStepHint: string; // حداکثر ۱ پله تذکر مفهومی (بدون نوشتن عدد حاصل)
  grade?: number;
  chapter?: number;
  lesson?: string;
  expectedMouths?: RoshaMouth[];
}

export interface ChildBottleneckState {
  lastNoteMouth: RoshaMouth | null;
  repeatCount: number;
  status: 'clear' | 'note' | 'open_bottleneck';
  activeBottleneck: RoshaMouth | null;
  lastTaskId: string | null;
  history: RoshaEvent[];
  completedToday: boolean;
}

// توضیحات تک‌جمله‌ای فارسی دهان‌ها برای گزارش صبح معلم (بدون درصد، رتبه و زمان)
export const MOUTH_DESCRIPTIONS: Record<RoshaMouth, string> = {
  add_instead_of_mult: 'عامل‌ها را جمع می‌کند، هنوز مفهوم دسته و بسته را مجسم نکرده است.',
  skip_count_error: 'در شمارش جهشی گام‌ها یک پرش کمتر یا بیشتر رفته است.',
  half_split: 'عامل را شکست اما بخش دوم را در عدد ضرب نکرد.',
  missing_second_part: 'جزء دوم را در جمع نهایی بخش‌های شکسته جا انداخت.',
  zero_mult_cleared: 'ضرب در صفر را بدون پاسخ یا پاک‌شده فرض کرده است.',
  one_mult_swapped: 'قاعدهٔ عضو خنثی ضرب در یک را نقض کرده است.',
  missing_tens: 'ارزش مکانی ده‌گان را در ضرب دو رقمی جا انداخته است.',
  concat_digits: 'رقم‌های ضرب را به شکل مکانیکی کنار هم چسبانده است.',
  concat_final_sum: 'جمع نهایی را کنار جزء ضرب چسبانده است.',
  comp_time_base100: 'ثانیه و دقیقه را با مبنای ۱۰۰ حساب کرده به‌جای ۶۰.',
  frac_div_no_invert: 'کسر دوم را در تقسیم معکوس نکرده و مستقیم ضرب کرده است.',
  mixed_add_sub_whole: 'واحد کامل را به‌جای مخرج کسر، ۱۰تایی قرض گرفته است.',
  prop_table_additive: 'رابطهٔ جدول تناسب را جمعی دیده نه ضربی.',
  percent_total_row_slip: 'در جدول ۳ سطری درصد، جای درصد را با مقدار کل لغزانده است.',
  rot_vs_ref_center: 'تقارن مرکزی را با بازتاب آینه‌ای اشتباه گرفته است.',
  dec_point_sum_digits: 'مجموع تعداد ارقام اعشار دو عامل را در حاصل‌ضرب جدا نکرده است.',
  volume_capacity_mismatch: 'در تبدیل سی‌سی به لیتر به‌جای ۱۰۰۰، بر ۱۰۰ تقسیم یا ضرب کرده است.',
  circle_area_as_peri: 'مساحت دایره را با محاسبه محیط دایره اشتباه گرفته است.',
  dec_div_shift_slip: 'ممیز مقسوم و مقسوم‌علیه را هماهنگ جابه‌جا نکرده است.',
  coord_xy_inversion: 'طول و عرض جغرافیایی/مختصات را جابه‌جا وارد کرده است.',
  int_sub_dir_error: 'جهت حرکت روی محور اعداد صحیح (منفی و مثبت) را معکوس رفته است.',
  order_ops_left_right: 'عملیات را بدون توجه به اولویت ضرب و پرانتز به صورت خطی انجام داده است.',
};

export function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
}

export function toPersianDigits(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '';
  return String(val).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
}

/**
 * تطبیق قطعی دهان‌های خطای شناختی ۶ پایه دبستان
 */
export function matchDeterministicMouth(
  task: TaskDefinition,
  givenValue: string | number
): MatchResult {
  const cleaned = typeof givenValue === 'string' ? toEnglishDigits(givenValue.trim()) : String(givenValue);
  const givenNum = parseInt(cleaned, 10);
  if (isNaN(givenNum)) {
    return NULL_CODE;
  }

  // پاسخ درست
  if (givenNum === task.expected) {
    return NULL_CODE;
  }

  const { factorA, factorB, stage, grade } = task;
  const matchedMouths: RoshaMouth[] = [];

  // -------------------------------------------------------------
  // تطبیق تخصصی پایه ۵ و ۶ (گلوگاه‌های شناختی جدید)
  // -------------------------------------------------------------
  if (grade === 5 || grade === 6) {
    // 1. circle_area_as_peri: محاسبه محیط دایره به جای مساحت (مثلاً در r=4, pi=3 -> به جای 4*4*3=48 بنویسد 2*4*3=24)
    if (task.lesson?.includes('مساحت دایره') || task.promptText.includes('مساحت دایره')) {
      const radius = Math.sqrt(factorA); // factorA usually holds r^2 or r
      const periCalc = 2 * (factorA > 10 ? Math.sqrt(factorA) : factorA) * factorB;
      if (givenNum === Math.round(periCalc) || givenNum === factorA * factorB) {
        matchedMouths.push('circle_area_as_peri');
      }
    }

    // 2. volume_capacity_mismatch: تقسیم یا ضرب بر ۱۰۰ به جای ۱۰۰۰ در تبدیل سی‌سی به لیتر
    if (task.lesson?.includes('حجم') || task.promptText.includes('سی‌سی') || task.promptText.includes('لیتر')) {
      if (givenNum === factorA / 100 || givenNum === factorA * 100) {
        matchedMouths.push('volume_capacity_mismatch');
      }
    }

    // 3. order_ops_left_right: انجام خطی بدون توجه به اولویت (مثلاً در 3 + 4 * 5 به جای 23 بنویسد 35)
    if (task.promptText.includes('به‌علاوه') && task.promptText.includes('ضرب')) {
      // Linear left to right evaluation
      if (givenNum === (factorA + 4) * 5 || givenNum === 35) {
        matchedMouths.push('order_ops_left_right');
      }
    }

    // 4. dec_point_sum_digits: عدم اعمال تعداد ارقام اعشار (مثلاً در 0.4 * 0.7 به جای 28 صدم بنویسد 280 یا 2.8)
    if (task.lesson?.includes('اعشار') || task.promptText.includes('اعشاری')) {
      if (givenNum === factorA * factorB * 10 || givenNum === (factorA * factorB) / 10) {
        matchedMouths.push('dec_point_sum_digits');
      }
    }

    // 5. prop_table_additive: دیدن رابطه جدول تناسب به صورت جمعی به جای ضربی
    if (task.lesson?.includes('نسبت') || task.promptText.includes('نسبت')) {
      if (givenNum === factorA + factorB) {
        matchedMouths.push('prop_table_additive');
      }
    }

    // 6. coord_xy_inversion: جابه‌جا وارد کردن طول و عرض در مختصات
    if (task.lesson?.includes('مختصات') || task.promptText.includes('طول و عرض')) {
      if (givenNum === parseInt(`${factorB}${factorA}`, 10)) {
        matchedMouths.push('coord_xy_inversion');
      }
    }
  }

  // -------------------------------------------------------------
  // [مرحله ۱: STAGE-1 (دسته‌ها و جدول یک‌رقم)]
  // -------------------------------------------------------------
  if (stage === 'STAGE-1') {
    if (givenNum === factorA + factorB) {
      matchedMouths.push('add_instead_of_mult');
    }

    const isStepA = givenNum === (factorA - 1) * factorB || givenNum === (factorA + 1) * factorB;
    const isStepB = givenNum === factorA * (factorB - 1) || givenNum === factorA * (factorB + 1);
    if (isStepA || isStepB) {
      matchedMouths.push('skip_count_error');
    }
  }

  // -------------------------------------------------------------
  // [مرحله ۲: STAGE-2 (جابه‌جایی و شکستن)]
  // -------------------------------------------------------------
  if (stage === 'STAGE-2') {
    const splitA1 = 5;
    const splitA2 = factorA - splitA1;
    if (splitA2 > 0) {
      const halfSplitValue = (splitA1 * factorB) + splitA2;
      if (givenNum === halfSplitValue) {
        matchedMouths.push('half_split');
      }

      const missingSecondValue = splitA1 * factorB;
      if (givenNum === missingSecondValue) {
        matchedMouths.push('missing_second_part');
      }
    }
  }

  // -------------------------------------------------------------
  // [مرحله ۳: STAGE-3 (صفر، یک، ضرب در ۱۰، عدد بزرگ‌تر)]
  // -------------------------------------------------------------
  if (stage === 'STAGE-3') {
    if (factorA === 0 || factorB === 0) {
      const nonZeroFactor = factorA === 0 ? factorB : factorA;
      if (givenNum === nonZeroFactor || givenNum === 1) {
        matchedMouths.push('zero_mult_cleared');
      }
    }

    if (factorA === 1 || factorB === 1) {
      if (givenNum === 1 || givenNum === factorA + factorB) {
        matchedMouths.push('one_mult_swapped');
      }
    }

    const twoDigit = Math.max(factorA, factorB);
    const oneDigit = Math.min(factorA, factorB);
    if (twoDigit >= 10 && twoDigit < 100) {
      const tens = Math.floor(twoDigit / 10);
      const ones = twoDigit % 10;

      if (givenNum === oneDigit * ones) {
        matchedMouths.push('missing_tens');
      }

      const concatVal1 = parseInt(`${oneDigit}${ones}`, 10);
      const concatVal2 = parseInt(`${oneDigit}${twoDigit}`, 10);
      if (givenNum === concatVal1 || givenNum === concatVal2) {
        matchedMouths.push('concat_digits');
      }

      const partTens = oneDigit * (tens * 10);
      const partOnes = oneDigit * ones;
      const concatSum1 = parseInt(`${partTens}${partOnes}`, 10);
      const concatSum2 = parseInt(`${oneDigit * tens}${partOnes}`, 10);
      if (givenNum === concatSum1 || givenNum === concatSum2) {
        matchedMouths.push('concat_final_sum');
      }
    }
  }

  if (matchedMouths.length === 1) {
    return matchedMouths[0];
  }

  if (task.expectedMouths && task.expectedMouths.length > 0) {
    for (const expectedMouth of task.expectedMouths) {
      if (matchedMouths.includes(expectedMouth)) {
        return expectedMouth;
      }
    }
    return task.expectedMouths[0];
  }

  return NULL_CODE;
}

export function transitionBottleneckState(
  currentState: ChildBottleneckState,
  event: RoshaEvent,
  matchedMouth: MatchResult
): ChildBottleneckState {
  const nextHistory = [...currentState.history, event];

  if (matchedMouth === NULL_CODE && !event.assisted && event.given !== '') {
    return {
      ...currentState,
      status: 'clear',
      activeBottleneck: null,
      repeatCount: 0,
      lastNoteMouth: null,
      lastTaskId: event.taskId,
      history: nextHistory,
      completedToday: true,
    };
  }

  if (event.assisted) {
    return {
      ...currentState,
      lastTaskId: event.taskId,
      history: nextHistory,
    };
  }

  if (matchedMouth === NULL_CODE) {
    return {
      ...currentState,
      lastTaskId: event.taskId,
      history: nextHistory,
    };
  }

  if (currentState.lastNoteMouth === matchedMouth) {
    return {
      ...currentState,
      status: 'open_bottleneck',
      activeBottleneck: matchedMouth,
      repeatCount: currentState.repeatCount + 1,
      lastTaskId: event.taskId,
      history: nextHistory,
      completedToday: false,
    };
  } else {
    return {
      ...currentState,
      status: 'note',
      lastNoteMouth: matchedMouth,
      repeatCount: 1,
      activeBottleneck: null,
      lastTaskId: event.taskId,
      history: nextHistory,
      completedToday: false,
    };
  }
}

export interface MorningReportRow {
  childId: string;
  childName: string;
  category: 'unvisited' | 'stuck' | 'completed';
  sentence: string;
}

export function generateMorningReport(
  children: Array<{ id: string; name: string }>,
  states: Record<string, ChildBottleneckState>
): {
  unvisited: MorningReportRow[];
  stuck: MorningReportRow[];
  completed: MorningReportRow[];
} {
  const unvisited: MorningReportRow[] = [];
  const stuck: MorningReportRow[] = [];
  const completed: MorningReportRow[] = [];

  for (const child of children) {
    const state = states[child.id];
    if (!state || state.history.length === 0) {
      unvisited.push({
        childId: child.id,
        childName: child.name,
        category: 'unvisited',
        sentence: 'دیشب تمرین عصرگاهی را باز نکرده است.',
      });
    } else if (state.status === 'open_bottleneck' && state.activeBottleneck) {
      stuck.push({
        childId: child.id,
        childName: child.name,
        category: 'stuck',
        sentence: MOUTH_DESCRIPTIONS[state.activeBottleneck],
      });
    } else {
      completed.push({
        childId: child.id,
        childName: child.name,
        category: 'completed',
        sentence: 'کار عصرگاهی را به سلامت تمام کرده است.',
      });
    }
  }

  return { unvisited, stuck, completed };
}

export interface OutsourcingExcelRow {
  grade: number;
  chapter: number;
  lesson: string;
  title?: string;
  instructionalContent?: string;
  difficultyLevel?: string;
  exerciseType?: string;
  stage: RoshaStage;
  factorA: number;
  factorB: number;
  expected: number;
  promptText: string;
  singleStepHint: string;
  expectedMouths: RoshaMouth[];
}

export function validateCartridgeRow(row: Partial<OutsourcingExcelRow>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!row.grade || row.grade < 1 || row.grade > 6) errors.push('پایه باید بین ۱ تا ۶ باشد.');
  if (typeof row.factorA !== 'number' || typeof row.factorB !== 'number') errors.push('عامل‌ها باید عددی باشند.');
  if (!row.singleStepHint || row.singleStepHint.length < 5) errors.push('تذکر مفهومی ۱ پله‌ای الزامی است.');

  if (row.expected !== undefined && row.singleStepHint) {
    const hintClean = row.singleStepHint;
    const expStr = String(row.expected);
    const expFa = toPersianDigits(row.expected);
    if (hintClean.includes(expStr) || hintClean.includes(expFa)) {
      errors.push('تذکر نباید حاصل را لو دهد.');
    }
  }

  if (row.grade === 3 && (row.stage === 'STAGE-1' || row.stage === 'STAGE-2')) {
    if (typeof row.factorA === 'number' && typeof row.factorB === 'number' && typeof row.expected === 'number') {
      if (row.factorA * row.factorB !== row.expected) {
        errors.push(`پاسخ اشتباه است: حاصل ضرب ${row.factorA} × ${row.factorB} برابر ${row.factorA * row.factorB} است، نه ${row.expected}.`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function parseCartridgeCSV(csvText: string): {
  validRows: OutsourcingExcelRow[];
  invalidRows: Array<{ rowNumber: number; line: string; errors: string[] }>;
} {
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const rawLines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (rawLines.length === 0) {
    return { validRows: [], invalidRows: [] };
  }

  const headerLine = rawLines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';

  const headerTokens = parseCsvLine(headerLine, delimiter).map((h) =>
    h.trim().toLowerCase().replace(/[\s_\-]/g, '')
  );

  const findCol = (...aliases: string[]): number => {
    for (const alias of aliases) {
      const norm = alias.trim().toLowerCase().replace(/[\s_\-]/g, '');
      const idx = headerTokens.indexOf(norm);
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const colGrade = findCol('grade', 'پایه');
  const colChapter = findCol('chapter', 'فصل');
  const colLesson = findCol('lesson', 'درس');
  const colTitle = findCol('title', 'عنوان');
  const colContent = findCol('instructionalcontent', 'محتوایآموزشی', 'محتوا');
  const colDifficulty = findCol('difficultylevel', 'سطحدشواری', 'دشواری');
  const colExerciseType = findCol('exercisetype', 'نوعتمرین');
  const colStage = findCol('stage', 'مرحله');
  const colFactorA = findCol('factora', 'عامل1', 'عامل_اول', 'عاول', 'عاملاول');
  const colFactorB = findCol('factorb', 'عامل2', 'عامل_دوم', 'عدوم', 'عاملدوم');
  const colExpected = findCol('expected', 'حاصل', 'پاسخ', 'جواب');
  const colPrompt = findCol('prompttext', 'prompt', 'صورتتمرین', 'صورتسوال', 'متنسوال');
  const colHint = findCol('singlestephint', 'hint', 'تذکر', 'تذکرتکمرحلهای', 'راهنما');
  const colMouths = findCol('expectedmouths', 'mouths', 'دهانخطا', 'کدخطا', 'خطا');

  const hasNamedHeader = colGrade !== -1 || colFactorA !== -1 || colTitle !== -1;

  const validRows: OutsourcingExcelRow[] = [];
  const invalidRows: Array<{ rowNumber: number; line: string; errors: string[] }> = [];

  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i];
    const tokens = parseCsvLine(line, delimiter);

    if (tokens.length < 5) {
      invalidRows.push({
        rowNumber: i + 1,
        line,
        errors: [`تعداد ستون‌ها (${tokens.length}) کمتر از حداقل الزامی است.`],
      });
      continue;
    }

    let grade: number;
    let chapter: number;
    let lesson: string;
    let title: string | undefined;
    let instructionalContent: string | undefined;
    let difficultyLevel: string | undefined;
    let exerciseType: string | undefined;
    let stage: RoshaStage = 'STAGE-1';
    let factorA: number;
    let factorB: number;
    let expected: number;
    let promptText: string;
    let singleStepHint: string;
    let mouthsStr = '';

    if (hasNamedHeader) {
      grade = parseInt(toEnglishDigits(colGrade !== -1 ? tokens[colGrade] || '3' : '3'), 10);
      chapter = parseInt(toEnglishDigits(colChapter !== -1 ? tokens[colChapter] || '1' : '1'), 10);
      lesson = (colLesson !== -1 ? tokens[colLesson] : '') || 'تمرین ریاضی';
      title = colTitle !== -1 ? tokens[colTitle] : undefined;
      instructionalContent = colContent !== -1 ? tokens[colContent] : undefined;
      difficultyLevel = colDifficulty !== -1 ? tokens[colDifficulty] : undefined;
      exerciseType = colExerciseType !== -1 ? tokens[colExerciseType] : undefined;

      const stageVal = (colStage !== -1 ? tokens[colStage] || '' : '').toUpperCase();
      if (stageVal.includes('STAGE-2') || stageVal.includes('۲') || stageVal.includes('شکستن')) {
        stage = 'STAGE-2';
      } else if (stageVal.includes('STAGE-3') || stageVal.includes('۳') || stageVal.includes('صفر')) {
        stage = 'STAGE-3';
      } else {
        stage = 'STAGE-1';
      }

      factorA = parseInt(toEnglishDigits(colFactorA !== -1 ? tokens[colFactorA] || '0' : '0'), 10);
      factorB = parseInt(toEnglishDigits(colFactorB !== -1 ? tokens[colFactorB] || '0' : '0'), 10);
      expected = parseInt(toEnglishDigits(colExpected !== -1 ? tokens[colExpected] || '0' : '0'), 10);
      promptText = (colPrompt !== -1 ? tokens[colPrompt] : '') || `تمرین پایه ${grade}:`;
      singleStepHint = (colHint !== -1 ? tokens[colHint] : '') || 'مفهوم تمرین را تجسم کن.';
      mouthsStr = colMouths !== -1 ? tokens[colMouths] || '' : '';
    } else {
      grade = parseInt(toEnglishDigits(tokens[0] || '3'), 10);
      chapter = parseInt(toEnglishDigits(tokens[1] || '1'), 10);
      lesson = tokens[2] || 'تمرین ریاضی';
      const stageStr = (tokens[3] || '').toUpperCase();
      if (stageStr.includes('STAGE-2') || stageStr.includes('۲') || stageStr.includes('شکستن')) {
        stage = 'STAGE-2';
      } else if (stageStr.includes('STAGE-3') || stageStr.includes('۳') || stageStr.includes('صفر')) {
        stage = 'STAGE-3';
      } else {
        stage = 'STAGE-1';
      }

      factorA = parseInt(toEnglishDigits(tokens[4] || '0'), 10);
      factorB = parseInt(toEnglishDigits(tokens[5] || '0'), 10);
      expected = parseInt(toEnglishDigits(tokens[6] || '0'), 10);
      promptText = tokens[7] || `تمرین پایه ${grade}:`;
      singleStepHint = tokens[8] || 'مفهوم تمرین را تجسم کن.';
      mouthsStr = tokens[9] || '';
    }

    const expectedMouths = mouthsStr
      .split(/[;,|]/)
      .map((m) => m.trim() as RoshaMouth)
      .filter((m) => m && m in MOUTH_DESCRIPTIONS);

    const parsedRow: OutsourcingExcelRow = {
      grade: isNaN(grade) ? 3 : grade,
      chapter: isNaN(chapter) ? 1 : chapter,
      lesson,
      title,
      instructionalContent,
      difficultyLevel,
      exerciseType,
      stage,
      factorA: isNaN(factorA) ? 0 : factorA,
      factorB: isNaN(factorB) ? 0 : factorB,
      expected: isNaN(expected) ? 0 : expected,
      promptText,
      singleStepHint,
      expectedMouths,
    };

    const validation = validateCartridgeRow(parsedRow);
    if (validation.valid) {
      validRows.push(parsedRow);
    } else {
      invalidRows.push({
        rowNumber: i + 1,
        line,
        errors: validation.errors,
      });
    }
  }

  return { validRows, invalidRows };
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function convertRowToTask(row: OutsourcingExcelRow, index: number): TaskDefinition {
  return {
    id: `custom-g${row.grade}-s${row.stage}-${index + 1}-${Date.now().toString(36)}`,
    stage: row.stage,
    factorA: row.factorA,
    factorB: row.factorB,
    expected: row.expected,
    promptText: row.promptText || `حاصل ضرب ${row.factorA} × ${row.factorB} را بنویس:`,
    singleStepHint: row.singleStepHint,
    grade: row.grade,
    chapter: row.chapter,
    lesson: row.lesson,
    expectedMouths: row.expectedMouths,
  };
}
