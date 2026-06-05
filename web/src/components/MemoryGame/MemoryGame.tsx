"use client";

import { useEffect, useState } from "react";
import type { MemoryQuestion } from "@/types/question";
import { DIFFICULTY_LABEL } from "@/types/question";
import { useVoice } from "@/hooks/useVoice";
import { VOICE_PROMPTS } from "@/services/voice";

interface MemoryGameProps {
  question: MemoryQuestion;
  questionLabel: string;
  onAnswer: (correct: boolean, responseTime: number) => void;
}

export function MemoryGame({ question, questionLabel, onAnswer }: MemoryGameProps) {
  const [phase, setPhase] = useState<"show" | "quiz">("show");
  const [countdown, setCountdown] = useState(question.showSeconds);
  const [quizStart, setQuizStart] = useState<number | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const { speak } = useVoice();

  useEffect(() => {
    setPhase("show");
    setCountdown(question.showSeconds);
    setPicked(null);
    setQuizStart(null);
    speak(VOICE_PROMPTS.memoryStart);
  }, [question, speak]);

  useEffect(() => {
    if (phase !== "show") return;
    if (countdown <= 0) {
      setPhase("quiz");
      setQuizStart(Date.now());
      speak(VOICE_PROMPTS.memoryQuiz);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, phase, speak]);

  const cols = question.items.length <= 4 ? 2 : question.items.length <= 6 ? 3 : 4;

  const choose = (opt: string) => {
    if (picked || quizStart === null) return;
    setPicked(opt);
    const correct = opt === question.answer;
    speak(correct ? VOICE_PROMPTS.correct : VOICE_PROMPTS.wrong);
    onAnswer(correct, (Date.now() - quizStart) / 1000);
  };

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-center text-sm font-bold text-bq-primary">Ghi nhớ hình ảnh</p>
      <p className="mb-5 text-center text-sm text-bq-muted">
        {questionLabel} · {DIFFICULTY_LABEL[question.difficulty]}
        {phase === "show" ? ` · ${countdown}s` : ""}
      </p>

      {phase === "show" ? (
        <>
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-bq-primary border-t-bq-accent text-2xl font-extrabold text-bq-primary">
            {countdown}
          </div>
          <div
            className="mb-6 grid gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {question.items.map((a, i) => (
              <div
                key={`${a}-${i}`}
                className="rounded-bq-sm bg-white p-4 text-center text-4xl shadow-sm"
              >
                {a}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-center text-lg font-extrabold">Con vật nào bạn đã thấy?</p>
          <div className="mt-auto grid grid-cols-3 gap-3">
            {question.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => choose(opt)}
                className={`min-h-[60px] rounded-bq-sm bg-white text-4xl shadow-sm hover:border-2 hover:border-bq-primary ${
                  picked === opt
                    ? opt === question.answer
                      ? "ring-2 ring-bq-success"
                      : "ring-2 ring-bq-danger"
                    : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
