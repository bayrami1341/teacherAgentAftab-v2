/**
 * RoshaVectorEngine v2.0
 * سوپر موتور تولید هندسه برداری پارامتریک و سایه‌زن متریال
 */
const RoshaVector = (function () {
  const SKINS = {
    sweet: {
      cardBg: '#fffdfa',
      cardStroke: '#e6dacb',
      accent: '#c85a32',
      accentLight: '#f49342',
      baseMaterial: '#f3cba4',
      itemFill: '#b34728',
      tally: '#3d2b1f',
      tallySlash: '#c85a32',
      filter: 'drop-sweet',
      unitType: 'dough'
    },
    station: {
      cardBg: '#f1f5f9',
      cardStroke: '#cbd5e1',
      accent: '#0284c7',
      accentLight: '#38bdf8',
      baseMaterial: '#475569',
      itemFill: '#0369a1',
      tally: '#334155',
      tallySlash: '#0284c7',
      filter: 'drop-station',
      unitType: 'cargo'
    },
    workshop: {
      cardBg: '#1e293b',
      cardStroke: '#475569',
      accent: '#f59e0b',
      accentLight: '#fbbf24',
      baseMaterial: '#334155',
      itemFill: '#d97706',
      tally: '#94a3b8',
      tallySlash: '#f59e0b',
      filter: 'drop-workshop',
      unitType: 'gear'
    },
    plain: {
      cardBg: '#0f172a',
      cardStroke: '#1e293b',
      accent: '#14b8a6',
      accentLight: '#2dd4bf',
      baseMaterial: '#1e293b',
      itemFill: '#0d9488',
      tally: '#64748b',
      tallySlash: '#14b8a6',
      filter: 'drop-plain',
      unitType: 'block'
    }
  };

  // تعبیه فیلترهای سایه‌زنی سه‌بعدی
  function getDefs() {
    return `
      <defs>
        <filter id="tactile-bevel" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000" flood-opacity="0.18"/>
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
          <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.8" specularExponent="16" lighting-color="#ffffff" result="spec">
            <fePointLight x="60" y="-30" z="100"/>
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="in" result="specOut"/>
          <feComposite in="SourceGraphic" in2="specOut" operator="over"/>
        </filter>
        <filter id="drop-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>
        </filter>
        <linearGradient id="metal-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
    `;
  }

  function wrapSvg(content) {
    return `<svg viewBox="0 0 120 156" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${getDefs()}${content}</svg>`;
  }

  // رسم یک دانه/واحد متریال متناسب با پوسته
  function renderUnit(cx, cy, r, skinKey, colorOverride = null) {
    const s = SKINS[skinKey] || SKINS.sweet;
    const fill = colorOverride || s.itemFill;

    if (s.unitType === 'dough') {
      return `
        <g filter="url(#drop-soft)">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />
          <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.3}" fill="#ffffff" opacity="0.45"/>
        </g>`;
    } else if (s.unitType === 'cargo') {
      const w = r * 1.8, h = r * 1.4;
      return `
        <g filter="url(#drop-soft)">
          <rect x="${cx - w/2}" y="${cy - h/2}" width="${w}" height="${h}" rx="2.5" fill="${fill}" stroke="#0f172a" stroke-width="1.2"/>
          <line x1="${cx - w/2}" y1="${cy}" x2="${cx + w/2}" y2="${cy}" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
        </g>`;
    } else if (s.unitType === 'gear') {
      return `
        <g filter="url(#tactile-bevel)">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${s.cardBg}" stroke-width="1.5"/>
          <circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="${s.cardBg}"/>
          <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${fill}" stroke-width="2"/>
          <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="${fill}" stroke-width="2"/>
        </g>`;
    } else {
      // plain / block
      const size = r * 1.7;
      return `
        <rect x="${cx - size/2}" y="${cy - size/2}" width="${size}" height="${size}" rx="2" fill="${fill}" stroke="${s.accentLight}" stroke-width="1.2" opacity="0.9"/>
      `;
    }
  }

  // ۱. سینی‌ها و بسته‌های دسته‌ای
  function renderContainers(groups, skinKey) {
    const s = SKINS[skinKey] || SKINS.sweet;
    const numGroups = groups.length;
    const maxItems = Math.max(...groups);
    const containerH = Math.min(38, 120 / numGroups);
    const gapY = (156 - (numGroups * containerH)) / (numGroups + 1);

    let svg = '';
    groups.forEach((count, idx) => {
      const y = gapY + idx * (containerH + gapY);
      svg += `<rect x="8" y="${y}" width="104" height="${containerH}" rx="8" fill="${s.cardBg}" stroke="${s.cardStroke}" stroke-width="2" filter="url(#tactile-bevel)"/>`;

      const gapX = Math.min(18, 90 / (count + 1));
      const startX = 60 - ((count - 1) * gapX) / 2;
      const radius = Math.min(6, (containerH - 12) / 2);

      for (let i = 0; i < count; i++) {
        svg += renderUnit(startX + i * gapX, y + containerH / 2, radius, skinKey);
      }
    });

    return wrapSvg(svg);
  }

  // ۲. چوب‌خط‌های ارگانیک
  function renderTallies(groups, skinKey) {
    const s = SKINS[skinKey] || SKINS.sweet;
    const numGroups = groups.length;
    const maxCount = Math.max(...groups);
    const groupW = 104 / numGroups;
    let svg = '';

    groups.forEach((count, gIdx) => {
      const gx = 8 + gIdx * groupW;
      const subGap = Math.min(6, (groupW - 12) / count);
      const startX = gx + (groupW - ((count - 1) * subGap)) / 2;

      for (let i = 0; i < count; i++) {
        const x = startX + i * subGap;
        svg += `<line x1="${x}" y1="36" x2="${x}" y2="120" stroke="${s.tally}" stroke-width="3" stroke-linecap="round" filter="url(#drop-soft)"/>`;
      }
      // خط اریب هم‌بند (تکمیل دسته)
      if (count >= 4) {
        svg += `<line x1="${startX - 4}" y1="112" x2="${startX + (count - 1) * subGap + 4}" y2="44" stroke="${s.tallySlash}" stroke-width="3.5" stroke-linecap="round"/>`;
      }
    });

    return wrapSvg(svg);
  }

  // ۳. رشته مهره‌ها / مهره‌های چرتکه‌ای
  function renderBeads(groups, skinKey) {
    const s = SKINS[skinKey] || SKINS.sweet;
    const numGroups = groups.length;
    const stepY = 120 / (numGroups + 1);
    let svg = '';

    groups.forEach((count, gIdx) => {
      const y = 18 + (gIdx + 1) * stepY;
      svg += `<line x1="16" y1="${y}" x2="104" y2="${y}" stroke="${s.cardStroke}" stroke-width="3" stroke-linecap="round"/>`;

      const gapX = Math.min(18, 76 / count);
      const startX = 60 - ((count - 1) * gapX) / 2;

      for (let i = 0; i < count; i++) {
        svg += renderUnit(startX + i * gapX, y, 6.5, skinKey);
      }
    });

    return wrapSvg(svg);
  }

  // ۴. ردیف پیوسته بی‌دسته (دهان‌جمع: ۳+۴=۷)
  function renderFlatRow(totalCount, skinKey) {
    const s = SKINS[skinKey] || SKINS.sweet;
    const gapX = Math.min(13, 96 / totalCount);
    const startX = 60 - ((totalCount - 1) * gapX) / 2;
    const radius = Math.min(5.5, gapX * 0.45);

    let svg = `<rect x="6" y="58" width="108" height="40" rx="20" fill="${s.cardBg}" stroke="${s.accent}" stroke-width="2" stroke-dasharray="4 2" filter="url(#tactile-bevel)"/>`;

    for (let i = 0; i < totalCount; i++) {
      svg += renderUnit(startX + i * gapX, 78, radius, skinKey, '#ef4444');
    }

    return wrapSvg(svg);
  }

  // ۵. شکستن توزیع‌پذیری (مرحله برج — پایه‌های کمکی ۵ و ۲)
  function renderSplitMatrix(factorA, factorB, partA1, partA2, skinKey) {
    const s = SKINS[skinKey] || SKINS.sweet;
    const stepY = 120 / factorA;
    const stepX = 86 / factorB;
    const startX = 60 - ((factorB - 1) * stepX) / 2;
    let svg = '';

    for (let r = 0; r < factorA; r++) {
      const y = 20 + r * stepY;
      const color = (r < partA1) ? s.accent : s.accentLight;
      for (let c = 0; c < factorB; c++) {
        const x = startX + c * stepX;
        svg += renderUnit(x, y, 5, skinKey, color);
      }
    }

    return wrapSvg(svg);
  }

  // ۶. سازنده قطعه ویترین (چوب، واگن، چرخ‌دنده، بلوک)
  function renderPiece(skinKey) {
    const s = SKINS[skinKey] || SKINS.sweet;
    if (s.unitType === 'dough') {
      return `
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <rect x="8" y="24" width="48" height="24" rx="10" fill="#f6d5a8" stroke="#c85a32" stroke-width="2"/>
          <circle cx="20" cy="36" r="3" fill="#b34728"/>
          <circle cx="32" cy="36" r="3" fill="#b34728"/>
          <circle cx="44" cy="36" r="3" fill="#b34728"/>
        </svg>`;
    } else if (s.unitType === 'cargo') {
      return `
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <rect x="6" y="20" width="52" height="28" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
          <line x1="6" y1="34" x2="58" y2="34" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3"/>
          <circle cx="16" cy="50" r="5" fill="#334155" stroke="#000" stroke-width="1.5"/>
          <circle cx="48" cy="50" r="5" fill="#334155" stroke="#000" stroke-width="1.5"/>
        </svg>`;
    } else if (s.unitType === 'gear') {
      return `
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <circle cx="32" cy="32" r="22" fill="#d97706" stroke="#fbbf24" stroke-width="2.5"/>
          <circle cx="32" cy="32" r="8" fill="#1e293b"/>
          <line x1="32" y1="6" x2="32" y2="58" stroke="#fbbf24" stroke-width="3"/>
          <line x1="6" y1="32" x2="58" y2="32" stroke="#fbbf24" stroke-width="3"/>
        </svg>`;
    } else {
      return `
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <rect x="10" y="16" width="44" height="32" rx="4" fill="#14b8a6" stroke="#2dd4bf" stroke-width="2"/>
          <line x1="10" y1="26" x2="54" y2="26" stroke="#0f172a" stroke-width="2"/>
          <circle cx="32" cy="38" r="4" fill="#0f172a"/>
        </svg>`;
    }
  }

  // ورودی عمومی رندر بر اساس نقش و تم
  function renderCardFace(cardData, skinKey) {
    const { kind, factorA, factorB, partA1, partA2, totalCount } = cardData;

    switch (kind) {
      case 'trays':
        const groupArr = Array(factorA).fill(factorB);
        return renderContainers(groupArr, skinKey);
      case 'tally':
        return renderTallies(Array(factorA).fill(factorB), skinKey);
      case 'beads':
        return renderBeads(Array(factorA).fill(factorB), skinKey);
      case 'row':
        return renderFlatRow(totalCount || (factorA + factorB), skinKey);
      case 'off':
        // یک دسته یکی کمتر (دهان شمارش)
        const offArr = Array(factorA).fill(factorB);
        offArr[offArr.length - 1] = Math.max(1, factorB - 1);
        return renderContainers(offArr, skinKey);
      case 'split':
        return renderSplitMatrix(factorA, factorB, partA1, partA2, skinKey);
      default:
        return renderContainers([factorB, factorB], skinKey);
    }
  }

  return {
    renderCardFace,
    renderPiece
  };
})();