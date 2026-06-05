import type { GameType } from "@/types/question";
import type { GameEvent } from "@/store/appStore";

export interface SkillScore {
  accuracy: number;
  avgResponseTime: number;
  total: number;
}

export function computeSkillScores(events: GameEvent[]): Record<GameType, SkillScore> {
  const games: GameType[] = ["pattern", "memory", "logic"];
  const result = {} as Record<GameType, SkillScore>;

  for (const game of games) {
    const gameEvents = events.filter((e) => e.game === game);
    if (gameEvents.length === 0) {
      result[game] = { accuracy: 0, avgResponseTime: 0, total: 0 };
      continue;
    }
    const correct = gameEvents.filter((e) => e.correct).length;
    const avgResponseTime =
      gameEvents.reduce((s, e) => s + e.responseTime, 0) / gameEvents.length;
    result[game] = {
      accuracy: Math.round((correct / gameEvents.length) * 100),
      avgResponseTime: Math.round(avgResponseTime * 10) / 10,
      total: gameEvents.length,
    };
  }

  return result;
}

export function weeklyActivity(events: GameEvent[]): number[] {
  const days = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  for (const event of events) {
    const d = new Date(event.timestamp);
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays >= 0 && diffDays <= mondayOffset + (6 - mondayOffset)) {
      const eventDay = d.getDay();
      const idx = eventDay === 0 ? 6 : eventDay - 1;
      if (idx >= 0 && idx < 7) days[idx] += 1;
    }
  }

  const max = Math.max(...days, 1);
  return days.map((c) => Math.round((c / max) * 100));
}

export function weakestSkill(scores: Record<GameType, SkillScore>): GameType {
  const games: GameType[] = ["pattern", "memory", "logic"];
  return games.reduce((weakest, game) =>
    scores[game].accuracy < scores[weakest].accuracy ? game : weakest
  );
}
