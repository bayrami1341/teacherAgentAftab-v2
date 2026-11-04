import test from 'node:test';
import assert from 'node:assert/strict';
import {
  matchDeterministicMouth,
  transitionBottleneckState,
  generateMorningReport,
  validateCartridgeRow,
  parseCartridgeCSV,
  convertRowToTask,
  toPersianDigits,
  NULL_CODE,
  TaskDefinition,
  ChildBottleneckState,
  RoshaEvent,
} from './roshaEngine';

// -------------------------------------------------------------
// 1. تست‌های موتور تطبیق ۹ دهان ضرب کتاب سوم
// -------------------------------------------------------------

test('Rosha Matcher: STAGE-1 add_instead_of_mult (۳×۴ = ۷)', () => {
  const task: TaskDefinition = {
    id: 't-stage1-1',
    stage: 'STAGE-1',
    factorA: 3,
    factorB: 4,
    expected: 12,
    promptText: 'حاصل ضرب ۳ × ۴ را بنویس:',
    singleStepHint: '۳ دستهٔ ۴تایی را مجسم کن، نه جمع ۳ و ۴.',
  };

  assert.equal(matchDeterministicMouth(task, 7), 'add_instead_of_mult');
  assert.equal(matchDeterministicMouth(task, '7'), 'add_instead_of_mult');
});

test('Rosha Matcher: STAGE-1 skip_count_error (۳×۴ = ۹ یا ۸)', () => {
  const task: TaskDefinition = {
    id: 't-stage1-2',
    stage: 'STAGE-1',
    factorA: 3,
    factorB: 4,
    expected: 12,
    promptText: '۳ × ۴',
    singleStepHint: 'یک پرش روی محور اعداد جا مانده است.',
  };

  // (3-1)*4 = 8
  assert.equal(matchDeterministicMouth(task, 8), 'skip_count_error');
  // 3*(4-1) = 9
  assert.equal(matchDeterministicMouth(task, 9), 'skip_count_error');
  // (3+1)*4 = 16
  assert.equal(matchDeterministicMouth(task, 16), 'skip_count_error');
});

test('Rosha Matcher: STAGE-2 half_split (۷×۶ = ۳۲)', () => {
  const task: TaskDefinition = {
    id: 't-stage2-1',
    stage: 'STAGE-2',
    factorA: 7,
    factorB: 6,
    expected: 42,
    promptText: '۷ × ۶ با شکستن ۷ به ۵ و ۲',
    singleStepHint: 'هر دو جزء ۵ و ۲ باید در ۶ ضرب شوند.',
  };

  // (5*6) + 2 = 32
  assert.equal(matchDeterministicMouth(task, 32), 'half_split');
});

test('Rosha Matcher: STAGE-2 missing_second_part (۷×۶ = ۳۰)', () => {
  const task: TaskDefinition = {
    id: 't-stage2-2',
    stage: 'STAGE-2',
    factorA: 7,
    factorB: 6,
    expected: 42,
    promptText: '۷ × ۶',
    singleStepHint: 'فراموش نکن حاصل جزء دوم را به جزء اول اضافه کنی.',
  };

  // 5 * 6 = 30 (جزء ۲×۶ کلاً جا افتاده)
  assert.equal(matchDeterministicMouth(task, 30), 'missing_second_part');
});

test('Rosha Matcher: STAGE-3 zero_mult_cleared (۵×۰ = ۵)', () => {
  const task: TaskDefinition = {
    id: 't-stage3-1',
    stage: 'STAGE-3',
    factorA: 5,
    factorB: 0,
    expected: 0,
    promptText: '۵ × ۰',
    singleStepHint: '۵ سبد که هیچ سیبی در آن نیست یعنی صفر.',
  };

  assert.equal(matchDeterministicMouth(task, 5), 'zero_mult_cleared');
});

test('Rosha Matcher: STAGE-3 one_mult_swapped (۵×۱ = ۱)', () => {
  const task: TaskDefinition = {
    id: 't-stage3-2',
    stage: 'STAGE-3',
    factorA: 5,
    factorB: 1,
    expected: 5,
    promptText: '۵ × ۱',
    singleStepHint: '۱ ضرب در هر عدد همان عدد است.',
  };

  assert.equal(matchDeterministicMouth(task, 1), 'one_mult_swapped');
});

