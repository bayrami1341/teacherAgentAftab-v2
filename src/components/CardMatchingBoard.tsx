import React, { useState, useEffect } from 'react';
import { Grid, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { QuestionItem, GradeLevel } from '../utils/mathCurriculumEngine';
import { sound } from '../utils/audio';

interface CardItem {
  id: number;
  matchId: number;
  type: 'text' | 'visual' | 'answer';
  content: string;
  visualData?: any;
  flipped: boolean;
  matched: boolean;
}

interface CardMatchingBoardProps {
  grade: GradeLevel;
  questions: QuestionItem[];
  onRewardPlant?: (energyBonus: number, habitName: string) => void;
  onMatchScore?: (pts: number) => void;
}

export const CardMatchingBoard: React.FC<CardMatchingBoardProps> = ({
  grade,
  questions,
  onRewardPlant,
  onMatchScore
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);

  // Initialize cards layout whenever grade or questions update
  useEffect(() => {
    initBoard();
  }, [grade, questions]);

  const initBoard = () => {
    const selectedQ = questions.slice(0, 4); // Take 4 questions to make 8 cards (4 pairs)
    const cardList: CardItem[] = [];

    selectedQ.forEach((q, idx) => {
      // Card A: Problem Prompt & Visual
      cardList.push({
        id: idx * 2 + 1,
        matchId: idx,
        type: 'visual',
        content: q.questionText,
        visualData: { visualType: q.visualType, visualData: q.visualData, text: q.questionText },
        flipped: false,
        matched: false
      });

      // Card B: Correct Answer
      cardList.push({
        id: idx * 2 + 2,
        matchId: idx,
        type: 'answer',
        content: `پاسخ: ${q.correctAnswer}`,
        flipped: false,
        matched: false
      });
    });

    // Shuffle cards
    cardList.sort(() => Math.random() - 0.5);
    setCards(cardList);
    setFlippedIds([]);
    setMatchedPairsCount(0);
  };

  const handleCardClick = (card: CardItem) => {
    if (card.flipped || card.matched || flippedIds.length >= 2) return;

    sound.playWoodTap(500, 0, 0.05);

    const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = updatedCards.find((c) => c.id === newFlipped[0]);
      const card2 = updatedCards.find((c) => c.id === newFlipped[1]);

      if (card1 && card2 && card1.matchId === card2.matchId) {
        sound.playHabitSuccess();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.matchId === card1.matchId ? { ...c, matched: true } : c))
          );
          setFlippedIds([]);
          setMatchedPairsCount((count) => count + 1);

          if (onMatchScore) onMatchScore(200);
          if (onRewardPlant) {
            onRewardPlant(15, `جورچین کارت‌های ریاضی پایه ${grade}`);
          }
        }, 500);
      } else {
        sound.playGentlePluck(200);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (newFlipped.includes(c.id) ? { ...c, flipped: false } : c))
          );
          setFlippedIds([]);
        }, 1100);
      }
    }
  };

  // Helper renderer for SVG Visuals on Cards
  const renderCardVisual = (visualData?: any) => {
    if (!visualData) return null;
    const { visualType, visualData: data } = visualData;

    if (visualType === 'clock') {
      const hour = data?.hour || 4;
      const angleH = (hour % 12) * 30;
      return (
        <div className="w-12 h-12 relative flex items-center justify-center my-1">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />
            <line x1="50" y1="50" x2={50 + 22 * Math.sin((angleH * Math.PI) / 180)} y2={50 - 22 * Math.cos((angleH * Math.PI) / 180)} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <line x1="50" y1="50" x2="50" y2="16" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
          </svg>
        </div>
      );
    }

    if (visualType === 'fractions') {
      // Check for dual fraction comparison: { f1: [3, 7], f2: [5, 7] }
      if (data?.f1 && data?.f2) {
        const [n1, d1] = data.f1;
        const [n2, d2] = data.f2;
        const renderSinglePie = (n: number, d: number, color: string) => (
          <svg className="w-9 h-9" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="#1e293b" stroke={color} strokeWidth="4" />
            {Array.from({ length: d }).map((_, i) => {
              const startA = (i * 360) / d - 90;
              const endA = ((i + 1) * 360) / d - 90;
              const isShaded = i < n;
              const x1 = 50 + 42 * Math.cos((startA * Math.PI) / 180);
              const y1 = 50 + 42 * Math.sin((startA * Math.PI) / 180);
              const x2 = 50 + 42 * Math.cos((endA * Math.PI) / 180);
              const y2 = 50 + 42 * Math.sin((endA * Math.PI) / 180);
              const pathD = `M 50 50 L ${x1} ${y1} A 42 42 0 0 1 ${x2} ${y2} Z`;
              return <path key={i} d={pathD} fill={isShaded ? color : 'transparent'} stroke="#0f172a" strokeWidth="2" opacity={isShaded ? 0.9 : 0.3} />;
            })}
          </svg>
        );

        return (
          <div className="flex items-center gap-1.5 my-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            <div className="flex flex-col items-center">
              {renderSinglePie(n1, d1, '#38bdf8')}
              <span className="text-[10px] font-mono text-cyan-300 font-bold">{n1}/{d1}</span>
            </div>
            <span className="text-[10px] font-bold text-amber-400">vs</span>
            <div className="flex flex-col items-center">
              {renderSinglePie(n2, d2, '#fb7185')}
              <span className="text-[10px] font-mono text-rose-300 font-bold">{n2}/{d2}</span>
            </div>
          </div>
        );
      }

      // Single fraction or mixed fraction
      const n = data?.numerator ?? 1;
      const d = data?.denominator ?? 4;
      const isImproper = n > d;

      if (isImproper) {
        const whole = Math.floor(n / d);
        const rem = n % d;
        return (
          <div className="flex items-center gap-1 my-1">
            {Array.from({ length: Math.min(whole + 1, 3) }).map((_, pieIdx) => {
              const currentN = pieIdx < whole ? d : rem;
              return (
                <div key={pieIdx} className="w-7 h-7 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="#1e293b" stroke="#f43f5e" strokeWidth="4" />
                    {Array.from({ length: d }).map((_, i) => {
                      const startA = (i * 360) / d - 90;
                      const endA = ((i + 1) * 360) / d - 90;
                      const isShaded = i < currentN;
                      const x1 = 50 + 42 * Math.cos((startA * Math.PI) / 180);
                      const y1 = 50 + 42 * Math.sin((startA * Math.PI) / 180);
                      const x2 = 50 + 42 * Math.cos((endA * Math.PI) / 180);
                      const y2 = 50 + 42 * Math.sin((endA * Math.PI) / 180);
                      const pathD = `M 50 50 L ${x1} ${y1} A 42 42 0 0 1 ${x2} ${y2} Z`;
                      return <path key={i} d={pathD} fill={isShaded ? '#fb7185' : 'transparent'} stroke="#9f1239" strokeWidth="2" />;
                    })}
                  </svg>
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <div className="w-12 h-12 relative flex items-center justify-center my-1">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="#1e293b" stroke="#f43f5e" strokeWidth="4" />
            {Array.from({ length: d }).map((_, i) => {
              const startA = (i * 360) / d - 90;
              const endA = ((i + 1) * 360) / d - 90;
              const isShaded = i < n;
              const x1 = 50 + 42 * Math.cos((startA * Math.PI) / 180);
              const y1 = 50 + 42 * Math.sin((startA * Math.PI) / 180);
              const x2 = 50 + 42 * Math.cos((endA * Math.PI) / 180);
              const y2 = 50 + 42 * Math.sin((endA * Math.PI) / 180);
              const pathD = `M 50 50 L ${x1} ${y1} A 42 42 0 0 1 ${x2} ${y2} Z`;
              return <path key={i} d={pathD} fill={isShaded ? '#fb7185' : 'transparent'} stroke="#9f1239" strokeWidth="2" />;
            })}
          </svg>
        </div>
      );
    }

    if (visualType === 'tally') {
      const g5 = data?.groupsOf5 ?? 2;
      const s = data?.singles ?? 3;
      return (
        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-amber-500/40 my-1">
          {Array.from({ length: g5 }).map((_, i) => (
            <span key={i} className="text-amber-400 font-mono text-[11px] tracking-tighter">
              ||||/
            </span>
          ))}
          <span className="text-amber-200 font-mono text-[11px]">{ '|'.repeat(s) }</span>
        </div>
      );
    }

    if (visualType === 'sudoku') {
      const row = data?.row || [2, 4, 1, null];
      return (
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-indigo-500/40 my-1 font-mono text-xs font-bold">
          {row.map((val: number | null, i: number) => (
            <div key={i} className={`w-5 h-5 flex items-center justify-center rounded border ${val === null ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-200'}`}>
              {val === null ? '؟' : val}
            </div>
          ))}
        </div>
      );
    }

    if (visualType === 'angle') {
      const deg = data?.degrees || 90;
      return (
        <div className="w-10 h-10 relative flex items-center justify-center my-1">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <line x1="20" y1="75" x2="80" y2="75" stroke="#38bdf8" strokeWidth="5" />
            <line x1="20" y1="75" x2={20 + 55 * Math.cos((-deg * Math.PI) / 180)} y2={75 + 55 * Math.sin((-deg * Math.PI) / 180)} stroke="#f59e0b" strokeWidth="5" />
            <circle cx="20" cy="75" r="5" fill="#ffffff" />
          </svg>
        </div>
      );
    }

    if (visualType === 'place_value') {
      const tens = data?.tens ?? 1;
      const ones = data?.ones ?? 6;
      return (
        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-cyan-500/40 my-1 text-[10px]">
          <span className="text-cyan-400 font-bold">{tens} دهتایی</span>
          <span className="text-slate-500">+</span>
          <span className="text-emerald-400 font-bold">{ones} یکی</span>
        </div>
      );
    }

    if (visualType === 'integers') {
      const start = data?.start ?? -8;
      const shift = data?.shift ?? 12;
      return (
        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-violet-500/40 my-1 font-mono text-[10px] text-violet-300">
          <span>({start})</span>
          <span>➔</span>
          <span className="text-emerald-400">+{shift}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Status */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-4 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Grid className="w-4 h-4 text-amber-400" />
          <span>حافظه دیداری ریاضی (پایه {grade})</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-400 font-bold">جفت‌های درست: {matchedPairsCount} از ۴</span>
          <button
            onClick={initBoard}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition"
            title="بازچینی کارت‌ها"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid (4x2 layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`h-36 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform flex flex-col items-center justify-center p-3 text-center shadow-xl relative overflow-hidden select-none ${
              card.flipped || card.matched
                ? card.matched
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 scale-95 opacity-90'
                  : 'bg-slate-800 border-amber-400 text-amber-100 scale-100'
                : 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-slate-700 hover:border-slate-500 hover:scale-[1.02]'
            }`}
          >
            {card.flipped || card.matched ? (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <span className="text-xs font-bold text-amber-300 mb-1">{card.content}</span>
                {card.type === 'visual' && renderCardVisual(card.visualData)}
                {card.matched && (
                  <div className="absolute top-2 right-2 text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-60">
                <Grid className="w-8 h-8 text-indigo-400" />
                <span className="text-[11px] font-bold text-slate-400">کارت آفتاب</span>
                <Sparkles className="w-3 h-3 text-amber-400 opacity-40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {matchedPairsCount === 4 && (
        <div className="mt-6 p-4 bg-emerald-950/90 border border-emerald-500 text-emerald-200 rounded-2xl text-center font-bold text-sm flex items-center justify-center gap-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <span>فوق‌العاده! تمامی ۴ جفت کارت متناظر پایه {grade} به درستی پیدا شدند!</span>
        </div>
      )}
    </div>
  );
};
