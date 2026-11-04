import React, { useEffect } from 'react';
import { X, MessageCircleHeart, Lightbulb, Compass, Heart } from 'lucide-react';
import { RadarData, Plant } from '../types';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  radar: RadarData;
  plants: Plant[];
}

export const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  radar,
  plants,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alertCount = plants.filter((p) => p.mood === 'alert').length;
  const longingCount = plants.filter((p) => p.mood === 'longing').length;
  const thrivingCount = plants.filter((p) => p.mood === 'thriving').length;

  const suggestions = [
    {
      icon: '🌱',
      condition: alertCount >= 1,
      title: 'برای گیاهان چشم‌به‌راه (احوالپرسی بدون قضاوت)',
      prompt:
        '«بچه‌ها، امروز احساس می‌کنم چند تا از گلدون‌های کلاسمون دلشون برای هم‌صحبتی تنگ شده. کی دوست داره بدون هیچ نگرانی تعریف کنه این روزا چه خبره؟»',
      pedagogy:
        'به جای تمرکز روی تکلیف انجام‌نشده، فضا را برای اشتراک‌گذاری دغدغه‌های روحی یا خانوادگی امن کنید.',
    },
    {
      icon: '🍃',
      condition: longingCount >= 2,
      title: 'برای روزهای دلتنگی (یک پیوند کوتاه)',
      prompt:
        '«امروز بیاید ۲ دقیقه آخر کلاس، با هم به گلدون‌هامون سلام بدیم و ببینیم برگ جدید درآوردن یا نه.»',
      pedagogy:
        'ایجاد یک آیین مشترک ۲ دقیقه‌ای، حس تعلق جمعی را در ایام دوری تقویت می‌کند.',
    },
    {
      icon: '🌸',
      condition: thrivingCount >= 2,
      title: 'برای روزهای شادابی و تداوم (ثبت خاطره)',
      prompt:
        '«امروز خیلی از جوانه‌ها سرحالند! کی حاضره تو یک جمله بگه رازش برای اینکه هر روز صبح به موقع بیدار می‌شه چی بوده؟»',
      pedagogy:
        'تبدیل عادات فردی مثبت به یک گفت‌وگوی الهام‌بخش کلاسی بدون مقایسه یا نمره‌دهی.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs fade-in-modal no-print"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversation-modal-title"
    >
      <div
        className="w-full max-w-xl bg-[#FDFBF7] rounded-3xl border border-[#E8DFC9] p-6 sm:p-7 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE7D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] flex items-center justify-center text-[#E8A87C]">
              <MessageCircleHeart className="w-5 h-5 text-[#D9825B]" />
            </div>
            <div>
              <h3
                id="conversation-modal-title"
                className="text-lg font-bold text-[#2D2D2D]"
              >
                پیشنهاد گفت‌وگوی امروز معلم
              </h3>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                جملات راهنما برای شروع مهربانانه کلاس صبحگاهی یا اسکای‌روم
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#777] hover:text-[#2D2D2D] hover:bg-[#EFE7D8] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions List */}
        <div className="space-y-3.5 my-5 max-h-[60vh] overflow-y-auto pr-1">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6EE] border border-[#EBE0CD] rounded-2xl p-4 transition-all hover:border-[#DDCBB1] hover:bg-white/80"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#3B4E2B] mb-1.5">
                <span className="text-base">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#2D2D2D] leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-[#EFE7D8] mb-2 italic">
                {item.prompt}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#7A7A7A]">
                <Lightbulb className="w-3.5 h-3.5 text-[#E8A87C] shrink-0" />
                <span>{item.pedagogy}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#7BA05B] hover:bg-[#688D49] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            متوجه شدم، ممنون
          </button>
        </div>
      </div>
    </div>
  );
};