test('Rosha Matcher: STAGE-3 missing_tens (۳×۱۴ = ۱۲)', () => {
  const task: TaskDefinition = {
    id: 't-stage3-3',
    stage: 'STAGE-3',
    factorA: 3,
    factorB: 14,
    expected: 42,
    promptText: '۳ × ۱۴',
    singleStepHint: '۱۰ تا ۳ تایی را هم به حاصل اضافه کن.',
  };

  // 3 * 4 = 12 (ارزش مکانی ۱۰ نادیده گرفته شده)
  assert.equal(matchDeterministicMouth(task, 12), 'missing_tens');
});

test('Rosha Matcher: STAGE-3 concat_digits (۳×۱۴ = ۳۴)', () => {
  const task: TaskDefinition = {
    id: 't-stage3-4',
    stage: 'STAGE-3',
    factorA: 3,
    factorB: 14,
    expected: 42,
    promptText: '۳ × ۱۴',
    singleStepHint: 'ضرب ریاضی است نه کنار هم گذاشتن ارقام.',
  };

  assert.equal(matchDeterministicMouth(task, 34), 'concat_digits');
});

test('Rosha Matcher: STAGE-3 concat_final_sum (۳×۱۴ = ۳۱۲)', () => {
  const task: TaskDefinition = {
    id: 't-stage3-5',
    stage: 'STAGE-3',
    factorA: 3,
    factorB: 14,
    expected: 42,
    promptText: '۳ × ۱۴',
    singleStepHint: 'حاصل ضرب ده‌گان و یکان را با هم جمع کن، نه متصل کردن ارقام.',
  };

  // 3*10=30, 3*4=12 -> 30 + 12 = 42, concat = 312
  assert.equal(matchDeterministicMouth(task, 312), 'concat_final_sum');
});

test('Rosha Matcher: Unmatched or Correct answer returns NULL_CODE (حق حدس زدن ندارد)', () => {
  const task: TaskDefinition = {
    id: 't-stage1-3',
    stage: 'STAGE-1',
    factorA: 3,
    factorB: 4,
    expected: 12,
    promptText: '۳ × ۴',
    singleStepHint: 'شمارش ۴تایی.',
  };

  // جواب درست -> NULL_CODE
  assert.equal(matchDeterministicMouth(task, 12), NULL_CODE);
  // جواب تصادفی بدون الگوی دهان -> NULL_CODE
  assert.equal(matchDeterministicMouth(task, 99), NULL_CODE);
  assert.equal(matchDeterministicMouth(task, 'نامشخص'), NULL_CODE);
});

// -------------------------------------------------------------
// 2. تست‌های ماشین وضعیت گره (Bottleneck State Machine)
// -------------------------------------------------------------

test('Bottleneck State Machine: بار اول خطای آشنا -> note (گره باز نمی‌شود)', () => {
  const initial: ChildBottleneckState = {
    lastNoteMouth: null,
    repeatCount: 0,
    status: 'clear',
    activeBottleneck: null,
    lastTaskId: null,
    history: [],
    completedToday: false,
  };

  const event: RoshaEvent = {
    childId: 'child-1',
    classId: 'class-3A',
    stage: 'STAGE-1',
    taskId: 't-1',
    given: 7,
    assisted: false,
    at: Date.now(),
  };

  const next = transitionBottleneckState(initial, event, 'add_instead_of_mult');

  assert.equal(next.status, 'note');
  assert.equal(next.repeatCount, 1);
  assert.equal(next.activeBottleneck, null, 'گره نباید در بار اول باز شود');
  assert.equal(next.lastNoteMouth, 'add_instead_of_mult');
});

