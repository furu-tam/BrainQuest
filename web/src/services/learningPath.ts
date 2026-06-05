import type { ChildProfile, GameType } from "@/store/appStore";
import { computeSkillScores, weakestSkill } from "@/utils/skillStats";

export const DAILY_COUNTS: Record<GameType, number> = {
  pattern: 2,
  memory: 2,
  logic: 1,
};

export interface PathStep {
  game: GameType;
  indexInGame: number;
  totalInGame: number;
}

/** Lộ trình cá nhân hóa: ưu tiên kỹ năng yếu, đủ 5 câu/ngày */
export function buildLearningPath(profile: ChildProfile): PathStep[] {
  const scores = computeSkillScores(profile.events);
  const weak = weakestSkill(scores);

  const order: GameType[] = [...(["pattern", "memory", "logic"] as const)].sort((a, b) => {
    if (a === weak) return -1;
    if (b === weak) return 1;
    return scores[a].accuracy - scores[b].accuracy;
  });

  const path: PathStep[] = [];
  const counts = { pattern: 0, memory: 0, logic: 0 };

  while (path.length < 5) {
    let added = false;
    for (const game of order) {
      if (counts[game] < DAILY_COUNTS[game]) {
        counts[game]++;
        path.push({
          game,
          indexInGame: counts[game],
          totalInGame: DAILY_COUNTS[game],
        });
        added = true;
        if (path.length >= 5) break;
      }
    }
    if (!added) break;
  }

  return path;
}

export function getPathRecommendation(profile: ChildProfile): string {
  const scores = computeSkillScores(profile.events);
  const weak = weakestSkill(scores);
  const labels: Record<GameType, string> = {
    pattern: "nhận diện quy luật",
    memory: "ghi nhớ",
    logic: "suy luận logic",
  };

  if (scores[weak].total === 0) {
    return "Bé mới bắt đầu — lộ trình cân bằng cả 3 kỹ năng.";
  }

  if (scores[weak].accuracy < 60) {
    return `Nên luyện thêm ${labels[weak]} — kỹ năng cần cải thiện nhất (${scores[weak].accuracy}% đúng).`;
  }

  return `Tiến bộ tốt! Hôm nay ưu tiên ${labels[weak]} để duy trì đà phát triển.`;
}
