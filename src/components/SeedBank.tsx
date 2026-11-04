import React from 'react';
import { Plant } from '../types';
import { PlantSvg } from './PlantSvg';
import { ChevronDown, ChevronUp, Archive, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface SeedBankProps {
  seedBank: Plant[];
  isOpen: boolean;
  onToggle: () => void;
  onSelectSeed?: (seed: Plant) => void;
}

export const SeedBank: React.FC<SeedBankProps> = ({
  seedBank,
  isOpen,
  onToggle,
  onSelectSeed,
}) => {
  if (!seedBank || seedBank.length === 0) return null;

  // Sorted by generation descending, then alphabetical
  const sortedSeeds = [...seedBank].sort((a, b) => {
    if (b.gen !== a.gen) return b.gen - a.gen;
    return a.plantName.localeCompare(b.plantName, 'fa');
  });

  const handleToggle = () => {
    sound.playPlantClick(isOpen ? 380 : 480);
    onToggle();
  };

  return (
    <section className="bg-white border border-[#E8DFC9] rounded-2xl overflow-hidden shadow-xs transition-all no-print">
      {/* Collapsible Header Bar */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-[#FAF6EE] hover:bg-[#F5EFE3] transition-colors cursor-pointer select-none text-right"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFE4D2] flex items-center justify-center text-[#7C6650]">
            <Archive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#2D2D2D]">
                بذرخانه‌ی خاطرات کلاس
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EADBCA] text-[#5C4935]">
                {seedBank.length} بذر کامل‌شده
              </span>
            </div>
            <p className="text-xs text-[#7A7A7A] mt-0.5">
              گیاهانی که دوره‌ی رشد ۲۴ روزه را به پایان رساندند و بذر نسل جدید را به یادگار گذاشتند.
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl text-[#777] bg-white border border-[#E5DAC6]">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Seeds Grid */}
      {isOpen && (
        <div className="p-5 sm:p-6 bg-[#FCFBF8] border-t border-[#EFE7D8]">
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
            {sortedSeeds.map((seed, idx) => (
              <div
                key={seed.id || idx}
                onClick={() => onSelectSeed && onSelectSeed(seed)}
                className="w-28 sm:w-32 bg-white rounded-2xl p-3 border border-[#EAE1D1] hover:border-[#CBBDA5] hover:shadow-sm transition-all flex flex-col items-center cursor-pointer group"
              >
                {/* Monochromatic botanical archive plant icon */}
                <div className="w-16 h-20 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                  <PlantSvg
                    mood="content"
                    stage={seed.stage}
                    size={64}
                    isArchive={true}
                    potStyle="clay"
                  />
                </div>

                <div className="text-center mt-2 w-full">
                  <span className="text-xs font-bold text-[#2D2D2D] block truncate group-hover:text-[#4A6E2E]">
                    {seed.plantName}
                  </span>
                  <span className="text-[10px] text-[#7A7A7A] block mt-0.5">
                    نسل {seed.gen} • مهرماه
                  </span>
                  <span className="text-[9px] text-[#8C7A68] bg-[#F4EDE0] px-1.5 py-0.5 rounded-md mt-1.5 inline-block">
                    {seed.memoriesCount} خاطره ثبت‌شده
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EFE7D8] flex items-center justify-between text-xs text-[#7A7A7A]">
            <span>🌱 در جوانه، پایان هر گیاه، آغازی برای نسل بعد است.</span>
            <span className="text-[11px] text-[#8C8C8C]">مراقبت پایدار، پیوند ماندگار</span>
          </div>
        </div>
      )}
    </section>
  );
};
