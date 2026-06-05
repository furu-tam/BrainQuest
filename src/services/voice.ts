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
};
