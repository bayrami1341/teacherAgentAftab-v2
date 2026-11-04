import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Plus,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Clock,
  Settings,
  Share2,
  Award,
  FileText,
  Trash2,
  Check,
  Radio,
  Square,
  VolumeX,
} from 'lucide-react';
import { sound } from '../utils/audio';

export interface DictationItem {
  id: string;
  title: string;
  grade: number;
  category: 'math_words' | 'number_dictation' | 'problem_solving';
  sentences: string[];
  audioUrls?: Record<number, string>; // Recorded audio per sentence index
}

const PRESET_DICTATIONS: DictationItem[] = [
  {
    id: 'dict-1',
    title: 'دیکته ارزش مکانی و اعداد بزرگ (پایه چهارم)',
    grade: 4,
    category: 'number_dictation',
    sentences: [
      'عدد چهارصد و پنجاه و سه هزار و دویست و چهارده را بنویسید.',
      'هفت میلیون و سیصد و بیست هزار و نهصد.',
      'سه پنجم شکل مقابل را رنگ بزنید.',
      'خارج قسمت تقسیم ۴۸ بر ۶ چند است؟',
    ],
  },
  {
    id: 'dict-2',
    title: 'دیکته کسرها و اعداد اعشاری (پایه پنجم)',
    grade: 5,
    category: 'math_words',
    sentences: [
      'کسر سه پنجم برابر با شش دهم است.',
      'مساحت مثلث برابر است با قاعده ضرب در ارتفاع تقسیم بر دو.',
      'عدد دو و هفت صدم را به صورت اعشاری بنویسید.',
      'نسبت مساحت مربع به طول ضلع را محاسبه کنید.',
    ],
  },
  {
    id: 'dict-3',
    title: 'دیکته اصطلاحات هندسی و حجم (پایه ششم)',
    grade: 6,
    category: 'problem_solving',
    sentences: [
      'محیط دایره برابر است با قطر ضرب در عدد پی.',
      'عدد پی تقریباً برابر سه و چهارده صدم است.',
      'حجم مکعب مستطیل برابر است با طول ضرب در عرض ضرب در ارتفاع.',
      'زاویه‌های متقابل به رأس با یکدیگر برابر هستند.',
    ],
  },
  {
    id: 'dict-4',
    title: 'دیکته اعداد و واژگان پایه دوم و سوم',
    grade: 3,
    category: 'math_words',
    sentences: [
      'صد و بیست و پنج ضرب در چهار.',
      'هر کیلوگرم برابر هزار گرم است.',
      'ساعت سه و پانزده دقیقه یعنی سه و ربع.',
      'محیط مربع برابر ضلع ضرب در چهار است.',
    ],
  },
];

