"use client";

import { useEffect, useState } from "react";
import type { LogicQuestion } from "@/types/question";
import { DIFFICULTY_LABEL } from "@/types/question";
import { useVoice } from "@/hooks/useVoice";
import { VOICE_PROMPTS } from "@/services/voice";

interface LogicGameProps {
  question: LogicQuestion;
  questionLabel: string;
  onAnswer: (correct: boolean, responseTime: number) => void;
}

export function LogicGame({ question, questionLabel, onAnswer }: LogicGameProps) {
  const [start] = useState(() => Date.now());
  const [picked, setPicked] = useState<string | null>(null);
  const { speak } = useVoice();

  useEffect(() => {
    speak(VOICE_PROMPTS.logicStart);
  }, [question, speak]);

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const correct = opt === question.answer;
    speak(correct ? VOICE_PROMPTS.correct : VOICE_PROMPTS.wrong);
    onAnswer(correct, (Date.now() - start) / 1000);
  };

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-center text-sm font-bold text-bq-primary">Suy luận logic</p>
      <p className="mb-5 text-center text-sm text-bq-muted">
        {questionLabel} · {DIFFICULTY_LABEL[question.difficulty]}
      </p>
      <div className="mb-6 rounded-bq bg-white p-6 text-center shadow-bq">
        {question.comparisons.map((c, i) => {
          const [left, right] = c.split(">").map((s) => s.trim());
          return (
            <div
              key={i}
              className="flex items-center justify-center gap-3 py-2 text-4xl leading-none"
            >
              <span>{left}</span>
              <span className="text-5xl font-extrabold text-bq-primary">&gt;</span>
              <span>{right}</span>
            </div>
          );
        })}
      </div>
      <p className="mb-5 text-center text-lg font-extrabold">{question.promptText}</p>
      <div className="mt-auto grid grid-cols-3 gap-3">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => choose(opt)}
            className={`min-h-[60px] rounded-bq-sm bg-white text-4xl shadow-sm ${
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
    </div>
  );
}