test('Bottleneck State Machine: بار دوم دقیقاً همان خطای آشنا -> open_bottleneck', () => {
  const noteState: ChildBottleneckState = {
    lastNoteMouth: 'add_instead_of_mult',
    repeatCount: 1,
    status: 'note',
    activeBottleneck: null,
    lastTaskId: 't-1',
    history: [],
    completedToday: false,
  };

  const secondEvent: RoshaEvent = {
    childId: 'child-1',
    classId: 'class-3A',
    stage: 'STAGE-1',
    taskId: 't-2',
    given: 7,
    assisted: false,
    at: Date.now(),
  };

  const next = transitionBottleneckState(noteState, secondEvent, 'add_instead_of_mult');

  assert.equal(next.status, 'open_bottleneck');
  assert.equal(next.repeatCount, 2);
  assert.equal(next.activeBottleneck, 'add_instead_of_mult');
});

test('Bottleneck State Machine: خطای متفاوت -> صفر شدن شمارنده و ثبت note جدید', () => {
  const noteState: ChildBottleneckState = {
    lastNoteMouth: 'add_instead_of_mult',
    repeatCount: 1,
    status: 'note',
    activeBottleneck: null,
    lastTaskId: 't-1',
    history: [],
    completedToday: false,
  };

  const diffEvent: RoshaEvent = {
    childId: 'child-1',
    classId: 'class-3A',
    stage: 'STAGE-1',
    taskId: 't-3',
    given: 8,
    assisted: false,
    at: Date.now(),
  };

  const next = transitionBottleneckState(noteState, diffEvent, 'skip_count_error');

  assert.equal(next.status, 'note');
  assert.equal(next.repeatCount, 1, 'شمارنده باید بازنشانی شود');
  assert.equal(next.lastNoteMouth, 'skip_count_error');
  assert.equal(next.activeBottleneck, null);
});

test('Bottleneck State Machine: پاسخ با راهنما (assisted: true) گره را نمی‌بندد', () => {
  const bottleneckState: ChildBottleneckState = {
    lastNoteMouth: 'add_instead_of_mult',
    repeatCount: 2,
    status: 'open_bottleneck',
    activeBottleneck: 'add_instead_of_mult',
    lastTaskId: 't-2',
    history: [],
    completedToday: false,
  };

  const assistedEvent: RoshaEvent = {
    childId: 'child-1',
    classId: 'class-3A',
    stage: 'STAGE-1',
    taskId: 't-2',
    given: 12,
    assisted: true,
    at: Date.now(),
  };

  const next = transitionBottleneckState(bottleneckState, assistedEvent, NULL_CODE);

  // گره نباید بسته شود چون با کمک انجام شده
  assert.equal(next.status, 'open_bottleneck');
  assert.equal(next.activeBottleneck, 'add_instead_of_mult');
});

// -------------------------------------------------------------
// 3. تست جدول ۳ ستونی صبح معلم (نیامده، مانده، تمام)
// -------------------------------------------------------------

test('Morning Report: تفکیک ۳ ستونی با تک‌جمله فارسی بدون درصد و رتبه', () => {
  const children = [
    { id: 'c-1', name: 'علی' },
    { id: 'c-2', name: 'سارا' },
    { id: 'c-3', name: 'امیرعلی' },
  ];

  const states: Record<string, ChildBottleneckState> = {
    'c-1': {
      lastNoteMouth: 'add_instead_of_mult',
      repeatCount: 2,
      status: 'open_bottleneck',
      activeBottleneck: 'add_instead_of_mult',
      lastTaskId: 't-1',
      history: [{ childId: 'c-1', classId: 'cls', stage: 'STAGE-1', taskId: 't-1', given: 7, assisted: false, at: 100 }],
      completedToday: false,
    },
    'c-2': {
      lastNoteMouth: null,
      repeatCount: 0,
      status: 'clear',
      activeBottleneck: null,
      lastTaskId: 't-2',
      history: [{ childId: 'c-2', classId: 'cls', stage: 'STAGE-1', taskId: 't-2', given: 12, assisted: false, at: 200 }],
      completedToday: true,
    },
    // c-3 تاریخچه‌ای ندارد (نیامده)
  };

  const report = generateMorningReport(children, states);

  assert.equal(report.stuck.length, 1);
  assert.equal(report.stuck[0].childName, 'علی');
  assert.equal(report.stuck[0].sentence, 'عامل‌ها را جمع می‌کند، هنوز مفهوم دسته و بسته را مجسم نکرده است.');

  assert.equal(report.completed.length, 1);
  assert.equal(report.completed[0].childName, 'سارا');

  assert.equal(report.unvisited.length, 1);
  assert.equal(report.unvisited[0].childName, 'امیرعلی');
});

