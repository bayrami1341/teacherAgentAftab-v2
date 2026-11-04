import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Plus,
  Trash2,
  Share2,
  Award,
  Target,
  Grid,
  Puzzle,
  Link as LinkIcon,
  HelpCircle,
  Trophy,
  Zap,
  Check,
  Flame,
  Flame as FlameIcon,
  Zap as ElectricZap,
  Cake,
  Crosshair,
  Wrench,
  Gauge,
  Sparkle,
} from 'lucide-react';
import { sound } from '../utils/audio';

export type GameMode = 'power_plant' | 'bakery' | 'shooting' | 'snakes_ladders' | 'jigsaw';

export interface GameQuestion {
  id: string;
  prompt: string; // E.g., "۲/۵" or "۷ × ۸"
  answer: string; // E.g., "۰/۴" or "۵۶"
  distractors: string[]; // E.g., ["۰/۲", "۰/۵", "۰/۶"]
  hint?: string;
}

export interface EducationalGameConfig {
  id: string;
  title: string;
  grade: number;
  mode: GameMode;
  questions: GameQuestion[];
  createdDate: string;
}

const PRESET_GAMES: EducationalGameConfig[] = [
  {
    id: 'game-power-plant',
    title: '⚡ تعمیر نیروگاه برق و کالیبراسیون ولتاژ (پایه پنجم و ششم)',
    grade: 6,
    mode: 'power_plant',
    createdDate: '۱۴۰۳/۰۸/۱۰',
    questions: [
      { id: 'q1', prompt: 'ولتاژ ورودی ۲/۵ خازن برابر چند اعشار است؟', answer: '۰/۴', distractors: ['۰/۲', '۰/۵', '۰/۶'], hint: 'صورت و مخرج را در ۲ ضرب کن تا مخرج ۱۰ شود' },
      { id: 'q2', prompt: 'افت فشار ۳/۴ بار ژنراتور معادل کدام اعشار است؟', answer: '۰/۷۵', distractors: ['۰/۳', '۰/۴', '۰/۵'], hint: 'سه ربع برابر هفتاد و پنج صدم است' },
      { id: 'q3', prompt: 'مقاومت ۱/۲ اهم توربین برابر کدام عدد است؟', answer: '۰/۵', distractors: ['۰/۱', '۰/۲5', '۰/۶'], hint: 'نصف یک واحد برابر نیم است' },
      { id: 'q4', prompt: 'جریان ۱/۱۰ آمپر خط خنک‌کننده؟', answer: '۰/۱', distractors: ['۰/۰۱', '۱/۰', '۰/۵'], hint: 'یک دهم با یک رقم اعشار نوشته می‌شود' },
    ],
  },
  {
    id: 'game-bakery',
    title: '🧁 قنادی ریاضی و برش کیک‌های کسری (پایه سوم و چهارم)',
    grade: 4,
    mode: 'bakery',
    createdDate: '۱۴۰۳/۰۸/۱۲',
    questions: [
      { id: 'q10', prompt: 'سفارش ۷ کیک ۸ برشی کلاً چند سهم می‌شود؟ ۷ × ۸', answer: '۵۶', distractors: ['۴۸', '۶۴', '۵۴'], hint: '۷ هشت تا میشه پنجاه و شش تا' },
      { id: 'q11', prompt: '۹ سینی شیرینی ۶ تایی کلاً چند شیرینی است؟ ۹ × ۶', answer: '۵۴', distractors: ['۶۳', '۴۵', '۴۸'], hint: 'از ۵۰ چهار تا بیشتر' },
      { id: 'q12', prompt: '۸ جعبه کاپ‌کیک ۴ تایی چند تا می‌شود؟ ۸ × ۴', answer: '۳۲', distractors: ['۳۶', '۲۸', '۲۴'], hint: 'چهار هشت تا سی و دو تا' },
      { id: 'q13', prompt: '۶ قالب پادرازی ۷ تایی؟ ۶ × ۷', answer: '۴۲', distractors: ['۳۶', '۴۸', '۴۹'], hint: 'شش هفت تا چهل و دو تا' },
    ],
  },
  {
    id: 'game-shooting',
    title: '🎯 میدان تیراندازی به اهداف جدول ضرب (پایه سوم و چهارم)',
    grade: 4,
    mode: 'shooting',
    createdDate: '۱۴۰۳/۰۸/۱۳',
    questions: [
      { id: 'q20', prompt: '۹ × ۹ = ?', answer: '۸۱', distractors: ['۷۲', '۹۰', '۸۹'], hint: 'نه نه تا هشتاد و یک تا' },
      { id: 'q21', prompt: '۶ × ۸ = ?', answer: '۴۸', distractors: ['۵۶', '۴۲', '۵۴'], hint: 'شش هشت تا چهل و هشت تا' },
      { id: 'q22', prompt: '۷ × ۷ = ?', answer: '۴۹', distractors: ['۴۲', '۵۶', '۳۵'], hint: 'haft haft ta chehel o noh ta' },
    ],
  },
  {
    id: 'game-snakes',
    title: '🎲 مار و پله جنگل جادویی مساحت و محیط (پایه ششم)',
    grade: 6,
    mode: 'snakes_ladders',
    createdDate: '۱۴۰۳/۰۸/۱۴',
    questions: [
      { id: 'q30', prompt: 'مساحت مربعی به ضلع ۵ سانتی‌متر چند است؟', answer: '۲۵', distractors: ['۲۰', '۱۰', '۱۵'], hint: 'ضلع × ضلع' },
      { id: 'q31', prompt: 'محیط مستطیلی به طول ۶ و عرض ۴ چند است؟', answer: '۲۰', distractors: ['۲۴', '۱۰', '۱۲'], hint: '(طول + عرض) × ۲' },
      { id: 'q32', prompt: 'مساحت مثلثی با قاعده ۸ و ارتفاع ۳ چند است؟', answer: '۱۲', distractors: ['۲۴', '۱۱', '۱۶'], hint: '(قاعده × ارتفاع) ÷ ۲' },
    ],
  },
  {
    id: 'game-jigsaw',
    title: '🧩 پازل قاب طلایی الگویابی هوش (پایه پنجم)',
    grade: 5,
    mode: 'jigsaw',
    createdDate: '۱۴۰۳/۰۸/۱۵',
    questions: [
      { id: 'q40', prompt: 'عدد بعدی در الگو چیست؟ ۲، ۴، ۸، ۱۶، ...', answer: '۳۲', distractors: ['۲۴', '۲۰', '۶۴'] },
      { id: 'q41', prompt: 'نصفِ نصفِ عدد ۱۶ چند است؟', answer: '۴', distractors: ['۸', '۲', '۶'] },
      { id: 'q42', prompt: 'کدام عدد هم بر ۲ و هم بر ۵ بخش‌پذیر است؟', answer: '۴۰', distractors: ['۲۵', '۳۲', '۱۵'] },
      { id: 'q43', prompt: 'ثلث (یک سوم) عدد ۲۷ چند است؟', answer: '۹', distractors: ['۳', '۱۸', '۶'] },
    ],
  },
];

