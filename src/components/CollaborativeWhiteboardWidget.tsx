import React, { useState, useRef, useEffect } from 'react';
import {
  Pencil,
  Eraser,
  Square,
  Circle as CircleIcon,
  Type,
  Grid,
  Trash2,
  Download,
  Users,
  Sparkles,
  Share2,
  Check,
  RotateCcw,
  Palette,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface CollaborativeWhiteboardWidgetProps {
  onSaveSnapshot?: (dataUrl: string) => void;
}

export const CollaborativeWhiteboardWidget: React.FC<CollaborativeWhiteboardWidgetProps> = ({
  onSaveSnapshot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'line' | 'rect' | 'circle' | 'eraser'>('pencil');
  const [color, setColor] = useState('#2563EB');
  const [lineWidth, setLineWidth] = useState(3);
  const [gridType, setGridType] = useState<'grid' | 'numberLine' | 'placeValue' | 'blank'>('grid');
  const [isGroupSessionActive, setIsGroupSessionActive] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulated Group Cursors
  const groupMembers = [
    { name: 'معلم (شما)', color: '#2563EB', isMe: true },
    { name: 'سارا (تیم سبز)', color: '#10B981', isMe: false, action: 'در حال رسم شعاع دایره' },
    { name: 'علی (تیم طلایی)', color: '#F59E0B', isMe: false, action: 'در حال نوشتن مخرج کسر' },
  ];

  // Draw Grid or Background Matrix
  const drawBackgroundGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    if (gridType === 'grid') {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      const gridSize = 25;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (gridType === 'numberLine') {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      const midY = height / 2;

      ctx.beginPath();
      ctx.moveTo(20, midY);
      ctx.lineTo(width - 20, midY);
      ctx.stroke();

      for (let x = 40; x < width - 40; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, midY - 10);
        ctx.lineTo(x, midY + 10);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 420;
    drawBackgroundGrid(ctx, canvas.width, canvas.height);
  }, [gridType]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    sound.playPlantClick(400);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBackgroundGrid(ctx, canvas.width, canvas.height);
  };

  const handleDownloadImage = () => {
    sound.playJoyfulChime();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'whiteboard_group_math.png';
    link.href = image;
    link.click();
  };

  const handleCopyGroupLink = () => {
    sound.playPlantClick(580);
    navigator.clipboard.writeText('https://aistudio.dev/class/whiteboard-room-305');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-5 text-right dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white text-2xl shadow-md ring-4 ring-[#0284C7]/20">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                وایت‌برد آنلاین تعاملی با دسترسی گروهی (Collaborative Group Whiteboard)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] text-[10px] font-bold border border-[#BAE6FD]">
                زنده و تعاملی
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              تخته رسم گروهی کسرها، اشکال هندسی و فرمول‌ها • قابلیت اتصال قلم‌های دانش‌آموزان هم‌گروه
            </p>
          </div>
        </div>

        {/* Group Link Share */}
        <button
          type="button"
          onClick={handleCopyGroupLink}
          className="px-3.5 py-2 bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE] rounded-xl border border-[#BAE6FD] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedLink ? 'لینک تخته گروهی کپی شد!' : 'اشتراک‌گذاری لینک تخته با کلاس'}</span>
        </button>
      </div>

      {/* Group Members Active Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0284C7]" />
          <span className="font-bold text-[#0F172A]">دانش‌آموزان متصل به این وایت‌برد:</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {groupMembers.map((m, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#CBD5E1] text-[11px] font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-[#0F172A]">{m.name}</span>
              {m.action && <span className="text-[10px] text-[#64748B]">({m.action})</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EADFCF] text-xs">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'pencil', label: 'مداد', icon: Pencil },
            { id: 'eraser', label: 'پاک‌کن', icon: Eraser },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTool(t.id as any);
                  sound.playPlantClick(480);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  tool === t.id ? 'bg-[#0F172A] text-white shadow-xs' : 'bg-white text-[#334155] hover:bg-[#F1F5F9]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-[#64748B]" />
          {['#2563EB', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#0F172A'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                sound.playPlantClick(520);
              }}
              className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                color === c ? 'scale-125 ring-2 ring-offset-2 ring-[#0F172A]' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Background Grid Types */}
        <div className="flex items-center gap-1.5">
          <Grid className="w-4 h-4 text-[#64748B]" />
          {[
            { id: 'grid', label: 'شطرنجی کسرها' },
            { id: 'numberLine', label: 'محور اعداد' },
            { id: 'blank', label: 'ساده' },
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setGridType(g.id as any);
                sound.playPlantClick(500);
              }}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                gridType === g.id ? 'bg-[#0284C7] text-white' : 'bg-white text-[#475569]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Actions: Clear & Download */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearCanvas}
            className="px-3 py-1.5 bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FCA5A5] rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>پاک کردن تخته</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            className="px-3 py-1.5 bg-[#ECFDF5] text-[#047857] hover:bg-[#A7F3D0] rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ذخیره تصویر PNG</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Element */}
      <div className="w-full bg-white rounded-2xl border-2 border-[#CBD5E1] overflow-hidden shadow-inner relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full cursor-crosshair touch-none"
        />

        {/* Simulated Live Remote Cursor Overlays */}
        <div className="absolute top-16 left-1/3 pointer-events-none flex items-center gap-1 bg-[#10B981] text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md animate-bounce">
          <span>✏️ سارا</span>
        </div>
        <div className="absolute bottom-20 right-1/4 pointer-events-none flex items-center gap-1 bg-[#F59E0B] text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md">
          <span>✏️ علی</span>
        </div>
      </div>
    </div>
  );
};
