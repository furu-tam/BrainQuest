let enabled = true;

export function setVoiceEnabled(value: boolean) {
  enabled = value;
}

export function isVoiceSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, lang = "vi-VN"): void {
  if (!enabled || !isVoiceSupported()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find((v) => v.lang.startsWith("vi"));
  if (viVoice) utterance.voice = viVoice;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isVoiceSupported()) window.speechSynthesis.cancel();
}

export const VOICE_PROMPTS = {
  patternStart: "Hãy tìm hình tiếp theo trong chuỗi nhé!",
  memoryStart: "Hãy nhớ các hình này thật kỹ!",
  memoryQuiz: "Con vật nào bạn đã thấy?",
  logicStart: "Hãy suy luận xem ai lớn nhất nhé!",
  correct: "Giỏi lắm!",
  wrong: "Thử lại lần sau nhé!",
  missionComplete: "Chúc mừng! Hoàn thành thử thách hôm nay!",
  towerRecord: "Chúc mừng! Phá kỷ lục mới! Giỏi lắm!",
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !enabled) return null;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Âm thanh hân hoan khi phá kỷ lục leo tháp */
export function playTrophyFanfare(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t0 = ctx.currentTime;
  const melody = [
    { freq: 523.25, at: 0, dur: 0.18 },
    { freq: 659.25, at: 0.14, dur: 0.18 },
    { freq: 783.99, at: 0.28, dur: 0.18 },
    { freq: 1046.5, at: 0.42, dur: 0.55 },
  ];

  for (const { freq, at, dur } of melody) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.001, t0 + at);
    gain.gain.exponentialRampToValueAtTime(0.22, t0 + at + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + at + dur);
    osc.start(t0 + at);
    osc.stop(t0 + at + dur + 0.05);
  }

  // Tiếng "cúp" chime
  const chime = ctx.createOscillator();
  const chimeGain = ctx.createGain();
  chime.type = "sine";
  chime.frequency.value = 1318.5;
  chime.connect(chimeGain);
  chimeGain.connect(ctx.destination);
  chimeGain.gain.setValueAtTime(0.001, t0 + 0.55);
  chimeGain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.58);
  chimeGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.1);
  chime.start(t0 + 0.55);
  chime.stop(t0 + 1.15);
}