export const EducationalGameBuilderWidget: React.FC = () => {
  const [games, setGames] = useState<EducationalGameConfig[]>(PRESET_GAMES);
  const [selectedGameId, setSelectedGameId] = useState<string>(PRESET_GAMES[0].id);
  const [activeTab, setActiveTab] = useState<'builder' | 'play'>('play');

  // Builder state
  const [customTitle, setCustomTitle] = useState('');
  const [customGrade, setCustomGrade] = useState<number>(5);
  const [customMode, setCustomMode] = useState<GameMode>('power_plant');
  const [questionsList, setQuestionsList] = useState<GameQuestion[]>([
    { id: 'q-new-1', prompt: '۳/۵', answer: '۰/۶', distractors: ['۰/۳', '۰/۵', '۰/۸'], hint: 'صورت و مخرج را ضرب در ۲ کن' },
    { id: 'q-new-2', prompt: '۴/۵', answer: '۰/۸', distractors: ['۰/۴', '۰/۶', '۰/۹'], hint: 'برابر هشت دهم است' },
  ]);
  const [newPrompt, setNewPrompt] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newDistractor1, setNewDistractor1] = useState('');
  const [newDistractor2, setNewDistractor2] = useState('');

  // Playing state
  const activeGame = games.find((g) => g.id === selectedGameId) || games[0];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Dynamic Level Depth & Stage Progression (Stage 1 -> Stage 2 -> Stage 3)
  const [stageLevel, setStageLevel] = useState<number>(1);
  const [floatingActionText, setFloatingActionText] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Power Plant Specific States
  const [turbineSpeed, setTurbineSpeed] = useState(1);
  const [powerVoltage, setPowerVoltage] = useState(220);
  const [repairedModules, setRepairedModules] = useState<number[]>([]);

  // Bakery Specific States
  const [bakedCakes, setBakedCakes] = useState<number>(0);
  const [ovenTemperature, setOvenTemperature] = useState(180);

  // Target Shooting Specific States
  const [shootingTargets, setShootingTargets] = useState<{ id: string; text: string; isCorrect: boolean; x: number; y: number }[]>([]);

  // Snakes & Ladders States
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [showMathModal, setShowMathModal] = useState(false);

  // Jigsaw Puzzle States
  const [revealedTiles, setRevealedTiles] = useState<boolean[]>([false, false, false, false]);

  // Reset state on game change
  useEffect(() => {
    resetGameState();
  }, [selectedGameId, activeTab]);

  const triggerFloatingAction = (text: string) => {
    setFloatingActionText(text);
    setTimeout(() => setFloatingActionText(null), 1800);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const resetGameState = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setGameCompleted(false);
    setFeedback(null);
    setStageLevel(1);
    setFloatingActionText(null);
    setIsShaking(false);
    setTurbineSpeed(1);
    setPowerVoltage(220);
    setRepairedModules([]);
    setBakedCakes(0);
    setOvenTemperature(180);
    setPlayerPosition(1);
    setDiceRoll(null);
    setShowMathModal(false);
    setRevealedTiles([false, false, false, false]);

    if (activeGame) {
      setupShootingTargets(0);
    }
  };

  const setupShootingTargets = (qIdx: number) => {
    if (!activeGame.questions[qIdx]) return;
    const q = activeGame.questions[qIdx];
    const choices = [q.answer, ...q.distractors].sort(() => Math.random() - 0.5);
    const targets = choices.map((text, i) => ({
      id: `t-${i}-${text}`,
      text,
      isCorrect: text === q.answer,
      x: 15 + i * 22,
      y: 20 + Math.floor(Math.random() * 40),
    }));
    setShootingTargets(targets);
  };

  const handleAddQuestionToBuilder = () => {
    if (!newPrompt.trim() || !newAnswer.trim()) return;
    sound.playPlantClick(520);
    const created: GameQuestion = {
      id: `q-${Date.now()}`,
      prompt: newPrompt.trim(),
      answer: newAnswer.trim(),
      distractors: [newDistractor1.trim() || '۱۰', newDistractor2.trim() || '۲۰'],
    };
    setQuestionsList([...questionsList, created]);
    setNewPrompt('');
    setNewAnswer('');
    setNewDistractor1('');
    setNewDistractor2('');
  };

  const handleSaveCustomGame = () => {
    if (!customTitle.trim() || questionsList.length === 0) return;
    sound.playJoyfulChime();
    const newGame: EducationalGameConfig = {
      id: `game-${Date.now()}`,
      title: customTitle.trim(),
      grade: customGrade,
      mode: customMode,
      questions: questionsList,
      createdDate: 'امروز',
    };
    setGames([newGame, ...games]);
    setSelectedGameId(newGame.id);
    setCustomTitle('');
    setActiveTab('play');
  };

  // --- GAMEPLAY HANDLERS ---

  // 1. POWER PLANT REPAIR LOGIC
  const handlePowerPlantAnswer = (selectedAns: string) => {
    const q = activeGame.questions[currentQuestionIndex];
    if (selectedAns === q.answer) {
      sound.playJoyfulChime();
      setScore((s) => s + 30);
      setStreak((st) => st + 1);
      setTurbineSpeed((spd) => Math.min(5, spd + 1));
      setPowerVoltage((v) => Math.min(380, v + 40));
      setRepairedModules((prev) => [...prev, currentQuestionIndex]);

      const nextStage = Math.min(3, Math.floor((currentQuestionIndex + 1) / 2) + 1);
      setStageLevel(nextStage);
      triggerFloatingAction(`⚡ +30 XP! صعود به مرحله ${nextStage} 🚀`);

      setFeedback({
        isCorrect: true,
        text: `⚡ فوق‌العاده! توربین شماره ${currentQuestionIndex + 1} کالیبره شد و گرافیک مرحله ${nextStage} فعال گشت!`,
      });

      if (currentQuestionIndex + 1 >= activeGame.questions.length) {
        setGameCompleted(true);
      } else {
        setCurrentQuestionIndex((idx) => idx + 1);
      }
    } else {
      sound.playPlantClick(250);
      setStreak(0);
      setTurbineSpeed(1);
      triggerShake();
      setFeedback({
        isCorrect: false,
        text: `⚠️ هشدار افت ولتاژ! راهنما: ${q.hint || 'دوباره محاسبات را بررسی کن!'}`,
      });
    }
  };

  // 2. BAKERY LOGIC
  const handleBakeryAnswer = (selectedAns: string) => {
    const q = activeGame.questions[currentQuestionIndex];
    if (selectedAns === q.answer) {
      sound.playJoyfulChime();
      setScore((s) => s + 25);
      setStreak((st) => st + 1);
      setBakedCakes((c) => c + 1);
      setOvenTemperature((t) => Math.min(220, t + 10));

      const nextStage = Math.min(3, Math.floor((currentQuestionIndex + 1) / 2) + 1);
      setStageLevel(nextStage);
      triggerFloatingAction(`🎂 +25 XP! تزئینات دسر مرحله ${nextStage} باز شد ✨`);

      setFeedback({
        isCorrect: true,
        text: `🧁 آفرین سرآشپز! کیک کسری داغ از تنور خارج شد و سینی مرحله ${nextStage} آماده گشت! 🎉`,
      });

      if (currentQuestionIndex + 1 >= activeGame.questions.length) {
        setGameCompleted(true);
      } else {
        setCurrentQuestionIndex((idx) => idx + 1);
      }
    } else {
      sound.playPlantClick(250);
      setStreak(0);
      triggerShake();
      setFeedback({
        isCorrect: false,
        text: `❌ ترکیب مواد سوخت! راهنما: ${q.hint || 'دقت کن و دوباره تلاش کن!'}`,
      });
    }
  };

  // 3. SHOOTING RANGE LOGIC
  const handleShootTarget = (target: { text: string; isCorrect: boolean }) => {
    if (target.isCorrect) {
      sound.playJoyfulChime();
      setScore((s) => s + 25);
      setStreak((st) => st + 1);

      const nextStage = Math.min(3, Math.floor((currentQuestionIndex + 1) / 2) + 1);
      setStageLevel(nextStage);
      triggerFloatingAction(`💥🎯 شلیک طلایی! مرحله لیزری ${nextStage} 🚀`);

      setFeedback({ isCorrect: true, text: `💥🎯 شلیک مستقیم به مرکز هدف! گرافیک میدان به مرحله ${nextStage} ارتقا یافت!` });

      if (currentQuestionIndex + 1 >= activeGame.questions.length) {
        setGameCompleted(true);
      } else {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        setupShootingTargets(nextIdx);
      }
    } else {
      sound.playPlantClick(250);
      setStreak(0);
      triggerShake();
      setFeedback({ isCorrect: false, text: '🎯 تیر به خطا رفت! به عدد روی سیبل بعدی دقت کن.' });
    }
  };

  // 4. SNAKES & LADDERS LOGIC
  const handleRollDice = () => {
    if (showMathModal) return;
    const roll = Math.floor(Math.random() * 4) + 1;
    sound.playPlantClick(600);
    setDiceRoll(roll);
    const nextPos = Math.min(30, playerPosition + roll);
    setPlayerPosition(nextPos);

    const nextStage = Math.min(3, Math.floor(nextPos / 10) + 1);
    setStageLevel(nextStage);

    if (nextPos >= 30) {
      sound.playJoyfulChime();
      setGameCompleted(true);
      return;
    }

    if (nextPos % 3 === 0 || nextPos % 5 === 0) {
      setShowMathModal(true);
    }
  };

  const handleSnakesAnswer = (selectedAns: string) => {
    const q = activeGame.questions[currentQuestionIndex % activeGame.questions.length];
    if (selectedAns === q.answer) {
      sound.playJoyfulChime();
      setScore((s) => s + 30);
      setPlayerPosition((pos) => Math.min(30, pos + 2));
      triggerFloatingAction('🪜 +30 XP! صعود صخره‌ای');
      setFeedback({ isCorrect: true, text: '🪜 پاسخ درست! نردبان دانش را طی کردی (+۲ خانه صعود)!' });
    } else {
      sound.playPlantClick(300);
      triggerShake();
      setPlayerPosition((pos) => Math.max(1, pos - 1));
      setFeedback({ isCorrect: false, text: '🐍 پاسخ نادرست! مار شما را ۱ خانه عقب کشید.' });
    }
    setShowMathModal(false);
    setCurrentQuestionIndex((idx) => idx + 1);
  };

  // 5. JIGSAW PUZZLE LOGIC
  const handleJigsawAnswer = (tileIndex: number, selectedAns: string) => {
    const q = activeGame.questions[tileIndex];
    if (selectedAns === q.answer) {
      sound.playJoyfulChime();
      setScore((s) => s + 25);
      const updated = [...revealedTiles];
      updated[tileIndex] = true;
      setRevealedTiles(updated);
      setFeedback({ isCorrect: true, text: `✨ قطعه شماره ${tileIndex + 1} پازل نمایان شد!` });

      if (updated.every((tile) => tile)) {
        setGameCompleted(true);
      }
    } else {
      sound.playPlantClick(300);
      setFeedback({ isCorrect: false, text: 'راهنمایی: به الگوی عددی دقت کرده و دوباره تلاش کن!' });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-6 text-right dir-rtl font-['Vazirmatn']" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F1F5F9]">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-[#8B5CF6]" />
            <span>موتور بازی‌ساز چندمحیطی درسی (Bespoke Thematic Game Engine)</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            محیط‌های سه بعدی گرافیکی: تعمیر نیروگاه برق⚡، قنادی ریاضی🧁، تیراندازی🎯، مارپله🎲 و پازل قاب طلایی🧩
          </p>
        </div>

        {/* Tab switcher: Play vs Builder */}
        <div className="flex items-center gap-2 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setActiveTab('play')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'play' ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>اجرا و تست بازی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'builder' ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>طراحی بازی جدید</span>
          </button>
        </div>
      </div>

      {/* Preset Games Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {games.map((game) => {
          const isSelected = game.id === selectedGameId;
          const getIcon = () => {
            switch (game.mode) {
              case 'power_plant':
                return <ElectricZap className="w-4 h-4 text-amber-500" />;
              case 'bakery':
                return <Cake className="w-4 h-4 text-rose-500" />;
              case 'shooting':
                return <Crosshair className="w-4 h-4 text-sky-500" />;
              case 'snakes_ladders':
                return <Grid className="w-4 h-4 text-emerald-500" />;
              case 'jigsaw':
                return <Puzzle className="w-4 h-4 text-purple-500" />;
            }
          };

          const getModeLabel = () => {
            switch (game.mode) {
              case 'power_plant': return 'تعمیر نیروگاه';
              case 'bakery': return 'قنادی ریاضی';
              case 'shooting': return 'تیراندازی';
              case 'snakes_ladders': return 'مار و پله';
              case 'jigsaw': return 'پازل معمایی';
            }
          };

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => {
                setSelectedGameId(game.id);
                sound.playPlantClick(500);
              }}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/30 shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold">
                  پایه {game.grade}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#475569]">
                  {getIcon()}
                  <span>{getModeLabel()}</span>
                </div>
              </div>
              <h4 className="font-bold text-xs text-[#0F172A] line-clamp-1">{game.title}</h4>
              <span className="text-[10px] text-[#94A3B8]">شامل {game.questions.length} سوال کلاسی</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLAY MODE */}
      {activeTab === 'play' && (
        <div className="bg-[#FAF5FF] rounded-3xl border border-[#E9D5FF] p-5 sm:p-6 space-y-6">
          {/* Game Header Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F3E8FF]">
            <div>
              <span className="text-xs font-bold text-[#7E22CE] bg-purple-100 px-3 py-1 rounded-full">
                محیط اختصاصی: {activeGame.mode === 'power_plant' ? '⚡ نیروگاه برق و کالیبراسیون' : activeGame.mode === 'bakery' ? '🧁 قنادی و پخت کیک‌های کسری' : activeGame.mode === 'shooting' ? '🎯 میدان تیراندازی به سیبل' : activeGame.mode === 'snakes_ladders' ? '🎲 مار و پله جنگل' : '🧩 پازل قاب طلایی'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#4C1D95] mt-1.5">{activeGame.title}</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>امتیاز: {score}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-rose-100 text-rose-800 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>کومبو: {streak}</span>
              </div>
              <button
                type="button"
                onClick={resetGameState}
                className="p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                title="شروع مجدد"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Action Badge Popup */}
          {floatingActionText && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-full shadow-2xl border-2 border-white animate-bounce text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-900" />
              <span>{floatingActionText}</span>
            </div>
          )}

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                feedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
              } ${isShaking ? 'animate-bounce' : ''}`}
            >
              {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Interactive Stage Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-purple-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black text-purple-900">
              <Target className="w-4 h-4 text-purple-600" />
              <span>عمق گرافیک مرحله (Stage Depth Visuals):</span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setStageLevel(lvl);
                    sound.playPlantClick(600);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    stageLevel === lvl
                      ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  مرحله {lvl}: {lvl === 1 ? 'پایه' : lvl === 2 ? 'تخصصی' : 'فوق‌پیشرفته'}
                </button>
              ))}
            </div>
          </div>

          {/* ⚡ THEME 1: POWER PLANT REPAIR GAME */}
          {activeGame.mode === 'power_plant' && !gameCompleted && (
            <div className={`space-y-6 ${isShaking ? 'animate-pulse' : ''}`}>
              {/* Power Plant Graphical SVG Console */}
              <div className="relative bg-[#0F172A] rounded-3xl p-6 border-4 border-amber-500/30 overflow-hidden shadow-2xl text-white space-y-5">
                {/* Background Grid Lines & Electric Arcs */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

                {/* Top HUD: Voltage & Turbines */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-400/40 text-amber-400 animate-pulse">
                      <ElectricZap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] text-amber-300 font-bold block">ولتاژ شبکه در مرحله {stageLevel}:</span>
                      <span className="text-xl font-black font-mono tracking-wider text-amber-400">{powerVoltage + (stageLevel - 1) * 100}V AC</span>
                    </div>
                  </div>

                  {/* Stage Environment Title */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-xs">
                    {stageLevel === 1 && '🌱 مرحله ۱: ایستگاه خورشیدی و بادی پادرا'}
                    {stageLevel === 2 && '🌊 مرحله ۲: سد و نیروگاه برق‌آبی کوهستان'}
                    {stageLevel === 3 && '⚛️ مرحله ۳: راکتور همجوشی کوانتومی امپراتوری'}
                  </div>

                  {/* Animated Turbine Indicator */}
                  <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-700">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"
                      style={{ animationDuration: `${2 / (turbineSpeed * stageLevel)}s` }}
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 block">دور ژنراتور:</span>
                      <span className="text-xs font-bold text-emerald-400">{turbineSpeed * stageLevel * 1200} RPM</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic SVG Scene depending on stageLevel */}
                <div className="relative z-10 h-48 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-2xl border border-slate-700 flex items-center justify-center p-4 overflow-hidden">
                  {stageLevel === 1 && (
                    <svg viewBox="0 0 400 120" className="w-full h-full">
                      {/* Solar Panels & Wind Turbines */}
                      <rect x="30" y="50" width="80" height="45" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="30" y1="72" x2="110" y2="72" stroke="#E0F2FE" strokeWidth="1" />
                      <line x1="70" y1="50" x2="70" y2="95" stroke="#E0F2FE" strokeWidth="1" />

                      {/* Wind Turbine Blade */}
                      <line x1="280" y1="110" x2="280" y2="40" stroke="#94A3B8" strokeWidth="6" />
                      <circle cx="280" cy="40" r="8" fill="#F8FAFC" />
                      <path d="M 280 40 L 250 15 M 280 40 L 310 15 M 280 40 L 280 70" stroke="#38BDF8" strokeWidth="4" className="animate-spin origin-[280px_40px]" />

                      {/* Green Power Grid Line */}
                      <path d="M 110 72 L 280 40" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="6 4" className="animate-pulse" />
                    </svg>
                  )}

                  {stageLevel === 2 && (
                    <svg viewBox="0 0 400 120" className="w-full h-full">
                      {/* Water Dam & Waterfall */}
                      <path d="M 10 110 L 80 30 L 160 30 L 200 110 Z" fill="#334155" stroke="#64748B" strokeWidth="3" />
                      <path d="M 85 35 L 155 35 L 170 110 L 100 110 Z" fill="#38BDF8" opacity="0.8" className="animate-pulse" />

                      {/* Spinning Hydro Wheels */}
                      <circle cx="280" cy="70" r="32" fill="#0F172A" stroke="#F59E0B" strokeWidth="4" />
                      <path d="M 280 38 L 280 102 M 248 70 L 312 70" stroke="#FBBF24" strokeWidth="3" className="animate-spin origin-[280px_70px]" />

                      <path d="M 170 70 L 248 70" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="8 4" />
                    </svg>
                  )}

                  {stageLevel === 3 && (
                    <svg viewBox="0 0 400 120" className="w-full h-full">
                      {/* Quantum Fusion Plasma Reactor */}
                      <circle cx="200" cy="60" r="50" fill="#2E1065" stroke="#A855F7" strokeWidth="4" className="animate-pulse" />
                      <circle cx="200" cy="60" r="35" fill="#581C87" stroke="#E879F9" strokeWidth="3" />
                      <circle cx="200" cy="60" r="18" fill="#F43F5E" className="animate-ping" />

                      {/* High Voltage Lightning Bolts */}
                      <path d="M 50 60 L 100 30 L 120 70 L 150 60" fill="none" stroke="#FACC15" strokeWidth="3" className="animate-bounce" />
                      <path d="M 250 60 L 280 30 L 310 80 L 360 60" fill="none" stroke="#38BDF8" strokeWidth="3" className="animate-bounce" />
                    </svg>
                  )}
                </div>

                {/* Equation & Repair Options */}
                <div className="relative z-10 bg-slate-900/90 p-5 rounded-2xl border border-amber-500/40 space-y-4">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <Wrench className="w-4 h-4" />
                    <span>ممیزی فرکانس و کالیبراسیون داده (مرحله {stageLevel}):</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white text-center">
                    {activeGame.questions[currentQuestionIndex]?.prompt}
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                      activeGame.questions[currentQuestionIndex]?.answer,
                      ...(activeGame.questions[currentQuestionIndex]?.distractors || []),
                    ]
                      .sort(() => Math.random() - 0.5)
                      .map((choice, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePowerPlantAnswer(choice)}
                          className="p-3 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 hover:text-white font-mono font-bold text-sm rounded-xl transition-all cursor-pointer text-center active:scale-95 shadow-xs"
                        >
                          {choice}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🧁 THEME 2: BAKERY & PASTRY SHOP */}
          {activeGame.mode === 'bakery' && !gameCompleted && (
            <div className={`space-y-6 ${isShaking ? 'animate-pulse' : ''}`}>
              {/* Bakery Graphic SVG Room */}
              <div className="relative bg-[#3B1C10] rounded-3xl p-6 border-4 border-amber-700/40 overflow-hidden shadow-2xl text-amber-50 space-y-5">
                {/* Brick Wall Texture */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Top HUD: Cakes baked & Oven Temp */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-[#26120A]/90 p-4 rounded-2xl border border-amber-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-400/40 text-rose-300">
                      <Cake className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] text-amber-200 font-bold block">تعداد سفارش‌های پخته‌شده:</span>
                      <span className="text-xl font-black text-rose-300">{bakedCakes} کیک کسری 🎂</span>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-800/40 border border-amber-600/50 text-amber-200 font-bold text-xs">
                    {stageLevel === 1 && '🧁 مرحله ۱: کارگاه شیرینی‌زی محلی'}
                    {stageLevel === 2 && '👑 مرحله ۲: قنادی سلطنتی کیک‌های طبقاتی'}
                    {stageLevel === 3 && '💎 مرحله ۳: کاخ بین‌المللی دسر و شکلات طلایی'}
                  </div>

                  <div className="flex items-center gap-3 bg-[#1A0B06] px-4 py-2 rounded-xl border border-amber-900/60">
                    <FlameIcon className="w-5 h-5 text-amber-500 animate-pulse" />
                    <div>
                      <span className="text-[10px] text-amber-400/80 block">حرارت تنور:</span>
                      <span className="text-xs font-bold text-amber-300">{ovenTemperature + (stageLevel - 1) * 30}°C</span>
                    </div>
                  </div>
                </div>

                {/* Central Oven & Cupcakes SVG Scene */}
                <div className="relative z-10 h-48 bg-gradient-to-b from-[#2D150B] to-[#1F0D06] rounded-2xl border border-amber-800/60 flex items-center justify-around p-4 overflow-hidden">
                  <svg viewBox="0 0 350 120" className="w-full h-full">
                    {/* Brick Oven Arch */}
                    <path d="M 100 110 C 100 30, 250 30, 250 110 Z" fill="#451A09" stroke="#92400E" strokeWidth="4" />
                    <path d="M 130 110 C 130 70, 220 70, 220 110 Z" fill="#F59E0B" opacity="0.8" className="animate-pulse" />

                    {/* Stage 1: Basic Cupcake, Stage 2: Royal Tier Cake, Stage 3: Golden Crystal Cake */}
                    {stageLevel === 1 && (
                      <g>
                        <ellipse cx="60" cy="95" rx="30" ry="8" fill="#D97706" />
                        <ellipse cx="60" cy="80" rx="20" ry="12" fill="#F472B6" />
                        <circle cx="60" cy="65" r="5" fill="#EF4444" />
                      </g>
                    )}

                    {stageLevel === 2 && (
                      <g>
                        <rect x="40" y="80" width="50" height="20" fill="#FDE047" rx="3" />
                        <rect x="48" y="62" width="34" height="18" fill="#F472B6" rx="3" />
                        <rect x="55" y="48" width="20" height="14" fill="#38BDF8" rx="2" />
                        <circle cx="65" cy="42" r="5" fill="#E11D48" className="animate-ping" />
                      </g>
                    )}

                    {stageLevel === 3 && (
                      <g>
                        <ellipse cx="60" cy="95" rx="38" ry="10" fill="#F59E0B" stroke="#FDE047" strokeWidth="2" />
                        <rect x="35" y="75" width="50" height="20" fill="#A855F7" rx="4" />
                        <rect x="43" y="55" width="34" height="20" fill="#EC4899" rx="4" />
                        <polygon points="60,30 68,48 52,48" fill="#FACC15" className="animate-bounce" />
                      </g>
                    )}
                  </svg>
                </div>

                {/* Math Cake Equation & Answers */}
                <div className="relative z-10 bg-[#26120A]/95 p-5 rounded-2xl border border-amber-600/40 space-y-4">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <Sparkle className="w-4 h-4 text-amber-400" />
                    <span>دستور پخت و محاسبات کسر قنادی (مرحله {stageLevel}):</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white text-center">
                    {activeGame.questions[currentQuestionIndex]?.prompt}
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                      activeGame.questions[currentQuestionIndex]?.answer,
                      ...(activeGame.questions[currentQuestionIndex]?.distractors || []),
                    ]
                      .sort(() => Math.random() - 0.5)
                      .map((choice, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleBakeryAnswer(choice)}
                          className="p-3 bg-amber-900/30 hover:bg-amber-800/50 border border-amber-500/40 text-amber-100 hover:text-white font-bold text-sm rounded-xl transition-all cursor-pointer text-center active:scale-95 shadow-xs"
                        >
                          {choice}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🎯 THEME 3: SHOOTING RANGE */}
          {activeGame.mode === 'shooting' && !gameCompleted && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#3B0764] to-[#6B21A8] text-white p-5 rounded-2xl text-center shadow-md space-y-2">
                <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full font-bold">
                  سوال شماره {currentQuestionIndex + 1} از {activeGame.questions.length}
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  {activeGame.questions[currentQuestionIndex]?.prompt}
                </h3>
                <p className="text-xs text-purple-200">مگسک را تنظیم کن و به سیبل پاسخ صحیح شلیک کن!</p>
              </div>

              {/* Target Shooting Gallery */}
              <div className="relative h-64 bg-slate-900 rounded-3xl overflow-hidden border-4 border-purple-500/30 flex items-center justify-around p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#6b21a8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                {shootingTargets.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => handleShootTarget(target)}
                    className="group relative flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-b from-rose-500 via-purple-600 to-indigo-700 hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer border-2 border-white/40"
                  >
                    <Crosshair className="w-6 h-6 text-white/80 mb-1 group-hover:rotate-45 transition-transform" />
                    <span className="text-white font-black text-sm tracking-wide">{target.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🎲 THEME 4: SNAKES & LADDERS */}
          {activeGame.mode === 'snakes_ladders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">موقعیت فعلی در زمین: خانه {playerPosition} از ۳۰</h4>
                  <p className="text-xs text-emerald-700">با تاس انداختن به سمت خانه ۳۰ حرکت کن! در خانه‌های چالش، سوال ریاضی را پاسخ بده.</p>
                </div>

                <button
                  type="button"
                  onClick={handleRollDice}
                  disabled={showMathModal || gameCompleted}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Grid className="w-5 h-5" />
                  <span>تاس انداختن {diceRoll && `(عدد ${diceRoll})`}</span>
                </button>
              </div>

              {/* Board Grid 30 squares */}
              <div className="grid grid-cols-6 gap-2 bg-emerald-950 p-4 rounded-3xl border-4 border-emerald-700 shadow-inner">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((sq) => {
                  const isPlayerHere = playerPosition === sq;
                  const isLadder = sq % 5 === 0;
                  const isSnake = sq % 3 === 0 && !isLadder;

                  return (
                    <div
                      key={sq}
                      className={`h-16 rounded-xl border flex flex-col items-center justify-between p-1.5 transition-all relative ${
                        isPlayerHere
                          ? 'bg-amber-400 border-amber-200 ring-4 ring-amber-300 scale-105 shadow-lg'
                          : isLadder
                          ? 'bg-emerald-800/80 border-emerald-500 text-emerald-200'
                          : isSnake
                          ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                          : 'bg-emerald-900/50 border-emerald-800 text-emerald-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold self-start">{sq}</span>
                      {isPlayerHere ? (
                        <span className="text-2xl animate-bounce">🏃</span>
                      ) : isLadder ? (
                        <span className="text-xs font-bold text-amber-300">🪜 نردبان</span>
                      ) : isSnake ? (
                        <span className="text-xs font-bold text-rose-400">🐍 مار</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Math Challenge Modal inside Snakes & Ladders */}
              {showMathModal && (
                <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>چالش ریاضی خانه {playerPosition}:</span>
                  </div>
                  <p className="text-sm font-bold text-[#0F172A]">
                    {activeGame.questions[currentQuestionIndex % activeGame.questions.length]?.prompt}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      activeGame.questions[currentQuestionIndex % activeGame.questions.length]?.answer,
                      ...(activeGame.questions[currentQuestionIndex % activeGame.questions.length]?.distractors || []),
                    ]
                      .sort(() => Math.random() - 0.5)
                      .map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSnakesAnswer(opt)}
                          className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-xs cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 🧩 THEME 5: JIGSAW PUZZLE */}
          {activeGame.mode === 'jigsaw' && (
            <div className="space-y-6">
              <p className="text-xs text-[#6B21A8] font-bold">
                دستورالعمل: به سوال هر قطعه پازل پاسخ بده تا تصویر مخفی هوش ریاضی آشکار شود!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {activeGame.questions.slice(0, 4).map((q, idx) => {
                  const isRevealed = revealedTiles[idx];
                  return (
                    <div
                      key={q.id}
                      className={`h-40 rounded-2xl border-2 p-4 transition-all flex flex-col justify-between ${
                        isRevealed
                          ? 'bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border-amber-600 text-amber-950 shadow-md'
                          : 'bg-slate-900 border-purple-500 text-white'
                      }`}
                    >
                      {isRevealed ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                          <Trophy className="w-8 h-8 text-amber-800" />
                          <span className="font-black text-sm">قطعه {idx + 1} باز شد!</span>
                          <span className="text-xs font-bold">{q.prompt} = {q.answer}</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs font-bold text-purple-300">
                            <span>قطعه شماره {idx + 1}</span>
                            <Puzzle className="w-4 h-4 text-purple-400" />
                          </div>
                          <p className="font-bold text-xs text-white line-clamp-2">{q.prompt}</p>

                          <div className="grid grid-cols-3 gap-1.5 pt-1">
                            {[q.answer, ...q.distractors].sort(() => Math.random() - 0.5).map((choice, cIdx) => (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => handleJigsawAnswer(idx, choice)}
                                className="p-1.5 bg-purple-800/80 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                              >
                                {choice}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Finish Celebratory Modal */}
          {gameCompleted && (
            <div className="p-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 text-white rounded-3xl text-center space-y-4 shadow-xl">
              <Award className="w-12 h-12 text-amber-300 mx-auto animate-pulse" />
              <h3 className="text-xl sm:text-2xl font-black">تبریک! بازی با موفقیت به پایان رسید 🎉🌱</h3>
              <p className="text-xs sm:text-sm text-emerald-100">
                دانش‌آموز تمام سوالات را با موفقیت طی کرد! امتیاز نهایی: {score} | ۲ قطره آب و مدال طلا به گلدان اضافه شد.
              </p>
              <button
                type="button"
                onClick={resetGameState}
                className="px-6 py-2.5 bg-white text-emerald-800 font-black text-xs rounded-xl shadow-md hover:bg-emerald-50 cursor-pointer"
              >
                اجرای مجدد بازی
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEACHER BUILDER MODE */}
      {activeTab === 'builder' && (
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#EADFCF] p-6 space-y-6">
          <div className="pb-4 border-b border-[#E2D5C3]">
            <h3 className="text-base font-black text-[#4A3B32] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#8B5CF6]" />
              <span>طراحی بازی جدید سفارشی برای کلاس</span>
            </h3>
            <p className="text-xs text-[#786455] mt-1">
              عنوان بازی، محیط تم (تعمیر نیروگاه، قنادی، تیراندازی، مارپله، پازل) و سوالات درسی را وارد کنید:
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSaveCustomGame(); }} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1 text-xs">
                <label className="font-bold text-[#4A3B32]">عنوان بازی درسی:</label>
                <input
                  type="text"
                  placeholder="مثلاً: چالش کالیبراسیون نیروگاه برق پایه ششم"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white font-semibold outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div className="sm:col-span-3 space-y-1 text-xs">
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

              <div className="sm:col-span-3 space-y-1 text-xs">
                <label className="font-bold text-[#4A3B32]">تم و محیط بازی:</label>
                <select
                  value={customMode}
                  onChange={(e) => setCustomMode(e.target.value as GameMode)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white font-bold outline-none cursor-pointer"
                >
                  <option value="power_plant">⚡ تعمیر نیروگاه برق</option>
                  <option value="bakery">🧁 قنادی و پخت کیک</option>
                  <option value="shooting">🎯 تیراندازی به هدف</option>
                  <option value="snakes_ladders">🎲 مار و پله جنگل</option>
                  <option value="jigsaw">🧩 پازل قاب طلایی</option>
                </select>
              </div>
            </div>

            {/* Questions Editor */}
            <div className="bg-white p-4 rounded-2xl border border-[#CBD5E1] space-y-3">
              <h4 className="text-xs font-bold text-[#4A3B32]">افزودن سوال جدید به این بازی:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] text-[#64748B]">صورت سوال / عبارت:</label>
                  <input
                    type="text"
                    placeholder="مثلاً: ۳/۵ یا ۷ × ۶"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] text-emerald-700 font-bold">پاسخ صحیح:</label>
                  <input
                    type="text"
                    placeholder="مثلاً: ۰/۶ یا ۴۲"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full p-2 rounded-lg border border-emerald-400 bg-emerald-50/50"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] text-rose-700">گزینه‌های انحرافی (دوتایی):</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="گزینه ۱"
                      value={newDistractor1}
                      onChange={(e) => setNewDistractor1(e.target.value)}
                      className="w-1/2 p-2 rounded-lg border border-[#CBD5E1]"
                    />
                    <input
                      type="text"
                      placeholder="گزینه ۲"
                      value={newDistractor2}
                      onChange={(e) => setNewDistractor2(e.target.value)}
                      className="w-1/2 p-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddQuestionToBuilder}
                    className="w-full py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن سوال</span>
                  </button>
                </div>
              </div>

              {/* List of current questions */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] text-[#64748B] font-bold">لیست سوالات آماده‌شده ({questionsList.length} سوال):</span>
                {questionsList.map((q, idx) => (
                  <div key={q.id} className="p-2.5 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#0F172A]">{idx + 1}. {q.prompt}</span>
                      <span className="mr-3 text-emerald-700 font-bold">← {q.answer}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuestionsList(questionsList.filter((item) => item.id !== q.id))}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ثبت نهایی و ذخیره‌سازی بازی در لیست کلاس</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
