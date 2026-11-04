/**
 * AIBrain.ts
 *
 * آینده‌نگری و هوش راهنمای معلم برای جوانه (کاملاً آفلاین و ایزوله)
 *
 * قانون سخت (Hard Rule):
 * در این فاز، هیچ درخواست شبکه‌ای (fetch، axios، یا هر تماس خارجی) برقرار نمی‌شود.
 * تمام پاسخ‌ها از بانک عبارات غنی و محلی (Local Bank) تولید و فیلتر می‌شوند.
 * این کلاس به صورت ماژولار و رابط‌محور (Interface-based) طراحی شده تا در آینده،
 * پیاده‌سازی اتصال به Google Gemini API با حفظ کامل منطق و بدون تغییر رابط کلاینت امکان‌پذیر باشد.
 */

import { Mood } from './types';

export interface AIContext {
  studentName?: string;
  plantName?: string;
  mood?: Mood;
  absenceDays?: number;
  dream?: string | null;
  habit?: string;
  promptType?: 'conversation_starter' | 'empathy_check' | 'morning_ritual' | 'encouragement';
}

export interface IAIBrain {
  generateResponse(context: AIContext | string): Promise<string>;
  isOfflineMode(): boolean;
}

/**
 * بانک عبارات محلی و از پیش‌نوشته‌شده (Local Bank)
 * دسته‌بندی‌شده بر اساس حس و حال گیاه، مدت غیبت و نیاز گفت‌وگوی معلم
 */
const LOCAL_PHRASE_BANK = {
  alert: [
    '«{student} عزیز، گیاه "{plant}" امروز توی باغچه با چشم‌های منتظر نشسته بود؛ بعد از زنگ کلاسی احوالش رو بپرس و ببین آیا چیزی نیاز داره.»',
    '«گاهی چند روز بی‌خبری فقط به خاطر خستگی یا مشکلات ارتباطیه؛ می‌تونی به {student} بگی: "امروز جات تو کلاس خالی بود، گیاهت هم منتظرت موند."»',
    '«به جای پرسیدن از تکالیف عقب‌افتاده، ازش بپرس: "{student} جان، شنیدم گیاهت چند روزه با نسیم پاییزی حرف نزده؛ دوست داری با هم بهش آب بدیم؟"»',
    '«یک تماس کوتاه با مادر یا پدر: "سلام، فقط می‌خواستم احوالی از {student} بپرسم؛ گیاهش توی باغچه دلتنگ دست‌های مهربونشه."»',
  ],
  longing: [
    '«می‌تونی ازش بپرسی دیشب گیاهش چه خوابی دیده.»',
    '«{student} جان، گیاه "{plant}" بعد از ۲ روز دوری هنوز منتظر شنیدن قصه‌ی تازه از زبون توئه!»',
    '«یک یادآوری ساده و پرلبخند در پایان کلاس مجازی: "بچه‌ها، بعد از خوندن درس، یک دقیقه به گلدون‌هاتون سر بزنید و بهشون سلام کنید."»',
    '«امروز زمان خوبی برای اینه که از {student} بپرسی آیا آب و نور کافی به گیاهش رسیده یا نه.»',
  ],
  thriving: [
    '«گیاه "{plant}" امروز با نشاط و پربرگ ایستاده؛ می‌تونی از {student} بخوای رازش رو برای بیدار شدن سر ساعت برای بقیه تعریف کنه.»',
    '«یک تحسین درونی: "چه حس قشنگیه که {student} هر روز مراقب این جوانه کوچیکه؛ استمرارت واقعاً باارزشه."»',
    '«می‌تونی بپرسی: "{student} عزیز، با برگ جدیدی که گیاهت داده، دوست داری براش یک قصه کوتاه دو خطی بنویسی؟"»',
    '«امروز گیاه شاداب و درخشانه! از {student} بپرس آیا دوست داره روی برگ گیاهش یه قطره شبنم یا روبان بزنه؟»',
  ],
  content: [
    '«ریتم مراقبت آرام و پایداره. می‌تونی از {student} بپرسی گیاهش امروز چه صدایی رو توی خونه شنیده.»',
    '«یک سلام صمیمی: "{student} عزیز، گیاهت روز آرومی رو سپری می‌کنه؛ ممنون که حواست به گلدونت هست."»',
    '«بهانه‌ای برای نوشتن: از {student} بخواه در چند کلمه بگه رنگ سبزی گیاهش به چی شباهت داره.»',
  ],
  general: [
    '«امروز روز فوق‌العاده‌ایه تا بچه‌ها بدون هیچ ترسی از نمره، از احساسشون نسبت به گیاه کلاسی بگن.»',
    '«یک آیین کلاسی دو دقیقه‌ای قبل از شروع درس: "بیاید چشم‌هامون رو ببندیم و تصور کنیم خاک گلدون‌هامون چه بوی خنکی میده."»',
    '«به یاد داشته باشیم: مراقبت استمرار می‌آفریند، نه رقابت.»',
  ],
};

