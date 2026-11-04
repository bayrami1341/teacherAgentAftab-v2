import React from 'react';
import { Plant, Mood } from '../types';
import { PlantSvg } from './PlantSvg';
import { sound } from '../utils/audio';
import { Filter, Sparkles, Moon } from 'lucide-react';

interface GardenProps {
  plants: Plant[];
  loading?: boolean;
  onSelectPlant: (plant: Plant) => void;
  selectedPlantId?: string | null;
}

export const Garden: React.FC<GardenProps> = ({
  plants,
  loading = false,
  onSelectPlant,
  selectedPlantId,
}) => {
  const [filter, setFilter] = React.useState<'all' | 'needs_care' | 'thriving' | 'blooming'>('all');

  const filteredPlants = React.useMemo(() => {
    switch (filter) {
      case 'needs_care':
        return plants.filter((p) => p.mood === 'longing' || p.mood === 'alert');
      case 'thriving':
        return plants.filter((p) => p.mood === 'thriving');
      case 'blooming':
        return plants.filter((p) => p.stage >= 4);
      default:
        return plants;
    }
  }, [plants, filter]);

  const handlePlantClick = (plant: Plant) => {
    // Generate gentle harmonic note and tactile wood tap based on plant stage
    const baseFreqs = [392, 440, 493.88, 523.25, 587.33];
    const freq = baseFreqs[(plant.stage - 1) % baseFreqs.length] || 440;
    sound.playWoodTap(plant.stage <= 2 ? 430 : plant.stage <= 4 ? 330 : 220);
    sound.playPlantClick(freq);
    onSelectPlant(plant);
  };

  const handleKeyDown = (e: React.KeyboardEvent, plant: Plant) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlantClick(plant);
    }
  };

  // Loading Skeleton State with Shimmer Animation
  if (loading) {
    return (
      <section className="bg-white border border-[#E8DFC9] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EFE9DC]">
          <div className="h-6 w-36 bg-[#EFE9DC] rounded-md shimmer-skeleton" />
          <div className="h-8 w-48 bg-[#EFE9DC] rounded-xl shimmer-skeleton" />
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-24 sm:w-28 h-36 rounded-2xl p-3 flex flex-col items-center justify-between border border-[#EFE9DC] shimmer-skeleton"
            >
              <div className="w-16 h-20 rounded-full bg-white/40" />
              <div className="w-12 h-3.5 bg-white/60 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-[#E8DFC9] rounded-2xl p-5 sm:p-7 shadow-xs">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EFE9DC]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#2D2D2D]">باغچه‌ی زنده‌ی کلاس</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF3E4] text-[#4A6E2E]">
              {plants.length} گلدان
            </span>
          </div>
          <p className="text-xs text-[#7A7A7A] mt-1">
            روی هر گلدان کلیک کنید تا کارت گفت‌وگو و رویاهای کودک باز شود.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF6EE] rounded-xl border border-[#E9DFCE] text-xs font-medium w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-[#2D2D2D] shadow-2xs font-bold'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            همه ({plants.length})
          </button>
          <button
            onClick={() => setFilter('needs_care')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'needs_care'
                ? 'bg-[#FDF0E7] text-[#935227] shadow-2xs font-bold'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            نیازمند توجه ({plants.filter((p) => p.mood === 'longing' || p.mood === 'alert').length})
          </button>
          <button
            onClick={() => setFilter('thriving')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'thriving'
                ? 'bg-[#EBF3E4] text-[#426527] shadow-2xs font-bold'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            شاداب‌ها ({plants.filter((p) => p.mood === 'thriving').length})
          </button>
          <button
            onClick={() => setFilter('blooming')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'blooming'
                ? 'bg-[#FFF3E0] text-[#B26A00] shadow-2xs font-bold'
                : 'text-[#666] hover:text-[#2D2D2D]'
            }`}
          >
            شکوفا شده ({plants.filter((p) => p.stage >= 4).length})
          </button>
        </div>
      </div>

      {/* Living Plant Nursery with organic height and lateral offsets */}
      {filteredPlants.length === 0 ? (
        <div className="py-16 text-center text-sm text-[#7A7A7A]">
          <span className="text-3xl block mb-2">🌾</span>
          گیاهی در این دسته‌بندی یافت نشد.
        </div>
      ) : (
        <div className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-[#FAF7F0] via-[#FAF5EC] to-[#F5EFE0] border border-[#EADBCA] shadow-inner">
          {/* Subtle natural nursery wooden slat effect */}
          <div className="absolute inset-x-4 bottom-2 h-1 bg-[#E8DCBF]/50 rounded-full pointer-events-none" />

          {/* Organic scattered flex layout */}
          <div className="flex flex-wrap items-end justify-center gap-x-3 sm:gap-x-5 gap-y-8 sm:gap-y-10 py-4 min-h-[360px]">
            {filteredPlants.map((plant, index) => {
              const isSelected = selectedPlantId === plant.id;
              const hasDream = Boolean(plant.activeDream);
              const isNeedAttention = plant.mood === 'longing' || plant.mood === 'alert';

              // Organic offsets for true garden randomness
              const staggeredOffsets = [4, 18, 0, 24, 10, 28, 6, 16, 2, 22, 12, 8, 26, 14, 0, 20];
              const verticalOffset = staggeredOffsets[index % staggeredOffsets.length];
              const lateralMargin = (index % 4 === 1 ? 'sm:mx-2' : index % 4 === 3 ? 'sm:mx-3' : 'sm:mx-1');

              return (
                <div
                  key={plant.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`گیاه ${plant.plantName}، وضعیت ${plant.mood}`}
                  onClick={() => handlePlantClick(plant)}
                  onKeyDown={(e) => handleKeyDown(e, plant)}
                  style={{
                    transform: `translateY(${verticalOffset}px)`,
                  }}
                  className={`group relative flex flex-col items-center justify-end w-24 sm:w-28 p-2 rounded-2xl transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#7BA05B] select-none ${lateralMargin} ${
                    isSelected
                      ? 'bg-white ring-2 ring-[#7BA05B] shadow-md scale-105 z-20'
                      : 'hover:-translate-y-2 hover:bg-white/90 hover:shadow-sm'
                  } ${
                    isNeedAttention
                      ? 'border border-dashed border-[#E8A87C]/70 bg-[#FFFDF9]/90'
                      : 'border border-transparent'
                  }`}
                >
                  {/* Generation badge if > 1 */}
                  {plant.gen > 1 && (
                    <span className="absolute -top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EAE2D2] text-[#695844] z-10 shadow-2xs">
                      نسل {plant.gen}
                    </span>
                  )}

                  {/* Has dream active glowing indicator */}
                  {hasDream && (
                    <span
                      className="absolute -top-1.5 left-1.5 text-xs text-[#F5B041] z-10 animate-pulse"
                      title="رویای دیشب فعال است"
                    >
                      🌙
                    </span>
                  )}

                  {/* The Handcrafted SVG Plant Graphic */}
                  <div className="w-20 h-24 sm:w-22 sm:h-26 flex items-center justify-center">
                    <PlantSvg
                      mood={plant.mood}
                      stage={plant.stage}
                      size="100%"
                      accessory={plant.accessory}
                      potStyle={plant.potStyle}
                    />
                  </div>

                  {/* Plant Name (Child Name is strictly kept private in Garden view!) */}
                  <div className="mt-2 text-center w-full">
                    <div className="text-xs sm:text-sm font-bold text-[#2D2D2D] truncate group-hover:text-[#4A6E2E] transition-colors">
                      {plant.plantName}
                    </div>

                    {/* Gentle Mood Indicator label */}
                    <div className="text-[10px] text-[#7A7A7A] mt-0.5 flex items-center justify-center gap-1">
                      {plant.mood === 'thriving' && (
                        <span className="text-[#55783A] font-semibold">شاداب</span>
                      )}
                      {plant.mood === 'content' && (
                        <span className="text-[#6B8558]">آرام</span>
                      )}
                      {plant.mood === 'longing' && (
                        <span className="text-[#B06B3E] font-medium">دلتنگ</span>
                      )}
                      {plant.mood === 'alert' && (
                        <span className="text-[#888888] font-medium">بی‌تاب</span>
                      )}
                    </div>
                  </div>

                  {/* Subtle highlight tag for teacher nudge sent */}
                  {plant.teacherNudgeSent && (
                    <span className="absolute -bottom-2 text-[9px] bg-[#EAF2E3] text-[#4F7332] px-1.5 py-0.5 rounded-full border border-[#D1E3C4] shadow-2xs">
                      نوازش فرستاده شد ✨
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
