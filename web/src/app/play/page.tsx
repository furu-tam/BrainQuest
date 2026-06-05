"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { LogicGame } from "@/components/LogicGame/LogicGame";
import { MemoryGame } from "@/components/MemoryGame/MemoryGame";
import { PatternGame } from "@/components/PatternGame/PatternGame";
import { VoiceToggle } from "@/components/ui/VoiceToggle";
import { trackEvent } from "@/services/analytics";
import { buildLearningPath, type PathStep } from "@/services/learningPath";
import { generateQuestionWithAI } from "@/services/questionGenerator";
import { VOICE_PROMPTS } from "@/services/voice";
import { useAppStore } from "@/store/appStore";
import { useVoice } from "@/hooks/useVoice";
import type { Question } from "@/types/question";

export default function PlayPage() {
  const router = useRouter();
  const { speak } = useVoice();
  const profile = useAppStore((s) => s.getActiveProfile());
  const startSession = useAppStore((s) => s.startSession);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const completeDaily = useAppStore((s) => s.completeDaily);
  const getDifficultyForGame = useAppStore((s) => s.getDifficultyForGame);

  const path = useMemo(() => buildLearningPath(profile), [profile.id, profile.events.length]);
  const [stepIndex, setStepIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  const currentStep: PathStep | undefined = path[stepIndex];

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (!currentStep) return;
    let cancelled = false;
    setLoading(true);
    const difficulty = getDifficultyForGame(currentStep.game);
    generateQuestionWithAI(currentStep.game, difficulty, profile.age).then((q) => {
      if (!cancelled) {
        setQuestion(q);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [stepIndex, currentStep, profile.age, getDifficultyForGame]);

  const handleAnswer = useCallback(
    (correct: boolean, responseTime: number) => {
      if (!currentStep || !question) return;
      const difficulty = question.difficulty;
      recordAnswer(currentStep.game, correct, responseTime, difficulty);
      const last = useAppStore.getState().getActiveProfile().events.at(-1);
      if (last) trackEvent(last);

      setTimeout(() => {
        if (stepIndex < path.length - 1) {
          setStepIndex((i) => i + 1);
        } else {
          speak(VOICE_PROMPTS.missionComplete);
          completeDaily();
          router.push("/reward");
        }
      }, 700);
    },
    [currentStep, question, stepIndex, path.length, recordAnswer, completeDaily, router, speak]
  );

  const questionLabel = currentStep
    ? `Câu ${currentStep.indexInGame}/${currentStep.totalInGame} · Tổng ${stepIndex + 1}/${path.length}`
    : "";

  return (
    <div className="page-wrap">
      <AppShell showNav={false}>
        <div className="flex justify-end px-4 pt-3">
          <VoiceToggle />
        </div>
        <main className="flex flex-1 flex-col px-4 pb-5">
          {loading || !question ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <div className="text-4xl animate-bounce">🧠</div>
              <p className="font-bold text-bq-muted">Đang tạo câu hỏi...</p>
            </div>
          ) : question.type === "pattern" ? (
            <PatternGame
              question={question}
              questionLabel={questionLabel}
              onAnswer={handleAnswer}
            />
          ) : question.type === "memory" ? (
            <MemoryGame
              question={question}
              questionLabel={questionLabel}
              onAnswer={handleAnswer}
            />
          ) : (
            <LogicGame
              question={question}
              questionLabel={questionLabel}
              onAnswer={handleAnswer}
            />
          )}
        </main>
      </AppShell>
    </div>
  );
}