export class AIBrain implements IAIBrain {
  private readonly offlineOnly = true;

  /**
   * وضعیت عملکردی ماژول (همواره آفلاین در این فاز)
   */
  public isOfflineMode(): boolean {
    return this.offlineOnly;
  }

  /**
   * متد اصلی تولید پاسخ (کاملاً محلی و بدون هیچ درخواست شبکه)
   * در صورت وجود اتصال به اینترنت در نسخه‌های آینده، این نقطه برای فراخوانی Gemini API فعال خواهد شد.
   */
  public async generateResponse(context: AIContext | string): Promise<string> {
    // نرمال‌سازی ورودی
    const parsedContext: AIContext =
      typeof context === 'string'
        ? { studentName: 'دانش‌آموز', plantName: 'گیاه', mood: 'content' }
        : context;

    const mood = parsedContext.mood || 'content';
    const studentName = parsedContext.studentName || 'دانش‌آموز';
    const plantName = parsedContext.plantName || 'گیاه';

    // اگر رویایی فعال باشد، اولویت با پیشنهاد گفت‌وگوی رویاست
    if (parsedContext.dream) {
      return `می‌تونی ازش بپرسی دیشب گیاهش چه خوابی دیده؛ خواب دیده بود که: «${parsedContext.dream.slice(0, 45)}...»`;
    }

    // انتخاب هوشمند از بانک جملات محلی (Local Bank)
    const candidates = LOCAL_PHRASE_BANK[mood] || LOCAL_PHRASE_BANK.general;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const template = candidates[randomIndex] || candidates[0];

    // پر کردن متغیرهای زمینه‌ای
    const resolvedSentence = template
      .replace(/{student}/g, studentName)
      .replace(/{plant}/g, plantName);

    // تاخیر کوچک صوری (۱۲۰ میلی‌ثانیه) صرفاً برای شبیه‌سازی حسیِ تعامل انسانی بدون ایجاد مکث
    await new Promise((resolve) => setTimeout(resolve, 120));

    return resolvedSentence;
  }

  /*
   * =========================================================================
   * معماری آینده‌نگر (Future Gemini Integration Hook - Dormant)
   * =========================================================================
   * این بخش در فازهای بعدی که سرور ابری یا کلید API در دسترس باشد
   * پیاده‌سازی خواهد شد. در وضعیت کنونی هیچ کدی از این بخش اجرا نمی‌شود.
   *
   * private async _futureGeminiCall(prompt: string, apiKey: string): Promise<string> {
   *   // Future implementation with @google/genai SDK on server-side proxy
   *   // Not executed in offline mode.
   *   return '';
   * }
   */
}

// سینگلتون پیش‌فرض برای استفاده در کامپوننت‌های فرانت‌اند
export const aiBrain = new AIBrain();
