import React, { useState, useEffect, useRef } from 'react';
import { Plant, Mood } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Heart,
  Copy,
  Check,
  Send,
  RefreshCw,
  MessageCircle,
  Sun,
  BookOpen,
  Clock,
  ShieldCheck,
  Play,
  Square,
  Trash2,
  Edit3,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface AvaAdvisorWidgetProps {
  plants: Plant[];
  onSendNudge?: (plantId: string, customMessage?: string, voiceAudioUrl?: string) => void;
  onSelectPlant?: (plant: Plant) => void;
}

// Empathy Engine Bank for Ava Advisor (مشاور آوا - تحلیل عاطفی ریتم روز)
const AVA_INSPIRING_QUOTES: Record<Mood, string[]> = {
  alert: [
    '«{child} عزیز، امروز گلدون "{plant}" خلوت و ساکت بود. در گفت‌وگوی خصوصی ازش بپرس: "چیز جالبی هست که دلمون بخواد با هم درباره‌ش حرف بزنیم؟"»',
    '«{child} جان، گاهی گیاهان هم مثل آدما دوست دارن یک روز رو به استراحت بگذرونن. بهش بگو: "منتظر شنیدن لبخند دوباره‌ت روی گلدون هستیم."»',
    '«به جای پیگیری تکالیف، با نغمه‌ای مهربانانه بپرس: "{child} عزیز، دیشب خوابِ چه پنجره‌ای رو دیدی؟ دوست داری با هم آبش بدیم؟"»',
  ],
  longing: [
    '«گیاه "{plant}" امروز چشم‌به‌راه قدم‌های تو بود. به {child} بگو: "هر موقع برگشتی، گلدونت با یه سلام گرم منتظرته."»',
    '«{child} جان، ۲ روز دوری باعث میشه دیدار دوباره قشنگ‌تر بشه. بپرس: "دوست داری با هم ببینیم برگ جدیدش چقدر قد کشیده؟"»',
    '«یک نغمهٔ امیدبخش: "{child} عزیز، بوی خاک مرطوب گلدونت هنوز منتظر دست‌های مهربون توئه."»',
  ],
  thriving: [
    '«امروز گیاه "{plant}" با انرژی و سرسبز ایستاده! به {child} بگو: "استمرار و مراقبت قشنگت، به همهٔ کلاس ما حس شادابی میده."»',
    '«{child} جان، دیدن سرزندگی گلدونت حس افتخار داره. بپرس: "دوست داری راز بیدار شدن سر ساعت رو در یک جمله برامون بگی؟"»',
    '«یک ستایش درونی: "{child} عزیز، تو با مهربانیت نشون دادی که چیزهای کوچک چقدر می‌تونن بزرگ و سرسبز بشن."»',
  ],
  content: [
    '«ریتم مراقبت آرام و استواره. به {child} بگو: "آرامش و نظم زیبات، مثل نور آروم صبحگاه برای گیاهت ارزشمنده."»',
    '«{child} جان، گلدون "{plant}" روز آروم و متوازن داره. بپرس: "دوست داری یک شعر دو کلمه‌ای برای برگ تازه‌ش بگی؟"»',
  ],
};

