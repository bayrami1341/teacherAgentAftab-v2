import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Sun, Droplets, Award, Star, Zap } from 'lucide-react';

interface PlantStageVisualProps {
  stage: number; // 1 to 5
  mood?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  interactive?: boolean;
}

// STAGE 1: 🌱 Sprout (جوانه نوپا)
export const SproutStageSVG: React.FC<{ mood?: string }> = ({ mood = 'thriving' }) => {
  const isLonging = mood === 'longing';
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        <defs>
          <radialGradient id="sproutGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A09" />
          </linearGradient>
          <linearGradient id="sproutStem" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>
        </defs>

        {/* Aura Glow */}
        <motion.circle
          cx="100"
          cy="120"
          r="60"
          fill="url(#sproutGlow)"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />

        {/* Soil Mound */}
        <path d="M 30 160 Q 100 130 170 160 L 170 185 Q 100 195 30 185 Z" fill="url(#soilGrad)" />
        <ellipse cx="100" cy="155" rx="50" ry="10" fill="#92400E" opacity="0.6" />

        {/* Growing Stem */}
        <motion.path
          d="M 100 155 Q 98 125 100 100"
          fill="none"
          stroke="url(#sproutStem)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Left Cotyledon Leaf */}
        <motion.g
          initial={{ scale: 0, rotate: -45, transformOrigin: '100px 100px' }}
          animate={{ scale: 1, rotate: isLonging ? -25 : -10 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        >
          <path
            d="M 100 100 C 70 80 50 100 100 110 Z"
            fill={isLonging ? '#A3E635' : '#22C55E'}
            stroke="#166534"
            strokeWidth="1.5"
          />
          {/* Leaf Vein */}
          <path d="M 100 100 Q 80 95 65 92" fill="none" stroke="#BBF7D0" strokeWidth="1" />
        </motion.g>

        {/* Right Cotyledon Leaf */}
        <motion.g
          initial={{ scale: 0, rotate: 45, transformOrigin: '100px 100px' }}
          animate={{ scale: 1, rotate: isLonging ? 25 : 10 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        >
          <path
            d="M 100 100 C 130 80 150 100 100 110 Z"
            fill={isLonging ? '#86EFAC' : '#4ADE80'}
            stroke="#166534"
            strokeWidth="1.5"
          />
          <path d="M 100 100 Q 120 95 135 92" fill="none" stroke="#DCFCE7" strokeWidth="1" />
        </motion.g>

        {/* Shimmering Morning Dewdrop */}
        <motion.circle
          cx="98"
          cy="92"
          r="4"
          fill="#38BDF8"
          opacity="0.9"
          animate={{ y: [0, 3, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};

// STAGE 2: 🌿 Stalk & Branches (ساقه و برگ‌های جوان)
export const StalkStageSVG: React.FC<{ mood?: string }> = ({ mood = 'thriving' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="stalkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        {/* Pot / Soil */}
        <path d="M 40 170 L 160 170 L 145 195 L 55 195 Z" fill="#92400E" stroke="#78350F" strokeWidth="2" />
        <ellipse cx="100" cy="170" rx="60" ry="8" fill="#B45309" />

        {/* Main Swaying Stalk */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 170px' }}
        >
          <path
            d="M 100 170 Q 95 130 100 80 Q 105 50 100 30"
            fill="none"
            stroke="url(#stalkGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Branch 1 Left */}
          <motion.path
            d="M 98 130 Q 70 120 50 125"
            fill="none"
            stroke="#15803D"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.ellipse
            cx="40"
            cy="125"
            rx="18"
            ry="10"
            fill="#4ADE80"
            stroke="#166534"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: -20 }}
            transition={{ delay: 0.5, type: 'spring' }}
          />

          {/* Branch 2 Right */}
          <motion.path
            d="M 100 100 Q 130 90 150 95"
            fill="none"
            stroke="#15803D"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.ellipse
            cx="160"
            cy="95"
            rx="20"
            ry="11"
            fill="#22C55E"
            stroke="#166534"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 25 }}
            transition={{ delay: 0.7, type: 'spring' }}
          />

          {/* Top Leaf Cluster */}
          <motion.ellipse
            cx="100"
            cy="25"
            rx="22"
            ry="12"
            fill="#86EFAC"
            stroke="#15803D"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, type: 'spring' }}
          />
        </motion.g>
      </svg>
    </div>
  );
};

// STAGE 3: 🌸 Blooming Bush (بوته شکوفا)
export const BloomingBushSVG: React.FC<{ mood?: string }> = ({ mood = 'thriving' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Pot */}
        <path d="M 45 160 L 155 160 L 140 195 L 60 195 Z" fill="#881337" stroke="#4C0519" strokeWidth="2" />
        <ellipse cx="100" cy="160" rx="55" ry="9" fill="#9F1239" />

        {/* Bush Foliage Cluster */}
        <motion.g
          animate={{ scale: [0.98, 1.02, 0.98] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <circle cx="80" cy="110" r="38" fill="#166534" />
          <circle cx="120" cy="110" r="38" fill="#15803D" />
          <circle cx="100" cy="85" r="42" fill="#22C55E" />
          <circle cx="75" cy="80" r="30" fill="#4ADE80" opacity="0.8" />
          <circle cx="125" cy="80" r="30" fill="#86EFAC" opacity="0.7" />
        </motion.g>

        {/* Blooming Flowers in Sequence */}
        {/* Flower 1 - Center */}
        <motion.g
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{ transformOrigin: '100px 75px' }}
        >
          <circle cx="100" cy="75" r="14" fill="#EC4899" />
          <circle cx="100" cy="75" r="10" fill="#F472B6" />
          <circle cx="100" cy="75" r="5" fill="#FDE047" />
        </motion.g>

        {/* Flower 2 - Left */}
        <motion.g
          initial={{ scale: 0, rotate: 90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring' }}
          style={{ transformOrigin: '65px 100px' }}
        >
          <circle cx="65" cy="100" r="12" fill="#A855F7" />
          <circle cx="65" cy="100" r="8" fill="#C084FC" />
          <circle cx="65" cy="100" r="4" fill="#FDE047" />
        </motion.g>

        {/* Flower 3 - Right */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          style={{ transformOrigin: '135px 100px' }}
        >
          <circle cx="135" cy="100" r="12" fill="#F43F5E" />
          <circle cx="135" cy="100" r="8" fill="#FB7185" />
          <circle cx="135" cy="100" r="4" fill="#FDE047" />
        </motion.g>
      </svg>
    </div>
  );
};

// STAGE 4: 🌳 Fruitful Tree (درخت بارور)
export const FruitTreeSVG: React.FC<{ mood?: string }> = ({ mood = 'thriving' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Sunbeam Aura */}
        <motion.circle
          cx="100"
          cy="75"
          r="70"
          fill="#FDE047"
          opacity="0.25"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        {/* Tree Trunk */}
        <path d="M 85 180 L 88 120 C 80 100 60 90 50 85 M 115 180 L 112 120 C 120 100 140 90 150 85" stroke="#78350F" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 92 180 C 95 130 95 100 100 80" stroke="#92400E" strokeWidth="18" strokeLinecap="round" fill="none" />

        {/* Rich Canopy */}
        <motion.g animate={{ scale: [0.99, 1.01, 0.99] }} transition={{ repeat: Infinity, duration: 4 }}>
          <circle cx="100" cy="70" r="50" fill="#15803D" />
          <circle cx="65" cy="80" r="38" fill="#166534" />
          <circle cx="135" cy="80" r="38" fill="#15803D" />
          <circle cx="100" cy="50" r="38" fill="#22C55E" />
        </motion.g>

        {/* Hanging Ripe Fruits with Swing Motion */}
        {[
          { cx: 70, cy: 75, delay: 0.2 },
          { cx: 125, cy: 75, delay: 0.4 },
          { cx: 95, cy: 95, delay: 0.6 },
          { cx: 105, cy: 45, delay: 0.8 },
        ].map((fruit, idx) => (
          <motion.g
            key={idx}
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 2.5 + idx * 0.3, ease: 'easeInOut' }}
            style={{ transformOrigin: `${fruit.cx}px ${fruit.cy - 10}px` }}
          >
            <circle cx={fruit.cx} cy={fruit.cy} r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            <circle cx={fruit.cx - 3} cy={fruit.cy - 3} r="3" fill="#FCA5A5" opacity="0.8" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

// STAGE 5: 👑 Golden Imperial Tree (درخت کهنسال امپراتوری و نورانی)
export const GoldenAncientTreeSVG: React.FC<{ mood?: string }> = ({ mood = 'thriving' }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]">
        <defs>
          <radialGradient id="goldAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FACC15" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Pulsing Radiant Cosmic Aura */}
        <motion.circle
          cx="100"
          cy="90"
          r="80"
          fill="url(#goldAura)"
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />

        {/* Orbiting Star Particle Ring */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
          style={{ transformOrigin: '100px 90px' }}
        >
          <circle cx="100" cy="15" r="4" fill="#FFFFFF" />
          <circle cx="175" cy="90" r="3" fill="#FDE047" />
          <circle cx="100" cy="165" r="4" fill="#E879F9" />
          <circle cx="25" cy="90" r="3" fill="#38BDF8" />
        </motion.g>

        {/* Golden Trunk */}
        <path d="M 80 185 L 88 120 Q 70 90 55 75 M 120 185 L 112 120 Q 130 90 145 75" stroke="#B45309" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 90 185 C 95 130 95 100 100 70" stroke="#F59E0B" strokeWidth="18" strokeLinecap="round" fill="none" />

        {/* Golden Crystal Canopy */}
        <motion.g animate={{ scale: [0.98, 1.02, 0.98] }} transition={{ repeat: Infinity, duration: 3 }}>
          <circle cx="100" cy="65" r="55" fill="#F59E0B" opacity="0.9" />
          <circle cx="60" cy="75" r="42" fill="#D97706" opacity="0.85" />
          <circle cx="140" cy="75" r="42" fill="#FBBF24" opacity="0.85" />
          <circle cx="100" cy="45" r="42" fill="#FDE047" opacity="0.95" />
        </motion.g>

        {/* Crown Crest */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <polygon points="100,10 112,30 88,30" fill="#FFFFFF" />
          <circle cx="100" cy="8" r="4" fill="#F43F5E" />
        </motion.g>
      </svg>
    </div>
  );
};

// MASTER COMPONENT: Selects the appropriate SVG and applies stage-switch Motion animations!
export const AnimatedPlantStageVisual: React.FC<PlantStageVisualProps> = ({
  stage,
  mood = 'thriving',
  size = 'md',
  showLabel = true,
  interactive = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-20 h-20';
      case 'md':
        return 'w-36 h-36';
      case 'lg':
        return 'w-52 h-52';
      case 'xl':
        return 'w-72 h-72 sm:w-80 sm:h-80';
    }
  };

  const getStageTitle = () => {
    switch (stage) {
      case 1:
        return '🌱 مرحله ۱: جوانه شاداب (Sprout)';
      case 2:
        return '🌿 مرحله ۲: ساقه و برگ جوان (Stalk)';
      case 3:
        return '🌸 مرحله ۳: بوته شکوفا (Blooming Bush)';
      case 4:
        return '🌳 مرحله ۴: درخت بارور (Fruitful Tree)';
      case 5:
        return '👑 مرحله ۵: امپراتوری طلایی (Ancient Golden Tree)';
      default:
        return '🌱 مرحله ۱';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 select-none">
      <div className={`relative ${getSizeClasses()} flex items-center justify-center`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.2, opacity: 0, rotate: 10 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 15 }}
            className="w-full h-full"
          >
            {stage === 1 && <SproutStageSVG mood={mood} />}
            {stage === 2 && <StalkStageSVG mood={mood} />}
            {stage === 3 && <BloomingBushSVG mood={mood} />}
            {stage === 4 && <FruitTreeSVG mood={mood} />}
            {stage >= 5 && <GoldenAncientTreeSVG mood={mood} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {showLabel && (
        <motion.div
          key={`label-${stage}`}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-purple-100 text-[#0F172A] border border-emerald-300/50 text-xs font-black shadow-xs inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>{getStageTitle()}</span>
          </span>
        </motion.div>
      )}
    </div>
  );
};
