"use client";

import { AppShell } from "@/components/ui/AppShell";
import { ACHIEVEMENTS, getUnlockedAchievements } from "@/utils/achievements";
import { computeSkillScores, weeklyActivity } from "@/utils/skillStats";
import { useAppStore } from "@/store/appStore";
import { DIFFICULTY_LABEL } from "@/types/question";

const SKILL_COLORS = {
  pattern: "bg-bq-primary",
  memory: "bg-teal-400",
  logic: "bg-bq-accent",
} as const;

const SKILL_LABELS = {
  pattern: "Quy luật",
  memory: "Ghi nhớ",
  logic: "Logic",
} as const;

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function DashboardPage() {
  const profile = useAppStore((s) => s.getActiveProfile());
  const scores = computeSkillScores(profile.events);
  const week = weeklyActivity(profile.events);
  const unlocked = getUnlockedAchievements(
    profile.events,
    profile.streak,
    profile.dailyCompleteCount
  );

  return (
    <div className="page-wrap">
      <AppShell activeNav="dashboard">
        <main className="flex flex-1 flex-col px-4 py-5">
          <header className="mb-5 text-center">
            <h1 className="text-2xl font-extrabold text-bq-primary">
              {profile.avatar} Tiến độ {profile.name}
            </h1>
            <p className="text-sm text-bq-muted">
              {profile.events.filter((e) => e.correct).length} câu đúng · Level {profile.level}
            </p>
          </header>

          <h2 className="mb-3 text-lg font-extrabold text-bq-primary">Kỹ năng</h2>
          <div className="mb-6 flex flex-col gap-3">
            {(["pattern", "memory", "logic"] as const).map((key) => (
              <div key={key} className="rounded-bq-sm bg-white p-4 shadow-sm">
                <div className="mb-2 flex justify-between font-bold">
                  <span>{SKILL_LABELS[key]}</span>
                  <span>
                    {scores[key].total > 0 ? `${scores[key].accuracy}%` : "—"}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${SKILL_COLORS[key]}`}
                    style={{ width: `${scores[key].accuracy}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-bq-muted">
                  {scores[key].total} câu · TB {scores[key].avgResponseTime}s ·{" "}
                  {DIFFICULTY_LABEL[profile.skillDifficulty[key]]}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 text-lg font-extrabold text-bq-primary">Tuần này</h2>
          <div className="mb-6 flex h-28 items-end justify-between gap-2 rounded-bq bg-white p-4 shadow-bq">
            {week.map((h, i) => (
              <div key={DAYS[i]} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full max-w-9 rounded-t-lg bg-gradient-to-t from-bq-primary to-indigo-300"
                  style={{ height: `${Math.max(h, 8)}%` }}
                />
                <span className="text-[0.65rem] font-bold text-bq-muted">{DAYS[i]}</span>
              </div>
            ))}
          </div>

          <h2 className="mb-3 text-lg font-extrabold text-bq-primary">Thành tích</h2>
          <div className="grid grid-cols-2 gap-2">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                className={`rounded-bq-sm bg-white p-3 text-center text-xs font-bold ${
                  unlocked.has(a.id) ? "ring-2 ring-bq-accent opacity-100" : "opacity-50"
                }`}
              >
                <span className="mb-1 block text-3xl">{a.icon}</span>
                {a.name}
              </div>
            ))}
          </div>
        </main>
      </AppShell>
    </div>
  );
}
