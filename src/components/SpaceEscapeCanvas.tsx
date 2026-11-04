import React, { useRef, useEffect, useState } from 'react';
import { Rocket, Zap, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { QuestionItem } from '../utils/mathCurriculumEngine';
import { sound } from '../utils/audio';

interface SpaceEscapeCanvasProps {
  question: QuestionItem;
  onCorrectAnswer: (answer: string | number) => void;
  onWrongAnswer: (answer: string | number) => void;
  score: number;
  streak: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface Meteor {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  option: string | number;
  isCorrect: boolean;
  rot: number;
  rotSpeed: number;
  color: string;
}

interface Laser {
  x: number;
  y: number;
  vy: number;
}

export const SpaceEscapeCanvas: React.FC<SpaceEscapeCanvasProps> = ({
  question,
  onCorrectAnswer,
  onWrongAnswer,
  score,
  streak
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shipX, setShipX] = useState<number>(300);
  const [autoFire, setAutoFire] = useState<boolean>(true);

  // References for animation loop
  const meteorsRef = useRef<Meteor[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shipPosRef = useRef<{ x: number; y: number }>({ x: 300, y: 340 });
  const animFrameIdRef = useRef<number | null>(null);
  const lastShotTimeRef = useRef<number>(0);
  const processedMeteorRef = useRef<Set<number>>(new Set());

  // Re-spawn meteors when question changes
  useEffect(() => {
    processedMeteorRef.current.clear();
    lasersRef.current = [];

    const options = [...question.options];
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'];
    
    meteorsRef.current = options.map((opt, idx) => {
      const isCorrect = String(opt) === String(question.correctAnswer);
      return {
        id: Math.random(),
        x: 80 + idx * 130 + (Math.random() * 20 - 10),
        y: 60 + (idx % 2 === 0 ? 0 : 35),
        radius: 36,
        speed: 0.3 + Math.random() * 0.2,
        option: opt,
        isCorrect,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[idx % colors.length]
      };
    });
  }, [question]);

  // Main 60 FPS HTML5 Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution width/height
    canvas.width = 640;
    canvas.height = 420;

    let running = true;

    const render = (time: number) => {
      if (!running) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Starfield Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const starX = (i * 97 + time * 0.02) % canvas.width;
        const starY = (i * 53 + time * 0.05) % canvas.height;
        ctx.fillRect(starX, starY, (i % 3) + 1, (i % 3) + 1);
      }

      // Auto firing logic
      if (autoFire && time - lastShotTimeRef.current > 350) {
        lasersRef.current.push({
          x: shipPosRef.current.x,
          y: shipPosRef.current.y - 20,
          vy: -12
        });
        sound.playWoodTap(800, 0, 0.02);
        lastShotTimeRef.current = time;
      }

      // 2. Update & Draw Lasers
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#0284c7';

      for (let i = lasersRef.current.length - 1; i >= 0; i--) {
        const l = lasersRef.current[i];
        l.y += l.vy;

        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x, l.y - 14);
        ctx.stroke();

        // Remove off-screen lasers
        if (l.y < -20) {
          lasersRef.current.splice(i, 1);
        }
      }
      ctx.shadowBlur = 0; // reset glow

      // 3. Update & Draw Meteors with Math Answers
      for (let i = 0; i < meteorsRef.current.length; i++) {
        const m = meteorsRef.current[i];
        m.y += m.speed * 0.4;
        m.rot += m.rotSpeed;

        // Bounce at bottom boundary
        if (m.y > canvas.height - 100) {
          m.speed = -Math.abs(m.speed);
        } else if (m.y < 50) {
          m.speed = Math.abs(m.speed);
        }

        // Draw Meteor Body
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rot);

        ctx.beginPath();
        ctx.arc(0, 0, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = m.color;
        ctx.stroke();

        // Inner crater details
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(-10, -10, 8, 0, Math.PI * 2);
        ctx.arc(12, 8, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw Math Option Text Badge
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Vazirmatn, Tahoma, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Background tag pill
        const textStr = String(m.option);
        const textWidth = ctx.measureText(textStr).width + 16;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-textWidth / 2, -13, textWidth, 26, 8);
        ctx.fill();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.fillText(textStr, 0, 1);
        ctx.restore();

        // Collision detection between Lasers and Meteors
        for (let j = lasersRef.current.length - 1; j >= 0; j--) {
          const l = lasersRef.current[j];
          const dist = Math.hypot(l.x - m.x, l.y - m.y);

          if (dist < m.radius + 6 && !processedMeteorRef.current.has(m.id)) {
            // Remove laser
            lasersRef.current.splice(j, 1);

            // Spawn explosion particles
            for (let p = 0; p < 25; p++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 5;
              particlesRef.current.push({
                x: m.x,
                y: m.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: m.isCorrect ? '#34d399' : '#f43f5e',
                size: 3 + Math.random() * 4,
                alpha: 1,
                life: 1
              });
            }

            if (m.isCorrect) {
              processedMeteorRef.current.add(m.id);
              sound.playHabitSuccess();
              onCorrectAnswer(m.option);
            } else {
              processedMeteorRef.current.add(m.id);
              sound.playGentlePluck(180);
              onWrongAnswer(m.option);
            }
            break;
          }
        }
      }

      // 4. Update & Draw Particles
      for (let p = particlesRef.current.length - 1; p >= 0; p--) {
        const pt = particlesRef.current[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.03;

        if (pt.alpha <= 0) {
          particlesRef.current.splice(p, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw Player Rocket Ship
      const sx = shipPosRef.current.x;
      const sy = shipPosRef.current.y;

      ctx.save();
      ctx.translate(sx, sy);

      // Rocket Thruster Flame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-6, 18);
      ctx.lineTo(0, 28 + Math.random() * 8);
      ctx.lineTo(6, 18);
      ctx.fill();

      // Rocket Ship SVG/Canvas Geometry
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(14, 14);
      ctx.lineTo(0, 8);
      ctx.lineTo(-14, 14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cockpit Window
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [question, autoFire, onCorrectAnswer, onWrongAnswer]);

  // Handle Mouse/Touch controls for Rocket Ship
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    const clampedX = Math.max(30, Math.min(canvas.width - 30, x));
    setShipX(clampedX);
    shipPosRef.current.x = clampedX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const clampedX = Math.max(30, Math.min(canvas.width - 30, x));
    setShipX(clampedX);
    shipPosRef.current.x = clampedX;
  };

  const manualFire = () => {
    lasersRef.current.push({
      x: shipPosRef.current.x,
      y: shipPosRef.current.y - 20,
      vy: -14
    });
    sound.playWoodTap(900, 0, 0.03);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Canvas Arcade Screen */}
      <div className="relative rounded-3xl border-2 border-indigo-500/50 overflow-hidden shadow-2xl bg-slate-950 max-w-full">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={manualFire}
          className="cursor-crosshair block w-full max-w-[640px] h-[340px] touch-none"
        />

        {/* HUD Overlay Top Banner */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 border border-amber-400/60 px-4 py-2 rounded-2xl text-amber-200 text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{question.questionText}</span>
          </div>

          <div className="bg-slate-900/90 border border-indigo-500/50 px-3 py-1.5 rounded-xl text-xs font-mono text-indigo-300 backdrop-blur flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span>کنترل: ماوس/لمس</span>
          </div>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={manualFire}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition shadow-lg flex items-center gap-2 text-sm"
        >
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>شلیک لیزر به هدف</span>
        </button>

        <button
          onClick={() => setAutoFire(!autoFire)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
            autoFire
              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>شلیک خودکار: {autoFire ? 'فعال' : 'غیرفعال'}</span>
        </button>
      </div>
    </div>
  );
};
