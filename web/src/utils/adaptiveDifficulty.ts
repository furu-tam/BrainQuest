import type { Difficulty, GameType } from "@/types/question";
import type { GameEvent } from "@/store/appStore";

const TIME_THRESHOLDS: Record<GameType, Record<Difficulty, number>> = {
  pattern: { 1: 8, 2: 6, 3: 5 },
  memory: { 1: 10, 2: 8, 3: 7 },
  logic: { 1: 12, 2: 9, 3: 7 },
};

export function initialDifficultyForAge(age: number): Difficulty {
  if (age <= 4) return 1;
  if (age <= 7) return 2;
  return 2;
}

export function nextDifficulty(
  current: Difficulty,
  events: GameEvent[],
  game: GameType
): Difficulty {
  const recent = events.filter((e) => e.game === game).slice(-5);
  if (recent.length < 2) return current;

  const last3 = recent.slice(-3);
  const accuracy = last3.filter((e) => e.correct).length / last3.length;
  const avgTime =
    last3.reduce((sum, e) => sum + e.responseTime, 0) / last3.length;
  const threshold = TIME_THRESHOLDS[game][current];

  if (accuracy >= 0.8 && avgTime <= threshold && current < 3) {
    return (current + 1) as Difficulty;
  }

  const last2Wrong = recent.slice(-2).length === 2 && recent.slice(-2).every((e) => !e.correct);
  if (accuracy < 0.5 || last2Wrong) {
    return Math.max(1, current - 1) as Difficulty;
  }

  return current;
}