// -------------------------------------------------------------
// 4. تست اعتبارسنجی ردیف اکسل و لو نرفتن جواب در تذکر
// -------------------------------------------------------------

test('Cartridge Validator: جلوگیری از لو رفتن جواب در تذکر مفهومی', () => {
  const leakingRow = {
    grade: 3,
    chapter: 4,
    lesson: 'مفهوم ضرب',
    stage: 'STAGE-1' as const,
    factorA: 3,
    factorB: 4,
    expected: 12,
    promptText: '۳ × ۴',
    singleStepHint: 'حاصل ۱۲ می‌شود دقت کن!', // لو دادن حاصل ۱۲!
  };

  const validation = validateCartridgeRow(leakingRow);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some(e => e.includes('لو دهد')));
});

test('Cartridge CSV Parser: تجزیه و اعتبارسنجی خودکار متن CSV با ارقام فارسی و انگلیسی', () => {
  const sampleCsv = `grade,chapter,lesson,stage,factorA,factorB,expected,promptText,singleStepHint,expectedMouths
3,4,مفهوم ضرب,STAGE-1,3,4,12,حاصل ۳ × ۴ را بنویس:,۳ دسته ۴ تایی مجسم کن,add_instead_of_mult
3,4,شکستن عامل,STAGE-2,7,6,42,حاصل ۷ × ۶:,۵ تا ۶ تا و ۲ تا ۶ تا,half_split
4,1,الگوها,STAGE-1,2,5,10,حاصل ۲ × ۵:,پرش‌های ۵تایی روی خط,skip_count_error
3,4,خطادار,STAGE-1,3,4,99,تست اشتباه,تذکر تستی,add_instead_of_mult`;

  const { validRows, invalidRows } = parseCartridgeCSV(sampleCsv);
  assert.equal(validRows.length, 3);
  assert.equal(invalidRows.length, 1); // 3 * 4 != 99
  assert.equal(validRows[0].grade, 3);
  assert.equal(validRows[0].factorA, 3);
  assert.equal(validRows[0].factorB, 4);
  assert.equal(validRows[0].expected, 12);
  assert.equal(validRows[2].grade, 4);

  const task = convertRowToTask(validRows[0], 0);
  assert.equal(task.expected, 12);
  assert.equal(task.stage, 'STAGE-1');
  assert.equal(task.grade, 3);
});

