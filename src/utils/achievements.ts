import type { GameEvent } from "@/store/appStore";

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first", icon: "👣", name: "First Steps", description: "Hoàn thành thử thách đầu tiên" },
  { id: "smart", icon: "🧠", name: "Smart Kid", description: "20 câu trả lời đúng" },
  { id: "hero", icon: "🔥", name: "7-Day Hero", description: "Streak 7 ngày" },
  { id: "memory", icon: "🎯", name: "Memory Master", description: "100 câu ghi nhớ" },
];

export function getUnlockedAchievements(
  events: GameEvent[],
  streak: number,
  dailyCompleteCount: number
): Set<string> {
  const unlocked = new Set<string>();
  const correct = events.filter((e) => e.correct).length;
  const memoryTotal = events.filter((e) => e.game === "memory").length;

  if (dailyCompleteCount >= 1 || events.length >= 3) unlocked.add("first");
  if (correct >= 20) unlocked.add("smart");
  if (streak >= 7) unlocked.add("hero");
  if (memoryTotal >= 100) unlocked.add("memory");

  return unlocked;
}
