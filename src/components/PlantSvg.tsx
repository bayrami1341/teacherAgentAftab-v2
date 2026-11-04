import React, { useId, useMemo } from 'react';
import { Mood, Stage, PotStyle, Plant } from '../types';

export type ActingState =
  | 'normal'
  | 'sleepy'
  | 'stretching'
  | 'yawning'
  | 'wide_smile'
  | 'celebrating'
  | 'water_refresh'
  | 'studying'
  | 'tucking_in';

interface PlantSvgProps {
  mood: Mood;
  stage: Stage;
  size?: number | string; // width/height
  actingState?: ActingState; // Character Acting expression & motion
  isBoardMode?: boolean;  // In board mode, longing/alert become soft muted aesthetic
  isArchive?: boolean;    // In seed bank, monochromatic nostalgic sepia/slate
  accessory?: Plant['accessory'];
  potStyle?: PotStyle;
  showParticles?: boolean;
  className?: string;
}

export const PlantSvg: React.FC<PlantSvgProps> = ({
  mood,
  stage,
  size = 120,
  actingState = 'normal',
  isBoardMode = false,
  isArchive = false,
  accessory = 'none',
  potStyle = 'terracotta',
  showParticles = true,
  className = '',
}) => {
  // Unique instance ID for gradients, clip-paths, and radial filters to eliminate cross-plant SVG collisions
  const rawId = useId();
  const uid = useMemo(() => rawId.replace(/[^a-zA-Z0-9-_]/g, ''), [rawId]);

  // Dynamic Head Y anchor based on growth stage
  const headY = stage <= 1 ? 66 : stage === 2 ? 55 : stage === 3 ? 45 : stage === 4 ? 38 : 34;
  const headRadius = stage <= 1 ? 14.5 : stage === 2 ? 16 : 17.5;

  // Horizontal head shift & tilt dependent on mood
  let headX = 60;
  let stemCtrlX = 57;
  let bodyTilt = 0;
  let bodyScale = 1;
  let animationClass = 'plant-breathe-content';

  if (isArchive) {
    animationClass = '';
  } else if (isBoardMode && (mood === 'longing' || mood === 'alert')) {
    bodyTilt = mood === 'longing' ? -4 : -8;
    headX = mood === 'longing' ? 57 : 54;
    stemCtrlX = mood === 'longing' ? 55 : 51;
    animationClass = mood === 'longing' ? 'plant-breathe-longing' : 'plant-breathe-alert';
  } else {
    switch (mood) {
      case 'thriving':
        headX = 60;
        stemCtrlX = 57;
        bodyScale = 1.05;
        bodyTilt = 0;
        animationClass = 'plant-breathe-thriving';
        break;
      case 'content':
        headX = 60;
        stemCtrlX = 57;
        bodyScale = 1.0;
        bodyTilt = 0;
        animationClass = 'plant-breathe-content';
        break;
      case 'longing':
        headX = 57;
        stemCtrlX = 55;
        bodyScale = 0.98;
        bodyTilt = -5;
        animationClass = 'plant-breathe-longing';
        break;
      case 'alert':
        headX = 54;
        stemCtrlX = 51;
        bodyScale = 0.95;
        bodyTilt = -10;
        animationClass = 'plant-breathe-alert';
        break;
    }

    // Acting State dynamic overrides
    if (actingState === 'stretching') {
      bodyScale = 1.14;
      bodyTilt = 0;
      animationClass = 'plant-act-stretch';
    } else if (actingState === 'yawning') {
      bodyScale = 1.08;
      bodyTilt = -2;
      animationClass = 'plant-act-yawn';
    } else if (actingState === 'celebrating') {
      bodyScale = stage === 1 ? 1.08 : stage === 2 ? 1.11 : stage === 3 ? 1.15 : stage === 4 ? 1.18 : 1.22;
      bodyTilt = 0;
      animationClass = `plant-bloom-stage-${stage}`;
    } else if (actingState === 'wide_smile') {
      bodyScale = 1.06;
      bodyTilt = 0;
      animationClass = 'plant-breathe-thriving';
    } else if (actingState === 'water_refresh') {
      bodyScale = 1.08;
      bodyTilt = 0;
      animationClass = 'plant-act-refresh';
    } else if (actingState === 'studying') {
      bodyScale = 1.10;
      bodyTilt = 0;
      animationClass = 'plant-act-study';
    } else if (actingState === 'tucking_in') {
      bodyScale = 0.96;
      bodyTilt = -6;
      animationClass = 'plant-act-tuck';
    } else if (actingState === 'sleepy') {
      bodyScale = 0.94;
      bodyTilt = -10;
      headX = 54;
      stemCtrlX = 51;
      animationClass = 'plant-breathe-alert';
    }
  }

  // Quantized Color Palette from the Gemini architectural specification
  const palette = useMemo(() => {
    if (isArchive) {
      return {
        main: '#9CA3AF',
        light: '#D1D5DB',
        dark: '#6B7280',
        stem: '#7F8796',
        soil: '#4B5563',
        blush: 'transparent',
        flowerPetal: '#E5E7EB',
        flowerCenter: '#9CA3AF',
      };
    }

    if (isBoardMode && (mood === 'longing' || mood === 'alert')) {
      return {
        main: '#9EAFA1',
        light: '#BDCABE',
        dark: '#7D8E80',
        stem: '#8C9D8F',
        soil: '#5D665E',
        blush: 'transparent',
        flowerPetal: '#E6EAE7',
        flowerCenter: '#A5B5A8',
      };
    }

    switch (mood) {
      case 'thriving':
        return {
          main: '#48CA84',
          light: '#95E3A8',
          dark: '#2B9348',
          stem: '#2F855A',
          soil: '#563D2D',
          blush: '#FF7B72',
          flowerPetal: '#FFF5B8',
          flowerCenter: '#F4A261',
        };
      case 'content':
        return {
          main: '#5BB784',
          light: '#A3DEBD',
          dark: '#3A8A5C',
          stem: '#3B7A54',
          soil: '#5E4433',
          blush: '#FFA07A',
          flowerPetal: '#FFFDF0',
          flowerCenter: '#E9C46A',
        };
      case 'longing':
        return {
          main: '#84C99D',
          light: '#BFE7D0',
          dark: '#569C70',
          stem: '#608E6F',
          soil: '#6E5544',
          blush: 'transparent',
          flowerPetal: '#F4EFE6',
          flowerCenter: '#D4B483',
        };
      case 'alert':
      default:
        return {
          main: '#A7CEB7',
          light: '#D3EAE0',
          dark: '#799E89',
          stem: '#7D9E8B',
          soil: '#7D6555',
          blush: 'transparent',
          flowerPetal: '#ECE8DF',
          flowerCenter: '#C4B79C',
        };
    }
  }, [mood, isArchive, isBoardMode]);

  // Pot styling data for the 4 distinctive cartoon pots + legacy fallbacks
  const potPalette = useMemo(() => {
    switch (potStyle) {
      case 'strawberry':
        return {
          rim: '#FF7582',
          bodyLight: '#FF5964',
          bodyDark: '#D90429',
          shadow: '#A0031E',
          type: 'strawberry',
        };
      case 'crystal':
        return {
          rim: '#90E0EF',
          bodyLight: '#4EA8DE',
          bodyDark: '#0077B6',
          shadow: '#03045E',
          type: 'crystal',
        };
      case 'cosmic':
        return {
          rim: '#9D4EDD',
          bodyLight: '#6A4C93',
          bodyDark: '#442B63',
          shadow: '#240046',
          type: 'cosmic',
        };
      case 'sage':
        return {
          rim: '#9AB89D',
          bodyLight: '#84A98C',
          bodyDark: '#52796F',
          shadow: '#354F52',
          type: 'plain',
        };
      case 'sand':
        return {
          rim: '#E9D8A6',
          bodyLight: '#EE9B00',
          bodyDark: '#CA6702',
          shadow: '#9B2226',
          type: 'plain',
        };
      case 'clay':
        return {
          rim: '#E09F67',
          bodyLight: '#D48148',
          bodyDark: '#B35E28',
          shadow: '#803D12',
          type: 'plain',
        };
      case 'terracotta':
      default:
        return {
          rim: '#FFAE80',
          bodyLight: '#E77843',
          bodyDark: '#C7632A',
          shadow: '#964215',
          type: 'terracotta',
        };
    }
  }, [potStyle]);

  // Stem midpoint for Bezier curve: P1 = (stemCtrlX, (96 + headY) / 2)
  const stemMidY = (96 + headY) / 2;

  return (
    <div
      role="img"
      aria-label={`گیاه مرحله ${stage} با حالت ${mood}`}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* LAYER 7 (Top Atmospheric): Ambient Golden Sparkles for Thriving */}
      {showParticles && mood === 'thriving' && !isArchive && !isBoardMode && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <span
            className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-[#F6D860] shadow-[0_0_8px_#F6D860]"
            style={{ animation: 'float-particles 3.2s ease-in-out infinite' }}
          />
          <span
            className="absolute top-6 left-3 w-1 h-1 rounded-full bg-[#FFE57F] shadow-[0_0_6px_#FFE57F]"
            style={{ animation: 'float-particles 4.5s ease-in-out infinite 1.5s' }}
          />
        </div>
      )}

      {/* LAYER 1 (Ground Reflection / Longing Aura): Soft peach glow around pot base */}
      {mood === 'longing' && !isArchive && !isBoardMode && (
        <div
          className="absolute -bottom-1 w-24 h-10 rounded-full blur-md pointer-events-none"
          style={{ background: 'rgba(232, 168, 124, 0.45)' }}
        />
      )}

      <svg
        viewBox="0 0 120 140"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          {/* Layer 0: Radial Halo Glow behind Head */}
          <radialGradient id={`halo-glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8F5D2" stopOpacity={mood === 'thriving' ? 0.75 : 0.4} />
            <stop offset="65%" stopColor="#E8F9ED" stopOpacity={mood === 'thriving' ? 0.35 : 0.15} />
            <stop offset="100%" stopColor="#FDFBF5" stopOpacity="0" />
          </radialGradient>

          {/* Layer 3: Head 3D Spherical Volume Gradient */}
          <radialGradient id={`grad-head-${uid}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="60%" stopColor={palette.main} />
            <stop offset="100%" stopColor={palette.dark} />
          </radialGradient>

          {/* Layer 2: Mathematical Stem Vertical Gradient */}
          <linearGradient id={`grad-stem-${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={palette.dark} />
            <stop offset="50%" stopColor={palette.stem} />
            <stop offset="100%" stopColor={palette.light} />
          </linearGradient>

          {/* Leaf Gradients with 3D Sunlight & Shadow */}
          <linearGradient id={`grad-leaf-l-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="70%" stopColor={palette.main} />
            <stop offset="100%" stopColor={palette.dark} />
          </linearGradient>

          <linearGradient id={`grad-leaf-r-${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="70%" stopColor={palette.main} />
            <stop offset="100%" stopColor={palette.dark} />
          </linearGradient>

          {/* Layer 5: Distinctive Pot Gradients */}
          <linearGradient id={`grad-pot-body-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={potPalette.bodyDark} />
            <stop offset="35%" stopColor={potPalette.bodyLight} />
            <stop offset="85%" stopColor={potPalette.bodyDark} />
            <stop offset="100%" stopColor={potPalette.shadow} />
          </linearGradient>

          <linearGradient id={`grad-pot-rim-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={potPalette.bodyDark} />
            <stop offset="40%" stopColor={potPalette.rim} />
            <stop offset="100%" stopColor={potPalette.shadow} />
          </linearGradient>

          {/* Soil Gradient */}
          <linearGradient id={`grad-soil-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2E1C12" />
            <stop offset="100%" stopColor={palette.soil} />
          </linearGradient>

          {/* Layer 4: Stage 5 Blooming Flower Petal Gradient */}
          <radialGradient id={`grad-petal-${uid}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFEE8" />
            <stop offset="55%" stopColor={palette.flowerPetal} />
            <stop offset="100%" stopColor={palette.flowerCenter} />
          </radialGradient>
        </defs>

        {/* ==================== LAYER 0: HALO GLOW ==================== */}
        {(mood === 'thriving' || stage === 5) && !isArchive && !isBoardMode && (
          <circle
            cx={headX}
            cy={headY}
            r="44"
            fill={`url(#halo-glow-${uid})`}
            className={`pointer-events-none ${actingState === 'celebrating' && stage === 5 ? 'solar-halo-anim' : ''}`}
          />
        )}

        {/* ==================== LAYER 1: CONTACT SHADOW ==================== */}
        <ellipse cx="60" cy="132" rx="30" ry="5.5" fill="#3D5A2B" opacity="0.18" />

        {/* Longing Mood: Wistful Dotted Ring around base */}
        {mood === 'longing' && !isArchive && (
          <ellipse
            cx="60"
            cy="114"
            rx="38"
            ry="20"
            fill="none"
            stroke="#E8A87C"
            strokeWidth="3.2"
            strokeDasharray="6 4"
            opacity="0.38"
          />
        )}

        {/* Longing Cloud hovering gently above */}
        {mood === 'longing' && !isArchive && (
          <g className="longing-cloud-anim" transform="translate(74, 8)">
            <path
              d="M10 16 H26 A6 6 0 0 0 27 4 A8 8 0 0 0 12 2 A6 6 0 0 0 10 16 Z"
              fill="#E8A87C"
              opacity="0.35"
            />
            <circle cx="15" cy="21" r="2" fill="#E8A87C" opacity="0.4" />
          </g>
        )}

        {/* ==================== PLANT BODY WITH KINEMATICS ==================== */}
        <g
          className={animationClass}
          style={{
            transformOrigin: '50% 95%',
            transformBox: 'view-box',
          }}
        >
          <g
            transform={`translate(60, 96) rotate(${bodyTilt}) scale(${bodyScale}) translate(-60, -96)`}
            style={{ transformOrigin: '60px 96px', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* ================= LAYER 2: BEZIER STEM & REAR LEAVES ================= */}
            {/* Dynamic Quadratic Bezier Stem: P0=(60, 96), P1=(stemCtrlX, stemMidY), P2=(headX, headY+10) */}
            <path
              d={`M 60 96 Q ${stemCtrlX} ${stemMidY} ${headX} ${headY + 10}`}
              stroke={`url(#grad-stem-${uid})`}
              strokeWidth={stage >= 4 ? 6.5 : 5.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* STAGE 1: Seed Sprout cotyledons peeking from soil */}
            {stage === 1 && (
              <g>
                <ellipse cx="60" cy="98" rx="8" ry="6" fill="#6B4B31" />
                <ellipse cx="58" cy="96" rx="6" ry="4.5" fill="#8B6343" />
                {/* Baby leaves unfolding */}
                <path
                  d="M60 88 C54 80 44 82 46 90 C48 95 58 92 60 88 Z"
                  fill={`url(#grad-leaf-l-${uid})`}
                />
                <path
                  d="M60 88 C66 80 76 82 74 90 C72 95 62 92 60 88 Z"
                  fill={`url(#grad-leaf-r-${uid})`}
                />
              </g>
            )}

            {/* STAGE 2: Twin Leaf Sprout with Asymmetric Wind Sway */}
            {stage === 2 && (
              <g>
                {/* Left Leaf with explicit transform-origin */}
                <g className="leaf-sway-l">
                  <path
                    d={`M 59 83 C 34 73 28 56 42 50 C 51 46 58 68 59 83 Z`}
                    fill={`url(#grad-leaf-l-${uid})`}
                  />
                  <path d="M 57 79 Q 47 68 42 55" stroke={palette.light} strokeWidth="1.2" fill="none" opacity="0.75" />
                </g>

                {/* Right Leaf with explicit transform-origin */}
                <g className="leaf-sway-r">
                  <path
                    d={`M 60 77 C 82 66 88 49 76 44 C 67 40 62 64 60 77 Z`}
                    fill={`url(#grad-leaf-r-${uid})`}
                  />
                  <path d="M 61 74 Q 71 63 74 50" stroke={palette.light} strokeWidth="1.2" fill="none" opacity="0.75" />
                </g>
              </g>
            )}

            {/* STAGE 3: Young Lush Sapling (4 leafy fans) */}
            {stage === 3 && (
              <g>
                {/* Lower Left Leaf */}
                <g className="leaf-sway-l">
                  <path
                    d="M 59 85 C 32 80 24 62 36 54 C 46 48 56 72 59 85 Z"
                    fill={`url(#grad-leaf-l-${uid})`}
                  />
                  <path d="M 56 81 Q 42 70 35 58" stroke={palette.light} strokeWidth="1.2" fill="none" opacity="0.75" />
                </g>

                {/* Lower Right Leaf */}
                <g className="leaf-sway-r">
                  <path
                    d="M 61 80 C 85 74 92 56 81 48 C 72 41 63 67 61 80 Z"
                    fill={`url(#grad-leaf-r-${uid})`}
                  />
                  <path d="M 63 76 Q 76 64 80 52" stroke={palette.light} strokeWidth="1.2" fill="none" opacity="0.75" />
                </g>

                {/* Upper Left Leaf */}
                <path
                  d="M 59 66 C 40 52 38 36 48 31 C 57 27 59 52 59 66 Z"
                  fill={`url(#grad-leaf-l-${uid})`}
                  opacity="0.9"
                />

                {/* Upper Right Leaf */}
                <path
                  d="M 61 62 C 80 48 82 32 72 28 C 62 25 61 49 61 62 Z"
                  fill={`url(#grad-leaf-r-${uid})`}
                  opacity="0.9"
                />
              </g>
            )}

            {/* STAGE 4: Lush Bushy Foliage with Deep 3D Layers */}
            {stage === 4 && (
              <g>
                {/* Deep Rear Shadow Leaves */}
                <path d="M 58 52 C 38 38 40 20 52 18 C 62 16 60 38 58 52 Z" fill={palette.dark} opacity="0.8" />
                <path d="M 62 48 C 80 34 80 18 69 16 C 59 15 60 38 62 48 Z" fill={palette.dark} opacity="0.8" />

                {/* Mid-tier Large Leaves */}
                <g className="leaf-sway-l">
                  <path
                    d="M 58 90 C 28 88 18 66 30 56 C 42 46 54 74 58 90 Z"
                    fill={`url(#grad-leaf-l-${uid})`}
                  />
                  <path d="M 55 86 Q 38 72 30 60" stroke={palette.light} strokeWidth="1.4" fill="none" opacity="0.75" />
                </g>

                <g className="leaf-sway-r">
                  <path
                    d="M 62 82 C 90 78 98 56 86 46 C 75 38 64 68 62 82 Z"
                    fill={`url(#grad-leaf-r-${uid})`}
                  />
                  <path d="M 64 78 Q 78 64 84 50" stroke={palette.light} strokeWidth="1.4" fill="none" opacity="0.75" />
                </g>

                {/* Upper Foliage */}
                <path
                  d="M 59 67 C 32 56 28 36 43 29 C 55 24 58 52 59 67 Z"
                  fill={`url(#grad-leaf-l-${uid})`}
                />
                <path
                  d="M 61 61 C 88 50 89 28 75 24 C 63 21 61 47 61 61 Z"
                  fill={`url(#grad-leaf-r-${uid})`}
                />
              </g>
            )}

            {/* STAGE 5: Majestic Flora with Crown Foliage */}
            {stage === 5 && (
              <g>
                {/* Lush Background Foliage */}
                <g className="leaf-sway-l">
                  <path
                    d="M 58 90 C 26 88 16 68 28 56 C 40 45 54 74 58 90 Z"
                    fill={`url(#grad-leaf-l-${uid})`}
                  />
                </g>
                <g className="leaf-sway-r">
                  <path
                    d="M 62 84 C 92 80 100 58 88 47 C 76 38 64 70 62 84 Z"
                    fill={`url(#grad-leaf-r-${uid})`}
                  />
                </g>
                <path
                  d="M 59 68 C 30 58 26 38 42 32 C 55 27 58 54 59 68 Z"
                  fill={`url(#grad-leaf-l-${uid})`}
                />
                <path
                  d="M 61 64 C 90 52 92 32 78 28 C 65 24 61 49 61 64 Z"
                  fill={`url(#grad-leaf-r-${uid})`}
                />

                {/* Blooming Petals around Floral Head */}
                <g className={actingState === 'celebrating' ? 'petal-bloom-anim' : ''} transform={`translate(${headX}, ${headY})`}>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <ellipse
                      key={angle}
                      cx="0"
                      cy="-22"
                      rx="7.5"
                      ry="11.5"
                      fill={`url(#grad-petal-${uid})`}
                      stroke={palette.flowerCenter}
                      strokeWidth="1"
                      transform={`rotate(${angle})`}
                    />
                  ))}
                </g>
              </g>
            )}

            {/* ================= LAYER 3: PLANT HEAD & CHIBI FACE ================= */}
            <g transform={`translate(${headX}, ${headY})`}>
              {/* Spherical Head Volume */}
              <circle
                cx="0"
                cy="0"
                r={headRadius}
                fill={`url(#grad-head-${uid})`}
              />

              {/* 3D Bubble Specular Arc Highlight (Pixar-like volumetric sheen) */}
              <path
                d="M -11 -4 A 13 13 0 0 1 5 -12"
                stroke="#FFFFFF"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.65"
              />
              <circle cx="-9" cy="-9" r="2.2" fill="#FFFFFF" opacity="0.9" />

              {/* Rosy Cheeks */}
              {palette.blush !== 'transparent' && (
                <>
                  <ellipse cx="-10" cy="3.5" rx="3.4" ry="2.2" fill={palette.blush} opacity={0.65} />
                  <ellipse cx="10" cy="3.5" rx="3.4" ry="2.2" fill={palette.blush} opacity={0.65} />
                </>
              )}

              {/* Facial Expression Rendering with Double-Glint Eyes & 3-Part Mouth */}
              {renderFacialFeatures(mood, actingState)}

              {/* Top Bud Crest for Stage 1 */}
              {stage <= 1 && (
                <g transform="translate(0, -14)">
                  <path d="M0 4 Q-12 -8 -4 -14 Q4 -8 0 4 Z" fill={palette.light} />
                  <path d="M0 4 Q12 -8 4 -14 Q-4 -8 0 4 Z" fill={palette.main} />
                </g>
              )}
            </g>

            {/* ================= LAYER 6: ACCESSORIES ================= */}
            {accessory === 'ladybug' && (
              <g transform="translate(42, 68) rotate(-20) scale(1.1)">
                <ellipse cx="0" cy="0" rx="5" ry="4" fill="#E63946" />
                <path d="M0 -4 L0 4" stroke="#1D2A44" strokeWidth="0.8" />
                <circle cx="3.8" cy="0" r="2" fill="#1D2A44" />
                <circle cx="-1.5" cy="-1.5" r="0.9" fill="#1D2A44" />
                <circle cx="1.5" cy="1.5" r="0.9" fill="#1D2A44" />
              </g>
            )}

            {accessory === 'dewdrop' && (
              <g transform="translate(78, 52)">
                <path
                  d="M0 -5 C3 -2 4 1 4 4 C4 6 2 8 0 8 C-2 8 -4 6 -4 4 C-4 1 -3 -2 0 -5 Z"
                  fill="#90E0EF"
                  opacity="0.9"
                />
                <circle cx="-1.2" cy="2" r="1.2" fill="#FFFFFF" opacity="0.95" />
              </g>
            )}

            {accessory === 'ribbon' && (
              <g transform={`translate(${headX + 11}, ${headY - 12}) rotate(20)`}>
                <path d="M0 0 L-8 -6 L-8 6 Z" fill="#F28482" />
                <path d="M0 0 L8 -6 L8 6 Z" fill="#F28482" />
                <circle cx="0" cy="0" r="2.6" fill="#D90429" />
              </g>
            )}

            {accessory === 'flower' && (
              <g transform={`translate(${headX - 12}, ${headY - 12})`}>
                <circle cx="-4" cy="0" r="3" fill="#FFF" />
                <circle cx="4" cy="0" r="3" fill="#FFF" />
                <circle cx="0" cy="-4" r="3" fill="#FFF" />
                <circle cx="0" cy="4" r="3" fill="#FFF" />
                <circle cx="0" cy="0" r="2.8" fill="#F4A261" />
              </g>
            )}

            {accessory === 'strawhat' && (
              <g transform={`translate(${headX}, ${headY - 14}) rotate(-4)`}>
                {/* Woven Straw Brim */}
                <ellipse cx="0" cy="2" rx="15" ry="4.5" fill="#E9C46A" stroke="#C69234" strokeWidth="0.8" />
                {/* Straw Dome */}
                <path d="M -8 1 Q 0 -9 8 1 Z" fill="#F4A261" stroke="#C69234" strokeWidth="0.8" />
                {/* Red Contrast Ribbon Band */}
                <path d="M -7.5 1 Q 0 -1 7.5 1" stroke="#E76F51" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            )}
          </g>
        </g>

        {/* ==================== LAYER 5: DISTINCTIVE POT BODY ==================== */}
        <g>
          {/* Soil Surface Oval */}
          <ellipse cx="60" cy="95" rx="25" ry="5.8" fill={`url(#grad-soil-${uid})`} />

          {/* Pot Main Body (Conical shell) */}
          <path
            d="M 34 95 L 40 126 Q 60 132 80 126 L 86 95 Z"
            fill={`url(#grad-pot-body-${uid})`}
          />

          {/* Pot Specular Left Highlight Curve */}
          <path
            d="M 36 96 L 41 125 C 45 126 50 126 51 126 L 45 96 Z"
            fill="#FFFFFF"
            opacity="0.14"
          />

          {/* Pot Ambient Right Shade */}
          <path
            d="M 84 96 L 79 125 C 75 126 71 126 70 126 L 75 96 Z"
            fill="#000000"
            opacity="0.18"
          />

          {/* Pot Raised Rim */}
          <rect
            x="31"
            y="88"
            width="58"
            height="9"
            rx="4.5"
            fill={`url(#grad-pot-rim-${uid})`}
            stroke={potPalette.shadow}
            strokeWidth="0.8"
          />

          {/* 1) TERRACOTTA SMILING FACE ON POT WALL */}
          {potPalette.type === 'terracotta' && (
            <g transform="translate(60, 112)">
              <circle cx="-4.5" cy="-1.5" r="1.3" fill="#6E3211" />
              <circle cx="4.5" cy="-1.5" r="1.3" fill="#6E3211" />
              <path
                d="M -3 1.8 Q 0 4.2 3 1.8"
                stroke="#6E3211"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* 2) STRAWBERRY DOTTED GOLDEN SEEDS WITH ROTATION */}
          {potPalette.type === 'strawberry' && (
            <g>
              <ellipse cx="48" cy="106" rx="1.5" ry="2.6" fill="#FFE57F" transform="rotate(-15 48 106)" />
              <ellipse cx="60" cy="107" rx="1.5" ry="2.6" fill="#FFE57F" />
              <ellipse cx="72" cy="106" rx="1.5" ry="2.6" fill="#FFE57F" transform="rotate(15 72 106)" />
              <ellipse cx="53" cy="117" rx="1.4" ry="2.4" fill="#FFE57F" transform="rotate(-10 53 117)" />
              <ellipse cx="67" cy="117" rx="1.4" ry="2.4" fill="#FFE57F" transform="rotate(10 67 117)" />
            </g>
          )}

          {/* 3) CRYSTAL WATER REFLECTION DIAMONDS */}
          {potPalette.type === 'crystal' && (
            <g>
              <path
                d="M 43 96 L 47 125 L 51 125 L 47 96 Z"
                fill="#FFFFFF"
                opacity="0.38"
              />
              <path
                d="M 68 96 L 70 125 L 72 125 L 70 96 Z"
                fill="#FFFFFF"
                opacity="0.22"
              />
              {/* Diamond Glint */}
              <polygon points="58,110 60,107 62,110 60,113" fill="#FFFFFF" opacity="0.9" />
              <polygon points="66,118 67.5,116 69,118 67.5,120" fill="#FFFFFF" opacity="0.8" />
            </g>
          )}

          {/* 4) COSMIC NIGHT PHOSPHORESCENT STARS */}
          {potPalette.type === 'cosmic' && (
            <g>
              {/* Star 1 */}
              <path
                d="M 50 110 Q 50 113 47 113 Q 50 113 50 116 Q 50 113 53 113 Q 50 113 50 110 Z"
                fill="#FFE66D"
              />
              {/* Star 2 */}
              <path
                d="M 68 114 Q 68 116.5 66 116.5 Q 68 116.5 68 119 Q 68 116.5 70 116.5 Q 68 116.5 68 114 Z"
                fill="#FFE66D"
              />
              {/* Micro Nebula Dust */}
              <circle cx="58" cy="107" r="0.9" fill="#FFB703" opacity="0.85" />
              <circle cx="63" cy="122" r="0.8" fill="#FFB703" opacity="0.85" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

/**
 * Helper to render expressive Double-Glint Cartoon Eyes and 3-Part Animated Mouth
 */
function renderFacialFeatures(mood: Mood, actingState: ActingState) {
  // 1. CHARACTER ACTING OVERRIDES
  if (actingState === 'yawning') {
    return (
      <g>
        {/* Squinting sleepy eyes (> <) */}
        <path
          d="M -9 -3.5 L -5 -2 L -9 -0.5"
          stroke="#1D2A44"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 9 -3.5 L 5 -2 L 9 -0.5"
          stroke="#1D2A44"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Adorable open O-mouth yawn with pink tongue */}
        <ellipse cx="0" cy="5.5" rx="3.2" ry="4.2" fill="#5F2723" stroke="#1D2A44" strokeWidth="0.9" />
        <ellipse cx="0" cy="7.2" rx="2.2" ry="1.6" fill="#FF8FA3" />
      </g>
    );
  }

  if (actingState === 'stretching') {
    return (
      <g>
        {/* Upward curved happy eyes (^_^) */}
        <path
          d="M -8.5 -1 Q -6 -4.5 -3.5 -1"
          stroke="#1D2A44"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 3.5 -1 Q 6 -4.5 8.5 -1"
          stroke="#1D2A44"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Warm content smile */}
        <path
          d="M -3.5 4.8 Q 0 7.8 3.5 4.8"
          stroke="#1D2A44"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  if (actingState === 'celebrating' || actingState === 'wide_smile') {
    return (
      <g>
        {/* Big sparkling eyes with double catchlights */}
        <g className="cartoon-eyes">
          <ellipse cx="-6" cy="-2" rx="3.6" ry="4.5" fill="#1D2A44" />
          <circle cx="-7.2" cy="-3.6" r="1.7" fill="#FFFFFF" />
          <circle cx="-4.8" cy="-0.6" r="0.9" fill="#FFFFFF" />

          <ellipse cx="6" cy="-2" rx="3.6" ry="4.5" fill="#1D2A44" />
          <circle cx="4.8" cy="-3.6" r="1.7" fill="#FFFFFF" />
          <circle cx="7.2" cy="-0.6" r="0.9" fill="#FFFFFF" />
        </g>
        {/* Wide joyful laughing smile with pink tongue */}
        <path
          d="M -5.5 3.5 Q 0 10.5 5.5 3.5 Z"
          fill="#D90429"
        />
        <path
          d="M -2.5 7.5 Q 0 5.8 2.5 7.5 Z"
          fill="#FF8FA3"
        />
        <path
          d="M -6 3.5 Q 0 11 6 3.5"
          stroke="#1D2A44"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  // Differentiated Facial Feature: Water Refresh (Dewy happy smile)
  if (actingState === 'water_refresh') {
    return (
      <g>
        {/* Playful wink / dewy joyful curved eyes */}
        <path
          d="M -9 -2 Q -6 -5 -3 -2"
          stroke="#1D2A44"
          strokeWidth="2.0"
          strokeLinecap="round"
          fill="none"
        />
        <g className="cartoon-eyes">
          <ellipse cx="6" cy="-2" rx="3.8" ry="4.4" fill="#1D2A44" />
          <circle cx="5" cy="-3.6" r="1.6" fill="#FFFFFF" />
          <circle cx="7.2" cy="-0.6" r="0.8" fill="#FFFFFF" />
        </g>
        {/* Refreshing satisfied smile with rosy cheeks */}
        <path
          d="M -4.5 3.8 Q 0 8.5 4.5 3.8"
          stroke="#1D2A44"
          strokeWidth="1.9"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tiny water droplet on forehead */}
        <circle cx="0" cy="-10" r="1.5" fill="#90E0EF" opacity="0.9" />
      </g>
    );
  }

  // Differentiated Facial Feature: Studying / Homework (Insightful starry eyes)
  if (actingState === 'studying') {
    return (
      <g>
        {/* Focused, brilliant, inspired cartoon eyes */}
        <ellipse cx="-6" cy="-2" rx="3.8" ry="4.6" fill="#1D2A44" />
        {/* Star highlight in eye */}
        <circle cx="-6" cy="-2" r="1.6" fill="#FFF7ED" />
        <circle cx="-4.5" cy="-0.2" r="0.8" fill="#FFFFFF" />

        <ellipse cx="6" cy="-2" rx="3.8" ry="4.6" fill="#1D2A44" />
        <circle cx="6" cy="-2" r="1.6" fill="#FFF7ED" />
        <circle cx="7.5" cy="-0.2" r="0.8" fill="#FFFFFF" />

        {/* Confident proud little smile */}
        <path
          d="M -4 4 Q 0 7.5 4 4"
          stroke="#1D2A44"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Little spark of thought above head */}
        <text x="0" y="-12" textAnchor="middle" fontSize="9" fill="#F59E0B">✦</text>
      </g>
    );
  }

  // Differentiated Facial Feature: Bedtime Tuck-in (Sleepy cuddled peaceful smile)
  if (actingState === 'tucking_in') {
    return (
      <g>
        {/* Gentle peaceful sleeping crescent eyes (u u) */}
        <path
          d="M -8.5 -1 Q -6 2.5 -3.5 -1"
          stroke="#1D2A44"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 3.5 -1 Q 6 2.5 8.5 -1"
          stroke="#1D2A44"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Serene soft dream smile */}
        <path
          d="M -3 4.5 Q 0 6.5 3 4.5"
          stroke="#1D2A44"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Floating tiny 'z' of sleep */}
        <text x="9" y="-8" fontSize="8" fill="#818CF8" fontWeight="bold" opacity="0.85">z</text>
      </g>
    );
  }

  if (actingState === 'sleepy' || mood === 'alert') {
    return (
      <g>
        {/* Gentle closed crescent sleepy eyes */}
        <path
          d="M -8.5 -1 Q -6 1.8 -3.5 -1"
          stroke="#2A3B2B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 3.5 -1 Q 6 1.8 8.5 -1"
          stroke="#2A3B2B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Quiet waiting mouth */}
        <path
          d="M -2.5 5.5 Q 0 4.2 2.5 5.5"
          stroke="#2A3B2B"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  // 2. DEFAULT MOOD: THRIVING / CONTENT (DOUBLE-GLINT EYES + 3-PART MOUTH)
  if (mood === 'thriving') {
    return (
      <g>
        {/* Double-Glint Cartoon Eyes with 4.2s natural blink cadence */}
        <g className="cartoon-eyes">
          <ellipse cx="-6" cy="-2" rx="3.6" ry="4.5" fill="#1D2A44" />
          <circle cx="-7.2" cy="-3.6" r="1.6" fill="#FFFFFF" />
          <circle cx="-4.8" cy="-0.6" r="0.8" fill="#FFFFFF" />

          <ellipse cx="6" cy="-2" rx="3.6" ry="4.5" fill="#1D2A44" />
          <circle cx="4.8" cy="-3.6" r="1.6" fill="#FFFFFF" />
          <circle cx="7.2" cy="-0.6" r="0.8" fill="#FFFFFF" />
        </g>

        {/* 3-Part Cartoon Mouth (Dark cavity + Pink tongue + Upper lip contour) */}
        <g transform="translate(0, 4.5)">
          <path d="M -5 0 Q 0 6.5 5 0 Z" fill="#D90429" />
          <path d="M -2 3.8 Q 0 2 2 3.8 Z" fill="#FF8FA3" />
          <path d="M -5.5 0 Q 0 7 5.5 0" stroke="#1D2A44" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }

  if (mood === 'content') {
    return (
      <g>
        {/* Peaceful crescent smiling eyes (^_^) */}
        <path
          d="M -8.5 0 Q -6 -3.5 -3.5 0"
          stroke="#1D2A44"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 3.5 0 Q 6 -3.5 8.5 0"
          stroke="#1D2A44"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Sweet contented smile */}
        <path
          d="M -3.8 4.8 Q 0 7.8 3.8 4.8"
          stroke="#1D2A44"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  // 3. LONGING MOOD: WISTFUL EYES & SWEET WAITING MOUTH
  return (
    <g>
      <g className="cartoon-eyes">
        <ellipse cx="-6" cy="-1.5" rx="3.2" ry="4" fill="#243324" />
        <circle cx="-6.8" cy="-2.8" r="1.4" fill="#FFFFFF" />
        <circle cx="-4.8" cy="-0.5" r="0.7" fill="#FFFFFF" />

        <ellipse cx="6" cy="-1.5" rx="3.2" ry="4" fill="#243324" />
        <circle cx="5.2" cy="-2.8" r="1.4" fill="#FFFFFF" />
        <circle cx="7.2" cy="-0.5" r="0.7" fill="#FFFFFF" />
      </g>
      {/* Sweet quiet longing mouth */}
      <ellipse cx="0" cy="5.5" rx="2.2" ry="1.4" fill="#5F755F" />
    </g>
  );
}