test('Grok Output Cartridge Verification: اعتبارسنجی کامل و ۱۰۰٪ فایل تمرینات سوپر گراک (۱۶ تمرین)', () => {
  const grokCsv = `grade,chapter,lesson,stage,factorA,factorB,expected,promptText,singleStepHint,expectedMouths
2,4,دسته‌های ده‌تایی,STAGE-3,9,10,90,۹ دستهٔ ده‌تایی چند تا است؟,خود دسته‌ها را نشمار. هر دسته ده تا است.,missing_tens
3,4,دسته‌های مساوی,STAGE-1,3,4,12,۳ بسته، هر بسته ۴ تا. چند تا است؟,دسته‌ها را کنار هم بچین. دو عدد را با هم جمع نکن.,add_instead_of_mult
3,4,دسته‌های مساوی,STAGE-1,4,5,20,۴ دستهٔ ۵تایی چند تا است؟,پنج‌تا پنج‌تا پیش برو. دو عدد را با هم جمع نکن.,add_instead_of_mult
3,4,دسته‌های مساوی,STAGE-1,8,7,56,۸ دستهٔ ۷تایی چند تا است؟,هفت‌تا هفت‌تا پیش برو. دو عدد را با هم جمع نکن.,add_instead_of_mult
3,4,چند برابر,STAGE-1,2,3,6,حسین ۳ مهره دارد. علی ۲ برابر اوست. علی چند مهره دارد؟,برابر یعنی همان دسته دوباره. دو عدد را با هم جمع نکن.,add_instead_of_mult
3,4,شمارش جهشی,STAGE-1,7,9,63,در شمارش نُه‌تا نُه‌تا، عدد بعد از ۵۴ چیست؟,یکی‌یکی جلو نرو. به اندازهٔ همان گام بپر.,skip_count_error
3,4,شکستن,STAGE-2,5,7,35,۷ را به ۵ و ۲ بشکن و در ۵ ضرب کن.,هر دو جزء را ضرب کن. یکی را رها نکن و جزءها را در هم ضرب نکن.,half_split;missing_second_part
3,4,شکستن,STAGE-2,8,7,56,۷ را به ۵ و ۲ بشکن و در ۸ ضرب کن.,هر دو جزء را در ۸ ضرب کن. یکی را رها نکن.,half_split;missing_second_part
3,4,ضرب در یک,STAGE-3,1,7,7,۱ × ۷,ضرب در یک عدد را عوض نمی‌کند.,one_mult_swapped
3,8,ضرب در صفر,STAGE-3,18,0,0,۱۸ × ۰,هیچ دسته، تهی می‌ماند. عامل دیگر را به‌جای حاصل ننویس.,zero_mult_cleared
3,8,ضرب در ده و عدد بزرگ‌تر,STAGE-3,4,23,92,۴ × ۲۳,۲۳ یعنی ۲۰ به‌علاوهٔ ۳. هر دو جزء را در ۴ ضرب کن.,missing_second_part;missing_tens
3,8,ضرب در ده و عدد بزرگ‌تر,STAGE-3,21,4,84,۲۱ × ۴,دهگان را هم ضرب کن. فقط یکی‌ها کافی نیست.,missing_tens
3,8,ضرب در عدد دو رقمی,STAGE-3,4,12,48,۴ دوجین چند تا است؟,دوجین را با ۴ جمع نکن. دستهٔ دوازده‌تایی را ۴ بار بچین.,add_instead_of_mult
4,1,چند برابر ضلع,STAGE-1,4,4,16,۴ بار ۴,چهار بار دستهٔ چهارتایی. دو تا را با هم جمع نکن.,add_instead_of_mult
4,1,ماشین ضرب در دو,STAGE-1,2,5,10,۵ داخل ماشین ضرب‌در‌دو. بیرون چند می‌شود؟,عدد را دو بار بگذار. ۲ را به آن اضافه نکن.,add_instead_of_mult
4,1,محیط مثلث متساوی‌الاضلاع,STAGE-1,3,2,6,ضلع مثلث ۲ است. محیط چند است؟,سه ضلع برابر را بچین. ضلع را با ۳ جمع نکن.,add_instead_of_mult`;

  const { validRows, invalidRows } = parseCartridgeCSV(grokCsv);
  assert.equal(invalidRows.length, 0, 'نباید هیچ خطایی در خروجی گراک وجود داشته باشد');
  assert.equal(validRows.length, 16, 'دقیقاً ۱۶ ردیف معتبر باید استخراج شود');

  // بررسی عدم افشای پاسخ در هیچ‌یک از ۱۶ ردیف
  for (const row of validRows) {
    const validation = validateCartridgeRow(row);
    assert.equal(validation.valid, true);
    assert.equal(validation.errors.length, 0);
  }
});

test('Persian Digits: تبدیل کامل ارقام انگلیسی به فارسی', () => {
  assert.equal(toPersianDigits(1234567890), '۱۲۳۴۵۶۷۸۹۰');
  assert.equal(toPersianDigits('3 * 4 = 12'), '۳ * ۴ = ۱۲');
});

