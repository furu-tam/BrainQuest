"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MathQuiz } from "@/math/components/MathQuiz";
import { MathShell } from "@/math/components/MathShell";
import { buildDailyExam } from "@/math/services/learningPath";
import { generateMathQuestion } from "@/math/services/questionGenerator";
import { useActiveMathProfile } from "@/math/hooks/useActiveMathProfile";
import { useMathStore } from "@/math/store/mathStore";
import type { MathQuestion } from "@/math/types/question";

export default function MathPlayPage() {
  const router = useRouter();
  const profile = useActiveMathProfile();
  const startSession = useMathStore((s) => s.startSession);
  const recordAnswer = useMathStore((s) => s.recordAnswer);
  const completeDaily = useMathStore((s) => s.completeDaily);
  const getDifficultyForModule = useMathStore((s) => s.getDifficultyForModule);

  const path = useMemo(
    () => buildDailyExam(profile),
    [profile.id, profile.grade, profile.events.length]
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [question, setQuestion] = useState<MathQuestion | null>(null);

  const currentStep = path[stepIndex];
  const currentModule = currentStep?.module;

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (!currentModule) return;
    const difficulty = getDifficultyForModule(currentModule);
    setQuestion(generateMathQuestion(currentModule, difficulty, profile.grade));
  }, [stepIndex, currentModule, profile.grade, getDifficultyForModule]);

  const handleAnswer = useCallback(
    (correct: boolean, responseTime: number) => {
      if (!currentStep || !question) return;
      recordAnswer(currentStep.module, correct, responseTime, question.difficulty);

      setTimeout(() => {
        if (stepIndex < path.length - 1) {
          setStepIndex((i) => i + 1);
        } else {
          completeDaily();
          router.push("/math/reward");
        }
      }, 900);
    },
    [currentStep, question, stepIndex, path.length, recordAnswer, completeDaily, router]
  );

  const questionLabel = currentStep
    ? `Câu ${stepIndex + 1}/${path.length} · ${currentStep.moduleLabel}`
    : "";

  return (
    <div className="page-wrap">
      <MathShell>
        <main className="flex flex-1 flex-col px-4 py-5">
          <Link href="/math" className="mb-3 text-sm font-bold text-mq-muted">
            ← Quay lại
          </Link>
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
      </MathShell>
    </div>
  );
}
