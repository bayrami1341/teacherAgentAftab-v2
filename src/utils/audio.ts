/**
 * Offline WebAudio Sound Synthesizer for Javaneh
 * 100% Client-side and offline safe. No external audio files required.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft organic harp / wind chime when clicking a plant
  public playPlantClick(frequency = 440) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.42);
  }

  // Warm gentle chime when drawer opens
  public playDrawerOpen() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [329.63, 392.0, 523.25]; // E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.52);
    });
  }

  // Soft water drop sound for care / teacher gentle whisper
  public playCareDrop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  }

  // Soothing bell when toggling board mode
  public playBoardChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz love/peace frequency

    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.82);
  }

  // Cute yawning sound: soft sweet slide
  public playYawn() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.25);
    osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.55);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.62);
  }

  // Rising stretch sound
  public playStretch() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.42);
  }

  // Tone synthesis with ADSR envelope
  public tone(freq: number, delay = 0, dur = 0.18, type: OscillatorType = 'sine', vol = 0.12) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + dur + 0.02);
    } catch {
      // Audio policies / silent fail
    }
  }

  // Major triad chord for habit completion (C5, E5, G5)
  public playHabitSuccess() {
    this.tone(523.25, 0.00, 0.16, 'sine', 0.12);
    this.tone(659.25, 0.09, 0.18, 'sine', 0.12);
    this.tone(783.99, 0.18, 0.28, 'triangle', 0.14);
  }

  // Morning / Wake-up melody ascending arpeggio (A4, C#5, E5, A5)
  public playWakeUpMelody() {
    this.tone(440.00, 0.00, 0.15, 'triangle', 0.10);
    this.tone(554.37, 0.10, 0.15, 'triangle', 0.12);
    this.tone(659.25, 0.20, 0.20, 'triangle', 0.13);
    this.tone(880.00, 0.32, 0.35, 'sine', 0.15);
  }

  // Joyful harmonic celebratory chord at apex
  public playJoyfulChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.62);
    });
  }

  // Gentle plucked note for retry or hint
  public playGentlePluck(frequency = 330) {
    if (this.isMuted) return;
    this.tone(frequency, 0, 0.22, 'sine', 0.09);
  }

  // Differentiated Sound 1: Water Splash & Dewdrops for Brush & Watering Habit (🪥 مسواک و آبیاری)
  public playWaterSplash() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Sweet ascending water droplet bubbles
    const bubbleFreqs = [620, 840, 1120, 1400];
    bubbleFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startT = ctx.currentTime + idx * 0.07;
      osc.frequency.setValueAtTime(freq * 0.8, startT);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, startT + 0.08);

      gain.gain.setValueAtTime(0.001, startT);
      gain.gain.linearRampToValueAtTime(0.10, startT + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.20);
    });
  }

  // Differentiated Sound 2: Bright Wisdom & Inspiration Chime for Homework Habit (✏️ مشق و تمرین درسی)
  public playStudyInspiration() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Bright intellectual discovery arpeggio: F#5, A#5, C#6, F#6
    const notes = [739.99, 932.33, 1108.73, 1479.98];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const startT = ctx.currentTime + idx * 0.075;
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.001, startT);
      gain.gain.linearRampToValueAtTime(0.11, startT + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.45);
    });
  }

  // Differentiated Sound 3: Soft Calming Music-Box Lullaby for Bedtime Habit (🌙 خواب و استراحت)
  public playBedtimeLullaby() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Soothing gentle descending music-box tones: G5, E5, D5, C5
    const notes = [783.99, 659.25, 587.33, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startT = ctx.currentTime + idx * 0.14;
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.001, startT);
      gain.gain.linearRampToValueAtTime(0.09, startT + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.58);
    });
  }

  // Battery Energy Charge sound (⚡ نماد شارژ باتری)
  public playBatteryCharge(count: number) {
    if (this.isMuted) return;
    if (count >= 4) {
      // 100% full battery fanfare
      this.playJoyfulChime();
    } else {
      // Ascending electric power-up chirp
      const base = 400 + count * 80;
      this.tone(base, 0.00, 0.09, 'sine', 0.10);
      this.tone(base * 1.33, 0.06, 0.12, 'triangle', 0.12);
    }
  }

  /**
   * High-tactile wooden acoustic knock / tap synthesis (تَقِ چوبی طبیعی)
   * Models the physical impact on seasoned wood / resonant hollow chamber:
   * - Ultra-fast attack (1ms)
   * - Downward pitch drop (strike transient)
   * - Exponential envelope decay
   * - Secondary subtle cavity overtone
   * - Tactile haptic vibration if supported by device
   */
  public playWoodTap(
    freq = 320,
    delay = 0,
    dur = 0.07,
    vol = 0.11,
    type: OscillatorType = 'triangle',
    pitchDropRatio = 0.42
  ) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const startTime = ctx.currentTime + delay;

      // 1. Primary body oscillator (wood block fundamental with downward frequency drop)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * pitchDropRatio), startTime + dur);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.01);

      // 2. High-frequency transient click (simulates the snap of wood-on-wood strike)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      const clickDur = Math.min(0.025, dur * 0.4);

      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(freq * 2.2, startTime);
      clickOsc.frequency.exponentialRampToValueAtTime(freq * 0.9, startTime + clickDur);

      clickGain.gain.setValueAtTime(vol * 0.45, startTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, startTime + clickDur);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(startTime);
      clickOsc.stop(startTime + clickDur + 0.005);

      // 3. Tactile haptic feedback
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(12);
        } catch {}
      }
    } catch {
      // Audio policies / silent fail
    }
  }

  /**
   * Stage-tuned physical wooden acoustic tapping for plant growth animations (Stages 1 through 5)
   * Provides tactile progression:
   * - Stage 1 (Sprout / جوانه): Light, tender micro-tap of a new shoot.
   * - Stage 2 (Sapling / نهال کوچک): Double crisp wood tap ("تق-تَق") of branching energy.
   * - Stage 3 (Young Plant / گیاه جوان): Tripartite resonant temple wood-block ("تق... تق... تَق").
   * - Stage 4 (Blooming / پرشکوفه): 4-tap ascending marimba wooden cascade accompanying the unfolding petals.
   * - Stage 5 (Mature Golden Tree / درخت تنومند زرین): Deep hollow wooden resonance + golden harmonic chime overtone.
   */
  public playGrowthWoodTap(stage: number = 1) {
    if (this.isMuted) return;

    switch (stage) {
      case 1:
        // Sprout: crisp high-pitched fresh twig click
        this.playWoodTap(460, 0.00, 0.055, 0.09, 'triangle', 0.48);
        this.playWoodTap(540, 0.045, 0.040, 0.05, 'sine', 0.60);
        break;

      case 2:
        // Sapling: two energetic, lively rhythmic taps
        this.playWoodTap(370, 0.00, 0.065, 0.10, 'triangle', 0.44);
        this.playWoodTap(420, 0.085, 0.065, 0.095, 'triangle', 0.46);
        break;

      case 3:
        // Young Plant: warm, hollow wood block resonance
        this.playWoodTap(300, 0.00, 0.075, 0.11, 'triangle', 0.40);
        this.playWoodTap(350, 0.095, 0.075, 0.105, 'triangle', 0.42);
        this.playWoodTap(410, 0.190, 0.085, 0.09, 'sine', 0.48);
        break;

      case 4:
        // Blooming: quadruple melodic wooden cascade
        this.playWoodTap(260, 0.00, 0.080, 0.11, 'triangle', 0.38);
        this.playWoodTap(320, 0.080, 0.080, 0.10, 'triangle', 0.40);
        this.playWoodTap(390, 0.160, 0.085, 0.095, 'triangle', 0.44);
        this.playWoodTap(480, 0.245, 0.100, 0.085, 'sine', 0.50);
        break;

      case 5:
      default:
        // Mature Tree: deep majestic resonant log + golden chime
        this.playWoodTap(190, 0.00, 0.110, 0.13, 'triangle', 0.36);
        this.playWoodTap(240, 0.100, 0.095, 0.115, 'triangle', 0.38);
        this.playWoodTap(330, 0.210, 0.095, 0.10, 'triangle', 0.42);
        this.playWoodTap(440, 0.320, 0.110, 0.085, 'sine', 0.48);
        // Golden harmonic overtone chime at apex
        this.tone(587.33, 0.42, 0.35, 'sine', 0.08);
        break;
    }
  }

  // Alias for backward compatibility / flexibility
  public playWoodKnock(stage: number = 1) {
    this.playGrowthWoodTap(stage);
  }
}

export const sound = new SoundEngine();
