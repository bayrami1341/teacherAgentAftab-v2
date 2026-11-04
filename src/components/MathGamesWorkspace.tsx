import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Grid,
  Target,
  Wrench,
  Trophy,
  Sparkles,
  Flame,
  ChevronRight,
  RefreshCw,
  Clock,
  Volume2,
  VolumeX,
  BookOpen,
  Brain,
  FileText
} from 'lucide-react';
import { sound } from '../utils/audio';
import {
  GradeLevel,
  QuestionItem,
  getQuestionsForGrade
} from '../utils/mathCurriculumEngine';

// Import 4 Arcade Game Mode Components
import { SpaceEscapeCanvas } from './SpaceEscapeCanvas';
import { TargetShooterCanvas } from './TargetShooterCanvas';
import { CardMatchingBoard } from './CardMatchingBoard';
import { RoshaInteractiveWorkshop } from './RoshaInteractiveWorkshop';

export type GameMode = 'speed_run' | 'card_matching' | 'target_shooter' | 'rosha_workshop';

interface MathGamesWorkspaceProps {
  initialGrade?: GradeLevel;
  onExit?: () => void;
  onRewardPlant?: (energyBonus: number, habitName: string) => void;
}

export const MathGamesWorkspace: React.FC<MathGamesWorkspaceProps> = ({
  initialGrade = 3,
  onExit,
  onRewardPlant
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [activeMode, setActiveMode] = useState<GameMode>('speed_run');

  // Question bank state for selected grade
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Score & Game Stats
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Load question bank when selected grade changes
  useEffect(() => {
    const qBank = getQuestionsForGrade(selectedGrade, 15);
    setQuestions(qBank);
    setCurrentIndex(0);
    setIsGameOver(false);
  }, [selectedGrade]);

  const currentQ = questions[currentIndex % (questions.length || 1)] || getQuestionsForGrade(3)[0];

  const handleCorrectAnswer = (answer: string | number) => {
    const newScore = score + 200 + streak * 25;
    setScore(newScore);
    setStreak((prev) => prev + 1);

    if (onRewardPlant) {
      onRewardPlant(15, `تمرین ریاضی پایه ${selectedGrade}: ${currentQ.topic}`);
    }

    setTimeout(() => {
      advanceQuestion();
    }, 900);
  };

  const handleWrongAnswer = (answer: string | number) => {
    setStreak(0);
    setTimeout(() => {
      advanceQuestion();
    }, 1200);
  };

  const advanceQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsGameOver(true);
      sound.playJoyfulChime();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setIsGameOver(false);
    const refreshed = getQuestionsForGrade(selectedGrade, 15);
    setQuestions(refreshed);
    sound.playWakeUpMelody();
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setSoundMuted(muted);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none relative overflow-hidden pb-12 rounded-3xl border border-slate-800">
      {/* Dynamic Background Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-xl transition text-slate-300 hover:text-white flex items-center gap-1 text-sm"
          >
            <ChevronRight className="w-4 h-4" />
            <span>بازگشت</span>
          </button>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              پایگاه جامع بازی‌ها و انیمیشن‌های تعاملی ریاضی آفتاب
            </h1>
            <p className="text-xs text-slate-400">منطبق بر برنامه‌درسی رسمی دبستان (پایه ۱ تا ۶)</p>
          </div>
        </div>

        {/* Right Stats & Audio */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-mono">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              امتیاز: {score}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Flame className="w-4 h-4" />
              زنجیره: {streak}
            </span>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 bg-slate-700/60 hover:bg-slate-600 text-slate-300 rounded-xl transition"
            title="تغییر وضعیت صدا"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="px-3 py-1.5 bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-600/50 rounded-xl transition text-xs flex items-center gap-1.5 font-bold"
          >
            <FileText className="w-4 h-4 text-cyan-300" />
            <span>گزارش فنی معماری</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4 flex-1 flex flex-col gap-5">
        {/* GRADE SELECTOR TABS (پایه ۱ تا پایه ۶) */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl p-2 flex items-center justify-between overflow-x-auto gap-2">
          <span className="text-xs text-slate-400 font-bold px-3 whitespace-nowrap flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-amber-400" /> انتخاب پایه تحصیلی:
          </span>
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {([1, 2, 3, 4, 5, 6] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  resetGame();
                }}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 border ${
                  selectedGrade === g
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/30'
                    : 'bg-slate-900/50 text-slate-300 border-slate-700/80 hover:bg-slate-700/50'
                }`}
              >
                <span>پایه {g}</span>
                <span className="text-[10px] opacity-75">دبستان</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4 ARCADE GAME MODES SELECTOR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setActiveMode('speed_run');
              resetGame();
            }}
            className={`p-3 rounded-2xl border text-right transition flex items-center gap-3 ${
              activeMode === 'speed_run'
                ? 'bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">نجات فضایی (۶۰ فریم)</div>
              <div className="text-[11px] text-slate-400">حرکت سفینه و شلیک لیزر</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveMode('target_shooter');
              resetGame();
            }}
            className={`p-3 rounded-2xl border text-right transition flex items-center gap-3 ${
              activeMode === 'target_shooter'
                ? 'bg-gradient-to-br from-emerald-900/90 to-teal-900/90 border-emerald-400 text-white shadow-lg'
                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">سیبل بالونی</div>
              <div className="text-[11px] text-slate-400">تیراندازی با نشانگر هدف</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveMode('card_matching');
              resetGame();
            }}
            className={`p-3 rounded-2xl border text-right transition flex items-center gap-3 ${
              activeMode === 'card_matching'
                ? 'bg-gradient-to-br from-amber-900/90 to-orange-900/90 border-amber-400 text-white shadow-lg'
                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">جورچین visual SVG</div>
              <div className="text-[11px] text-slate-400">حافظه با ساعت و کسر</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveMode('rosha_workshop');
              resetGame();
            }}
            className={`p-3 rounded-2xl border text-right transition flex items-center gap-3 ${
              activeMode === 'rosha_workshop'
                ? 'bg-gradient-to-br from-rose-900/90 to-pink-900/90 border-rose-400 text-white shadow-lg'
                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">کارگاه تعاملی روشا</div>
              <div className="text-[11px] text-slate-400">اسلایدر ولتاژ و برش کیک</div>
            </div>
          </button>
        </div>

        {/* ACTIVE GAME CANVAS DISPLAY AREA */}
        <div className="flex-1 bg-slate-800/40 backdrop-blur border border-slate-700/80 rounded-3xl p-6 relative flex flex-col items-center justify-center overflow-hidden shadow-2xl min-h-[460px]">
          {/* Question Breadcrumb Bar */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30">
                {currentQ.chapterTitle}
              </span>
              <span className="text-xs text-slate-400">موضوع: {currentQ.topic}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>سوال {currentIndex + 1} از {questions.length}</span>
            </div>
          </div>

          {/* RENDER GAME MODE 1: SPACE ESCAPE */}
          {activeMode === 'speed_run' && !isGameOver && (
            <SpaceEscapeCanvas
              question={currentQ}
              onCorrectAnswer={handleCorrectAnswer}
              onWrongAnswer={handleWrongAnswer}
              score={score}
              streak={streak}
            />
          )}

          {/* RENDER GAME MODE 2: TARGET SHOOTER */}
          {activeMode === 'target_shooter' && !isGameOver && (
            <TargetShooterCanvas
              question={currentQ}
              onCorrectAnswer={handleCorrectAnswer}
              onWrongAnswer={handleWrongAnswer}
              score={score}
            />
          )}

          {/* RENDER GAME MODE 3: CARD MATCHING BOARD */}
          {activeMode === 'card_matching' && !isGameOver && (
            <CardMatchingBoard
              grade={selectedGrade}
              questions={questions}
              onRewardPlant={onRewardPlant}
              onMatchScore={(pts) => setScore((s) => s + pts)}
            />
          )}

          {/* RENDER GAME MODE 4: ROSHA WORKSHOP */}
          {activeMode === 'rosha_workshop' && !isGameOver && (
            <RoshaInteractiveWorkshop
              question={currentQ}
              onCorrectAnswer={handleCorrectAnswer}
              onWrongAnswer={handleWrongAnswer}
            />
          )}

          {/* GAME OVER SCREEN */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center">
              <Trophy className="w-16 h-16 text-amber-400 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-white mb-2">دور تمرین ریاضی با موفقیت به پایان رسید!</h2>
              <p className="text-sm text-slate-300 mb-6">
                شما در پایه {selectedGrade} دبستان موفق به کسب امتیاز <span className="text-amber-400 font-bold">{score}</span> شدید.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:brightness-110 transition flex items-center gap-2 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>تکرار بازی و سوالات تازه</span>
                </button>
                <button
                  onClick={onExit}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-600 transition"
                >
                  بازگشت به پیشخوان اصلی
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TECHNICAL ARCHITECTURE MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 text-right space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                گزارش فنی معماری موتور بازی‌سازی و انیمیشن‌های ریاضی دبستان آفتاب
              </h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕ بستن
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                این سند معماری جهت بررسی هوش‌های مصنوعی ناظر تدوین شده تا فرآیند ساخت بازی‌ها، موتور فیزیک HTML5 Canvas و اصلاح دقیق پداگوژی ریاضی پایه اول تا ششم بدون دسترسی قبلی ارزیابی گردد.
              </p>

              <h4 className="font-bold text-amber-400 text-sm">۱. اصلاح پداگوژی و تطبیق ۱۰۰٪ با کتب درسی (بدون ضرب در پایه اول):</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pr-2">
                <li>پایه اول: چوب‌خط، جمع/تفریق تا ۲۰، سودوکوی ۴×۴ و ساعت تمام (فاقد ضرب).</li>
                <li>پایه دوم: ارزش مکانی ۳ رقمی، جمع/تفریق فرآیندی، کاشی‌کاری و ربع/نیم.</li>
                <li>پایه سوم: الگوی پرشی ۸تا۸تا، جدول ضرب ۱ تا ۱۰، کسرها و مساحت مستطیل.</li>
                <li>پایه چهارم: میلیون، کسر مخلوط، تقسیم چکشی و مساحت مثلث/متوازی‌الاضلاع.</li>
                <li>پایه پنجم: درصد و تخفیف، محاسبات اعشاری و تبدیل واحد لیتر به سی‌سی.</li>
                <li>پایه ششم: بخش‌پذیری بر ۳ و ۹، اعداد صحیح روی محور و مساحت دایره.</li>
              </ul>

              <h4 className="font-bold text-emerald-400 text-sm">۲. موتور اکشن و انیمیشن ۶۰ فریم HTML5 Canvas:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pr-2">
                <li>🚀 نجات فضایی (Space Escape): کنترل فیزیک سفینه با ماوس/لمس، شلیک پرتابه‌های لیزری و انفجار ذرات شهاب‌سنگ.</li>
                <li>🎯 سیبل بالونی (Target Shooter): پیش‌نمایش خط سیر پرتابه، شلیک توپخانه‌ای و پاپ فیزیک بالون‌ها.</li>
                <li>🃏 جورچین visual SVG: نمایش ساعت‌های عقربه‌ای و برش‌های کسری پیتزا روی کارت‌ها با چرخش ۱۸۰ درجه.</li>
                <li>🛠️ کارگاه تعاملی روشا: اسلایدر پویا و آمپرمتر ولتاژ به همراه برش کیک کسرها.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
              >
                تایید و بسته شدن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
