"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LogicGame } from "@/components/LogicGame/LogicGame";
import { MemoryGame } from "@/components/MemoryGame/MemoryGame";
import { PatternGame } from "@/components/PatternGame/PatternGame";
import { AppShell } from "@/components/ui/AppShell";
import { VoiceToggle } from "@/components/ui/VoiceToggle";
import { trackEvent } from "@/services/analytics";
import { generateQuestionWithAI } from "@/services/questionGenerator";
import { useAppStore } from "@/store/appStore";
import type { Difficulty, GameType, Question } from "@/types/question";

function gameByFloor(floor: number): GameType {
  const cycle: GameType[] = ["pattern", "memory", "logic"];
  return cycle[(floor - 1) % cycle.length];
}

function difficultyByFloor(floor: number): Difficulty {
  if (floor <= 3) return 1;
  if (floor <= 7) return 2;
  return 3;
}

export default function TowerPage() {
  const profile = useAppStore((s) => s.getActiveProfile());
  const startSession = useAppStore((s) => s.startSession);
  const recordTowerAnswer = useAppStore((s) => s.recordTowerAnswer);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  const floor = profile.towerCurrentFloor ?? 1;
  const conqueredFloors = profile.towerConqueredFloors ?? [];
  const bestFloor = profile.towerBestFloor ?? 1;
  const game = useMemo(() => gameByFloor(floor), [floor]);
  const difficulty = useMemo(() => difficultyByFloor(floor), [floor]);

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    generateQuestionWithAI(game, difficulty, profile.age).then((q) => {
      if (!cancelled) {
        setQuestion(q);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [game, difficulty, profile.age, floor]);

  const handleAnswer = (correct: boolean, responseTime: number) => {
    recordTowerAnswer(game, correct, responseTime, difficulty);
    const last = useAppStore.getState().getActiveProfile().events.at(-1);
    if (last) trackEvent(last);
  };

  const label = `Tầng ${floor} · ${game.toUpperCase()} · ${difficulty === 1 ? "Dễ" : difficulty === 2 ? "TB" : "Khó"}`;

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
          <div className="mb-4 rounded-bq-sm bg-indigo-50 px-3 py-2 text-sm font-bold text-bq-primary">
            🏰 Đã chinh phục: {conqueredFloors.length} cửa · Kỷ lục: tầng {Math.max(1, bestFloor - 1)}
          </div>

          {loading || !question ? (
            <div className="flex flex-1 items-center justify-center font-bold text-bq-muted">
              Đang tạo thử thách leo tháp...
            </div>
          ) : question.type === "pattern" ? (
            <PatternGame question={question} questionLabel={label} onAnswer={handleAnswer} />
          ) : question.type === "memory" ? (
            <MemoryGame question={question} questionLabel={label} onAnswer={handleAnswer} />
          ) : (
            <LogicGame question={question} questionLabel={label} onAnswer={handleAnswer} />
          )}

          <p className="mt-4 text-center text-xs font-semibold text-bq-muted">
            Trả lời sai sẽ rơi về tầng 1.
          </p>
        </main>
      </AppShell>
    </div>
  );
}
