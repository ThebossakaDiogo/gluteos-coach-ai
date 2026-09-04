/**
 * Procedural Web Audio Engine - Quiz Funnel UI
 * Síntese em tempo real sem arquivos .mp3/.wav externos (zero latência).
 */

class UiAudioEngine {
  private context: AudioContext | null = null;
  public enabled: boolean = true;
  private storageKey: string = 'quiz-ui-sounds';

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(this.storageKey);
      this.enabled = stored !== 'off';
    } catch {
      this.enabled = true;
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.context && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.context = new AudioCtx();
      }
    }
    if (this.context && this.context.state === 'suspended') {
      void this.context.resume();
    }
    return this.context;
  }

  public playTone(
    startFreq: number,
    endFreq: number,
    duration: number,
    delay: number = 0,
    volume: number = 0.035,
    type: OscillatorType = 'triangle'
  ) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const startAt = ctx.currentTime + delay;
      const endAt = startAt + duration;

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startFreq, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), endAt);

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startAt);
      oscillator.stop(endAt + 0.015);
    } catch (e) {
      console.warn('[Audio Engine] Playback note error:', e);
    }
  }

  public play(kind: 'click' | 'select' | 'back' | 'success' | 'alert') {
    if (!this.enabled) return;

    switch (kind) {
      case 'select':
        this.playTone(390, 620, 0.09, 0, 0.04, 'triangle');
        break;
      case 'back':
      case 'alert':
        this.playTone(330, 190, 0.075, 0, 0.025, 'triangle');
        break;
      case 'success':
        this.playTone(440, 660, 0.13, 0, 0.035, 'sine');
        this.playTone(620, 880, 0.16, 0.075, 0.03, 'sine');
        this.playTone(880, 1100, 0.18, 0.15, 0.025, 'sine');
        break;
      case 'click':
      default:
        this.playTone(270, 210, 0.055, 0, 0.025, 'triangle');
        break;
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(this.storageKey, this.enabled ? 'on' : 'off');
      } catch {
        // ignore
      }
    }
    if (this.enabled) {
      this.play('select');
    }
    return this.enabled;
  }
}

// Instância global exportada
export const uiAudio = new UiAudioEngine();

// Compatibilidade Vanilla JS
if (typeof window !== 'undefined') {
  (window as unknown as { uiAudio: UiAudioEngine }).uiAudio = uiAudio;
}