export const SmartDictationWidget: React.FC = () => {
  const [dictations, setDictations] = useState<DictationItem[]>(PRESET_DICTATIONS);
  const [selectedDictId, setSelectedDictId] = useState<string>(PRESET_DICTATIONS[0].id);
  const [activeTab, setActiveTab] = useState<'play' | 'record_teacher' | 'create'>('play');
  const [voiceSource, setVoiceSource] = useState<'teacher_recorded' | 'tts_speech'>('teacher_recorded');

  // Playback settings
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.8);
  const [repeatCount, setRepeatCount] = useState<number>(2);
  const [pauseDuration, setPauseDuration] = useState<number>(5);

  // Playback State
  const activeDictation = dictations.find((d) => d.id === selectedDictId) || dictations[0];
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  // Sentence Voice Recording State
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Custom Dictation Builder State
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customGrade, setCustomGrade] = useState<number>(5);
  const [customCategory, setCustomCategory] = useState<'math_words' | 'number_dictation' | 'problem_solving'>('math_words');
  const [rawSentencesText, setRawSentencesText] = useState<string>('');

  const speechTimerRef = useRef<any>(null);

  useEffect(() => {
    resetPlayback();
  }, [selectedDictId]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (currentAudioRef.current) currentAudioRef.current.pause();
    };
  }, []);

  const resetPlayback = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (currentAudioRef.current) currentAudioRef.current.pause();

    setCurrentSentenceIndex(0);
    setCurrentRepeat(1);
    setIsPlaying(false);
    setIsFinished(false);
    setShowAnswerKey(false);
  };

  // Play a sentence using either Recorded Teacher Voice or Speech Synthesis
  const playSentenceAudio = (sentenceText: string, sentenceIndex: number, onEndCallback?: () => void) => {
    const recordedUrl = activeDictation.audioUrls?.[sentenceIndex];

    // Priority 1: Use Teacher's Recorded Voice if available & selected
    if (voiceSource === 'teacher_recorded' && recordedUrl) {
      if (currentAudioRef.current) currentAudioRef.current.pause();
      const audio = new Audio(recordedUrl);
      currentAudioRef.current = audio;
      audio.play();

      audio.onended = () => {
        if (onEndCallback) onEndCallback();
      };
      audio.onerror = () => {
        fallbackToTTS(sentenceText, onEndCallback);
      };
      return;
    }

    // Priority 2: Web Speech Synthesis TTS
    fallbackToTTS(sentenceText, onEndCallback);
  };

  const fallbackToTTS = (sentenceText: string, onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, 3500);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = 'fa-IR';
    utterance.rate = speechSpeed;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Dictation Engine Loop
  const playDictationStep = (sIndex: number, repIndex: number) => {
    if (sIndex >= activeDictation.sentences.length) {
      sound.playJoyfulChime();
      setIsPlaying(false);
      setIsFinished(true);
      return;
    }

    setCurrentSentenceIndex(sIndex);
    setCurrentRepeat(repIndex);
    setIsPlaying(true);

    const sentence = activeDictation.sentences[sIndex];

    playSentenceAudio(sentence, sIndex, () => {
      if (repIndex < repeatCount) {
        speechTimerRef.current = setTimeout(() => {
          playDictationStep(sIndex, repIndex + 1);
        }, pauseDuration * 1000);
      } else {
        speechTimerRef.current = setTimeout(() => {
          playDictationStep(sIndex + 1, 1);
        }, pauseDuration * 1000);
      }
    });
  };

  const handleStartPlay = () => {
    sound.playPlantClick(540);
    if (isFinished) {
      resetPlayback();
    }
    playDictationStep(currentSentenceIndex, currentRepeat);
  };

  const handlePausePlay = () => {
    sound.playPlantClick(400);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (currentAudioRef.current) currentAudioRef.current.pause();
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    setIsPlaying(false);
  };

  const handleNextSentence = () => {
    sound.playPlantClick(480);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (currentAudioRef.current) currentAudioRef.current.pause();
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

    const nextIndex = Math.min(activeDictation.sentences.length - 1, currentSentenceIndex + 1);
    setCurrentSentenceIndex(nextIndex);
    setCurrentRepeat(1);
    if (isPlaying) {
      playDictationStep(nextIndex, 1);
    }
  };

  const handlePrevSentence = () => {
    sound.playPlantClick(480);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (currentAudioRef.current) currentAudioRef.current.pause();
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

    const prevIndex = Math.max(0, currentSentenceIndex - 1);
    setCurrentSentenceIndex(prevIndex);
    setCurrentRepeat(1);
    if (isPlaying) {
      playDictationStep(prevIndex, 1);
    }
  };

  const handleReplayCurrent = () => {
    sound.playPlantClick(520);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (currentAudioRef.current) currentAudioRef.current.pause();
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

    playSentenceAudio(activeDictation.sentences[currentSentenceIndex], currentSentenceIndex);
  };

  // --- TEACHER SENTENCE AUDIO RECORDING LOGIC ---
  const startRecordingSentence = async (sIndex: number) => {
    sound.playPlantClick(600);
    setRecordingIndex(sIndex);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          saveSentenceAudioUrl(sIndex, url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        timerRef.current = setInterval(() => setRecordingSeconds((sec) => sec + 1), 1000);
      } else {
        simulateSentenceRecording(sIndex);
      }
    } catch (err) {
      simulateSentenceRecording(sIndex);
    }
  };

  const simulateSentenceRecording = (sIndex: number) => {
    timerRef.current = setInterval(() => setRecordingSeconds((sec) => sec + 1), 1000);
  };

  const stopRecordingSentence = (sIndex: number) => {
    sound.playPlantClick(480);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      saveSentenceAudioUrl(sIndex, 'simulated-teacher-voice.mp3');
    }
    setRecordingIndex(null);
  };

  const saveSentenceAudioUrl = (sIndex: number, url: string) => {
    const updatedDicts = dictations.map((dict) => {
      if (dict.id === activeDictation.id) {
        return {
          ...dict,
          audioUrls: {
            ...(dict.audioUrls || {}),
            [sIndex]: url,
          },
        };
      }
      return dict;
    });
    setDictations(updatedDicts);
    sound.playJoyfulChime();
  };

  const handleDeleteSentenceAudio = (sIndex: number) => {
    sound.playPlantClick(300);
    const updatedDicts = dictations.map((dict) => {
      if (dict.id === activeDictation.id) {
        const nextAudioUrls = { ...(dict.audioUrls || {}) };
        delete nextAudioUrls[sIndex];
        return { ...dict, audioUrls: nextAudioUrls };
      }
      return dict;
    });
    setDictations(updatedDicts);
  };

  // Custom Dictation Save
  const handleSaveCustomDictation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !rawSentencesText.trim()) return;

    sound.playJoyfulChime();
    const lines = rawSentencesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const created: DictationItem = {
      id: `dict-${Date.now()}`,
      title: customTitle.trim(),
      grade: customGrade,
      category: customCategory,
      sentences: lines,
    };

    setDictations([created, ...dictations]);
    setSelectedDictId(created.id);
    setCustomTitle('');
    setRawSentencesText('');
    setActiveTab('play');
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-6 text-right dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F1F5F9]">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-[#0284C7]" />
            <span>ابزارک «دیکته‌گوی درسی با صدای معلم» (Smart Dictation Engine)</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            پشتیبانی کامل از هر دو حالت: **ضبط صدای واقعی معلم** (بدون لهجه و با لحن استاندارد کلاسی) + **گوینده هوشمند**
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setActiveTab('play')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'play' ? 'bg-[#0284C7] text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>اجرای دیکته کلاس</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('record_teacher')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'record_teacher' ? 'bg-purple-600 text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>ضبط صدای معلم (سطر به سطر)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'create' ? 'bg-[#0284C7] text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>ثبت متن دیکته جدید</span>
          </button>
        </div>
      </div>

      {/* Preset Dictations Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {dictations.map((d) => {
          const isSelected = d.id === selectedDictId;
          const hasTeacherVoices = d.audioUrls && Object.keys(d.audioUrls).length > 0;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setSelectedDictId(d.id);
                sound.playPlantClick(500);
              }}
              className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/30 shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-sky-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">
                  پایه {d.grade}
                </span>
                {hasTeacherVoices && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    <span>با صدای معلم</span>
                  </span>
                )}
              </div>
              <h4 className="font-bold text-xs text-[#0F172A] line-clamp-1">{d.title}</h4>
              <span className="text-[10px] text-[#94A3B8]">شامل {d.sentences.length} جمله دیکته</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLAY DICTATION MODE */}
      {activeTab === 'play' && (
        <div className="space-y-6">
          {/* Voice Mode Selector & Controls */}
          <div className="bg-[#F0F9FF] p-4 rounded-3xl border border-[#BAE6FD] grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs items-center">
            <div className="sm:col-span-5 space-y-1">
              <label className="font-bold text-[#0369A1] block">منبع صدا و لهجه گوینده:</label>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#93C5FD]">
                <button
                  type="button"
                  onClick={() => setVoiceSource('teacher_recorded')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    voiceSource === 'teacher_recorded' ? 'bg-purple-600 text-white shadow-xs' : 'text-[#64748B]'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>صدای واقعی معلم (پیش‌فرض)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceSource('tts_speech')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    voiceSource === 'tts_speech' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-[#64748B]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>گوینده هوشمند</span>
                </button>
              </div>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="font-bold text-[#0369A1] block">تعداد تکرار هر جمله:</label>
              <select
                value={repeatCount}
                onChange={(e) => setRepeatCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#93C5FD] bg-white font-bold text-[#0F172A] outline-none cursor-pointer"
              >
                <option value={1}>۱ بار خوانده شود</option>
                <option value={2}>۲ بار خوانده شود (پیش‌فرض)</option>
                <option value={3}>۳ بار خوانده شود</option>
              </select>
            </div>

            <div className="sm:col-span-4 space-y-1">
              <label className="font-bold text-[#0369A1] block">مکث بین جملات (ثانیه):</label>
              <select
                value={pauseDuration}
                onChange={(e) => setPauseDuration(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#93C5FD] bg-white font-bold text-[#0F172A] outline-none cursor-pointer"
              >
                <option value={3}>۳ ثانیه مکث</option>
                <option value={5}>۵ ثانیه مکث (پیش‌فرض)</option>
                <option value={8}>۸ ثانیه مکث (زمان بیشتر برای نوشتن)</option>
              </select>
            </div>
          </div>

          {/* Main Dictation Player Display Box */}
          <div className="bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0369A1] text-white p-6 rounded-3xl shadow-lg space-y-6 text-center">
            <div className="flex items-center justify-between text-xs text-sky-100 border-b border-white/20 pb-3">
              <span className="font-bold">
                جمله شماره {currentSentenceIndex + 1} از {activeDictation.sentences.length}
              </span>
              <div className="flex items-center gap-2">
                {activeDictation.audioUrls?.[currentSentenceIndex] && (
                  <span className="bg-purple-500/80 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    <span>صدای معلم موجود است</span>
                  </span>
                )}
                <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
                  تکرار {currentRepeat} از {repeatCount}
                </span>
              </div>
            </div>

            {/* Current Sentence Prompt */}
            <div className="py-4 space-y-2">
              <h3 className="text-xl sm:text-2xl font-black leading-relaxed">
                {isPlaying
                  ? `🔊 «${activeDictation.sentences[currentSentenceIndex]}»`
                  : showAnswerKey
                  ? `«${activeDictation.sentences[currentSentenceIndex]}»`
                  : 'برای شروع دیکته‌گویی روی دکمه پخش کلیک کنید.'}
              </h3>
              {isPlaying && (
                <p className="text-xs text-sky-200 animate-pulse">
                  در حال پخش صوتی... (دانش‌آموزان روی دفترچه یا تبلت بنویسند)
                </p>
              )}
            </div>

            {/* Playback Audio Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrevSentence}
                disabled={currentSentenceIndex === 0}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 cursor-pointer"
                title="جمله قبلی"
              >
                <SkipRightIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleReplayCurrent}
                className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                title="تکرار مجدد همین جمله"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {!isPlaying ? (
                <button
                  type="button"
                  onClick={handleStartPlay}
                  className="px-6 py-3 bg-white text-[#0369A1] hover:bg-sky-50 font-black text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-[#0369A1]" />
                  <span>{isFinished ? 'شروع مجدد دیکته' : 'پخش دیکته'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePausePlay}
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer animate-pulse"
                >
                  <Pause className="w-5 h-5" />
                  <span>توقف موقت</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNextSentence}
                disabled={currentSentenceIndex >= activeDictation.sentences.length - 1}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 cursor-pointer"
                title="جمله بعدی"
              >
                <SkipLeftIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Self-Check & Answer Key Verification Section */}
          <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#EADFCF] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#4A3B32] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>خودسنجی و بررسی متن دیکته نوشته‌شده:</span>
              </h4>

              <button
                type="button"
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] text-xs font-bold cursor-pointer"
              >
                {showAnswerKey ? 'مخفی‌سازی کلید پاسخ' : 'نمایش کلید پاسخ تمام جملات'}
              </button>
            </div>

            {showAnswerKey && (
              <div className="bg-white p-4 rounded-2xl border border-[#CBD5E1] space-y-2 text-xs">
                <span className="font-bold text-[#0F172A] block mb-1">کلید کامل دیکته «{activeDictation.title}»:</span>
                {activeDictation.sentences.map((sent, idx) => (
                  <div key={idx} className="p-2 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] font-semibold text-[#334155] flex items-center justify-between">
                    <div>
                      <span className="text-[#0284C7] font-bold ml-2">جمله {idx + 1}:</span>
                      <span>{sent}</span>
                    </div>
                    {activeDictation.audioUrls?.[idx] && (
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-bold">
                        🎙️ صدای اختصاصی معلم
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER VOICE RECORDING (ضبط صدای معلم سطر به سطر) */}
      {activeTab === 'record_teacher' && (
        <div className="bg-[#FAF5FF] rounded-3xl border border-[#E9D5FF] p-6 space-y-6">
          <div className="pb-3 border-b border-[#E9D5FF]">
            <h3 className="text-base font-black text-[#4C1D95] flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-600" />
              <span>ضبط صدای واقعی معلم برای جملات دیکته «{activeDictation.title}»</span>
            </h3>
            <p className="text-xs text-[#6B21A8] mt-1">
              معلم گرامی، روی دکمه میکروفون هر جمله کلیک کرده و با لحن رسا، شمرده و بدون لهجه جمله را بخوانید:
            </p>
          </div>

          <div className="space-y-3">
            {activeDictation.sentences.map((sentence, idx) => {
              const isRec = recordingIndex === idx;
              const hasAudio = Boolean(activeDictation.audioUrls?.[idx]);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    hasAudio
                      ? 'bg-white border-purple-300 shadow-2xs'
                      : 'bg-white/60 border-[#CBD5E1]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#9333EA]">جمله {idx + 1}:</span>
                    <p className="text-sm font-bold text-[#0F172A]">{sentence}</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {hasAudio && !isRec && (
                      <button
                        type="button"
                        onClick={() => playSentenceAudio(sentence, idx)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>پخش صدای معلم</span>
                      </button>
                    )}

                    {!isRec ? (
                      <button
                        type="button"
                        onClick={() => startRecordingSentence(idx)}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{hasAudio ? 'ضبط مجدد صدا' : 'شروع ضبط صدا'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => stopRecordingSentence(idx)}
                        className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer animate-pulse shadow-md"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>توقف ضبط ({recordingSeconds} ثانیه)</span>
                      </button>
                    )}

                    {hasAudio && !isRec && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSentenceAudio(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="حذف صدای این جمله"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TEACHER DICTATION BUILDER */}
      {activeTab === 'create' && (
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#EADFCF] p-6 space-y-5">
          <div className="pb-3 border-b border-[#E2D5C3]">
            <h3 className="text-base font-black text-[#4A3B32] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#0284C7]" />
              <span>ثبت متن دیکته جدید برای کلاس</span>
            </h3>
            <p className="text-xs text-[#786455] mt-1">
              عنوان دیکته، پایه تحصیلی و جملات را وارد کنید:
            </p>
          </div>

          <form onSubmit={handleSaveCustomDictation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
              <div className="sm:col-span-6 space-y-1">
                <label className="font-bold text-[#4A3B32]">عنوان دیکته:</label>
                <input
                  type="text"
                  placeholder="مثلاً: دیکته کسرها و اعداد اعشاری پایه پنجم"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white font-semibold outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="font-bold text-[#4A3B32]">پایه تحصیلی:</label>
                <select
                  value={customGrade}
                  onChange={(e) => setCustomGrade(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white font-bold outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>پایه {g} دبستان</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="font-bold text-[#4A3B32]">دسته‌بندی دیکته:</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white font-bold outline-none cursor-pointer"
                >
                  <option value="math_words">واژگان و اصطلاحات ریاضی</option>
                  <option value="number_dictation">دیکته عددی و ارزش مکانی</option>
                  <option value="problem_solving">صورت مسائل و تعریف مفاهیم</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#4A3B32]">جملات دیکته (هر جمله در یک سطر جدید):</label>
              <textarea
                rows={5}
                value={rawSentencesText}
                onChange={(e) => setRawSentencesText(e.target.value)}
                placeholder={'مثلاً:\nعدد سیصد و چهل و دو هزار را بنویسید.\nکسر دو پنجم مساوی با چهار دهم است.\nمساحت مستطیل برابر طول ضرب در عرض است.'}
                className="w-full p-3 rounded-2xl border border-[#CBD5E1] bg-white font-semibold outline-none focus:ring-2 focus:ring-[#0284C7] leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره‌سازی و افزودن دیکته به لیست کلاس</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Helper Icon Components
const SkipLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const SkipRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
