"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogicGame } from "@/components/LogicGame/LogicGame";
import { MemoryGame } from "@/components/MemoryGame/MemoryGame";
import { PatternGame } from "@/components/PatternGame/PatternGame";
import { AppShell } from "@/components/ui/AppShell";
import { VoiceToggle } from "@/components/ui/VoiceToggle";
import { trackEvent } from "@/services/analytics";
import { useAppStore, type WrongQuestionItem } from "@/store/appStore";

export default function ReviewPage() {
  const router = useRouter();
  const wrongQuestions = useAppStore((s) => s.getTodayWrongQuestions());
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const [queue] = useState<WrongQuestionItem[]>(() => [...wrongQuestions]);
  const [index, setIndex] = useState(0);
  const current = queue[index];

  if (queue.length === 0) {
    return (
      <div className="page-wrap">
        <AppShell showNav={false}>
          <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <div className="text-6xl">🎉</div>
            <h1 className="mt-3 text-2xl font-extrabold text-bq-primary">Không còn câu sai nào hôm nay</h1>
            <Link
              href="/"
              className="mt-6 flex min-h-[60px] w-full items-center justify-center rounded-bq bg-bq-primary text-lg font-extrabold text-white"
            >
              Về trang chủ
            </Link>
          </main>
        </AppShell>
      </div>
    );
  }

  const handleAnswer = (correct: boolean, responseTime: number) => {
    if (!current) return;
    const { game, question, id } = current;
    recordAnswer(game, correct, responseTime, question.difficulty, question, id);
    const last = useAppStore.getState().getActiveProfile().events.at(-1);
    if (last) trackEvent(last);

    setTimeout(() => {
      if (index < queue.length - 1) {
        setIndex((v) => v + 1);
      } else {
        router.push("/");
      }
    }, 700);
  };

  const label = `Ôn câu sai ${index + 1}/${queue.length}`;

  return (
    <div className="page-wrap">
      <AppShell showNav={false}>
        <div className="flex items-center justify-between px-4 pt-3">
          <Link href="/" className="text-sm font-bold text-bq-muted">
            ← Trang chủ
          </Link>
          <VoiceToggle />
        </div>
        <main className="flex flex-1 flex-col px-4 pb-5">
          {current.question.type === "pattern" ? (
            <PatternGame question={current.question} questionLabel={label} onAnswer={handleAnswer} />
          ) : current.question.type === "memory" ? (
            <MemoryGame question={current.question} questionLabel={label} onAnswer={handleAnswer} />
          ) : (
            <LogicGame question={current.question} questionLabel={label} onAnswer={handleAnswer} />
          )}
        </main>
      </AppShell>
    </div>
  );
}