test('Grok Output Cartridge Verification: اعتبارسنجی کامل و ۱۰۰٪ فایل تمرینات پایه‌های ۱، ۵ و ۶ (۱۷ تمرین)', () => {
  const grokG156Csv = `grade,chapter,lesson,stage,factorA,factorB,expected,promptText,singleStepHint,expectedMouths
1,22,شمارش چهارتا چهارتا,STAGE-1,4,3,12,در شمارش چهارتا چهارتا، عدد بعد از ۸ چیست؟,یکی‌یکی جلو نرو. به اندازهٔ همان گام بپر.,skip_count_error
1,22,شمارش هفت‌تا هفت‌تا,STAGE-1,7,2,14,در شمارش هفت‌تا هفت‌تا، عدد بعد از ۷ چیست؟,یکی‌یکی جلو نرو. همان گام را دوباره بردار.,skip_count_error
1,22,شمارش هفت‌تا هفت‌تا,STAGE-1,7,3,21,سومین عددِ شمارش هفت‌تا هفت‌تا، از ۷، چیست؟,دو گام همان اندازه بردار. گام را یکی نکن.,skip_count_error
1,22,الگوی شش‌تا,STAGE-1,6,3,18,در الگوی شش‌تا، عدد بعد از ۱۲ چیست؟,یکی‌یکی جلو نرو. شش تا بپر.,skip_count_error
1,23,شمارش هشت‌تا هشت‌تا,STAGE-1,8,2,16,در شمارش هشت‌تا هشت‌تا، عدد بعد از ۸ چیست؟,یکی‌یکی جلو نرو. هشت تا بپر.,skip_count_error
5,2,تکه‌های روبان,STAGE-1,3,4,12,۳ متر روبان است. هر تکه یک‌چهارم متر است. چند تکه می‌شود؟,متر را با چهار جمع نکن. در هر متر چهار تکه بگذار.,add_instead_of_mult
5,2,دو سوم کلاس,STAGE-2,2,14,28,کلاس ۴۲ نفر است. دو سوم‌شان کتابخانه‌اند. چند نفرند؟,اول سه قسمت کن. دو قسمت را بردار. نصف را برندار.,half_split
5,2,بسته‌های چای,STAGE-2,4,5,20,۴ کیلو چای در بسته‌های یک‌پنجم کیلو. چند بسته است؟,هر کیلو را پنج بسته بگیر. خود عدد پنج را به‌جای همه ننویس.,missing_second_part
5,3,طول مستطیل,STAGE-2,5,15,75,محیط ۲۴۰ متر است و طول به عرض ۵ به ۳. طول چند متر است؟,اول محیط را نصف کن و به هشت قسمت تقسیم کن. پنج قسمت مال طول است.,half_split
5,4,ده درصد تخفیف,STAGE-3,2,10,20,از ۲۰۰ تومان، ۱۰ درصد کم می‌شود. چند تومان است؟,هر صد تومان ده تومان است. هر دو صد را حساب کن.,missing_tens
6,1,مضرب پنج,STAGE-1,9,5,45,نهمین مضرب ۵ چیست؟,نُه بار پنج‌تا بپر. خود عدد نُه را ننویس.,skip_count_error
6,1,چوب کبریت شکل,STAGE-2,4,3,12,شکل چهارم چند چوب دارد، اگر چوب‌ها شمارهٔ شکل ضرب‌در ۳ باشند؟,شماره را سه بار بگذار. خود شماره را ننویس.,missing_second_part
6,1,آبِ نان,STAGE-3,2,1000,2000,هفته‌ای ۲ کیلو نان. هر کیلو بیش از ۱۰۰۰ لیتر آب. در هفته بیش از چند لیتر است؟,هر دو کیلو را حساب کن. فقط یک کیلو را ننویس.,missing_second_part
6,2,دو سوم بیست‌وچهار,STAGE-2,2,8,16,دو سومِ ۲۴ چند است؟,اول سه قسمت کن. دو قسمت را بردار. بر دو تقسیم نکن.,half_split
6,3,ضرب در صد,STAGE-3,41,10,410,۲٫۴ به‌علاوهٔ ۱٫۷، بعد ضرب در ۱۰۰. حاصل چیست؟,اول جمع کن. دو بار ده برابر کن، نه یک بار.,missing_tens
6,6,درصد سود,STAGE-3,150,20,3000,کتاب ۱۵٬۰۰۰ تومان است. ۲۰ درصد سود چند تومان است؟,بیست را به قیمت نچسبان. اول قیمت را صد قسمت کن.,concat_digits
6,6,سهم دارو,STAGE-2,7,4,28,دارو با نسبت ۷ و ۵ و ۳، روی هم ۶۰ گرم. سهم ۷ چند گرم است؟,اول هر سه نسبت را با هم جمع کن. هر سه سهم را برابر نگیر.,missing_second_part`;

  const { validRows, invalidRows } = parseCartridgeCSV(grokG156Csv);
  assert.equal(invalidRows.length, 0, 'نباید هیچ خطایی در خروجی گراک پایه‌های ۱، ۵ و ۶ وجود داشته باشد');
  assert.equal(validRows.length, 17, 'دقیقاً ۱۷ ردیف معتبر باید استخراج شود');

  // بررسی عدم افشای پاسخ در هیچ‌یک از ۱۷ ردیف
  for (const row of validRows) {
    const validation = validateCartridgeRow(row);
    assert.equal(validation.valid, true);
    assert.equal(validation.errors.length, 0);
  }
});

