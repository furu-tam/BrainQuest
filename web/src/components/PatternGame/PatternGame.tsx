"use client";

import { useEffect, useMemo, useState } from "react";
import type { PatternQuestion } from "@/types/question";
import { DIFFICULTY_LABEL } from "@/types/question";
import { useVoice } from "@/hooks/useVoice";
import { VOICE_PROMPTS } from "@/services/voice";

function shuffleOptions<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface PatternGameProps {
  question: PatternQuestion;
  questionLabel: string;
  onAnswer: (correct: boolean, responseTime: number) => void;
}

export function PatternGame({ question, questionLabel, onAnswer }: PatternGameProps) {
  const [start, setStart] = useState(() => Date.now());
  const [picked, setPicked] = useState<string | null>(null);
  const { speak } = useVoice();

  const displayOptions = useMemo(() => {
    const opts = shuffleOptions(question.options);
    if (opts.length > 1 && opts[0] === question.answer) {
      [opts[0], opts[1]] = [opts[1], opts[0]];
    }
    return opts;
  }, [question.options, question.answer]);

  useEffect(() => {
    setStart(Date.now());
    setPicked(null);
    speak(VOICE_PROMPTS.patternStart);
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
      <p className="text-center text-sm font-bold text-bq-primary">Nhận diện quy luật</p>
      <p className="mb-5 text-center text-sm text-bq-muted">
        {questionLabel} · {DIFFICULTY_LABEL[question.difficulty]}
      </p>
      <div className="mb-7 flex min-h-[100px] flex-wrap items-center justify-center gap-3 rounded-bq bg-white p-7 shadow-bq">
        {question.sequence.map((s, i) => (
          <span key={i} className="text-4xl">
            {s}
          </span>
        ))}
        <span className="animate-pulse text-4xl opacity-50">?</span>
      </div>
      <p className="mb-4 text-center text-sm text-bq-muted">Chọn hình tiếp theo</p>
      <div className="mt-auto grid grid-cols-3 gap-3">
        {displayOptions.map((opt, i) => (
          <button
            key={`${opt}-${i}`}
            type="button"
            onClick={() => choose(opt)}
            className={`min-h-[60px] min-w-[60px] rounded-bq-sm text-4xl shadow-sm transition ${
              picked === opt
                ? opt === question.answer
                  ? "border-3 border-bq-success bg-green-100"
                  : "border-3 border-bq-danger bg-red-50"
                : "border-3 border-transparent bg-white hover:border-bq-primary"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
