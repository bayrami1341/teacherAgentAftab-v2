import React, { useState } from 'react';
import { Wrench, Zap, Cake, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { QuestionItem } from '../utils/mathCurriculumEngine';
import { sound } from '../utils/audio';

interface RoshaInteractiveWorkshopProps {
  question: QuestionItem;
  onCorrectAnswer: (answer: string | number) => void;
  onWrongAnswer: (answer: string | number) => void;
}

export const RoshaInteractiveWorkshop: React.FC<RoshaInteractiveWorkshopProps> = ({
  question,
  onCorrectAnswer,
  onWrongAnswer
}) => {
  const [theme, setTheme] = useState<'power_plant' | 'bakery'>('power_plant');

  // Power plant state: user interactive voltage slider
  const [sliderVal, setSliderVal] = useState<number>(50);

  // Bakery state: user selected slice numerator
  const [sliceCount, setSliceCount] = useState<number>(1);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const handleOptionSubmit = (option: string | number) => {
    const isCorrect = String(option) === String(question.correctAnswer);

    if (isCorrect) {
      sound.playHabitSuccess();
      setFeedback({
        isCorrect: true,
        message: 'عالی بود! تنظیم کارگاهی با موفقیت انجام شد و مدار به کار افتاد. ⚡'
      });
      onCorrectAnswer(option);
    } else {
      sound.playGentlePluck(220);
      setFeedback({
        isCorrect: false,
        message: `تنظیم نادرست است. ${question.explanationFa}`
      });
      onWrongAnswer(option);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-5">
      {/* Theme Selector Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setTheme('power_plant')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs border transition flex items-center gap-2 ${
            theme === 'power_plant'
              ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-900/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>تم ۱: کارگاه نیروگاه برق آفتاب (تنظیم ولتاژ)</span>
        </button>

        <button
          onClick={() => setTheme('bakery')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs border transition flex items-center gap-2 ${
            theme === 'bakery'
              ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-900/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Cake className="w-4 h-4 text-rose-300" />
          <span>تم ۲: کارگاه قنادی (برش کسری کیک)</span>
        </button>
      </div>

      {/* Main Interactive Workshop Panel */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {theme === 'power_plant' ? (
          /* POWER PLANT THEME */
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-right space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Wrench className="w-5 h-5" />
                <span>عیب‌یابی مدار نیروگاه روشا</span>
              </div>
              <p className="text-sm font-bold text-slate-100">{question.questionText}</p>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span>سطح خروجی ولتاژ متغیر:</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">{sliderVal} V</span>
                </div>
                {/* Interactive Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Interactive Voltage Gauge & Circuit SVG */}
            <div className="w-48 h-48 bg-slate-950 border-2 border-amber-500/50 rounded-3xl p-4 flex flex-col items-center justify-center relative shrink-0 shadow-inner">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="8" />
                {/* Meter Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * sliderVal) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                {/* Needle */}
                <line
                  x1="50"
                  y1="50"
                  x2={50 + 30 * Math.cos(((sliderVal * 2.7 - 135) * Math.PI) / 180)}
                  y2={50 + 30 * Math.sin(((sliderVal * 2.7 - 135) * Math.PI) / 180)}
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="6" fill="#f8fafc" />
              </svg>
              <span className="text-xs font-mono font-bold text-amber-300 mt-2">
                مولد آفتاب: {sliderVal}kW
              </span>
            </div>
          </div>
        ) : (
          /* BAKERY CAKE SLICER THEME */
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-right space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Cake className="w-5 h-5 animate-bounce" />
                <span>کارگاه تزیین و برش کسر کیک قنادی</span>
              </div>
              <p className="text-sm font-bold text-slate-100">{question.questionText}</p>
              
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span>تعداد اسلایس‌های انتخابی:</span>
                  <span className="font-mono text-rose-300 font-bold text-sm">{sliceCount} اسلایس</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSliceCount(n)}
                      className={`flex-1 py-1.5 rounded-xl font-bold transition text-xs border ${
                        sliceCount === n
                          ? 'bg-rose-600 text-white border-rose-400'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {n} اسلایس
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Cake Slice SVG */}
            <div className="w-48 h-48 bg-slate-950 border-2 border-rose-500/50 rounded-3xl p-4 flex flex-col items-center justify-center relative shrink-0 shadow-inner">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#881337" stroke="#f43f5e" strokeWidth="4" />
                {Array.from({ length: 4 }).map((_, i) => {
                  const angle = (i * 90 * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={50 + 40 * Math.cos(angle)}
                      y2={50 + 40 * Math.sin(angle)}
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                  );
                })}
                {/* Active shaded slices */}
                {Array.from({ length: sliceCount }).map((_, i) => {
                  const startA = (i * 90 * Math.PI) / 180;
                  const endA = ((i + 1) * 90 * Math.PI) / 180;
                  const x1 = 50 + 40 * Math.cos(startA);
                  const y1 = 50 + 40 * Math.sin(startA);
                  const x2 = 50 + 40 * Math.cos(endA);
                  const y2 = 50 + 40 * Math.sin(endA);
                  return (
                    <path
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 0 1 ${x2} ${y2} Z`}
                      fill="#fb7185"
                      opacity="0.85"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="8" fill="#fff1f2" />
              </svg>
              <span className="text-xs font-mono font-bold text-rose-300 mt-2">
                کسر: {sliceCount}/۴ کیک
              </span>
            </div>
          </div>
        )}

        {/* Answer Options Grid */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-3 font-bold">پاسخ ریاضی نهایی را انتخاب کنید:</p>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSubmit(option)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 rounded-2xl font-bold text-sm text-slate-100 transition shadow flex items-center justify-between"
              >
                <span>{option}</span>
                <Wrench className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-4 p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500 text-rose-200'
            }`}
          >
            {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
