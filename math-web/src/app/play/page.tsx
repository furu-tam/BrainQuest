"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { MathQuiz } from "@/components/MathQuiz/MathQuiz";
import { buildDailyExam, type PathStep } from "@/services/learningPath";
import { generateMathQuestion } from "@/services/questionGenerator";
import { useActiveProfile } from "@/hooks/useActiveProfile";
import { useAppStore } from "@/store/appStore";
import type { MathQuestion } from "@/types/question";

export default function PlayPage() {
  const router = useRouter();
  const profile = useActiveProfile();
  const startSession = useAppStore((s) => s.startSession);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const completeDaily = useAppStore((s) => s.completeDaily);
  const getDifficultyForModule = useAppStore((s) => s.getDifficultyForModule);

  const path = useMemo(
    () => buildDailyExam(profile),
    [profile.id, profile.grade, profile.events.length]
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [question, setQuestion] = useState<MathQuestion | null>(null);

  const currentStep: PathStep | undefined = path[stepIndex];

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (!currentStep) return;
    const difficulty = getDifficultyForModule(currentStep.module);
    const q = generateMathQuestion(currentStep.module, difficulty, profile.grade);
    setQuestion(q);
  }, [stepIndex, currentStep, profile.grade, getDifficultyForModule]);

  const handleAnswer = useCallback(
    (correct: boolean, responseTime: number) => {
      if (!currentStep || !question) return;
      recordAnswer(currentStep.module, correct, responseTime, question.difficulty);

      setTimeout(() => {
        if (stepIndex < path.length - 1) {
          setStepIndex((i) => i + 1);
        } else {
          completeDaily();
          router.push("/reward");
        }
      }, 900);
    },
    [currentStep, question, stepIndex, path.length, recordAnswer, completeDaily, router]
  );

  const questionLabel = currentStep
    ? `Câu ${currentStep.indexInModule}/${currentStep.totalInModule} · Tổng ${stepIndex + 1}/${path.length}`
    : "";

  return (
    <div className="page-wrap">
      <AppShell showNav={false}>
        <main className="flex flex-1 flex-col px-4 py-5">
          {currentStep && (
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-mq-muted">
              <span className="text-xl">{currentStep.moduleIcon}</span>
              {currentStep.moduleLabel}
            </div>
          )}
          {!question ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <div className="animate-bounce text-4xl">📐</div>
              <p className="font-bold text-mq-muted">Đang tạo đề...</p>
            </div>
          ) : (
            <MathQuiz
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
