import React, { useState, useEffect, useMemo, useRef } from 'react';

// ============================================================================
// ۰. استایل‌های سراسری، فونت وزیرمتن، متغیرهای رنگی و انیمیشن‌های ارگانیک
// ============================================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap');

    :root {
      --color-green-primary: #7BA05B;
      --color-green-light: #A5CC85;
      --color-green-pale: #C8D9B5;
      --color-green-dark: #5A7A3F;
      --color-cream: #FDFBF5;
      --color-orange-soft: #E8A87C;
      --color-text-primary: #2D2D2D;
      --color-text-secondary: #7A7A7A;
    }

    body {
      font-family: 'Vazirmatn', system-ui, -apple-system, sans-serif;
      background-color: var(--color-cream);
      color: var(--color-text-primary);
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* انیمیشن‌های تنفس گیاه بر اساس حال عاطفی (۴ ثانیه برای شاداب و آرام) */
    @keyframes breathe-4s {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    @keyframes breathe-6s {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    @keyframes breathe-8s {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.015); }
    }

    .plant-thriving, .plant-content {
      animation: breathe-4s 4s ease-in-out infinite;
      transform-origin: 50% 95%;
    }
    .plant-longing {
      animation: breathe-6s 6s ease-in-out infinite;
      transform-origin: 50% 95%;
    }
    .plant-alert {
      animation: breathe-8s 8s ease-in-out infinite;
      transform-origin: 50% 95%;
    }

    /* جهش شادی هنگام انجام عادت یا نوازش گیاه */
    @keyframes happy-bounce {
      0% { transform: scale(1) translateY(0); }
      30% { transform: scale(1.12, 0.9) translateY(4px); }
      60% { transform: scale(0.95, 1.08) translateY(-10px); }
      80% { transform: scale(1.03, 0.98) translateY(0); }
      100% { transform: scale(1) translateY(0); }
    }
    .plant-happy-jump {
      animation: happy-bounce 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* پرواز پروانه و دوستان کوچک */
    @keyframes butterfly-wing {
      0%, 100% { transform: translateY(0px) rotate(-4deg) scale(1); }
      50% { transform: translateY(-9px) rotate(6deg) scale(1.06); }
    }
    .friend-float {
      animation: butterfly-wing 3.2s ease-in-out infinite;
    }

    /* ذرات طلایی گیاهان شاداب */
    @keyframes sparkle-float-1 {
      0%, 100% { opacity: 0; transform: translateY(0px) scale(0.4); }
      35% { opacity: 0.95; transform: translateY(-14px) scale(1.1); }
      70% { opacity: 0; transform: translateY(-26px) scale(0.5); }
    }
    @keyframes sparkle-float-2 {
      0%, 100% { opacity: 0; transform: translateY(0px) scale(0.3); }
      50% { opacity: 0.85; transform: translateY(-18px) scale(1); }
      85% { opacity: 0; transform: translateY(-30px) scale(0.4); }
    }
    .gold-particle-1 {
      animation: sparkle-float-1 5s ease-in-out infinite;
    }
    .gold-particle-2 {
      animation: sparkle-float-2 5s ease-in-out 2.3s infinite;
    }

    /* ابر دلتنگی بالای گیاه */
    @keyframes cloud-bob {
      0%, 100% { transform: translateY(0px); opacity: 0.75; }
      50% { transform: translateY(-4px); opacity: 0.95; }
    }
    .longing-cloud-anim {
      animation: cloud-bob 4s ease-in-out infinite;
    }

    /* بارش قلب و شبنم پس از انجام عادت */
    @keyframes float-up-heart {
      0% { opacity: 1; transform: translateY(0) scale(0.6) rotate(0deg); }
      50% { opacity: 0.95; transform: translateY(-45px) scale(1.15) rotate(-8deg); }
      100% { opacity: 0; transform: translateY(-95px) scale(0.8) rotate(10deg); }
    }
    .floating-particle {
      animation: float-up-heart 1.3s ease-out forwards;
      pointer-events: none;
    }

    /* کارت گیاه و افکت Hover */
    .plant-card {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .plant-card:hover, .plant-card:focus-visible {
      transform: scale(1.1) translateY(-4px);
      box-shadow: 0 8px 20px rgba(123, 160, 91, 0.25);
      background-color: rgba(255, 255, 255, 0.75);
      cursor: pointer;
      outline: none;
    }

    /* باز شدن کشو از پایین */
    @keyframes slide-up {
      from { transform: translateY(100%); opacity: 0.6; }
      to { transform: translateY(0); opacity: 1; }
    }
    .drawer-slide-up {
      animation: slide-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }

    /* اسکلت بارگذاری با افکت Shimmer */
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .skeleton-shimmer {
      background: linear-gradient(90deg, #ECE8DC 25%, #F5F2E9 50%, #ECE8DC 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s infinite;
    }

    /* احترام به دسترسی‌پذیری prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {
      .plant-thriving, .plant-content, .plant-longing, .plant-alert,
      .gold-particle-1, .gold-particle-2, .longing-cloud-anim, .skeleton-shimmer,
      .friend-float, .plant-happy-jump {
        animation: none !important;
      }
      .plant-card:hover {
        transform: none !important;
      }
    }

    /* قوانین چاپ اختصاصی */
    @media print {
      body {
        background: #FFFFFF !important;
        color: #000000 !important;
      }
      .no-print {
        display: none !important;
      }
      .print-only {
        display: block !important;
      }
      .garden-print-area {
        page-break-inside: avoid;
      }
    }
  `}</style>
);

// ============================================================================
// ۱. موتور صدای سنتزشده‌ی WebAudio (۱۰۰٪ آفلاین — بدون نیاز به هیچ فایل صوتی)
// ============================================================================
const Sfx = {
  ctx: null,
  muted: false,
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },
  tone(freq, delay = 0, dur = 0.18, type = 'sine', vol = 0.12) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    } catch (e) {
      // نادیده گرفتن در صورت مسدود بودن صدا توسط مرورگر
    }
  },
  playHabitDone() {
    this.tone(523.25, 0, 0.16, 'sine', 0.12);    // C5
    this.tone(659.25, 0.09, 0.18, 'sine', 0.12); // E5
    this.tone(783.99, 0.18, 0.28, 'triangle', 0.14); // G5
  },
  playWakeUp() {
    this.tone(440, 0, 0.15, 'triangle', 0.1);
    this.tone(554.37, 0.1, 0.15, 'triangle', 0.12);
    this.tone(659.25, 0.2, 0.2, 'triangle', 0.13);
    this.tone(880, 0.32, 0.35, 'sine', 0.15);
  },
  playDream() {
    this.tone(587.33, 0, 0.25, 'sine', 0.09);
    this.tone(739.99, 0.16, 0.25, 'sine', 0.09);
    this.tone(880, 0.32, 0.35, 'sine', 0.1);
    this.tone(1174.66, 0.5, 0.45, 'sine', 0.08);
  },
  playGentleError() {
    this.tone(349.23, 0, 0.2, 'sine', 0.09);
    this.tone(311.13, 0.15, 0.28, 'sine', 0.08);
  },
  playSeedCelebration() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      this.tone(f, idx * 0.11, 0.32, 'triangle', 0.13);
    });
  },
  playTap() {
    this.tone(620, 0, 0.08, 'sine', 0.06);
  }
};

// ============================================================================
// ۲. بانک داده‌ها، عادت‌ها، رویاها، آیتم‌های اتاق و تولیدکننده‌ی Mock
// ============================================================================
const STAGE_LABELS = {
  0: 'دانه در خاک',
  1: 'جوانه‌ی کوچک',
  2: 'نهال نوپا',
  3: 'نهال سبز',
  4: 'بوته‌ی پرپشت',
  5: 'شکوفا و گل‌دار',
};

constSTAGE_THRESHOLDS = [0, 2, 5, 10, 16, 24];

function stageForGrowth(days) {
  let s = 1;
  if (days >= 24) s = 5;
  else if (days >= 16) s = 4;
  else if (days >= 10) s = 3;
  else if (days >= 5) s = 2;
  else s = 1;
  return s;
}

const MOOD_LABELS = {
  thriving: 'شاداب',
  content: 'آرام',
  longing: 'دل‌تنگ',
  alert: 'بی‌تاب',
};

// ۴ عادت اصلی و ریتم‌ساز روزانه‌ی کودک در خانه (مطابق SPEC)
const DAILY_HABITS = [
  {
    key: 'wake',
    title: 'بیدارباش سحرگاه',
    subtitle: 'بیدار شدن قبل از ساعت ۷ صبح',
    icon: '☀️',
    wakeRule: true,
    color: '#FFF6DF',
    border: '#F2C94C',
  },
  {
    key: 'brush',
    title: 'مسواک و آبیاری صبح',
    subtitle: 'شروع تمیز و باطراوت روز',
    icon: '🪥',
    wakeRule: false,
    color: '#EEF7F2',
    border: '#A5CC85',
  },
  {
    key: 'homework',
    title: 'مشق و تمرین امروز',
    subtitle: 'انجام باحوصله‌ی درس‌های مدرسه',
    icon: '✏️',
    wakeRule: false,
    color: '#F3F6EC',
    border: '#7BA05B',
  },
  {
    key: 'sleep',
    title: 'قصه و آماده‌ی خواب',
    subtitle: 'جمع کردن کیف و خواب به‌موقع',
    icon: '🌙',
    wakeRule: false,
    color: '#F2F0F9',
    border: '#B8B2D8',
  },
];

// بانک ۱۲ رویای ارگانیک و شاعرانه‌ی گیاه
const ORGANIC_DREAM_BANK = [
  'دیشب خواب دیدم یک پروانه‌ی آبی روی بالاترین برگم نشست و برایم قصه‌ی ابرها را تعریف کرد...',
  'خواب دیدم قطره‌های باران مثل نت‌های موسیقی روی گلدانم تقه می‌زدند و آواز می‌خواندند...',
  'دیشب در خواب دیدم ریشه‌هایم به یک کتابخانه‌ی قدیمی زیر خاک رسیدند که پر از قصه بود...',
  'خواب دیدم با کرم شب‌تاب کوچکی دوست شدم که تا صبح برایم چراغ گرفته بود...',
  'دیشب خواب دیدم باد ملایمی آمد و گلبرگ‌هایم را تا حیاط مدرسه پرواز داد...',
  'خواب دیدم مورچه‌ها دور گلدانم جشن تولد گرفته بودند و شیرینی تقسیم می‌کردند...',
  'دیشب خواب دیدم ماه از پشت پنجره سرک کشید و برگ‌هایم را نقره‌ای کرد...',
  'خواب دیدم یک گنجشک کوچک روی لبه گلدانم نشست و از مشق‌هایت تعریف کرد...',
];

// آیتم‌های قابل باز شدن در کمد اتاق گیاه (همیشگی، بدون پس گرفتن)
const UNLOCKABLE_ITEMS = {
  pots: [
    { id: 'terracotta', name: 'سفالی کلاسیک', minStage: 1, minDays: 0, icon: '🪴' },
    { id: 'mint', name: 'گلدان نعنایی', minStage: 2, minDays: 5, icon: '🍵' },
    { id: 'painted', name: 'سفال نقش‌دار ایرانی', minStage: 3, minDays: 10, icon: '🎨' },
    { id: 'wood', name: 'گلدان چوب بلوط', minStage: 4, minDays: 16, icon: '🪵' },
  ],
  accessories: [
    { id: 'none', name: 'بدون کلاه', minStage: 1, minDays: 0, icon: '✨' },
    { id: 'ribbon', name: 'پاپیون صورتی', minStage: 2, minDays: 6, icon: '🎀' },
    { id: 'strawhat', name: 'کلاه حصیری باغبانی', minStage: 3, minDays: 12, icon: '👒' },
    { id: 'crown', name: 'تاج شکوفه', minStage: 5, minDays: 22, icon: '👑' },
  ],
  friends: [
    { id: 'none', name: 'تنها در آرامش', minStage: 1, minDays: 0, icon: '🍃' },
    { id: 'ladybug', name: 'کفشدوزک خال‌خالی', minStage: 2, minDays: 5, icon: '🐞' },
    { id: 'butterfly', name: 'پروانه‌ی طلایی', minStage: 4, minDays: 15, icon: '🦋' },
    { id: 'bird', name: 'سهره آوازخوان', minStage: 5, minDays: 24, icon: '🐦' },
  ],
};

// حاشیه بالای نامنظم ولی پایدار (بین ۰ تا ۱۶ پیکسل) برای حس باغچه‌ی طبیعی
const IRREGULAR_OFFSETS = [0, 10, 4, 15, 2, 12, 7, 16, 3, 14, 6, 11, 1, 15, 8, 5, 13, 2, 9, 14];

function buildRadarFromPlants(plants) {
  const thrivingCount = plants.filter((p) => p.mood === 'thriving').length;
  const contentCount = plants.filter((p) => p.mood === 'content').length;
  const longingPlants = plants.filter((p) => p.mood === 'longing');
  const alertPlants = plants.filter((p) => p.mood === 'alert');

  const carePlants = [...alertPlants, ...longingPlants];
  const total = plants.length || 1;
  const weightedHealth = Math.round(
    ((thrivingCount * 1 + contentCount * 0.82 + longingPlants.length * 0.35 + alertPlants.length * 0.1) / total) * 100
  );

  let overall = 'mixed';
  let overallMessage = 'امروز حال باغچه متوسط است.';
  if (weightedHealth >= 70) {
    overall = 'good';
    overallMessage = 'امروز حال باغچه خوبه.';
  } else if (weightedHealth < 40) {
    overall = 'needs_care';
    overallMessage = 'امروز باغچه نیاز به مراقبت داره.';
  }

  const needsAttention = carePlants.slice(0, 3).map((p) => {
    let hint = 'یه احوال‌پرسی کوتاه و گرم قبل از شروع درس کافیه.';
    if (p.mood === 'alert') {
      hint = `گیاه «${p.plantName}» چند روزه منتظره؛ بدون اشاره به غیبت، حال خودش رو بپرس.`;
    } else if (p.activeDream) {
      hint = `می‌تونی ازش بپرسی فکر می‌کنه «${p.plantName}» این روزها چه خوابی دیده.`;
    } else {
      hint = `یه یادآوری مهربانانه که «${p.plantName}» دلش برای دیدن دوستش تنگ شده.`;
    }
    return {
      id: p.id,
      childName: p.childName,
      plantName: p.plantName,
      mood: p.mood,
      lastSeenDays: p.lastSeenDays,
      hint,
    };
  });

  const bloomingCount = plants.filter((p) => p.stage === 5 && (p.mood === 'thriving' || p.mood === 'content')).length;
  const dreamingCount = plants.filter((p) => p.activeDream !== null).length;

  const goodNews = [
    {
      type: 'comeback',
      text: '۲ نفر بعد از چند روز غیبت به باغچه برگشته‌اند.',
    },
    {
      type: 'stage',
      text: `${bloomingCount > 0 ? bloomingCount : 2} گیاه، تازه شکوفا شده‌اند و گل داده‌اند.`,
    },
  ];

  if (dreamingCount >= 4) {
    goodNews.push({
      type: 'dream',
      text: `${dreamingCount} گیاه دیشب خواب‌های رنگی دیده‌اند — بهانه‌ی خوبی برای گپ زدن!`,
    });
  }

  return {
    overall,
    overallMessage,
    needsAttentionCount: carePlants.length,
    needsAttention,
    goodNews: goodNews.slice(0, 2),
    healthPercentage: weightedHealth,
  };
}

function enrichPlantDefaults(p, idx) {
  const defaultMemories = [
    { id: `m-${p.id}-1`, date: '۱۴ آبان', text: `اولین روزی که «${p.plantName}» سر از خاک بیرون آورد و با ${p.childName} دوست شد.`, icon: '🌱' },
  ];
  if (p.activeDream) {
    defaultMemories.unshift({
      id: `m-${p.id}-2`,
      date: 'دیشب',
      text: p.activeDream,
      icon: '🌙',
    });
  }
  if (p.stage >= 4) {
    defaultMemories.push({
      id: `m-${p.id}-3`,
      date: 'هفته پیش',
      text: `در یک صبح بارانی، برگ‌های «${p.plantName}» پرپشت‌تر شد.`,
      icon: '🌧️',
    });
  }

  return {
    ...p,
    onboarded: true,
    accessory: idx === 0 ? 'crown' : idx === 1 ? 'ribbon' : idx === 3 ? 'strawhat' : 'none',
    friend: idx === 0 ? 'butterfly' : idx === 1 ? 'ladybug' : idx === 5 ? 'bird' : 'none',
    completedHabitsToday: p.lastSeenDays === 0 ? ['wake', 'brush'] : [],
    weekHistory:
      p.mood === 'thriving'
        ? [true, true, true, true, true, true, true]
        : p.mood === 'content'
        ? [true, true, false, true, true, true, false]
        : p.mood === 'longing'
        ? [true, false, true, true, false, false, false]
        : [false, true, false, false, false, false, false],
    memoriesList: defaultMemories,
    readyForSeed: p.stage === 5 && p.growthDays >= 24,
  };
}

function generateMockClass() {
  const rawPlants = [
    // ۸ گیاه شاداب (thriving)
    {
      id: 'p-1',
      plantName: 'نارنجک',
      childName: 'امیرعلی',
      gen: 2,
      mood: 'thriving',
      stage: 5,
      growthDays: 24,
      lastSeenDays: 0,
      activeDream: 'دیشب خواب دیدم یک پروانه‌ی آبی روی بالاترین برگم نشست و برایم قصه‌ی ابرها را تعریف کرد...',
      memoriesCount: 9,
      archived: false,
      potStyle: 'painted',
    },
    {
      id: 'p-2',
      plantName: 'آفتاب‌گردان',
      childName: 'سارا',
      gen: 1,
      mood: 'thriving',
      stage: 4,
      growthDays: 19,
      lastSeenDays: 0,
      activeDream: 'خواب دیدم قطره‌های باران مثل نت‌های موسیقی روی گلدانم تقه می‌زدند و آواز می‌خواندند...',
      memoriesCount: 6,
      archived: false,
      potStyle: 'terracotta',
    },
    {
      id: 'p-3',
      plantName: 'پونه',
      childName: 'کیان',
      gen: 1,
      mood: 'thriving',
      stage: 3,
      growthDays: 12,
      lastSeenDays: 0,
      activeDream: null,
      memoriesCount: 4,
      archived: false,
      potStyle: 'mint',
    },
    {
      id: 'p-4',
      plantName: 'ترمه',
      childName: 'حلما',
      gen: 3,
      mood: 'thriving',
      stage: 5,
      growthDays: 25,
      lastSeenDays: 0,
      activeDream: 'دیشب در خواب دیدم ریشه‌هایم به یک کتابخانه‌ی قدیمی زیر خاک رسیدند که پر از قصه بود...',
      memoriesCount: 10,
      archived: false,
      potStyle: 'painted',
    },
    {
      id: 'p-5',
      plantName: 'سنجد',
      childName: 'رادین',
      gen: 1,
      mood: 'thriving',
      stage: 2,
      growthDays: 7,
      lastSeenDays: 0,
      activeDream: null,
      memoriesCount: 2,
      archived: false,
      potStyle: 'terracotta',
    },
    {
      id: 'p-6',
      plantName: 'شبنم',
      childName: 'باران',
      gen: 2,
      mood: 'thriving',
      stage: 4,
      growthDays: 18,
      lastSeenDays: 0,
      activeDream: 'خواب دیدم با کرم شب‌تاب کوچکی دوست شدم که تا صبح برایم چراغ گرفته بود...',
      memoriesCount: 7,
      archived: false,
      potStyle: 'wood',
    },
    {
      id: 'p-7',
      plantName: 'نعنا',
      childName: 'ماهان',
      gen: 1,
      mood: 'thriving',
      stage: 3,
      growthDays: 14,
      lastSeenDays: 0,
      activeDream: null,
      memoriesCount: 5,
      archived: false,
      potStyle: 'terracotta',
    },
    {
      id: 'p-8',
      plantName: 'بابونه',
      childName: 'آوا',
      gen: 2,
      mood: 'thriving',
      stage: 5,
      growthDays: 24,
      lastSeenDays: 0,
      activeDream: 'دیشب خواب دیدم باد ملایمی آمد و گلبرگ‌هایم را تا حیاط مدرسه پرواز داد...',
      memoriesCount: 8,
      archived: false,
      potStyle: 'mint',
    },

    // ۶ گیاه آرام (content)
    {
      id: 'p-9',
      plantName: 'مخمل',
      childName: 'پارسا',
      gen: 1,
      mood: 'content',
      stage: 4,
      growthDays: 17,
      lastSeenDays: 1,
      activeDream: 'خواب دیدم مورچه‌ها دور گلدانم جشن تولد گرفته بودند و شیرینی تقسیم می‌کردند...',
      memoriesCount: 5,
      archived: false,
      potStyle: 'wood',
    },
    {
      id: 'p-10',
      plantName: 'یاسمن',
      childName: 'نرگس',
      gen: 1,
      mood: 'content',
      stage: 3,
      growthDays: 11,
      lastSeenDays: 1,
      activeDream: null,
      memoriesCount: 3,
      archived: false,
      potStyle: 'terracotta',
    },
    {
      id: 'p-11',
      plantName: 'فندق',
      childName: 'آرتین',
      gen: 2,
      mood: 'content',
      stage: 2,
      growthDays: 8,
      lastSeenDays: 1,
      activeDream: null,
      memoriesCount: 4,
      archived: false,
      potStyle: 'painted',
    },
    {
      id: 'p-12',
      plantName: 'بارهنگ',
      childName: 'مرسانا',
      gen: 1,
      mood: 'content',
      stage: 4,
      growthDays: 20,
      lastSeenDays: 1,
      activeDream: 'دیشب خواب دیدم ماه از پشت پنجره سرک کشید و برگ‌هایم را نقره‌ای کرد...',
      memoriesCount: 6,
      archived: false,
      potStyle: 'mint',
    },
    {
      id: 'p-13',
      plantName: 'زیتون',
      childName: 'دانیال',
      gen: 1,
      mood: 'content',
      stage: 1,
      growthDays: 5,
      lastSeenDays: 1,
      activeDream: null,
      memoriesCount: 1,
      archived: false,
      potStyle: 'terracotta',
    },
    {
      id: 'p-14',
      plantName: 'لاله',
      childName: 'فاطمه',
      gen: 2,
      mood: 'content',
      stage: 3,
      growthDays: 15,
      lastSeenDays: 1,
      activeDream: null,
      memoriesCount: 7,
      archived: false,
      potStyle: 'wood',
    },

    // ۴ گیاه دل‌تنگ (longing)
    {
      id: 'p-15',
      plantName: 'جوانه',
      childName: 'علی',
      gen: 1,
      mood: 'longing',
      stage: 3,
      growthDays: 13,
      lastSeenDays: 3,
      activeDream: 'دیشب خواب دیدم صدای قدم‌هایت از راهرو می‌آمد و من برگ‌هایم را تکان می‌دادم...',
      memoriesCount: 4,
      archived: false,
      potStyle: 'terracotta',
    },
    {
      id: 'p-16',
      plantName: 'ریواس',
      childName: 'نیما',
      gen: 1,
      mood: 'longing',
      stage: 2,
      growthDays: 9,
      lastSeenDays: 2,
      activeDream: null,
      memoriesCount: 3,
      archived: false,
      potStyle: 'mint',
    },
    {
      id: 'p-17',
      plantName: 'شقایق',
      childName: 'الینا',
      gen: 2,
      mood: 'longing',
      stage: 4,
      growthDays: 18,
      lastSeenDays: 3,
      activeDream: 'خواب دیدم یک کفشدوزک خال‌خالی رویم نشست و گفت دوستت به‌زودی برمی‌گردد...',
      memoriesCount: 6,
      archived: false,
      potStyle: 'painted',
    },
    {
      id: 'p-18',
      plantName: 'شمعدانی',
      childName: 'حسین',
      gen: 1,
      mood: 'longing',
      stage: 2,
      growthDays: 6,
      lastSeenDays: 2,
      activeDream: null,
      memoriesCount: 2,
      archived: false,
      potStyle: 'terracotta',
    },

    // ۲ گیاه بی‌تاب (alert)
    {
      id: 'p-19',
      plantName: 'سبزه',
      childName: 'مریم',
      gen: 1,
      mood: 'alert',
      stage: 3,
      growthDays: 14,
      lastSeenDays: 5,
      activeDream: 'چند شب است خواب می‌بینم پنجره باز می‌شود و نور گرمی دوباره به گلدانم می‌تابد...',
      memoriesCount: 5,
      archived: false,
      potStyle: 'wood',
    },
    {
      id: 'p-20',
      plantName: 'گل‌پونه',
      childName: 'سهراب',
      gen: 1,
      mood: 'alert',
      stage: 2,
      growthDays: 8,
      lastSeenDays: 6,
      activeDream: null,
      memoriesCount: 2,
      archived: false,
      potStyle: 'terracotta',
    },
  ];

  const initialPlants = rawPlants.map((p, idx) => enrichPlantDefaults(p, idx));

  const seedBank = [
    {
      id: 's-1',
      plantName: 'ابریشم',
      childName: 'حلما',
      gen: 2,
      mood: 'thriving',
      stage: 5,
      growthDays: 25,
      lastSeenDays: 0,
      activeDream: 'خواب دیدم دانه‌هایم در خاک گرم می‌خندند...',
      memoriesCount: 10,
      archived: true,
      monthLabel: 'آبان',
    },
    {
      id: 's-2',
      plantName: 'سرو ناز',
      childName: 'امیرعلی',
      gen: 1,
      mood: 'thriving',
      stage: 5,
      growthDays: 24,
      lastSeenDays: 0,
      activeDream: null,
      memoriesCount: 8,
      archived: true,
      monthLabel: 'مهر',
    },
    {
      id: 's-3',
      plantName: 'نسترن',
      childName: 'باران',
      gen: 1,
      mood: 'content',
      stage: 5,
      growthDays: 24,
      lastSeenDays: 0,
      activeDream: null,
      memoriesCount: 9,
      archived: true,
      monthLabel: 'مهر',
    },
    {
      id: 's-4',
      plantName: 'پامچال',
      childName: 'آوا',
      gen: 1,
      mood: 'thriving',
      stage: 5,
      growthDays: 25,
      lastSeenDays: 0,
      activeDream: null,
      memoriesCount: 7,
      archived: true,
      monthLabel: 'مهر',
    },
    {
      id: 's-5',
      plantName: 'اقاقیا',
      childName: 'الینا',
      gen: 1,
      mood: 'content',
      stage: 5,
      growthDays: 24,
      lastSeenDays: 0,
      activeDream: null,
      memoriesCount: 8,
      archived: true,
      monthLabel: 'شهریور',
    },
  ];

  const radar = buildRadarFromPlants(initialPlants);
  radar.healthPercentage = 65;
  radar.overall = 'mixed';
  radar.overallMessage = 'امروز حال باغچه متوسط است.';

  return {
    className: 'کلاس سوم الف',
    totalPlants: initialPlants.length,
    radar,
    plants: initialPlants,
    seedBank,
  };
}

// ============================================================================
// ۳. موتور گرافیکی وکتور پیشرفته (Rich Hand-Crafted Botanical SVG + Accessories)
// ============================================================================
const BotanicalPlantSVG = ({
  mood = 'thriving',
  stage = 3,
  potStyle = 'terracotta',
  accessory = 'none',
  friend = 'none',
  isGrayscale = false,
  isGoldenSeed = false,
  size = 'normal', // 'normal' | 'large' | 'drawer' | 'hero'
}) => {
  const palette = useMemo(() => {
    if (isGrayscale) {
      return {
        main: '#B0B0B0',
        light: '#CACACA',
        dark: '#8E8E8E',
        stem: '#9E9E9E',
        potMain: '#BDBDBD',
        potRim: '#AEAEAE',
        potShadow: '#9A9A9A',
        soil: '#8C8C8C',
        blush: 'transparent',
        flowerPetal: '#D6D6D6',
        flowerCenter: '#A8A8A8',
      };
    }

    const potColors = {
      terracotta: { potMain: '#D98A6C', potRim: '#E49B7E', potShadow: '#BC6D4F' },
      painted: { potMain: '#DF9A57', potRim: '#EBB075', potShadow: '#C07B3B' },
      mint: { potMain: '#8AB59D', potRim: '#A3C9B4', potShadow: '#6E9981' },
      wood: { potMain: '#B58963', potRim: '#C79E7A', potShadow: '#966B47' },
    }[potStyle] || { potMain: '#D98A6C', potRim: '#E49B7E', potShadow: '#BC6D4F' };

    if (isGoldenSeed) {
      return {
        main: '#E6B85C',
        light: '#F4D58D',
        dark: '#C49237',
        stem: '#B88B3B',
        soil: '#6E503B',
        blush: '#F4A28C',
        flowerPetal: '#FFF6CC',
        flowerCenter: '#E09F3E',
        ...potColors,
      };
    }

    switch (mood) {
      case 'thriving':
        return {
          main: '#7BA05B',
          light: '#A5CC85',
          dark: '#5A7A3F',
          stem: '#648847',
          soil: '#6E503B',
          blush: '#F4A28C',
          flowerPetal: '#FFF3B0',
          flowerCenter: '#E8A87C',
          ...potColors,
        };
      case 'content':
        return {
          main: '#7BA05B',
          light: '#98BE77',
          dark: '#5A7A3F',
          stem: '#648847',
          soil: '#6E503B',
          blush: '#E8A87C',
          flowerPetal: '#FDFBF5',
          flowerCenter: '#E6B86A',
          ...potColors,
        };
      case 'longing':
        return {
          main: '#A5CC85',
          light: '#BDD9A3',
          dark: '#82A665',
          stem: '#8CAE70',
          soil: '#856A56',
          blush: 'transparent',
          flowerPetal: '#F2EFE4',
          flowerCenter: '#D4B483',
          ...potColors,
        };
      case 'alert':
      default:
        return {
          main: '#C8D9B5',
          light: '#DCE8CE',
          dark: '#A3B88F',
          stem: '#AEC29B',
          soil: '#968272',
          blush: 'transparent',
          flowerPetal: '#EAE7DC',
          flowerCenter: '#C4B79C',
          ...potColors,
        };
    }
  }, [mood, potStyle, isGrayscale, isGoldenSeed]);

  const animClass = isGrayscale
    ? ''
    : mood === 'thriving'
    ? 'plant-thriving'
    : mood === 'content'
    ? 'plant-content'
    : mood === 'longing'
    ? 'plant-longing'
    : 'plant-alert';

  const bodyScale = mood === 'thriving' && !isGrayscale ? 1.05 : mood === 'alert' && !isGrayscale ? 0.95 : 1;
  const bodyTilt = isGrayscale ? 0 : mood === 'longing' ? -5 : mood === 'alert' ? -10 : 0;

  const headY = stage <= 1 ? 66 : stage === 2 ? 56 : stage === 3 ? 45 : stage === 4 ? 38 : 34;
  const headX = mood === 'alert' ? 54 : mood === 'longing' ? 57 : 60;
  const headRadius = stage <= 1 ? 14.5 : stage === 2 ? 16 : 17.5;

  const dimensions =
    size === 'hero'
      ? 'w-52 h-60 md:w-60 md:h-64'
      : size === 'large'
      ? 'w-28 h-32'
      : size === 'drawer'
      ? 'w-24 h-28'
      : 'w-[68px] h-[82px]';

  return (
    <svg
      viewBox="0 0 120 140"
      className={`${dimensions} overflow-visible select-none`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`glow-${mood}-${stage}`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={isGoldenSeed ? '#FFF3B0' : '#E6F4D7'} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#E6F4D7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`pot-grad-${potStyle}-${isGrayscale ? 'g' : 'c'}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.potRim} />
          <stop offset="55%" stopColor={palette.potMain} />
          <stop offset="100%" stopColor={palette.potShadow} />
        </linearGradient>
      </defs>

      {/* درخشش پس‌زمینه برای گیاهان شاداب */}
      {(mood === 'thriving' || isGoldenSeed) && !isGrayscale && (
        <circle cx="60" cy="58" r="48" fill={`url(#glow-${mood}-${stage})`} />
      )}

      {/* سایه‌ی زیر گلدان */}
      <ellipse cx="60" cy="131" rx="28" ry="5" fill="#5A7A3F" opacity="0.15" />

      {/* حلقه‌ی نارنجی ملایم دور گلدان برای حالت دل‌تنگ (longing) */}
      {mood === 'longing' && !isGrayscale && (
        <ellipse
          cx="60"
          cy="112"
          rx="36"
          ry="22"
          fill="none"
          stroke="#E8A87C"
          strokeWidth="3.5"
          strokeDasharray="6 4"
          opacity="0.38"
        />
      )}

      {/* ابر کوچک دلتنگی بالای گیاه برای حالت longing */}
      {mood === 'longing' && !isGrayscale && (
        <g className="longing-cloud-anim" transform="translate(74, 8)">
          <path
            d="M10 16 H26 A6 6 0 0 0 27 4 A8 8 0 0 0 12 2 A6 6 0 0 0 10 16 Z"
            fill="#E8A87C"
            opacity="0.35"
          />
          <circle cx="15" cy="21" r="2" fill="#E8A87C" opacity="0.4" />
        </g>
      )}

      {/* گروه متحرک گیاه */}
      <g className={animClass}>
        <g transform={`translate(60, 96) rotate(${bodyTilt}) scale(${bodyScale}) translate(-60, -96)`}>
          {/* ساقه‌ی اصلی ارگانیک */}
          <path
            d={
              mood === 'alert'
                ? `M60 96 Q53 ${(96 + headY) / 2} 54 ${headY + 8}`
                : mood === 'longing'
                ? `M60 96 Q56 ${(96 + headY) / 2} 57 ${headY + 8}`
                : `M60 96 Q57 ${(96 + headY) / 2} 60 ${headY + 8}`
            }
            stroke={palette.stem}
            strokeWidth={stage >= 4 ? '5.5' : '4.5'}
            strokeLinecap="round"
            fill="none"
          />

          {/* برگ‌های مرحله‌ی ۲ به بالا */}
          {stage >= 2 && (
            <>
              <path
                d={
                  mood === 'alert'
                    ? 'M58 84 Q34 86 28 96 Q42 96 58 88 Z'
                    : 'M59 83 Q34 73 29 58 Q45 63 59 76 Z'
                }
                fill={palette.main}
              />
              <path
                d={
                  mood === 'alert'
                    ? 'M56 85 Q41 88 33 93'
                    : 'M57 80 Q42 72 34 62'
                }
                stroke={palette.light}
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
              />

              <path
                d={
                  mood === 'alert'
                    ? 'M59 80 Q83 82 89 92 Q75 93 59 84 Z'
                    : 'M60 77 Q85 67 90 52 Q74 57 60 70 Z'
                }
                fill={palette.light}
              />
              <path
                d={
                  mood === 'alert'
                    ? 'M61 81 Q76 84 84 89'
                    : 'M62 74 Q77 66 85 56'
                }
                stroke={palette.main}
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* برگ‌های مرحله‌ی ۳ و ۴ و ۵ */}
          {stage >= 3 && (
            <>
              <path
                d={
                  mood === 'alert'
                    ? 'M56 68 Q30 68 24 79 Q38 80 56 72 Z'
                    : 'M59 66 Q30 52 26 36 Q44 42 59 58 Z'
                }
                fill={palette.light}
              />
              <path
                d={
                  mood === 'alert'
                    ? 'M57 65 Q82 65 88 76 Q74 77 57 69 Z'
                    : 'M61 62 Q88 48 92 33 Q74 39 61 54 Z'
                }
                fill={palette.main}
              />
            </>
          )}

          {/* برگ‌های تاجی برای مرحله‌ی ۴ و ۵ */}
          {stage >= 4 && (
            <>
              <path d="M52 30 Q36 14 28 22 Q35 34 49 36 Z" fill={palette.dark} opacity="0.85" />
              <path d="M68 30 Q84 14 92 22 Q85 34 71 36 Z" fill={palette.dark} opacity="0.85" />
            </>
          )}

          {/* گلبرگ‌های شکوفایی برای مرحله‌ی ۵ */}
          {stage === 5 && (
            <g transform={`translate(${headX}, ${headY})`}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-21"
                  rx="7.5"
                  ry="11"
                  fill={palette.flowerPetal}
                  stroke={palette.flowerCenter}
                  strokeWidth="1"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>
          )}

          {/* جوانه‌ی کوچک بالای سر برای مرحله‌ی ۱ */}
          {stage <= 1 && (
            <g transform={`translate(${headX}, ${headY - 14})`}>
              <path d="M0 4 Q-12 -8 -4 -14 Q4 -8 0 4 Z" fill={palette.light} />
              <path d="M0 4 Q12 -8 4 -14 Q-4 -8 0 4 Z" fill={palette.main} />
            </g>
          )}

          {/* سر گرد و بامزه‌ی کاراکتر گیاه */}
          <g transform={`translate(${headX}, ${headY})`}>
            <circle cx="0" cy="0" r={headRadius} fill={palette.main} />
            <ellipse
              cx="-5"
              cy="-7"
              rx="6"
              ry="3.5"
              fill={palette.light}
              opacity="0.65"
              transform="rotate(-20 -5 -7)"
            />

            {/* گونه‌های گل‌انداخته */}
            {palette.blush !== 'transparent' && (
              <>
                <ellipse cx="-9.5" cy="3" rx="3.2" ry="2" fill={palette.blush} opacity="0.65" />
                <ellipse cx="9.5" cy="3" rx="3.2" ry="2" fill={palette.blush} opacity="0.65" />
              </>
            )}

            {/* چشم‌ها */}
            {mood === 'thriving' || mood === 'content' ? (
              <>
                <circle cx="-6" cy="-1.5" r="2.6" fill="#2D2D2D" />
                <circle cx="6" cy="-1.5" r="2.6" fill="#2D2D2D" />
                <circle cx="-6.8" cy="-2.4" r="0.9" fill="#FFFFFF" />
                <circle cx="5.2" cy="-2.4" r="0.9" fill="#FFFFFF" />
              </>
            ) : mood === 'longing' ? (
              <>
                <circle cx="-6" cy="-0.5" r="2.4" fill="#2D2D2D" />
                <circle cx="6" cy="-0.5" r="2.4" fill="#2D2D2D" />
                <path d="M-9.5 -4.5 Q-6 -6 -3.5 -3.8" stroke="#2D2D2D" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                <path d="M3.5 -3.8 Q6 -6 9.5 -4.5" stroke="#2D2D2D" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M-8.5 0 Q-6 2.5 -3.5 0" stroke="#2D2D2D" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                <path d="M3.5 0 Q6 2.5 8.5 0" stroke="#2D2D2D" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* دهان */}
            {mood === 'thriving' ? (
              <path d="M-4.5 4.2 Q0 8.2 4.5 4.2" stroke="#2D2D2D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            ) : mood === 'content' ? (
              <path d="M-4 4.8 Q0 7.2 4 4.8" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            ) : mood === 'longing' ? (
              <path d="M-3.5 6.2 Q0 4.5 3.5 6.2" stroke="#2D2D2D" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            ) : (
              <ellipse cx="0" cy="6" rx="2.2" ry="1.5" fill="none" stroke="#2D2D2D" strokeWidth="1.3" />
            )}

            {/* اکسسوری‌های کلاه و پاپیون روی سر گیاه (در صورت فعال بودن) */}
            {!isGrayscale && accessory === 'ribbon' && (
              <g transform="translate(10, -12) rotate(18)">
                <path d="M0 0 L-7 -5 L-7 5 Z" fill="#F28482" />
                <path d="M0 0 L7 -5 L7 5 Z" fill="#F28482" />
                <circle cx="0" cy="0" r="2.3" fill="#D9534F" />
              </g>
            )}
            {!isGrayscale && accessory === 'strawhat' && (
              <g transform="translate(0, -16)">
                <ellipse cx="0" cy="2" rx="22" ry="4.5" fill="#E9C46A" stroke="#C9A243" strokeWidth="1" />
                <path d="M-12 2 Q0 -14 12 2 Z" fill="#F4D58D" stroke="#C9A243" strokeWidth="1" />
                <path d="M-11 1 Q0 3 11 1" stroke="#E76F51" strokeWidth="2.5" fill="none" />
              </g>
            )}
            {!isGrayscale && accessory === 'crown' && (
              <g transform="translate(0, -17)">
                <path
                  d="M-10 3 L-12 -6 L-5 -1 L0 -8 L5 -1 L12 -6 L10 3 Z"
                  fill="#F2C94C"
                  stroke="#D4A017"
                  strokeWidth="1"
                />
                <circle cx="0" cy="-4" r="1.5" fill="#E76F51" />
              </g>
            )}
          </g>

          {/* دوستان کوچک گیاه (کفشدوزک، پروانه، پرنده) */}
          {!isGrayscale && friend === 'ladybug' && stage >= 2 && (
            <g transform="translate(39, 69) rotate(-25)">
              <ellipse cx="0" cy="0" rx="5" ry="4" fill="#E63946" />
              <circle cx="4" cy="0" r="2" fill="#2D2D2D" />
              <circle cx="-1" cy="-1.5" r="0.9" fill="#2D2D2D" />
              <circle cx="1" cy="1.5" r="0.9" fill="#2D2D2D" />
            </g>
          )}
          {!isGrayscale && friend === 'butterfly' && (
            <g className="friend-float" transform="translate(92, 26)">
              <path d="M0 0 C-8 -10 -14 -2 -2 2 C-12 6 -6 12 0 3 Z" fill="#F4A261" opacity="0.9" />
              <path d="M0 0 C8 -10 14 -2 2 2 C12 6 6 12 0 3 Z" fill="#E9C46A" opacity="0.9" />
              <line x1="0" y1="-2" x2="0" y2="5" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}
          {!isGrayscale && friend === 'bird' && (
            <g transform="translate(81, 83)">
              <ellipse cx="0" cy="0" rx="6.5" ry="5" fill="#72A1E5" />
              <circle cx="-4" cy="-3" r="4" fill="#72A1E5" />
              <polygon points="-8,-3 -11,-1.5 -8,0" fill="#F4A261" />
              <circle cx="-5" cy="-3.5" r="1" fill="#2D2D2D" />
            </g>
          )}
        </g>
      </g>

      {/* ذرات طلایی برای گیاهان thriving */}
      {(mood === 'thriving' || isGoldenSeed) && !isGrayscale && (
        <g>
          <g className="gold-particle-1" transform="translate(22, 44)">
            <circle cx="0" cy="0" r="3.2" fill="#F2C94C" />
            <circle cx="0" cy="0" r="6" fill="#F2C94C" opacity="0.35" />
          </g>
          <g className="gold-particle-2" transform="translate(95, 34)">
            <circle cx="0" cy="0" r="2.8" fill="#F2C94C" />
            <circle cx="0" cy="0" r="5" fill="#F2C94C" opacity="0.35" />
          </g>
        </g>
      )}

      {/* گلدان سه‌بعدی دست‌ساز در پایین */}
      <g>
        <ellipse cx="60" cy="95" rx="24" ry="5.5" fill={palette.soil} />
        <path
          d="M35 95 L41 126 Q60 131 79 126 L85 95 Z"
          fill={`url(#pot-grad-${potStyle}-${isGrayscale ? 'g' : 'c'})`}
        />
        <rect
          x="32"
          y="89"
          width="56"
          height="8"
          rx="4"
          fill={palette.potRim}
          stroke={palette.potShadow}
          strokeWidth="0.8"
        />
        {potStyle === 'painted' && !isGrayscale && (
          <path
            d="M40 108 Q45 103 50 108 T60 108 T70 108 T80 108"
            fill="none"
            stroke="#FDFBF5"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
        )}
      </g>
    </svg>
  );
};

// آیکون SVG بذر آرشیوشده در بذرخانه
const SeedArchiveSVG = () => (
  <svg viewBox="0 0 80 80" className="w-14 h-14 mx-auto" aria-hidden="true">
    <ellipse cx="40" cy="67" rx="18" ry="4" fill="#B0B0B0" opacity="0.25" />
    <path
      d="M40 16 C54 28 58 46 40 62 C22 46 26 28 40 16 Z"
      fill="#B0B0B0"
      stroke="#8E8E8E"
      strokeWidth="2"
    />
    <path d="M35 28 Q31 40 36 52" stroke="#DCDCDC" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M40 16 Q46 8 53 11 Q48 18 40 16 Z" fill="#9E9E9E" />
    <circle cx="36" cy="40" r="1.8" fill="#5A5A5A" />
    <circle cx="44" cy="40" r="1.8" fill="#5A5A5A" />
    <path d="M37 45 Q40 47.5 43 45" stroke="#5A5A5A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// ۴. کامپوننت تمام‌صفحه و فوق‌العاده جذاب اتاق دانش‌آموز (StudentPWAView)
// ============================================================================
const StudentPWAView = ({
  plants,
  activeStudentId,
  onSelectStudent,
  onCompleteHabit,
  onCustomizePlant,
  onRenamePlant,
  onPlantNewSeed,
  onCreateNewStudentPlant,
}) => {
  const [subTab, setSubTab] = useState('room'); // 'room' | 'closet' | 'week' | 'memories'
  const [simulatedHour, setSimulatedHour] = useState(6); // پیش‌فرض ۶:۳۰ صبح تا کودک بتواند بیدارباش را تست کند
  const [isJumping, setIsJumping] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [storyBanner, setStoryBanner] = useState(null);
  const [dreamPopup, setDreamPopup] = useState(null);
  const [seedModalOpen, setSeedModalOpen] = useState(false);
  const [newSeedName, setNewSeedName] = useState('');
  const [renameMode, setRenameMode] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [newOnboardingOpen, setNewOnboardingOpen] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newPlantName, setNewPlantName] = useState('');
  const [onboardingError, setOnboardingError] = useState('');

  const student = useMemo(() => {
    return plants.find((p) => p.id === activeStudentId) || plants[0];
  }, [plants, activeStudentId]);

  if (!student) return null;

  // تعیین فاز آسمان پنجره‌ی اتاق بر اساس ساعت شبیه‌ساز
  const skyTheme = useMemo(() => {
    if (simulatedHour >= 5 && simulatedHour < 8) {
      return {
        label: 'سحرگاه طلایی (۶:۳۰ صبح)',
        windowBg: 'linear-gradient(180deg, #FDE4C8 0%, #FFF7E4 100%)',
        roomBg: 'linear-gradient(180deg, #FAF4E6 0%, #F4EFE0 100%)',
        celestial: 'sunrise',
      };
    }
    if (simulatedHour >= 8 && simulatedHour < 16) {
      return {
        label: 'روز آفتابی (۱۲:۰۰ ظهر)',
        windowBg: 'linear-gradient(180deg, #CBE8F8 0%, #EFF9FE 100%)',
        roomBg: 'linear-gradient(180deg, #F7F9F2 0%, #EFECE0 100%)',
        celestial: 'sun',
      };
    }
    if (simulatedHour >= 16 && simulatedHour < 19) {
      return {
        label: 'عصر نارنجی (۱۷:۳۰ عصر)',
        windowBg: 'linear-gradient(180deg, #F6C6A5 0%, #FDE8D0 100%)',
        roomBg: 'linear-gradient(180deg, #F9F2E7 0%, #EFE6D5 100%)',
        celestial: 'sunset',
      };
    }
    return {
      label: 'شب پرستاره (۲۱:۰۰ شب)',
      windowBg: 'linear-gradient(180deg, #2C3E5A 0%, #4B6282 100%)',
      roomBg: 'linear-gradient(180deg, #EAE8DF 0%, #DFDDD2 100%)',
      celestial: 'moon',
    };
  }, [simulatedHour]);

  // تولید بارش قلب و شبنم
  const triggerParticles = (emoji = '💚') => {
    const batch = Array.from({ length: 7 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      emoji: i % 2 === 0 ? emoji : '✨',
      left: 30 + Math.random() * 40,
      delay: i * 0.06,
    }));
    setFloatingHearts(batch);
    setTimeout(() => setFloatingHearts([]), 1400);
  };

  // نوازش مستقیم گیاه با لمس آن
  const handleTouchPlant = () => {
    Sfx.playTap();
    setIsJumping(true);
    triggerParticles('🌿');
    setTimeout(() => setIsJumping(false), 750);

    const messages = {
      thriving: `«${student.plantName}» برگ‌هایش را با خوشحالی برایت تکان می‌دهد!`,
      content: `«${student.plantName}» از اینکه کنارش هستی احساس آرامش می‌کند.`,
      longing: `«${student.plantName}» سرش را بالا می‌آورد: «دلم برایت تنگ شده بود دوست من!»`,
      alert: `«${student.plantName}» با مهربانی نفس عمیقی می‌کشد؛ چقدر خوب که برگشتی!`,
    };
    setStoryBanner({ type: 'warm', text: messages[student.mood] });
  };

  // انجام یکی از ۴ عادت روزانه
  const handleHabitClick = (habit) => {
    const alreadyDone = (student.completedHabitsToday || []).includes(habit.key);
    if (alreadyDone) {
      Sfx.playTap();
      setStoryBanner({
        type: 'info',
        text: `عادت «${habit.title}» امروز ثبت شده است. فردا دوباره با هم انجامش می‌دهیم!`,
      });
      return;
    }

    // قانون ساعت ۷ صبح برای بیدارباش
    if (habit.wakeRule && simulatedHour >= 7) {
      Sfx.playGentleError();
      setStoryBanner({
        type: 'gentle_warn',
        text: 'خورشید زودتر از تو بیدار شده! ☀️ بیدارباش فقط قبل از ساعت ۷ صبح ثبت می‌شود (می‌توانی با دکمه‌ی ساعت در بالا، سحرگاه را تست کنی).',
      });
      return;
    }

    if (habit.wakeRule) {
      Sfx.playWakeUp();
      triggerParticles('☀️');
    } else {
      Sfx.playHabitDone();
      triggerParticles('💚');
    }

    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 750);

    const result = onCompleteHabit(student.id, habit.key);
    if (result?.dreamTriggered) {
      setTimeout(() => {
        Sfx.playDream();
        setDreamPopup(result.dreamTriggered);
      }, 500);
    }

    setStoryBanner({
      type: 'success',
      text: result?.narrativeMessage || `«${student.plantName}» از اینکه «${habit.title}» را انجام دادی، شاداب‌تر شد! 🌱`,
    });
  };

  // اعتبارسنجی نام فارسی (۲ تا ۱۲ حرف)
  const isValidPersianName = (str) => {
    const clean = (str || '').trim().replace(/\s+/g, ' ');
    return clean.length >= 2 && clean.length <= 15;
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (!isValidPersianName(renameInput)) {
      setStoryBanner({ type: 'gentle_warn', text: 'نام گیاه باید بین ۲ تا ۱۵ حرف باشد.' });
      return;
    }
    onRenamePlant(student.id, renameInput.trim());
    setRenameMode(false);
    Sfx.playHabitDone();
    setStoryBanner({ type: 'success', text: `نام گیاهت به «${renameInput.trim()}» تغییر کرد!` });
  };

  const handlePlantNewGeneration = (e) => {
    e.preventDefault();
    if (!isValidPersianName(newSeedName)) return;
    Sfx.playSeedCelebration();
    onPlantNewSeed(student.id, newSeedName.trim());
    setSeedModalOpen(false);
    setNewSeedName('');
    triggerParticles('🌼');
    setStoryBanner({
      type: 'success',
      text: `نسل جدید با نام «${newSeedName.trim()}» کاشته شد و گیاه قبلی به بذرخانه‌ی کلاس رفت!`,
    });
  };

  const handleCreateStudentSubmit = (e) => {
    e.preventDefault();
    if (!isValidPersianName(newChildName) || !isValidPersianName(newPlantName)) {
      setOnboardingError('لطفاً نام خودت و نام جوانه‌ات را (حداقل ۲ حرف) بنویس.');
      return;
    }
    Sfx.playSeedCelebration();
    onCreateNewStudentPlant(newChildName.trim(), newPlantName.trim());
    setNewOnboardingOpen(false);
    setNewChildName('');
    setNewPlantName('');
    setOnboardingError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {/* نوار انتخاب دانش‌آموز و شبیه‌ساز ساعت روز (برای تست راحت شما) */}
      <div className="bg-white/90 border border-[#E5DEC9] rounded-[16px] p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="student-picker" className="text-[13px] font-semibold text-[#5A7A3F]">
            👧 تجربه از نگاه دانش‌آموز:
          </label>
          <select
            id="student-picker"
            value={student.id}
            onChange={(e) => {
              onSelectStudent(e.target.value);
              setStoryBanner(null);
            }}
            className="px-3 py-1.5 rounded-[10px] bg-[#FAF8F1] border border-[#C8D9B5] text-[14px] font-semibold text-[#2D2D2D] focus:outline-none focus:border-[#7BA05B]"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.childName} — گیاه «{p.plantName}» ({MOOD_LABELS[p.mood]})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setNewOnboardingOpen(true)}
            className="px-3 py-1.5 rounded-[10px] bg-[#7BA05B]/15 hover:bg-[#7BA05B]/25 text-[#5A7A3F] text-[13px] font-semibold transition-colors"
          >
            + کاشتن جوانه‌ی دانش‌آموز جدید
          </button>
        </div>

        {/* دکمه‌های تغییر ساعت آسمان برای تست قانون بیدارباش قبل از ۷ صبح */}
        <div className="flex items-center gap-1.5 bg-[#F5F2E8] px-2.5 py-1 rounded-[10px] border border-[#E5DEC9] text-[12px]">
          <span className="text-[#7A7A7A] ml-1">ساعت اتاق:</span>
          {[
            { h: 6, label: '۶ صبح (بیدارباش)' },
            { h: 12, label: 'ظهر' },
            { h: 17, label: 'عصر' },
            { h: 21, label: 'شب' },
          ].map((t) => (
            <button
              key={t.h}
              type="button"
              onClick={() => setSimulatedHour(t.h)}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                simulatedHour === t.h
                  ? 'bg-[#7BA05B] text-white'
                  : 'text-[#2D2D2D] hover:bg-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* کارت اصلی اتاق گیاه و تب‌های چهارگانه */}
      <div className="bg-white border border-[#E5DEC9] rounded-[20px] shadow-md overflow-hidden">
        {/* صحنه‌ی گرافیکی اتاق گیاه (پنجره، آسمان پویا، طاقچه چوبی، گیاه سخنگو) */}
        <div
          className="relative p-5 md:p-7 transition-colors duration-700 overflow-hidden"
          style={{ background: skyTheme.roomBg }}
        >
          {/* پنجره‌ی دلباز پشت گیاه با آسمان زنده */}
          <div className="max-w-md mx-auto relative">
            <div
              className="w-48 h-44 sm:w-56 sm:h-48 mx-auto rounded-t-full border-4 border-[#D8C7A8] shadow-inner relative overflow-hidden transition-all duration-700"
              style={{ background: skyTheme.windowBg }}
            >
              {/* خورشید / ماه و ابرها داخل پنجره */}
              {skyTheme.celestial === 'sunrise' && (
                <div className="w-12 h-12 rounded-full bg-[#F5B041] opacity-90 absolute bottom-4 right-8 shadow-lg" />
              )}
              {skyTheme.celestial === 'sun' && (
                <div className="w-11 h-11 rounded-full bg-[#F7DC6F] absolute top-6 right-8 shadow-md" />
              )}
              {skyTheme.celestial === 'sunset' && (
                <div className="w-12 h-12 rounded-full bg-[#E76F51] opacity-85 absolute bottom-3 left-8" />
              )}
              {skyTheme.celestial === 'moon' && (
                <>
                  <div className="w-9 h-9 rounded-full bg-[#FDFBF5] absolute top-6 left-10 shadow-sm" />
                  <span className="absolute top-5 right-12 text-xs text-white/80">✦</span>
                  <span className="absolute top-12 right-7 text-[10px] text-white/70">★</span>
                  <span className="absolute top-16 left-20 text-xs text-white/80">✧</span>
                </>
              )}

              {/* چهارچوب چوبی پنجره */}
              <div className="absolute inset-x-0 top-1/2 h-1.5 bg-[#D8C7A8]" />
              <div className="absolute inset-y-0 left-1/2 w-1.5 bg-[#D8C7A8]" />
            </div>

            {/* کاراکتر گیاه روی طاقچه (قابل لمس و نوازش) */}
            <div className="relative -mt-28 flex flex-col items-center z-10">
              {/* ذرات شناور قلب و شبنم هنگام انجام عادت */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {floatingHearts.map((h) => (
                  <span
                    key={h.id}
                    style={{ left: `${h.left}%`, animationDelay: `${h.delay}s` }}
                    className="floating-particle absolute top-16 text-2xl"
                  >
                    {h.emoji}
                  </span>
                ))}
              </div>

              {/* حباب رویا در صورتی که گیاه خواب دیده باشد */}
              {student.activeDream && (
                <button
                  type="button"
                  onClick={() => {
                    Sfx.playDream();
                    setDreamPopup(student.activeDream);
                  }}
                  className="mb-1 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white border border-[#C8D9B5] shadow-sm text-[13px] font-semibold text-[#5A7A3F] flex items-center gap-1.5 animate-bounce"
                >
                  <span>🌙</span>
                  <span>دیشب یه خواب دیدم! (بزن تا بگم)</span>
                </button>
              )}

              {/* گیاه تعاملی */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleTouchPlant}
                onKeyDown={(e) => e.key === 'Enter' && handleTouchPlant()}
                title="برای نوازش گیاه کلیک کن!"
                className={`cursor-pointer transition-transform ${
                  isJumping ? 'plant-happy-jump' : ''
                }`}
              >
                <BotanicalPlantSVG
                  mood={student.mood}
                  stage={student.stage}
                  potStyle={student.potStyle}
                  accessory={student.accessory}
                  friend={student.friend}
                  isGoldenSeed={student.readyForSeed}
                  size="hero"
                />
              </div>

              {/* میز / طاقچه‌ی چوبی گرم زیر گلدان */}
              <div className="w-64 sm:w-80 h-4 bg-[#C8A986] rounded-full border-b-4 border-[#A88967] -mt-3 shadow-sm" />
            </div>
          </div>

          {/* شناسنامه‌ی گیاه زیر طاقچه (نام، نسل، مرحله، روزهای با هم بودن — بدون امتیاز!) */}
          <div className="mt-4 text-center">
            {!renameMode ? (
              <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#E5DEC9] shadow-sm">
                <h2 className="text-[20px] font-bold text-[#2D2D2D]">
                  {student.plantName}
                </h2>
                <span className="text-[13px] px-2 py-0.5 rounded-full bg-[#7BA05B]/15 text-[#5A7A3F] font-semibold">
                  نسل {student.gen}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRenameInput(student.plantName);
                    setRenameMode(true);
                  }}
                  className="text-[12px] text-[#7A7A7A] hover:text-[#2D2D2D] px-1"
                  title="تغییر نام گیاه"
                >
                  ✎
                </button>
              </div>
            ) : (
              <form onSubmit={handleRenameSubmit} className="inline-flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#7BA05B]">
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="px-2.5 py-1 text-[14px] rounded-lg border border-[#E5DEC9] focus:outline-none"
                  placeholder="نام جدید گیاه..."
                  autoFocus
                />
                <button type="submit" className="px-3 py-1 bg-[#7BA05B] text-white text-[13px] rounded-lg font-semibold">
                  ثبت
                </button>
                <button
                  type="button"
                  onClick={() => setRenameMode(false)}
                  className="px-2 py-1 text-[13px] text-[#7A7A7A]"
                >
                  انصراف
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 text-[13px] text-[#5A5A5A]">
              <span className="bg-white/75 px-3 py-1 rounded-full border border-[#E5DEC9]">
                🌱 مرحله: <strong>{STAGE_LABELS[student.stage]}</strong>
              </span>
              <span className="bg-white/75 px-3 py-1 rounded-full border border-[#E5DEC9]">
                💚 حالِ امروز: <strong>{MOOD_LABELS[student.mood]}</strong>
              </span>
              <span className="bg-white/75 px-3 py-1 rounded-full border border-[#E5DEC9]">
                ☀️ <strong>{student.growthDays} روز</strong> مراقبت و دوستی
              </span>
            </div>

            {/* دکمه‌ی جشن بذر در صورتی که گیاه به مرحله‌ی ۵ و ۲۴ روز رسیده باشد */}
            {student.readyForSeed && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setSeedModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#F4D58D] hover:bg-[#E9C46A] text-[#5A4214] font-bold text-[14px] border border-[#D4A017] shadow-sm transition-all"
                >
                  🌰 «{student.plantName}» بذر طلایی داده! کاشتن نسل {student.gen + 1}
                </button>
              </div>
            )}
          </div>

          {/* پیام داستانی و بازخورد مهربانانه */}
          {storyBanner && (
            <div
              className={`mt-4 max-w-lg mx-auto p-3 rounded-[14px] text-[14px] text-center font-medium border animate-fade-in ${
                storyBanner.type === 'gentle_warn'
                  ? 'bg-[#FDF6EC] border-[#E8A87C] text-[#7A4E2D]'
                  : 'bg-white/95 border-[#A5CC85] text-[#2D2D2D]'
              }`}
            >
              {storyBanner.text}
            </div>
          )}
        </div>

        {/* نوار ناوبری پایین اتاق دانش‌آموز (۴ بخش جذاب) */}
        <div className="bg-[#FAF8F2] border-y border-[#E5DEC9] px-4 py-2 flex items-center justify-around gap-2">
          {[
            { id: 'room', label: 'کارهای امروز', icon: '🌿' },
            { id: 'closet', label: 'کمد و تزئین اتاق', icon: '🎨' },
            { id: 'week', label: 'برگ‌های هفته‌ی من', icon: '📅' },
            { id: 'memories', label: 'دفتر خاطرات و رویا', icon: '📖' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                Sfx.playTap();
                setSubTab(tab.id);
              }}
              className={`flex-1 py-2.5 px-2 rounded-[12px] text-[14px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
                subTab === tab.id
                  ? 'bg-[#7BA05B] text-white shadow-sm'
                  : 'text-[#5A5A5A] hover:bg-[#EFECE2]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* محتوای تب فعال */}
        <div className="p-5 md:p-6 bg-[#FDFBF5]">
          {/* تب ۱: ۴ عادت روزانه‌ی دانش‌آموز */}
          {subTab === 'room' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-bold text-[#2D2D2D]">
                  ریتم روزانه‌ی من و «{student.plantName}»
                </h3>
                <span className="text-[13px] text-[#7A7A7A]">
                  هر روز حتی ۱ کار کوچک هم گیاهت را خوشحال نگه می‌دارد
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {DAILY_HABITS.map((habit) => {
                  const isDone = (student.completedHabitsToday || []).includes(habit.key);
                  return (
                    <button
                      key={habit.key}
                      type="button"
                      onClick={() => handleHabitClick(habit)}
                      style={{
                        backgroundColor: isDone ? '#F2F7ED' : habit.color,
                        borderColor: isDone ? '#7BA05B' : habit.border,
                      }}
                      className="p-4 rounded-[16px] border-2 text-right transition-all hover:scale-[1.01] flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center text-2xl shadow-sm shrink-0">
                          {habit.icon}
                        </div>
                        <div>
                          <div className="text-[16px] font-bold text-[#2D2D2D] flex items-center gap-2">
                            <span>{habit.title}</span>
                          </div>
                          <p className="text-[13px] text-[#666666] mt-0.5">
                            {habit.subtitle}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-colors ${
                          isDone
                            ? 'bg-[#7BA05B] text-white'
                            : 'bg-white/80 text-[#7A7A7A] border border-[#D8D0BC]'
                        }`}
                      >
                        {isDone ? '✓' : '+'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* تب ۲: کمد شخصی‌سازی (گلدان‌ها، کلاه‌ها، دوستان کوچک — بدون پس گرفتن آنلاک‌ها) */}
          {subTab === 'closet' && (
            <div className="space-y-5">
              <p className="text-[14px] text-[#5A7A3F] bg-[#F3F7EE] p-3 rounded-[12px] border border-[#C8D9B5]">
                ✨ هرچه روزهای بیشتری کنار گیاهت باشی، یادگاری‌های بیشتری باز می‌شوند و برای همیشه (حتی در نسل‌های بعدی) مال تو می‌مانند!
              </p>

              {/* انتخاب گلدان */}
              <div>
                <h4 className="text-[15px] font-bold text-[#2D2D2D] mb-2.5">🪴 گلدان‌ها</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {UNLOCKABLE_ITEMS.pots.map((item) => {
                    const unlocked = student.stage >= item.minStage || student.growthDays >= item.minDays || student.gen > 1;
                    const active = student.potStyle === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          Sfx.playTap();
                          onCustomizePlant(student.id, { potStyle: item.id });
                        }}
                        className={`p-3 rounded-[12px] border text-center transition-all ${
                          active
                            ? 'bg-[#7BA05B]/15 border-[#7BA05B] font-bold'
                            : unlocked
                            ? 'bg-white hover:bg-[#FAF8F2] border-[#E5DEC9]'
                            : 'bg-[#F2F0E8] border-[#E5DEC9] opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-2xl mb-1">{unlocked ? item.icon : '🔒'}</div>
                        <div className="text-[13px] text-[#2D2D2D]">{item.name}</div>
                        {!unlocked && (
                          <div className="text-[11px] text-[#7A7A7A] mt-0.5">
                            نیاز به {item.minDays} روز دوستی
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* انتخاب کلاه و پاپیون */}
              <div>
                <h4 className="text-[15px] font-bold text-[#2D2D2D] mb-2.5">👒 کلاه و یادگاری روی سر</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {UNLOCKABLE_ITEMS.accessories.map((item) => {
                    const unlocked = student.stage >= item.minStage || student.growthDays >= item.minDays || student.gen > 1;
                    const active = (student.accessory || 'none') === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          Sfx.playTap();
                          onCustomizePlant(student.id, { accessory: item.id });
                        }}
                        className={`p-3 rounded-[12px] border text-center transition-all ${
                          active
                            ? 'bg-[#7BA05B]/15 border-[#7BA05B] font-bold'
                            : unlocked
                            ? 'bg-white hover:bg-[#FAF8F2] border-[#E5DEC9]'
                            : 'bg-[#F2F0E8] border-[#E5DEC9] opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-2xl mb-1">{unlocked ? item.icon : '🔒'}</div>
                        <div className="text-[13px] text-[#2D2D2D]">{item.name}</div>
                        {!unlocked && (
                          <div className="text-[11px] text-[#7A7A7A] mt-0.5">
                            نیاز به {item.minDays} روز دوستی
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* انتخاب دوست کوچک */}
              <div>
                <h4 className="text-[15px] font-bold text-[#2D2D2D] mb-2.5">🦋 مهمان کوچک کنار گلدان</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {UNLOCKABLE_ITEMS.friends.map((item) => {
                    const unlocked = student.stage >= item.minStage || student.growthDays >= item.minDays || student.gen > 1;
                    const active = (student.friend || 'none') === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          Sfx.playTap();
                          onCustomizePlant(student.id, { friend: item.id });
                        }}
                        className={`p-3 rounded-[12px] border text-center transition-all ${
                          active
                            ? 'bg-[#7BA05B]/15 border-[#7BA05B] font-bold'
                            : unlocked
                            ? 'bg-white hover:bg-[#FAF8F2] border-[#E5DEC9]'
                            : 'bg-[#F2F0E8] border-[#E5DEC9] opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-2xl mb-1">{unlocked ? item.icon : '🔒'}</div>
                        <div className="text-[13px] text-[#2D2D2D]">{item.name}</div>
                        {!unlocked && (
                          <div className="text-[11px] text-[#7A7A7A] mt-0.5">
                            نیاز به {item.minDays} روز دوستی
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* تب ۳: برگ‌های هفته‌ی من (نمای بصری بدون استریک تنبیهی) */}
          {subTab === 'week' && (
            <div>
              <h3 className="text-[16px] font-bold text-[#2D2D2D] mb-2">
                برگ‌های مراقبت این هفته
              </h3>
              <p className="text-[13px] text-[#7A7A7A] mb-4">
                هر روزی که به «{student.plantName}» سر بزنی، یک برگ سبز در تقویم هفته‌ات شکوفا می‌شود. هیچ روز ازدست‌رفته‌ای باعث سوختن برگ‌های قبلی نمی‌شود!
              </p>

              <div className="grid grid-cols-7 gap-2 text-center">
                {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'امروز'].map((dayLabel, idx) => {
                  const cared = idx === 6 ? (student.completedHabitsToday || []).length > 0 : student.weekHistory?.[idx];
                  return (
                    <div
                      key={dayLabel}
                      className={`p-3 rounded-[14px] border flex flex-col items-center gap-2 ${
                        cared
                          ? 'bg-[#F2F7ED] border-[#A5CC85]'
                          : 'bg-[#FAF8F2] border-[#E5DEC9]'
                      }`}
                    >
                      <span className="text-[12px] font-semibold text-[#5A5A5A]">{dayLabel}</span>
                      <span className="text-2xl">{cared ? '🌿' : '🌱'}</span>
                      <span className="text-[11px] text-[#7A7A7A]">
                        {cared ? 'حضور سبز' : 'استراحت'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* تب ۴: دفتر خاطرات و رویاهای گیاه */}
          {subTab === 'memories' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-[#2D2D2D]">
                  دفتر خاطرات «{student.plantName}» ({student.memoriesCount} یادگاری)
                </h3>
                <span className="text-[12px] text-[#5A7A3F] bg-[#F2F7ED] px-2.5 py-1 rounded-full">
                  خاطرات بین تمام نسل‌ها باقی می‌مانند
                </span>
              </div>

              <div className="space-y-2.5">
                {(student.memoriesList || []).map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3.5 rounded-[14px] bg-white border border-[#E5DEC9] flex items-start gap-3"
                  >
                    <span className="text-2xl">{mem.icon}</span>
                    <div>
                      <span className="text-[12px] text-[#7A7A7A] block">{mem.date}</span>
                      <p className="text-[14px] text-[#2D2D2D] mt-0.5 leading-relaxed">
                        {mem.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* مودال قصه‌گوی رویا */}
      {dreamPopup && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDreamPopup(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#FDFBF5] rounded-[20px] border-2 border-[#C8D9B5] p-6 text-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-[#F2F0F9] mx-auto flex items-center justify-center text-3xl mb-3">
              🌙
            </div>
            <h3 className="text-[18px] font-bold text-[#5A7A3F] mb-2">
              رویای دیشبِ «{student.plantName}»
            </h3>
            <p className="text-[15px] text-[#2D2D2D] leading-relaxed italic bg-white p-4 rounded-[14px] border border-[#E5DEC9] mb-5">
              «{dreamPopup}»
            </p>
            <button
              type="button"
              onClick={() => setDreamPopup(null)}
              className="w-full py-2.5 rounded-[12px] bg-[#7BA05B] hover:bg-[#5A7A3F] text-white font-semibold"
            >
              چقدر رویای قشنگی! 💚
            </button>
          </div>
        </div>
      )}

      {/* مودال آیین کاشتن بذر نسل جدید */}
      {seedModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSeedModalOpen(false)}
        >
          <form
            onSubmit={handlePlantNewGeneration}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#FDFBF5] rounded-[20px] border-2 border-[#E6B85C] p-6 text-center shadow-2xl"
          >
            <div className="text-4xl mb-2">🌰✨</div>
            <h3 className="text-[19px] font-bold text-[#2D2D2D] mb-2">
              آیین بذر و تولد نسل {student.gen + 1}
            </h3>
            <p className="text-[14px] text-[#666666] leading-relaxed mb-4">
              «{student.plantName}» بعد از {student.growthDays} روز دوستی با تو، به شکوفایی کامل رسیده و یک بذر طلایی به جا گذاشته است. خودش به بذرخانه‌ی کلاس می‌رود و تمام خاطرات و کلاه‌هایت برای نسل جدید باقی می‌ماند!
            </p>
            <input
              type="text"
              value={newSeedName}
              onChange={(e) => setNewSeedName(e.target.value)}
              placeholder="نام جوانه‌ی نسل جدید را چه می‌گذاری؟"
              className="w-full px-4 py-2.5 rounded-[12px] bg-white border border-[#D8D0BC] text-[15px] mb-4 focus:outline-none focus:border-[#7BA05B]"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-[12px] bg-[#7BA05B] hover:bg-[#5A7A3F] text-white font-semibold"
              >
                کاشتن بذر جدید 🌱
              </button>
              <button
                type="button"
                onClick={() => setSeedModalOpen(false)}
                className="px-4 py-2.5 rounded-[12px] bg-[#EFECE2] text-[#2D2D2D]"
              >
                فعلاً نه
              </button>
            </div>
          </form>
        </div>
      )}

      {/* مودال آنبوردینگ دانش‌آموز جدید (کاشتن اولین دانه) */}
      {newOnboardingOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNewOnboardingOpen(false)}
        >
          <form
            onSubmit={handleCreateStudentSubmit}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#FDFBF5] rounded-[20px] border border-[#C8D9B5] p-6 shadow-2xl"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🌱🪴</div>
              <h3 className="text-[19px] font-bold text-[#2D2D2D]">
                کاشتن جوانه‌ی جدید در باغچه‌ی کلاس
              </h3>
              <p className="text-[13px] text-[#7A7A7A] mt-1">
                دانه‌ات را در خاک بگذار و برایش یک اسم قشنگ انتخاب کن
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#2D2D2D] mb-1">
                  نام خودت (فقط معلم می‌بیند):
                </label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="مثلاً: روشا"
                  className="w-full px-3.5 py-2 rounded-[10px] bg-white border border-[#D8D0BC] text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#2D2D2D] mb-1">
                  نام گیاهت (در باغچه‌ی کلاس نمایش داده می‌شود):
                </label>
                <input
                  type="text"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  placeholder="مثلاً: بهارنارنج"
                  className="w-full px-3.5 py-2 rounded-[10px] bg-white border border-[#D8D0BC] text-[14px]"
                />
              </div>
              {onboardingError && (
                <p className="text-[13px] text-[#7A4E2D] bg-[#FDF6EC] p-2 rounded-lg">
                  {onboardingError}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-[12px] bg-[#7BA05B] hover:bg-[#5A7A3F] text-white font-semibold"
              >
                بکاریمش! 🌿
              </button>
              <button
                type="button"
                onClick={() => setNewOnboardingOpen(false)}
                className="px-4 py-2.5 rounded-[12px] bg-[#EFECE2] text-[#2D2D2D]"
              >
                بستن
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ۵. کامپوننت Header (با کلید جابه‌جایی بین «اتاق دانش‌آموز» و «پنل معلم»)
// ============================================================================
const Header = ({
  classNameTitle,
  activeRole,
  onChangeRole,
  soundMuted,
  onToggleSound,
  onOpenBoardMode,
  onOpenConversationModal,
  onPrint,
  simOpen,
  onToggleSim,
}) => {
  return (
    <header className="no-print bg-[#F6F3E8]/95 backdrop-blur-sm border-b border-[#E5DEC9] sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* لوگو و نام کلاس */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#7BA05B]/15 border border-[#7BA05B]/30 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 36 36" className="w-7 h-7 text-[#5A7A3F]" fill="currentColor">
              <path d="M18 31V16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M18 22C10 22 7 15 9 9C15 9 18 14 18 22Z" fill="#7BA05B" />
              <path d="M18 18C26 18 29 11 27 5C21 5 18 10 18 18Z" fill="#A5CC85" />
            </svg>
          </div>
          <div>
            <h1 className="text-[19px] sm:text-[20px] font-bold text-[#2D2D2D] leading-tight">
              جوانه — باغچه‌ی کلاس
            </h1>
            <p className="text-[13px] text-[#7A7A7A] mt-0.5">
              {classNameTitle} • {activeRole === 'student' ? 'نمای اتاق دانش‌آموز (PWA)' : 'پنل مراقبت معلم'}
            </p>
          </div>
        </div>

        {/* سوییچ اصلی بین نمای دانش‌آموز و نمای معلم */}
        <div className="flex items-center bg-[#EAE5D5] p-1 rounded-[14px] border border-[#D8D0BC]">
          <button
            type="button"
            onClick={() => {
              Sfx.playTap();
              onChangeRole('student');
            }}
            className={`px-3.5 py-1.5 rounded-[10px] text-[14px] font-bold transition-all flex items-center gap-1.5 ${
              activeRole === 'student'
                ? 'bg-[#7BA05B] text-white shadow-sm'
                : 'text-[#5A5A5A] hover:text-[#2D2D2D]'
            }`}
          >
            <span>🎒</span>
            <span>اتاق دانش‌آموز</span>
          </button>
          <button
            type="button"
            onClick={() => {
              Sfx.playTap();
              onChangeRole('teacher');
            }}
            className={`px-3.5 py-1.5 rounded-[10px] text-[14px] font-bold transition-all flex items-center gap-1.5 ${
              activeRole === 'teacher'
                ? 'bg-[#7BA05B] text-white shadow-sm'
                : 'text-[#5A5A5A] hover:text-[#2D2D2D]'
            }`}
          >
            <span>👩‍🏫</span>
            <span>باغچه‌ی معلم</span>
          </button>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-[12px] bg-white hover:bg-[#F3EFE2] text-[#2D2D2D] border border-[#D8D0BC] text-[14px]"
            title={soundMuted ? 'روشن کردن صدای محیط' : 'بی‌صدا کردن'}
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>

          {activeRole === 'teacher' && (
            <>
              <button
                type="button"
                onClick={onToggleSim}
                className={`px-3 py-2 rounded-[12px] text-[13px] font-medium border transition-colors flex items-center gap-1.5 ${
                  simOpen
                    ? 'bg-[#5A7A3F] text-white border-[#5A7A3F]'
                    : 'bg-white/80 text-[#5A7A3F] border-[#C8D9B5] hover:bg-[#C8D9B5]/30'
                }`}
              >
                <span>🧪</span>
                <span className="hidden md:inline">شبیه‌ساز</span>
              </button>

              <button
                type="button"
                onClick={onOpenBoardMode}
                className="px-3.5 py-2 rounded-[12px] bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-[13px] font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>حالت تخته‌ای</span>
              </button>

              <button
                type="button"
                onClick={onOpenConversationModal}
                className="px-3.5 py-2 rounded-[12px] bg-white hover:bg-[#F3EFE2] text-[#2D2D2D] border border-[#D8D0BC] text-[13px] font-semibold transition-all flex items-center gap-1.5"
              >
                <span>💬</span>
                <span>گفت‌وگوی امروز</span>
              </button>

              <button
                type="button"
                onClick={onPrint}
                aria-label="چاپ وضعیت باغچه"
                title="چاپ برگه‌ی مراقبت کلاس"
                className="p-2 rounded-[12px] bg-white hover:bg-[#F3EFE2] text-[#2D2D2D] border border-[#D8D0BC] transition-all"
              >
                🖨️
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// ۶. کامپوننت RadarCard (رادار ۱۰ ثانیه‌ای کلاس بدون عدد و بدون رنگ قرمز)
// ============================================================================
const RadarCard = ({ radar, totalPlants, onSelectPlantById }) => {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(radar ? radar.healthPercentage : 0);
    }, 80);
    return () => clearTimeout(timer);
  }, [radar]);

  if (totalPlants === 0) {
    return (
      <section className="bg-white/90 border border-[#E6E0D0] rounded-[16px] p-[16px] shadow-sm">
        <p className="text-[16px] text-[#7A7A7A] text-center py-2">
          هنوز هیچ گیاهی کاشته نشده.
        </p>
      </section>
    );
  }

  const overallText =
    radar.healthPercentage >= 70
      ? 'امروز حال باغچه خوبه.'
      : radar.healthPercentage >= 40
      ? 'امروز حال باغچه متوسط است.'
      : 'امروز باغچه نیاز به مراقبت داره.';

  return (
    <section
      aria-label="رادار مراقبت کلاس"
      className={`rounded-[16px] p-[16px] border transition-colors shadow-sm ${
        radar.healthPercentage < 40
          ? 'bg-[#FAF3EB] border-[#E8A87C]/50'
          : 'bg-white/90 border-[#E6E0D0]'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{
              backgroundColor:
                radar.healthPercentage >= 70
                  ? '#7BA05B'
                  : radar.healthPercentage >= 40
                  ? '#A5CC85'
                  : '#E8A87C',
            }}
          />
          <h2 className="text-[20px] font-semibold text-[#2D2D2D]">
            {overallText}
          </h2>
        </div>
        <span className="text-[14px] text-[#7A7A7A]">
          رادار روزانه‌ی معلم
        </span>
      </div>

      {/* نوار پیشرفت (بدون هیچ عدد یا درصدی) */}
      <div
        className="w-full h-[8px] bg-[#EFECE2] rounded-full overflow-hidden mb-4"
        role="presentation"
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${barWidth}%`,
            background: 'linear-gradient(90deg, #C8D9B5 0%, #7BA05B 100%)',
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {radar.goodNews && radar.goodNews.length > 0 && (
          <div className="bg-[#F7F9F4] border border-[#C8D9B5]/60 rounded-[12px] p-3.5">
            <h3 className="text-[14px] font-semibold text-[#5A7A3F] mb-2 flex items-center gap-1.5">
              <span>🌱</span>
              <span>خبرهای خوب باغچه</span>
            </h3>
            <ul className="space-y-2">
              {radar.goodNews.map((news, idx) => (
                <li key={idx} className="text-[14px] text-[#2D2D2D] flex items-start gap-2">
                  <span className="text-[#7BA05B] mt-0.5">
                    {news.type === 'comeback'
                      ? '🌤️'
                      : news.type === 'stage'
                      ? '🌼'
                      : news.type === 'seed'
                      ? '🌰'
                      : '🌙'}
                  </span>
                  <span>{news.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`bg-[#FDF9F3] border border-[#E8A87C]/40 rounded-[12px] p-3.5 ${
            !radar.goodNews || radar.goodNews.length === 0 ? 'md:col-span-2' : ''
          }`}
        >
          <h3 className="text-[14px] font-semibold text-[#7A5C43] mb-2 flex items-center gap-1.5">
            <span>🤲</span>
            <span>نیاز به توجه و احوال‌پرسی</span>
          </h3>

          {radar.needsAttention && radar.needsAttention.length > 0 ? (
            <ul className="space-y-1.5">
              {radar.needsAttention.slice(0, 3).map((item) => (
                <li key={item.id || item.childName}>
                  <button
                    type="button"
                    onClick={() => onSelectPlantById(item.id, item.childName)}
                    className="w-full text-right p-2 rounded-[10px] hover:bg-[#E8A87C]/15 transition-colors flex flex-col gap-0.5 group"
                  >
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="font-semibold text-[#2D2D2D] group-hover:text-[#5A7A3F] transition-colors">
                        {item.childName} ({item.plantName}) — {item.lastSeenDays} روزه ندیده
                      </span>
                      <span className="text-[12px] text-[#7A7A7A] bg-white/80 px-2 py-0.5 rounded-full border border-[#E5DEC9]">
                        {MOOD_LABELS[item.mood]}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#7A7A7A] pr-1">
                      پیشنهاد: {item.hint}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-[#5A7A3F] py-2">
              امروز، همه‌ی گیاهان حالشون خوبه.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// ۷. کامپوننت Garden و PlantCard
// ============================================================================
const PlantCard = ({ plant, index, onSelect }) => {
  const marginTopOffset = IRREGULAR_OFFSETS[index % IRREGULAR_OFFSETS.length];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(plant);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={plant.plantName}
      onClick={() => onSelect(plant)}
      onKeyDown={handleKeyDown}
      style={{ marginTop: `${marginTopOffset}px` }}
      className="plant-card w-[80px] h-[100px] p-[8px] rounded-[12px] bg-transparent flex flex-col items-center justify-between relative select-none"
    >
      {plant.gen > 1 && (
        <span
          className="absolute -top-1 right-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[#EFECE2] text-[#5A7A3F] border border-[#C8D9B5]"
          title={`نسل ${plant.gen}`}
        >
          نسل {plant.gen}
        </span>
      )}

      {plant.activeDream && (
        <span
          className="absolute -top-1 left-1 text-[11px]"
          title="این گیاه خواب دیده است"
          aria-hidden="true"
        >
          🌙
        </span>
      )}

      <div className="w-[64px] h-[64px] flex items-center justify-center">
        <BotanicalPlantSVG
          mood={plant.mood}
          stage={plant.stage}
          potStyle={plant.potStyle}
          accessory={plant.accessory}
          friend={plant.friend}
          size="normal"
        />
      </div>

      <span className="text-[14px] font-medium text-[#2D2D2D] truncate max-w-full leading-tight mt-1">
        {plant.plantName}
      </span>
    </div>
  );
};

const Garden = ({ plants, loading, onSelectPlant }) => {
  if (loading) {
    return (
      <section
        aria-label="در حال بارگذاری باغچه"
        className="bg-white/60 border border-[#E6E0D0] rounded-[16px] p-6"
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={idx}
              style={{ marginTop: `${IRREGULAR_OFFSETS[idx % IRREGULAR_OFFSETS.length]}px` }}
              className="w-[80px] h-[100px] p-[8px] rounded-[12px] flex flex-col items-center justify-between"
            >
              <div className="w-[56px] h-[60px] rounded-2xl skeleton-shimmer" />
              <div className="w-[48px] h-[14px] rounded-md skeleton-shimmer" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!plants || plants.length === 0) {
    return (
      <section className="bg-white/75 border border-[#E6E0D0] rounded-[16px] p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#C8D9B5]/35 flex items-center justify-center text-3xl">
          🌱
        </div>
        <p className="text-[16px] font-semibold text-[#2D2D2D]">
          هنوز هیچ گیاهی کاشته نشده.
        </p>
        <p className="text-[14px] text-[#7A7A7A] mt-1">
          وقتی بچه‌ها اولین جوانه‌هایشان را نام‌گذاری کنند، اینجا سبز می‌شود.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="باغچه‌ی زنده‌ی کلاس"
      className="bg-white/70 border border-[#E6E0D0] rounded-[16px] p-5 md:p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFECE2]">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D]">
            گلدان‌های کلاس ({plants.length} گیاه)
          </h2>
          <span className="text-[13px] text-[#7A7A7A]">
            — برای دیدن نام کودک و پیشنهاد گفت‌وگو روی هر گیاه کلیک کنید
          </span>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-[#7A7A7A]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7BA05B]" /> شاداب و آرام
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8A87C]" /> دل‌تنگ
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8D9B5]" /> بی‌تاب
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}
        className="py-2"
      >
        {plants.map((plant, idx) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            index={idx}
            onSelect={onSelectPlant}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================================================
// ۸. کامپوننت SeedBank (بذرخانه‌ی نسل‌های پیشین — جمع‌شونده)
// ============================================================================
const SeedBank = ({ seedBank, isOpen, onToggle, onSelectSeed }) => {
  if (!seedBank || seedBank.length === 0) {
    return null;
  }

  const sortedSeeds = useMemo(() => {
    return [...seedBank].sort((a, b) => {
      if (b.gen !== a.gen) return b.gen - a.gen;
      return a.plantName.localeCompare(b.plantName, 'fa');
    });
  }, [seedBank]);

  return (
    <section
      aria-label="بذرخانه‌ی کلاس"
      className="no-print bg-white/80 rounded-[16px] border border-[#E5E5E5] overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full p-[12px] px-4 flex items-center justify-between text-right hover:bg-[#F5F2E8] transition-colors border-t border-[#E5E5E5]"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🌰</span>
          <span className="text-[16px] font-semibold text-[#2D2D2D]">
            بذرخانه — {sortedSeeds.length} بذر
          </span>
          <span className="text-[13px] text-[#7A7A7A] hidden sm:inline">
            (گیاهانی که چرخه‌ی رشدشان کامل شده و به خاطره تبدیل شده‌اند)
          </span>
        </div>

        <svg
          className={`w-5 h-5 text-[#7A7A7A] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 pt-2 border-t border-[#EFECE2] overflow-x-auto">
          <div className="flex items-center gap-4 min-w-max pb-1">
            {sortedSeeds.map((seed) => (
              <button
                key={seed.id}
                type="button"
                onClick={() => onSelectSeed(seed)}
                className="w-36 p-3 rounded-[12px] bg-[#FAF8F2] hover:bg-[#F0EDE2] border border-[#E5DEC9] flex flex-col items-center text-center transition-all"
              >
                <SeedArchiveSVG />
                <span className="text-[15px] font-semibold text-[#2D2D2D] mt-1">
                  {seed.plantName}
                </span>
                <span className="text-[13px] text-[#7A7A7A] mt-0.5">
                  نسل {seed.gen} — {seed.monthLabel || 'آبان'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

// ============================================================================
// ۹. کامپوننت Drawer (کارت گفت‌وگوی خصوصی معلم + دکمه‌ی ورود به اتاق آن کودک)
// ============================================================================
const Drawer = ({ plant, onClose, onJumpToStudentRoom }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (plant && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [plant]);

  if (!plant) return null;

  const presenceText =
    plant.lastSeenDays === 0
      ? 'امروز دیده'
      : `${plant.lastSeenDays} روزه ندیده`;

  const getConversationSuggestion = (p) => {
    if (p.archived) {
      return `این بذر یادگار نسل ${p.gen} گیاه ${p.childName} است. می‌تونی ازش بپرسی بهترین خاطره‌ای که از «${p.plantName}» داره چیه.`;
    }
    if (p.activeDream) {
      return 'می‌تونی ازش بپرسی دیشب گیاهش چه خوابی دیده.';
    }
    if (p.mood === 'alert') {
      return `بدون اشاره به غیبت یا تکالیف، بهش بگو «${p.plantName}» این روزها خیلی دلش برای دیدنت تنگ شده؛ یه سر کوتاه بهش بزنیم؟`;
    }
    if (p.mood === 'longing') {
      return `می‌تونی ازش بپرسی دیشب گیاهش چه خوابی دیده یا بگی «${p.plantName}» منتظر یه سر زدن کوتاه از طرف توئه.`;
    }
    if (p.stage === 5) {
      return `گیاهش شکوفا شده! می‌تونی ازش بپرسی چه حسی داره که «${p.plantName}» به مرحله‌ی گل‌دهی رسیده.`;
    }
    return `می‌تونی ازش بپرسی دیشب گیاهش چه خوابی دیده یا امروز که به «${p.plantName}» سر زد حال و هوایش چطور بود.`;
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/30 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-plant-title"
        onClick={(e) => e.stopPropagation()}
        className="drawer-slide-up w-full max-w-xl bg-[#FDFBF5] rounded-t-[24px] shadow-2xl border-t border-[#E5DEC9] p-5 md:p-6 max-h-[60vh] overflow-y-auto"
      >
        <div className="w-12 h-1.5 bg-[#D8D0BC] rounded-full mx-auto mb-4" />

        {/* ۱. Header: نام گیاه + نام کودک + نسل — با دکمه‌ی بستن (×) */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#EFECE2]">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-20 rounded-2xl bg-[#F4F1E6] border border-[#E5DEC9] flex items-center justify-center shrink-0">
              {plant.archived ? (
                <SeedArchiveSVG />
              ) : (
                <BotanicalPlantSVG
                  mood={plant.mood}
                  stage={plant.stage}
                  potStyle={plant.potStyle}
                  accessory={plant.accessory}
                  friend={plant.friend}
                  size="normal"
                />
              )}
            </div>
            <div>
              <h2
                id="drawer-plant-title"
                className="text-[20px] font-bold text-[#2D2D2D] flex items-center gap-2 flex-wrap"
              >
                <span>{plant.plantName}</span>
                <span className="text-[15px] font-medium text-[#5A7A3F]">
                  • کودک: {plant.childName}
                </span>
                <span className="text-[13px] font-normal px-2.5 py-0.5 rounded-full bg-[#C8D9B5]/45 text-[#5A7A3F]">
                  نسل {plant.gen}
                </span>
              </h2>

              {/* ۲ و ۳. وضعیت حضور (مثلاً ۳ روزه ندیده) + مرحله‌ی رشد */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[14px]">
                <span
                  className={`px-2.5 py-0.5 rounded-lg font-semibold ${
                    plant.lastSeenDays >= 2
                      ? 'bg-[#E8A87C]/25 text-[#7A4E2D]'
                      : 'bg-[#7BA05B]/15 text-[#5A7A3F]'
                  }`}
                >
                  وضعیت: {presenceText}
                </span>
                <span className="text-[#7A7A7A]">•</span>
                <span className="text-[#2D2D2D] font-medium">
                  مرحله: {STAGE_LABELS[plant.stage] || 'شکوفا'}
                </span>
              </div>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-9 h-9 rounded-full bg-[#EFECE2] hover:bg-[#E2DEC9] text-[#2D2D2D] flex items-center justify-center text-xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-3.5 my-4">
          {/* ۴. رویای اخیر گیاه در صورت وجود */}
          {plant.activeDream && (
            <div className="bg-[#F4F7F0] border border-[#C8D9B5] rounded-[12px] p-3.5 flex items-start gap-2.5">
              <span className="text-xl leading-none mt-0.5" aria-hidden="true">
                🌙
              </span>
              <div>
                <span className="text-[13px] font-semibold text-[#5A7A3F] block mb-0.5">
                  رویای اخیر گیاه:
                </span>
                <p className="text-[14px] text-[#2D2D2D] italic leading-relaxed">
                  «{plant.activeDream}»
                </p>
              </div>
            </div>
          )}

          {/* ۵. تعداد روزهای مراقبت با هم */}
          <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#2D2D2D]">
            <div className="bg-white border border-[#E5DEC9] rounded-[12px] px-3.5 py-2 flex items-center gap-2">
              <span>🌿</span>
              <span className="font-semibold">{plant.growthDays} روز با هم</span>
            </div>
            <div className="bg-white border border-[#E5DEC9] rounded-[12px] px-3.5 py-2 flex items-center gap-2">
              <span>📖</span>
              <span>خاطره و یادگاری ثبت‌شده در دفتر</span>
            </div>
          </div>

          {/* ۶. پیشنهاد مهربانانه برای معلم */}
          <div className="bg-[#FAF6EC] border border-[#E8A87C]/50 rounded-[12px] p-3.5">
            <span className="text-[13px] font-semibold text-[#7A5C43] block mb-1">
              💡 پیشنهاد مهربانانه برای گفت‌وگو با {plant.childName}:
            </span>
            <p className="text-[15px] text-[#2D2D2D] leading-relaxed">
              «{getConversationSuggestion(plant)}»
            </p>
          </div>
        </div>

        {/* ۷. دکمه‌ی بستن در پایین */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          {!plant.archived && onJumpToStudentRoom && (
            <button
              type="button"
              onClick={() => onJumpToStudentRoom(plant.id)}
              className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#EFECE2] hover:bg-[#E2DEC9] text-[#2D2D2D] text-[14px] font-semibold transition-colors"
            >
              🎒 مشاهده‌ی اتاق گیاه {plant.childName}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-[15px] font-semibold transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ۱۰. کامپوننت BoardMode (حالت تخته‌ای تمام‌صفحه، ایمن برای پروژکتور)
// ============================================================================
const BoardMode = ({ classData, onExit, onAutoRefresh }) => {
  const [lastRefreshedText, setLastRefreshedText] = useState('همین الان');

  useEffect(() => {
    const interval = setInterval(() => {
      onAutoRefresh();
      const now = new Date();
      setLastRefreshedText(
        now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, [onAutoRefresh]);

  if (!classData) return null;

  const overallSentence =
    classData.radar.healthPercentage >= 70
      ? 'امروز حال باغچه خوبه.'
      : classData.radar.healthPercentage >= 40
      ? 'امروز حال باغچه متوسط است.'
      : 'امروز باغچه نیاز به مراقبت داره.';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="حالت تخته‌ای باغچه"
      className="no-print fixed inset-0 z-50 bg-[#FDFBF5] overflow-y-auto animate-fade-in flex flex-col justify-between p-6 md:p-10"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#E5DEC9] pb-4">
        <div>
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#2D2D2D]">
            🌿 صبحانه‌ی گیاهی — {classData.className}
          </h2>
          <p className="text-[14px] text-[#7A7A7A] mt-0.5">
            نمای جمعی کلاس (حفظ حریم کودک: گیاهان دل‌تنگ و بی‌تاب با رنگ خاکستری ملایم و بدون نام دانش‌آموز نمایش داده می‌شوند) • آخرین تازه‌سازی: {lastRefreshedText}
          </p>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="px-5 py-2.5 rounded-[12px] bg-[#2D2D2D] hover:bg-[#454545] text-white text-[16px] font-semibold transition-colors shadow-sm"
        >
          خروج
        </button>
      </div>

      <div className="my-auto py-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
          {classData.plants.map((plant) => {
            const isMutedInBoard = plant.mood === 'longing' || plant.mood === 'alert';
            return (
              <div
                key={plant.id}
                className={`flex flex-col items-center justify-center p-3 rounded-[16px] transition-all ${
                  isMutedInBoard ? 'opacity-65' : ''
                }`}
              >
                <BotanicalPlantSVG
                  mood={plant.mood}
                  stage={plant.stage}
                  potStyle={plant.potStyle}
                  accessory={plant.accessory}
                  friend={plant.friend}
                  isGrayscale={isMutedInBoard}
                  size="large"
                />
                <span
                  className="mt-2 font-semibold text-[24px]"
                  style={{
                    color: isMutedInBoard ? '#B0B0B0' : '#2D2D2D',
                  }}
                >
                  {plant.plantName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center border-t border-[#E5DEC9] pt-5">
        <p className="text-[20px] font-semibold text-[#5A7A3F]">
          {overallSentence}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// ۱۱. کامپوننت ConversationModal (پیشنهاد گفت‌وگوی امروز برای کل کلاس)
// ============================================================================
const ConversationModal = ({ isOpen, plants, onClose }) => {
  if (!isOpen) return null;

  const alertCount = plants.filter((p) => p.mood === 'alert').length;
  const longingCount = plants.filter((p) => p.mood === 'longing').length;
  const thrivingCount = plants.filter((p) => p.mood === 'thriving').length;

  const suggestions = [];

  if (alertCount >= 2) {
    suggestions.push({
      icon: '🕊️',
      title: 'حمایت مهربانانه از گیاهان بی‌تاب',
      text: 'امروز، دو تا از گیاهان بی‌تابن. می‌تونی بپرسی "کسی دوست داره از گیاهش بگه؟"',
    });
  } else {
    suggestions.push({
      icon: '🕊️',
      title: 'شروع آرام در ابتدای کلاس',
      text: 'می‌تونی اول زنگ بپرسی "چه کسی دیشب قبل از خواب به گیاهش سر زد؟"',
    });
  }

  if (longingCount >= 2) {
    suggestions.push({
      icon: '🌤️',
      title: 'دعوت بدون ایجاد حس گناه',
      text: 'چند تا گیاه دل‌تنگن. یه بازدید کوتاه کافیه.',
    });
  } else {
    suggestions.push({
      icon: '🌤️',
      title: 'حفظ ریتم روزانه',
      text: 'یه یادآوری کوتاه که هر روز فقط یک کار کوچک برای سرحال ماندن گیاهان کافیه.',
    });
  }

  if (thrivingCount >= 2) {
    suggestions.push({
      icon: '🌼',
      title: 'جشن گرفتن حضور و مراقبت',
      text: 'امروز باغچه حالش خوبه. می‌تونی ازشون بپرسی "گیاهتون امروز چه شکلیه؟"',
    });
  } else {
    suggestions.push({
      icon: '🌙',
      title: 'گفت‌وگو درباره‌ی قصه و رویا',
      text: 'می‌تونی بپرسی "فکر می‌کنید اگر گیاهتون امشب خواب ببینه، چه خوابی می‌بینه؟"',
    });
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="conv-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FDFBF5] rounded-[16px] border border-[#E5DEC9] shadow-xl p-6"
      >
        <div className="flex items-center justify-between border-b border-[#EFECE2] pb-3 mb-4">
          <h2 id="conv-modal-title" className="text-[20px] font-bold text-[#2D2D2D]">
            💬 پیشنهاد گفت‌وگوی امروز:
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-[#EFECE2] hover:bg-[#E2DEC9] text-[#2D2D2D] flex items-center justify-center font-bold"
          >
            ×
          </button>
        </div>

        <p className="text-[14px] text-[#7A7A7A] mb-4">
          این جمله‌ها بر اساس حال امروز باغچه طراحی شده‌اند تا بدون ایجاد رقابت یا سرزنش، بچه‌ها را به مراقبت و نظم روزانه دعوت کنند:
        </p>

        <div className="space-y-3 mb-6">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-[12px] bg-white border border-[#E5DEC9] flex items-start gap-3"
            >
              <span className="text-2xl leading-none mt-0.5">{item.icon}</span>
              <div>
                <h3 className="text-[14px] font-semibold text-[#5A7A3F] mb-1">
                  {item.title}
                </h3>
                <p className="text-[15px] text-[#2D2D2D] leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-[12px] bg-[#7BA05B] hover:bg-[#5A7A3F] text-white text-[15px] font-semibold transition-colors"
        >
          بستن
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// ۱۲. کامپوننت PrintView (نسخه‌ی متنی تمیز مخصوص چاپ کاغذی معلم)
// ============================================================================
const PrintView = ({ classData }) => {
  if (!classData) return null;

  return (
    <div className="print-only hidden p-6 text-right" dir="rtl">
      <div className="border-b-2 border-[#2D2D2D] pb-3 mb-4">
        <h1 className="text-[22px] font-bold">
          جوانه — باغچه‌ی کلاس ({classData.className})
        </h1>
        <p className="text-[14px] text-[#555555]">
          برگه‌ی یادداشت مراقبت معلم • این باغچه مراقبت است، نه رتبه‌بندی.
        </p>
      </div>

      <div className="mb-6 p-3 border border-[#CCCCCC] rounded-lg">
        <h2 className="text-[18px] font-bold mb-2">
          وضعیت کلی: {classData.radar.overallMessage}
        </h2>
        {classData.radar.goodNews.length > 0 && (
          <div className="mb-2">
            <strong>خبرهای خوب:</strong>
            <ul className="list-disc list-inside text-[14px]">
              {classData.radar.goodNews.map((g, i) => (
                <li key={i}>{g.text}</li>
              ))}
            </ul>
          </div>
        )}
        {classData.radar.needsAttention.length > 0 && (
          <div>
            <strong>نیاز به احوال‌پرسی امروز:</strong>
            <ul className="list-disc list-inside text-[14px]">
              {classData.radar.needsAttention.map((n, i) => (
                <li key={i}>
                  {n.childName} (گیاه «{n.plantName}») — {n.lastSeenDays} روزه ندیده — پیشنهاد: {n.hint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="garden-print-area mb-6">
        <h2 className="text-[18px] font-bold mb-2">فهرست گیاهان باغچه</h2>
        <div className="grid grid-cols-2 gap-2 text-[14px]">
          {classData.plants.map((p) => (
            <div key={p.id} className="border border-[#DDDDDD] p-2 rounded">
              <strong>{p.plantName}</strong> ({p.childName}) — وضعیت: {MOOD_LABELS[p.mood]} —{' '}
              {p.lastSeenDays === 0 ? 'امروز دیده' : `${p.lastSeenDays} روزه ندیده`} ({STAGE_LABELS[p.stage]})
            </div>
          ))}
        </div>
      </div>

      {classData.seedBank && classData.seedBank.length > 0 && (
        <div>
          <h2 className="text-[18px] font-bold mb-2">بذرخانه‌ی کلاس</h2>
          <div className="flex flex-wrap gap-3 text-[14px]">
            {classData.seedBank.map((s) => (
              <span key={s.id} className="border border-[#DDDDDD] px-3 py-1 rounded">
                {s.plantName} — نسل {s.gen}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ۱۳. کامپوننت اصلی App (یکپارچه‌ساز اتاق دانش‌آموز و باغچه‌ی معلم)
// ============================================================================
export default function App() {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'teacher'
  const [activeStudentId, setActiveStudentId] = useState('p-15'); // پیش‌فرض روی «علی (جوانه)» که دل‌تنگ است تا برگشتش به شادابی را ببینید
  const [soundMuted, setSoundMuted] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [boardMode, setBoardMode] = useState(false);
  const [conversationModal, setConversationModal] = useState(false);
  const [seedBankOpen, setSeedBankOpen] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
  }, []);

  const loadInitialData = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setClassData(generateMockClass());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedPlant) setSelectedPlant(null);
        else if (conversationModal) setConversationModal(false);
        else if (boardMode) setBoardMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlant, conversationModal, boardMode]);

  // منطق موتور دامنه هنگام انجام عادت توسط دانش‌آموز
  const handleCompleteHabit = (studentId, habitKey) => {
    let dreamTriggered = null;
    let narrativeMessage = '';

    setClassData((prev) => {
      if (!prev) return prev;
      const updatedPlants = prev.plants.map((p) => {
        if (p.id !== studentId) return p;

        const prevHabits = p.completedHabitsToday || [];
        if (prevHabits.includes(habitKey)) return p;

        // قانون Rate-Limit: فقط اولین عادت امروز باعث افزایش روز رشد می‌شود
        const isFirstCareToday = prevHabits.length === 0 || p.lastSeenDays > 0;
        const nextGrowthDays = isFirstCareToday ? p.growthDays + 1 : p.growthDays;
        const nextStage = stageForGrowth(nextGrowthDays);
        const wasAbsent = p.lastSeenDays >= 2;

        // اگر از غیبت برگشته یا به مرحله‌ی جدید رسیده، یک رویای تازه بساز
        let nextDream = p.activeDream;
        if (wasAbsent && !nextDream) {
          nextDream = 'دیشب خواب دیدم برگشتی و پنجره‌ی اتاق را باز کردی؛ چقدر دلم برایت تنگ شده بود!';
          dreamTriggered = nextDream;
        } else if (!nextDream && nextGrowthDays % 3 === 0) {
          nextDream = ORGANIC_DREAM_BANK[nextGrowthDays % ORGANIC_DREAM_BANK.length];
          dreamTriggered = nextDream;
        }

        if (wasAbsent) {
          narrativeMessage = `خوش برگشتی ${p.childName} عزیز! «${p.plantName}» از حالت ${MOOD_LABELS[p.mood]} دوباره سرحال و شاداب شد! 🌿`;
        } else if (nextStage > p.stage) {
          narrativeMessage = `مژده! «${p.plantName}» وارد مرحله‌ی «${STAGE_LABELS[nextStage]}» شد! 🎉`;
        }

        const newMemories = [...(p.memoriesList || [])];
        if (wasAbsent) {
          newMemories.unshift({
            id: `m-${Date.now()}`,
            date: 'امروز',
            text: `بازگشت دوباره بعد از ${p.lastSeenDays} روز و شاداب شدن «${p.plantName}».`,
            icon: '🌤️',
          });
        }

        return {
          ...p,
          mood: 'thriving',
          lastSeenDays: 0,
          growthDays: nextGrowthDays,
          stage: nextStage,
          activeDream: nextDream,
          completedHabitsToday: [...prevHabits, habitKey],
          memoriesCount: newMemories.length,
          memoriesList: newMemories,
          readyForSeed: nextStage === 5 && nextGrowthDays >= 24,
        };
      });

      return {
        ...prev,
        plants: updatedPlants,
        radar: buildRadarFromPlants(updatedPlants),
      };
    });

    return { dreamTriggered, narrativeMessage };
  };

  // تغییر ظاهر گلدان، کلاه یا دوست کوچک در اتاق دانش‌آموز
  const handleCustomizePlant = (studentId, changes) => {
    setClassData((prev) => {
      if (!prev) return prev;
      const updatedPlants = prev.plants.map((p) =>
        p.id === studentId ? { ...p, ...changes } : p
      );
      return { ...prev, plants: updatedPlants };
    });
  };

  // تغییر نام گیاه توسط دانش‌آموز
  const handleRenamePlant = (studentId, newName) => {
    setClassData((prev) => {
      if (!prev) return prev;
      const updatedPlants = prev.plants.map((p) =>
        p.id === studentId ? { ...p, plantName: newName } : p
      );
      return {
        ...prev,
        plants: updatedPlants,
        radar: buildRadarFromPlants(updatedPlants),
      };
    });
  };

  // کاشتن بذر نسل جدید و انتقال گیاه فعلی به بذرخانه‌ی کلاس
  const handlePlantNewSeed = (studentId, nextPlantName) => {
    setClassData((prev) => {
      if (!prev) return prev;
      let archivedSeed = null;

      const updatedPlants = prev.plants.map((p) => {
        if (p.id !== studentId) return p;

        archivedSeed = {
          id: `seed-${Date.now()}`,
          plantName: p.plantName,
          childName: p.childName,
          gen: p.gen,
          mood: 'thriving',
          stage: 5,
          growthDays: p.growthDays,
          lastSeenDays: 0,
          activeDream: p.activeDream,
          memoriesCount: p.memoriesCount,
          archived: true,
          monthLabel: 'آبان',
        };

        const inheritedMemories = [
          {
            id: `mem-seed-${Date.now()}`,
            date: 'امروز',
            text: `«${p.plantName}» (نسل ${p.gen}) پس از ${p.growthDays} روز به بذر تبدیل شد و «${nextPlantName}» متولد شد.`,
            icon: '🌰',
          },
          ...(p.memoriesList || []),
        ];

        return {
          ...p,
          plantName: nextPlantName,
          gen: p.gen + 1,
          mood: 'thriving',
          stage: 1,
          growthDays: 1,
          lastSeenDays: 0,
          activeDream: null,
          completedHabitsToday: [],
          memoriesCount: inheritedMemories.length,
          memoriesList: inheritedMemories,
          readyForSeed: false,
        };
      });

      const nextSeedBank = archivedSeed
        ? [archivedSeed, ...prev.seedBank]
        : prev.seedBank;

      return {
        ...prev,
        plants: updatedPlants,
        seedBank: nextSeedBank,
        radar: buildRadarFromPlants(updatedPlants),
      };
    });
  };

  // افزودن دانش‌آموز جدید (آنبوردینگ)
  const handleCreateNewStudentPlant = (childName, plantName) => {
    const newId = `p-${Date.now()}`;
    setClassData((prev) => {
      if (!prev) return prev;
      const newPlant = enrichPlantDefaults(
        {
          id: newId,
          plantName,
          childName,
          gen: 1,
          mood: 'thriving',
          stage: 1,
          growthDays: 1,
          lastSeenDays: 0,
          activeDream: null,
          memoriesCount: 1,
          archived: false,
          potStyle: 'terracotta',
        },
        prev.plants.length
      );
      const updatedPlants = [newPlant, ...prev.plants];
      return {
        ...prev,
        totalPlants: updatedPlants.length,
        plants: updatedPlants,
        radar: buildRadarFromPlants(updatedPlants),
      };
    });
    setActiveStudentId(newId);
  };

  const handleSelectFromRadar = (plantId, childName) => {
    if (!classData) return;
    const found =
      classData.plants.find((p) => p.id === plantId) ||
      classData.plants.find((p) => p.childName === childName);
    if (found) {
      setSelectedPlant(found);
    }
  };

  const applyScenario = (scenario) => {
    if (scenario === 'reset') {
      setClassData(generateMockClass());
      setSelectedPlant(null);
      return;
    }
    if (scenario === 'all_thriving') {
      const base = generateMockClass();
      const updatedPlants = base.plants.map((p) => ({
        ...p,
        mood: 'thriving',
        lastSeenDays: 0,
      }));
      const radar = buildRadarFromPlants(updatedPlants);
      radar.healthPercentage = 95;
      radar.overall = 'good';
      radar.overallMessage = 'امروز حال باغچه خوبه.';
      setClassData({ ...base, plants: updatedPlants, radar });
      return;
    }
    if (scenario === 'war_outage_care') {
      const base = generateMockClass();
      const updatedPlants = base.plants.map((p, idx) => {
        if (idx < 4) return { ...p, mood: 'thriving', lastSeenDays: 0 };
        if (idx < 12) return { ...p, mood: 'longing', lastSeenDays: 3 };
        return { ...p, mood: 'alert', lastSeenDays: 5 };
      });
      const radar = buildRadarFromPlants(updatedPlants);
      radar.healthPercentage = 32;
      radar.overall = 'needs_care';
      radar.overallMessage = 'امروز باغچه نیاز به مراقبت داره.';
      setClassData({ ...base, plants: updatedPlants, radar });
      return;
    }
    if (scenario === 'empty_garden') {
      const base = generateMockClass();
      setClassData({
        ...base,
        totalPlants: 0,
        plants: [],
        seedBank: [],
        radar: {
          overall: 'mixed',
          overallMessage: 'هنوز هیچ گیاهی کاشته نشده.',
          needsAttentionCount: 0,
          needsAttention: [],
          goodNews: [],
          healthPercentage: 0,
        },
      });
      return;
    }
    if (scenario === 'error') {
      setError(true);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FDFBF5] text-[#2D2D2D] text-right flex flex-col">
      <GlobalStyles />

      {/* هدر دوگانه‌ی دانش‌آموز و معلم */}
      <Header
        classNameTitle={classData ? classData.className : 'کلاس سوم الف'}
        activeRole={activeRole}
        onChangeRole={(role) => setActiveRole(role)}
        soundMuted={soundMuted}
        onToggleSound={() => {
          Sfx.muted = !soundMuted;
          setSoundMuted(!soundMuted);
        }}
        onOpenBoardMode={() => setBoardMode(true)}
        onOpenConversationModal={() => setConversationModal(true)}
        onPrint={() => window.print()}
        simOpen={simulatorOpen}
        onToggleSim={() => setSimulatorOpen((prev) => !prev)}
      />

      {/* نوار شبیه‌ساز در حالت معلم */}
      {activeRole === 'teacher' && simulatorOpen && (
        <div className="no-print bg-[#EFECE2] border-b border-[#D8D0BC] px-4 py-3 animate-fade-in">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <span className="font-semibold text-[#5A7A3F]">
              🧪 آزمایشگاه تست سناریوها (مخصوص بررسی رفتار رادار و گرافیک):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyScenario('reset')}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#7BA05B] hover:text-white border border-[#C8D9B5] transition-colors"
              >
                حالت استاندارد (متوسط و متنوع)
              </button>
              <button
                type="button"
                onClick={() => applyScenario('all_thriving')}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#7BA05B] hover:text-white border border-[#C8D9B5] transition-colors"
              >
                همه سرحال و شاداب
              </button>
              <button
                type="button"
                onClick={() => applyScenario('war_outage_care')}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#E8A87C] hover:text-white border border-[#E8A87C] transition-colors"
              >
                شرایط بحران و غیبت بالا (نیازمند مراقبت)
              </button>
              <button
                type="button"
                onClick={() => applyScenario('empty_garden')}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#7A7A7A] hover:text-white border border-[#D8D0BC] transition-colors"
              >
                باغچه خالی
              </button>
              <button
                type="button"
                onClick={() => applyScenario('error')}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#7A7A7A] hover:text-white border border-[#D8D0BC] transition-colors"
              >
                تست خطای ارتباط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* محتوای اصلی: یا اتاق دانش‌آموز یا باغچه‌ی معلم */}
      {activeRole === 'student' && classData && !loading ? (
        <main className="no-print flex-1 w-full">
          <StudentPWAView
            plants={classData.plants}
            activeStudentId={activeStudentId}
            onSelectStudent={(id) => setActiveStudentId(id)}
            onCompleteHabit={handleCompleteHabit}
            onCustomizePlant={handleCustomizePlant}
            onRenamePlant={handleRenamePlant}
            onPlantNewSeed={handlePlantNewSeed}
            onCreateNewStudentPlant={handleCreateNewStudentPlant}
          />
        </main>
      ) : (
        <main className="no-print flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-5">
          {error ? (
            <div className="bg-white border border-[#E8A87C] rounded-[16px] p-8 text-center my-8 shadow-sm">
              <div className="text-4xl mb-3">🍂</div>
              <p className="text-[18px] font-semibold text-[#2D2D2D] mb-4">
                مشکلی پیش اومد. دوباره امتحان کن.
              </p>
              <button
                type="button"
                onClick={loadInitialData}
                className="px-6 py-2.5 rounded-[12px] bg-[#7BA05B] hover:bg-[#5A7A3F] text-white font-semibold transition-colors"
              >
                تلاش دوباره
              </button>
            </div>
          ) : (
            <>
              {!loading && classData && (
                <RadarCard
                  radar={classData.radar}
                  totalPlants={classData.totalPlants}
                  onSelectPlantById={handleSelectFromRadar}
                />
              )}

              <Garden
                plants={classData ? classData.plants : []}
                loading={loading}
                onSelectPlant={(plant) => setSelectedPlant(plant)}
              />

              {!loading && classData && (
                <SeedBank
                  seedBank={classData.seedBank}
                  isOpen={seedBankOpen}
                  onToggle={() => setSeedBankOpen((prev) => !prev)}
                  onSelectSeed={(seed) => setSelectedPlant(seed)}
                />
              )}
            </>
          )}
        </main>
      )}

      {/* پانوشت فلسفی برنامه */}
      <footer className="no-print py-4 text-center text-[13px] text-[#7A7A7A] border-t border-[#EFECE2]">
        این باغچه مراقبت است، نه رتبه‌بندی • هرچه کودک بیشتر مراقبت کند، گیاهش نه قوی‌تر، بلکه خاص‌تر و پرخاطره‌تر می‌شود.
      </footer>

      {/* کشوی جزئیات گیاه و پیشنهاد گفت‌وگو از پایین */}
      <Drawer
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onJumpToStudentRoom={(plantId) => {
          setActiveStudentId(plantId);
          setSelectedPlant(null);
          setActiveRole('student');
        }}
      />

      {/* حالت تخته‌ای تمام‌صفحه */}
      {boardMode && classData && (
        <BoardMode
          classData={classData}
          onExit={() => setBoardMode(false)}
          onAutoRefresh={() => {
            setClassData((prev) => (prev ? { ...prev } : prev));
          }}
        />
      )}

      {/* مودال پیشنهاد گفت‌وگوی امروز */}
      <ConversationModal
        isOpen={conversationModal}
        plants={classData ? classData.plants : []}
        onClose={() => setConversationModal(false)}
      />

      {/* نمای اختصاصی چاپ */}
      <PrintView classData={classData} />
    </div>
  );
}