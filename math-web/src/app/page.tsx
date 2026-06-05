"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { ProfileBadge } from "@/components/ui/ProfileBadge";
import { getPathRecommendation } from "@/services/learningPath";
import { useActiveProfile } from "@/hooks/useActiveProfile";
import { dailyTotalProgress, useAppStore } from "@/store/appStore";
import { DAILY_QUESTION_COUNT, getModulesForGrade } from "@/types/curriculum";

export default function HomePage() {
  const profile = useActiveProfile();
  const resetDailyIfNewDay = useAppStore((s) => s.resetDailyIfNewDay);

  useEffect(() => {
    resetDailyIfNewDay();
  }, [resetDailyIfNewDay]);

  const { xp, coins, level, streak, dailyProgress, dailyComplete } = profile;
  const done = dailyTotalProgress(dailyProgress);
  const pct = Math.round((done / DAILY_QUESTION_COUNT) * 100);
  const recommendation = getPathRecommendation(profile);
  const modules = getModulesForGrade(profile.grade);

  return (
    <div className="page-wrap">
      <AppShell activeNav="home">
        <main className="flex flex-1 flex-col px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <ProfileBadge />
          </div>

          <header className="mb-5 text-center">
            <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold text-mq-primary">
              <span>📐</span> MathQuest
            </h1>
            <p className="mt-1 text-sm text-mq-muted">10 câu Toán mỗi ngày — lớp {profile.grade}</p>
          </header>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {[
              { label: "Level", value: level },
              { label: "XP", value: xp },
              { label: "Coins", value: coins },
            ].map((s) => (
              <div key={s.label} className="rounded-mq-sm bg-white py-3 text-center shadow-sm">
                <div className="text-[0.65rem] font-bold uppercase tracking-wide text-mq-muted">
                  {s.label}
                </div>
                <div className="text-xl font-extrabold text-mq-primary">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-center gap-2 rounded-mq bg-gradient-to-r from-mq-accent to-amber-300 py-3.5 font-extrabold text-white">
            <span className="text-2xl">🔥</span>
            <span>{streak} ngày liên tiếp!</span>
          </div>

          <div className="mb-4 rounded-mq-sm bg-blue-50 px-3 py-2 text-sm font-semibold text-mq-primary">
            🎯 {recommendation}
          </div>

          <div className="mb-5">
            <div className="mb-2 flex justify-between text-sm font-bold">
              <span>Đề ôn hôm nay</span>
              <span>
                {done}/{DAILY_QUESTION_COUNT}
              </span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-mq-success transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3">
            {modules.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-mq-sm bg-white p-3.5 shadow-sm"
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  {m.icon}
                </span>
                <div>
                  <h3 className="font-extrabold">{m.label}</h3>
                  <p className="text-sm text-mq-muted">
                    {dailyProgress[m.id] ?? 0}/{m.dailyCount} câu · {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            {dailyComplete ? (
              <div className="rounded-mq bg-green-100 py-4 text-center font-extrabold text-mq-success">
                ✅ Đã hoàn thành đề hôm nay!
              </div>
            ) : (
              <Link
                href="/play"
                className="flex min-h-[72px] items-center justify-center rounded-mq bg-gradient-to-br from-mq-primary to-sky-400 text-xl font-extrabold text-white shadow-blue active:scale-[0.97]"
              >
                ▶ LÀM BÀI HÔM NAY
              </Link>
            )}
          </div>
        </main>
      </AppShell>
    </div>
  );
}