export const AvaAdvisorWidget: React.FC<AvaAdvisorWidgetProps> = ({
  plants,
  onSendNudge,
  onSelectPlant,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(plants[0]?.id || 'p-15');
  const [analyzingRhythm, setAnalyzingRhythm] = useState<boolean>(false);
  const [editableAdvice, setEditableAdvice] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [nudgeSentStatus, setNudgeSentStatus] = useState<boolean>(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const selectedPlant = plants.find((p) => p.id === selectedStudentId) || plants[0] || {
    id: 'p-15',
    childName: 'علی',
    plantName: 'جوانه',
    mood: 'longing' as Mood,
    lastSeenDays: 2,
    growthDays: 12,
  };

  // Generate Empathetic Inspiring Sentence Template based on Plant Mood
  const generateNewAdvice = (plant: Partial<Plant>) => {
    sound.playPlantClick(520);
    setAnalyzingRhythm(true);

    setTimeout(() => {
      const mood = (plant.mood || 'content') as Mood;
      const candidates = AVA_INSPIRING_QUOTES[mood] || AVA_INSPIRING_QUOTES.content;
      const randomIndex = Math.floor(Math.random() * candidates.length);

      let text = candidates[randomIndex] || candidates[0];
      text = text
        .replace(/{child}/g, plant.childName || 'دانش‌آموز')
        .replace(/{plant}/g, plant.plantName || 'گیاه');

      setEditableAdvice(text);
      setAnalyzingRhythm(false);
      setNudgeSentStatus(false);
    }, 400);
  };

  useEffect(() => {
    if (selectedPlant) {
      generateNewAdvice(selectedPlant);
      setRecordedAudioUrl(null);
    }
  }, [selectedStudentId]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // MediaRecorder Voice Recording Logic
  const startVoiceRecording = async () => {
    sound.playPlantClick(600);
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];
    setRecordSeconds(0);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        timerRef.current = setInterval(() => {
          setRecordSeconds((sec) => sec + 1);
        }, 1000);
      } else {
        simulateVoiceRecording();
      }
    } catch (err) {
      // Fallback simulation if mic permission is denied or in non-https environment
      simulateVoiceRecording();
    }
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setRecordSeconds((sec) => sec + 1);
    }, 1000);
  };

  const stopVoiceRecording = () => {
    sound.playPlantClick(480);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Dummy audio URL for simulated mic
      setRecordedAudioUrl('simulated-voice-note.mp3');
    }
  };

  const handleDeleteRecordedVoice = () => {
    sound.playPlantClick(300);
    setRecordedAudioUrl(null);
    setRecordSeconds(0);
  };

  const handlePlayRecordedVoice = () => {
    sound.playJoyfulChime();
    setIsPlayingRecorded(true);

    if (recordedAudioUrl && recordedAudioUrl !== 'simulated-voice-note.mp3') {
      const audio = new Audio(recordedAudioUrl);
      audioPlayerRef.current = audio;
      audio.play();
      audio.onended = () => setIsPlayingRecorded(false);
    } else {
      setTimeout(() => setIsPlayingRecorded(false), 3000);
    }
  };

  // Speech Synthesis Playback (TTS)
  const handlePlayVoiceTTS = () => {
    if (!editableAdvice) return;

    sound.playJoyfulChime();
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = editableAdvice.replace(/[«»"]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fa-IR';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const handleCopy = () => {
    if (!editableAdvice) return;
    navigator.clipboard.writeText(editableAdvice);
    sound.playPlantClick(620);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendNudgeClick = () => {
    if (selectedPlant) {
      sound.playJoyfulChime();
      if (onSendNudge) {
        onSendNudge(selectedPlant.id, editableAdvice, recordedAudioUrl || undefined);
      }
      setNudgeSentStatus(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#F5F3FF] rounded-3xl p-5 sm:p-6 border border-[#E9D5FF] shadow-xs space-y-5 text-right dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E9D5FF]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9333EA] to-[#C084FC] flex items-center justify-center text-white text-2xl shadow-md ring-4 ring-[#9333EA]/20 shrink-0">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#4C1D95]">
                ابزارک «مشاور آوا» — تحلیل خلق‌وخو و ضبط صدای الهام‌بخش (Voice-to-Emotion)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5FF] text-[#7E22CE] text-[10px] font-bold border border-[#D8B4FE]">
                بدون نمره‌دهی و مقایسه
              </span>
            </div>
            <p className="text-xs text-[#6B21A8] mt-0.5">
              پیشنهاد تمپلیت متنی بر اساس خلق‌وخوی گیاه + امکان ضبط مستقیم صدای معلم و ارسال برای دانش‌آموز
            </p>
          </div>
        </div>

        {/* Voice Record Toggle Button */}
        {!isRecording ? (
          <button
            type="button"
            onClick={startVoiceRecording}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer bg-white hover:bg-[#FAF5FF] text-[#6B21A8] border border-[#D8B4FE]"
          >
            <Mic className="w-4 h-4 text-[#9333EA]" />
            <span>ضبط صدای معلم برای دانش‌آموز</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopVoiceRecording}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer bg-[#DC2626] text-white animate-pulse ring-4 ring-red-300"
          >
            <Square className="w-4 h-4" />
            <span>توقف ضبط ({recordSeconds} ثانیه)</span>
          </button>
        )}
      </div>

      {/* Target Student Selector & Rhythm Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/80 p-3.5 rounded-2xl border border-[#E9D5FF] text-xs">
        {/* Student Dropdown */}
        <div className="space-y-1 sm:col-span-1">
          <label className="font-bold text-[#581C87] block text-[11px]">
            انتخاب دانش‌آموز جهت گفت‌وگوی خصوصی:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              const p = plants.find((x) => x.id === e.target.value);
              if (p && onSelectPlant) onSelectPlant(p);
            }}
            className="w-full p-2 rounded-xl border border-[#D8B4FE] bg-[#FAF5FF] font-bold text-[#4C1D95] outline-none focus:ring-2 focus:ring-[#9333EA] text-xs cursor-pointer"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                گیاه «{p.plantName}» — دانش‌آموز: {p.childName} ({p.mood === 'thriving' ? 'شاداب' : p.mood === 'longing' ? 'دلتنگ' : p.mood === 'alert' ? 'نیازمند توجه' : 'آرام'})
              </option>
            ))}
          </select>
        </div>

        {/* Student Rhythm Summary Cards */}
        <div className="flex items-center justify-around sm:col-span-2 bg-[#FAF5FF] p-2 rounded-xl border border-[#F3E8FF] text-[#6B21A8]">
          <div className="text-center">
            <span className="text-[10px] text-[#A855F7] block font-semibold">تحلیل خلق‌وخوی گیاه</span>
            <span className="font-black text-xs text-[#581C87]">
              {selectedPlant.mood === 'thriving'
                ? '🌿 سرزنده و پرانرژی'
                : selectedPlant.mood === 'longing'
                ? '🌾 دلتنگ و چشم‌به‌راه'
                : selectedPlant.mood === 'alert'
                ? '🍂 نیازمند توجه ویژه'
                : '🍃 آرام و متوازن'}
            </span>
          </div>

          <div className="h-6 w-px bg-[#E9D5FF]" />

          <div className="text-center">
            <span className="text-[10px] text-[#A855F7] block font-semibold">استمرار همراهی</span>
            <span className="font-black text-xs text-[#581C87]">
              {selectedPlant.growthDays} روز مراقبت فعال
            </span>
          </div>

          <div className="h-6 w-px bg-[#E9D5FF]" />

          <div className="text-center">
            <span className="text-[10px] text-[#A855F7] block font-semibold">حضور امروز</span>
            <span className="font-black text-xs text-[#581C87]">
              {selectedPlant.lastSeenDays === 0 ? 'امروز بیدار شد ☀️' : `${selectedPlant.lastSeenDays} روز غایب 🌙`}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Recording Player Bar if Audio Saved */}
      {recordedAudioUrl && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayRecordedVoice}
              className="w-10 h-10 rounded-full bg-white text-purple-900 flex items-center justify-center shadow-md hover:scale-105 cursor-pointer"
            >
              {isPlayingRecorded ? <Square className="w-4 h-4 fill-purple-900" /> : <Play className="w-4 h-4 fill-purple-900 mr-0.5" />}
            </button>
            <div>
              <h4 className="text-xs font-bold">صدای ضبط‌شده معلم برای {selectedPlant.childName}</h4>
              <span className="text-[10px] text-purple-200">مدت زمان: {recordSeconds > 0 ? `${recordSeconds} ثانیه` : 'آماده ارسال'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteRecordedVoice}
            className="p-2 text-rose-300 hover:text-rose-100 cursor-pointer"
            title="حذف صدای ضبط‌شده"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Editable Inspiring Quote Template Box */}
      <div className="bg-white rounded-2xl p-5 border-2 border-[#D8B4FE] shadow-xs relative space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F3E8FF]">
          <span className="text-xs font-bold text-[#7E22CE] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#A855F7]" />
            <span>تمپلیت پیشنهادی بر اساس خلق‌وخوی گیاه «{selectedPlant.plantName}» (قابل ویرایش):</span>
          </span>

          <button
            type="button"
            onClick={() => generateNewAdvice(selectedPlant)}
            disabled={analyzingRhythm}
            className="text-xs text-[#9333EA] hover:text-[#6B21A8] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzingRhythm ? 'animate-spin' : ''}`} />
            <span>پیشنهاد تمپلیت جدید</span>
          </button>
        </div>

        {/* Editable Textarea Template */}
        {analyzingRhythm ? (
          <div className="py-6 text-center text-xs font-bold text-[#A855F7] animate-pulse flex items-center justify-center gap-2">
            <span>✨</span>
            <span>در حال تحلیل ریتم خلق‌وخو و ساخت تمپلیت الهام‌بخش...</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <textarea
              rows={3}
              value={editableAdvice}
              onChange={(e) => setEditableAdvice(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#D8B4FE] bg-[#FAF5FF] text-sm font-bold text-[#3B0764] leading-relaxed outline-none focus:ring-2 focus:ring-[#9333EA] resize-none"
              placeholder="متن پیام الهام‌بخش را ویرایش یا تکمیل کنید..."
            />
            <span className="text-[10px] text-[#9333EA] block text-left">
              💡 معلم گرامی، می‌توانید متن فوق را آزادانه ویرایش و شخصی‌سازی کنید.
            </span>
          </div>
        )}

        {/* Action Buttons: Play TTS, Copy, Send Nudge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F3E8FF]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayVoiceTTS}
              disabled={isPlayingAudio || analyzingRhythm}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#9333EA] text-white animate-pulse'
                  : 'bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#6B21A8] border border-[#D8B4FE]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'در حال پخش لحن هوشمند...' : 'شنیدن با لحن هوشمند'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] transition-all flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد!' : 'کپی متن'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendNudgeClick}
            disabled={nudgeSentStatus}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
              nudgeSentStatus
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#7E22CE] hover:to-[#6B21A8] text-white'
            }`}
          >
            {nudgeSentStatus ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            <span>
              {nudgeSentStatus
                ? 'پیام و صدای صمیمی ارسال شد ✨'
                : recordedAudioUrl
                ? 'ارسال مستقیم متن و صدای ضبط‌شده به دانش‌آموز'
                : 'ارسال مستقیم متن تمپلیت به دانش‌آموز'}
            </span>
          </button>
        </div>
      </div>

      {/* Ethical Guarantee Notice */}
      <div className="flex items-center gap-2 text-[11px] text-[#7E22CE] bg-white/60 p-2.5 rounded-xl border border-[#E9D5FF]">
        <ShieldCheck className="w-4 h-4 text-[#9333EA] shrink-0" />
        <span>
          <strong>ضمانت اخلاقی مشاور آوا:</strong> این جملات تمپلیت بر اساس خلق‌وخوی گیاه پیشنهاد می‌شوند و بدون نمره‌دهی یا مقایسه دانش‌آموزان با یکدیگر هستند.
        </span>
      </div>
    </div>
  );
};