test('Super Grok Curriculum Template: اعتبارسنجی الگوی جامع استاندارد ۷ ستونی با سرستون‌های انگلیسی', () => {
  const templateCsv = `grade,chapter,lesson,title,instructional_content,difficulty_level,exercise_type,stage,factorA,factorB,expected,promptText,singleStepHint,expectedMouths
1,22,شمارش چندتا چندتا,پرش‌های منظم چهارگانه,درک الگوی شمارش جهشی افزایشی,آسان,الگویابی,STAGE-1,4,3,12,در شمارش چهارتا چهارتا، عدد بعد از ۸ چیست؟,یکی‌یکی جلو نرو. به اندازهٔ همان گام بپر.,skip_count_error
3,4,مفهوم ضرب,مدل‌سازی مساحتی,تبدیل جمع تکراری به ضرب,آسان,مفهومی,STAGE-1,3,4,12,۳ بسته، هر بسته ۴ تا. چند تا است؟,دسته‌ها را کنار هم بچین. دو عدد را با هم جمع نکن.,add_instead_of_mult
6,6,درصد سود,تسهیم نسبت,تقسیم کل بر پایه نسبت‌ها,پیشرفته,مساله‌محور,STAGE-2,7,4,28,دارو با نسبت ۷ و ۵ و ۳. سهم ۷ چند گرم است؟,اول هر سه نسبت را با هم جمع کن. هر سه سهم را برابر نگیر.,missing_second_part`;

  const { validRows, invalidRows } = parseCartridgeCSV(templateCsv);
  assert.equal(invalidRows.length, 0);
  assert.equal(validRows.length, 3);
  assert.equal(validRows[0].title, 'پرش‌های منظم چهارگانه');
  assert.equal(validRows[0].difficultyLevel, 'آسان');
  assert.equal(validRows[0].exerciseType, 'الگویابی');
  assert.equal(validRows[2].grade, 6);
  assert.equal(validRows[2].expected, 28);
});

test('Super Grok Curriculum Template: اعتبارسنجی الگوی جامع با سرستون‌های کاملاً فارسی', () => {
  const faCsv = `پایه,فصل,درس,عنوان,محتوای آموزشی,سطح دشواری,نوع تمرین,مرحله,عامل اول,عامل دوم,حاصل,صورت تمرین,تذکر تک مرحله ای,دهان خطا
2,4,دسته‌بندی ده‌تایی,ارزش مکانی,شناخت بسته ده‌تایی,متوسط,مجسم-تصویری,STAGE-3,9,10,90,۹ دستهٔ ده‌تایی چند تا است؟,خود دسته‌ها را نشمار. هر دسته ده تا است.,missing_tens
5,4,درصد و تخفیف,نرخ درصدی,محاسبه درصد از کل,پیشرفته,کاربردی-مالی,STAGE-3,2,10,20,از ۲۰۰ تومان، ۱۰ درصد کم می‌شود. تخفیف چند تومان است؟,هر صد تومان ده تومان است. هر دو صد را حساب کن.,missing_tens`;

  const { validRows, invalidRows } = parseCartridgeCSV(faCsv);
  assert.equal(invalidRows.length, 0);
  assert.equal(validRows.length, 2);
  assert.equal(validRows[0].grade, 2);
  assert.equal(validRows[0].title, 'ارزش مکانی');
  assert.equal(validRows[1].grade, 5);
  assert.equal(validRows[1].expected, 20);
});



