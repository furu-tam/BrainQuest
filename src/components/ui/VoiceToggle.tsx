"use client";

import { useVoice } from "@/hooks/useVoice";

export function VoiceToggle() {
  const { voiceEnabled, setVoiceEnabled } = useVoice();

  return (
    <button
      type="button"
      onClick={() => setVoiceEnabled(!voiceEnabled)}
      className="flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-sm font-bold shadow-sm"
      aria-label={voiceEnabled ? "Tắt giọng nói" : "Bật giọng nói"}
    >
      {voiceEnabled ? "🔊" : "🔇"}
      <span className="text-bq-muted">{voiceEnabled ? "Giọng nói" : "Im lặng"}</span>
    </button>
  );
}
