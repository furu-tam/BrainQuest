"use client";

import { useCallback, useRef } from "react";
import { setVoiceEnabled, speak } from "@/services/voice";
import { useAppStore } from "@/store/appStore";

export function useVoice() {
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);
  const setEnabled = useAppStore((s) => s.setVoiceEnabled);

  const toggle = useCallback(
    (enabled: boolean) => {
      setEnabled(enabled);
      setVoiceEnabled(enabled);
    },
    [setEnabled]
  );

  const speakIfEnabled = useCallback(
    (text: string) => {
      if (voiceEnabled) speak(text);
    },
    [voiceEnabled]
  );

  const speakRef = useRef(speakIfEnabled);
  speakRef.current = speakIfEnabled;

  const stableSpeak = useCallback((text: string) => {
    speakRef.current(text);
  }, []);

  return {
    voiceEnabled,
    setVoiceEnabled: toggle,
    speak: stableSpeak,
  };
}
