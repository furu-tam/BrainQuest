"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { ProfileBadge } from "@/components/ui/ProfileBadge";
import { VoiceToggle } from "@/components/ui/VoiceToggle";
import { getPathRecommendation } from "@/services/learningPath";
import { useActiveProfile } from "@/hooks/useActiveProfile";
import {
  DAILY_MISSION_TOTAL,
  dailyTotalProgress,
  useAppStore,
} from "@/store/appStore";

export default function HomePage() {
  const profile = useActiveProfile();
  const resetDailyIfNewDay = useAppStore((s) => s.resetDailyIfNewDay);

  useEffect(() => {
    resetDailyIfNewDay();
  }, [resetDailyIfNewDay]);

  const { xp, coins, level, streak, dailyProgress, dailyComplete } = profile;
  const todayWrongQuestions = profile.todayWrongQuestions ?? [];
  const towerConqueredFloors = profile.towerConqueredFloors ?? [];
  const towerCurrentFloor = profile.towerCurrentFloor ?? 1;
  const towerBestFloor = profile.towerBestFloor ?? 1;
  const done = dailyTotalProgress(dailyProgress);
  const pct = Math.round((done / DAILY_MISSION_TOTAL) * 100);
  const recommendation = getPathRecommendation(profile);

  return (
    <div className="page-wrap">
      <AppShell activeNav="home">
        <main className="flex flex-1 flex-col px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <ProfileBadge />
            <VoiceToggle />
          </div>

          <header className="mb-5 text-center">
            <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold text-bq-primary">
              <span>🧠</span> BrainQuest
            </h1>
            <p className="mt-1 text-sm text-bq-muted">5 phút mỗi ngày — tiến bộ từng chút!</p>
          </header>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {[
              { label: "Level", value: level },
              { label: "XP", value: xp },
              { label: "Coins", value: coins },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-bq-sm bg-white py-3 text-center shadow-sm"
              >
                <div className="text-[0.65rem] font-bold uppercase tracking-wide text-bq-muted">
                  {s.label}
                </div>
                <div className="text-xl font-extrabold text-bq-primary">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-center gap-2 rounded-bq bg-gradient-to-r from-bq-accent to-amber-300 py-3.5 font-extrabold text-white shadow-orange">
            <span className="text-2xl">🔥</span>
            <span>{streak} ngày liên tiếp!</span>
          </div>

          <div className="mb-4 rounded-bq-sm bg-indigo-50 px-3 py-2 text-sm font-semibold text-bq-primary">
            🎯 {recommendation}
          </div>

          <div className="mb-5">
            <div className="mb-2 flex justify-between text-sm font-bold">
              <span>Thử thách hôm nay</span>
              <span>
                {done}/{DAILY_MISSION_TOTAL}
              </span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-bq-success transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3">
            {[
              { icon: "🔴🔵", title: "Nhận diện quy luật", sub: `${dailyProgress.pattern}/2 câu` },
              { icon: "🐶🐱", title: "Ghi nhớ", sub: `${dailyProgress.memory}/2 câu` },
              { icon: "🐘🐶", title: "Suy luận logic", sub: `${dailyProgress.logic}/1 câu` },
            ].map((m) => (
              <div
                key={m.title}
                className="flex items-center gap-3 rounded-bq-sm bg-white p-3.5 shadow-sm"
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                  {m.icon}
                </span>
                <div>
                  <h3 className="font-extrabold">{m.title}</h3>
                  <p className="text-sm text-bq-muted">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-5 rounded-bq-sm bg-white p-3.5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-extrabold text-bq-primary">🏰 Mode Leo Tháp</h3>
              <span className="text-sm font-bold text-bq-muted">
                Kỷ lục: tầng {Math.max(1, towerBestFloor - 1)}
              </span>
            </div>
            <p className="text-sm text-bq-muted">
              Chinh phục {towerConqueredFloors.length} cửa trong lượt hiện tại.
            </p>
            <Link
              href="/tower"
              className="mt-3 flex min-h-[60px] items-center justify-center rounded-bq bg-gradient-to-br from-amber-500 to-orange-400 text-lg font-extrabold text-white"
            >
              Leo tháp: tầng {towerCurrentFloor}
            </Link>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            {dailyComplete ? (
              <div className="rounded-bq bg-green-100 py-4 text-center font-extrabold text-bq-success">
                ✅ Đã hoàn thành hôm nay!
              </div>
            ) : (
              <Link
                href="/play"
                className="flex min-h-[72px] items-center justify-center rounded-bq bg-gradient-to-br from-bq-primary to-indigo-400 text-xl font-extrabold text-white shadow-purple active:scale-[0.97]"
              >
                ▶ PLAY TODAY
              </Link>
            )}

            {todayWrongQuestions.length > 0 && (
              <Link
                href="/review"
                className="flex min-h-[60px] items-center justify-center rounded-bq border-2 border-bq-accent bg-white text-lg font-extrabold text-bq-accent"
              >
                Ôn lại câu sai ({todayWrongQuestions.length})
              </Link>
            )}
          </div>
        </main>
      </AppShell>
    </div>
  );
}
