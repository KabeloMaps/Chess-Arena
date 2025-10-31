// Simple sound effect generation using Web Audio API

class SoundEffects {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined" && "AudioContext" in window) {
      this.audioContext = new AudioContext();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.1
  ) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playMove() {
    // Normal move sound - soft click
    this.playTone(220, 0.08, "sine", 0.08);
  }

  playCapture() {
    // Capture sound - sharper, with two tones
    this.playTone(330, 0.05, "square", 0.12);
    setTimeout(() => {
      this.playTone(220, 0.08, "sine", 0.08);
    }, 30);
  }

  playCheck() {
    // Check sound - alert tone
    this.playTone(440, 0.15, "sine", 0.15);
    setTimeout(() => {
      this.playTone(554, 0.15, "sine", 0.12);
    }, 80);
  }

  playGameEnd() {
    // Game end sound - descending tones
    this.playTone(523, 0.2, "sine", 0.1);
    setTimeout(() => {
      this.playTone(440, 0.2, "sine", 0.1);
    }, 150);
    setTimeout(() => {
      this.playTone(392, 0.3, "sine", 0.1);
    }, 300);
  }

  playStart() {
    // Game start sound - ascending tones
    this.playTone(262, 0.15, "sine", 0.1);
    setTimeout(() => {
      this.playTone(330, 0.15, "sine", 0.1);
    }, 100);
  }
}

export const soundEffects = new SoundEffects();
