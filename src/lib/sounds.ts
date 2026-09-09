type Tone = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  return ctx;
}

export function setMuted(next: boolean) {
  muted = next;
}

export function isMuted() {
  return muted;
}

function playTones(tones: Tone[]) {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;
  void audio.resume();
  const now = audio.currentTime;

  for (const tone of tones) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = tone.type ?? "sine";
    osc.frequency.value = tone.freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(tone.gain ?? 0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + tone.duration + 0.02);
  }
}

export const sounds = {
  click() {
    playTones([{ freq: 640, duration: 0.06, type: "triangle", gain: 0.03 }]);
  },
  deposit() {
    playTones([
      { freq: 420, duration: 0.12, type: "sine", gain: 0.04 },
      { freq: 660, duration: 0.16, type: "sine", gain: 0.035 },
    ]);
  },
  spin() {
    playTones([
      { freq: 180, duration: 0.28, type: "sawtooth", gain: 0.02 },
      { freq: 90, duration: 0.4, type: "sine", gain: 0.03 },
    ]);
  },
  tick() {
    playTones([{ freq: 880, duration: 0.04, type: "square", gain: 0.015 }]);
  },
  lose() {
    playTones([
      { freq: 220, duration: 0.28, type: "triangle", gain: 0.04 },
      { freq: 140, duration: 0.4, type: "sine", gain: 0.035 },
    ]);
  },
  win() {
    playTones([
      { freq: 523, duration: 0.16, type: "sine", gain: 0.04 },
      { freq: 659, duration: 0.18, type: "sine", gain: 0.035 },
      { freq: 784, duration: 0.22, type: "sine", gain: 0.03 },
    ]);
  },
  zero() {
    playTones([{ freq: 90, duration: 0.8, type: "sine", gain: 0.045 }]);
  },
};
