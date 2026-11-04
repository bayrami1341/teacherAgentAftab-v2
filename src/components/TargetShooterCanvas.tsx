import React, { useRef, useEffect, useState } from 'react';
import { Target, Crosshair, Sparkles } from 'lucide-react';
import { QuestionItem } from '../utils/mathCurriculumEngine';
import { sound } from '../utils/audio';

interface TargetShooterCanvasProps {
  question: QuestionItem;
  onCorrectAnswer: (answer: string | number) => void;
  onWrongAnswer: (answer: string | number) => void;
  score: number;
}

interface BalloonTarget {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  option: string | number;
  isCorrect: boolean;
  color: string;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export const TargetShooterCanvas: React.FC<TargetShooterCanvasProps> = ({
  question,
  onCorrectAnswer,
  onWrongAnswer,
  score
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const balloonsRef = useRef<BalloonTarget[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const confettiRef = useRef<Confetti[]>([]);
  const aimAngleRef = useRef<number>(-Math.PI / 2); // default aiming up
  const animFrameRef = useRef<number | null>(null);
  const processedTargetRef = useRef<Set<number>>(new Set());

  // Setup balloons on question change
  useEffect(() => {
    processedTargetRef.current.clear();
    bulletsRef.current = [];

    const colors = ['#f43f5e', '#10b981', '#3b82f6', '#f59e0b'];
    balloonsRef.current = question.options.map((opt, idx) => {
      const isCorrect = String(opt) === String(question.correctAnswer);
      return {
        id: Math.random(),
        x: 100 + idx * 130,
        y: 120 + (idx % 2 === 0 ? 0 : 40),
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.3 - Math.random() * 0.3,
        radius: 38,
        option: opt,
        isCorrect,
        color: colors[idx % colors.length]
      };
    });
  }, [question]);

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 400;

    let running = true;

    const render = () => {
      if (!running) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Field Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Concentric target grid background lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 1;
      for (let r = 50; r < 300; r += 50) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height - 30, r, Math.PI, 0);
        ctx.stroke();
      }

      // 2. Update & Draw Floating Target Balloons
      for (let i = 0; i < balloonsRef.current.length; i++) {
        const b = balloonsRef.current[i];
        b.x += b.vx;
        b.y += b.vy;

        // Bounce inside canvas boundaries
        if (b.x < 50 || b.x > canvas.width - 50) b.vx = -b.vx;
        if (b.y < 60 || b.y > canvas.height - 140) b.vy = -b.vy;

        // Draw Balloon Body
        ctx.save();
        ctx.translate(b.x, b.y);

        // Balloon string
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, b.radius);
        ctx.quadraticCurveTo(5, b.radius + 15, 0, b.radius + 30);
        ctx.stroke();

        // Balloon Ellipse
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, b.radius * 0.9, b.radius * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon Highlight Shine
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-b.radius * 0.3, -b.radius * 0.4, 6, 0, Math.PI * 2);
        ctx.fill();

        // Answer Text Pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(-26, -12, 52, 24, 6);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px Vazirmatn, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(b.option), 0, 1);

        ctx.restore();
      }

      // 3. Update & Draw Bullets
      for (let j = bulletsRef.current.length - 1; j >= 0; j--) {
        const bul = bulletsRef.current[j];
        bul.x += bul.vx;
        bul.y += bul.vy;

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(bul.x, bul.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Check Collision with Balloons
        for (let i = 0; i < balloonsRef.current.length; i++) {
          const b = balloonsRef.current[i];
          const dist = Math.hypot(bul.x - b.x, bul.y - b.y);

          if (dist < b.radius + 6 && !processedTargetRef.current.has(b.id)) {
            bulletsRef.current.splice(j, 1);
            processedTargetRef.current.add(b.id);

            // Spawn Balloon Pop Confetti
            for (let c = 0; c < 30; c++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 6;
              confettiRef.current.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: b.color,
                size: 4 + Math.random() * 4,
                alpha: 1
              });
            }

            if (b.isCorrect) {
              sound.playHabitSuccess();
              onCorrectAnswer(b.option);
            } else {
              sound.playGentlePluck(200);
              onWrongAnswer(b.option);
            }
            break;
          }
        }

        // Remove offscreen bullets
        if (bul.x < 0 || bul.x > canvas.width || bul.y < 0) {
          bulletsRef.current.splice(j, 1);
        }
      }

      // 4. Update & Draw Confetti Particles
      for (let c = confettiRef.current.length - 1; c >= 0; c--) {
        const cf = confettiRef.current[c];
        cf.x += cf.vx;
        cf.y += cf.vy;
        cf.vy += 0.1; // gravity
        cf.alpha -= 0.025;

        if (cf.alpha <= 0) {
          confettiRef.current.splice(c, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = cf.alpha;
        ctx.fillStyle = cf.color;
        ctx.fillRect(cf.x, cf.y, cf.size, cf.size);
        ctx.restore();
      }

      // 5. Draw Aiming Cannon at Bottom Center
      const cannonX = canvas.width / 2;
      const cannonY = canvas.height - 30;
      const angle = aimAngleRef.current;

      ctx.save();
      ctx.translate(cannonX, cannonY);

      // Trajectory dashed line preview
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 300, Math.sin(angle) * 300);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating Cannon Barrel
      ctx.rotate(angle);
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, -35, 20, 35);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(-10, -35, 20, 35);
      ctx.restore();

      // Cannon Base
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cannonX, cannonY, 24, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [question, onCorrectAnswer, onWrongAnswer]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - (canvas.height - 30);
    const angle = Math.atan2(y, x);
    // Limit angle upward arc
    if (angle < -0.1 && angle > -Math.PI + 0.1) {
      aimAngleRef.current = angle;
    }
  };

  const handleShoot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const angle = aimAngleRef.current;
    const cannonX = canvas.width / 2;
    const cannonY = canvas.height - 30;
    const speed = 14;

    bulletsRef.current.push({
      x: cannonX + Math.cos(angle) * 35,
      y: cannonY + Math.sin(angle) * 35,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    });

    sound.playWoodTap(700, 0, 0.04);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative rounded-3xl border-2 border-emerald-500/50 overflow-hidden shadow-2xl bg-slate-950 max-w-full">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onClick={handleShoot}
          className="cursor-crosshair block w-full max-w-[640px] h-[340px] touch-none"
        />

        {/* HUD Banner */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 border border-emerald-400/60 px-4 py-2 rounded-2xl text-emerald-200 text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur">
            <Target className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>{question.questionText}</span>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/50 px-3 py-1.5 rounded-xl text-xs font-mono text-amber-300 backdrop-blur">
            هدف‌گیری با نشانگر + کلیک
          </div>
        </div>
      </div>

      <button
        onClick={handleShoot}
        className="mt-4 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition shadow-lg flex items-center gap-2 text-sm"
      >
        <Crosshair className="w-4 h-4 text-emerald-300" />
        <span>تیراندازی به سیبل ریاضی</span>
      </button>
    </div>
  );
};
