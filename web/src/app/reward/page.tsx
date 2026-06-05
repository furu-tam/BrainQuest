"use client";

import Link from "next/link";
import { AppShell } from "@/components/ui/AppShell";
import { useActiveProfile } from "@/hooks/useActiveProfile";
import { useAppStore } from "@/store/appStore";

export default function RewardPage() {
  const bonus = useAppStore((s) => s.lastSessionBonus);
  const profile = useActiveProfile();

  return (
    <div className="page-wrap">
      <AppShell showNav={false}>
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
          <div className="animate-bounce text-6xl">🎉</div>
          <h1 className="mt-3 text-3xl font-extrabold text-bq-primary">Mission Complete!</h1>
          <p className="mt-2 text-sm text-bq-muted">Giỏi lắm {profile.name}!</p>
          <div className="my-6 text-7xl drop-shadow-lg">🎁</div>
          <div className="mb-8 flex w-full flex-col gap-3">
            <div className="flex items-center justify-center gap-3 rounded-bq bg-white py-4 text-xl font-extrabold shadow-bq">
              <span>⭐</span> +{bonus?.xp ?? 50} XP
            </div>
            <div className="flex items-center justify-center gap-3 rounded-bq bg-white py-4 text-xl font-extrabold shadow-bq">
              <span>🪙</span> +{bonus?.coins ?? 20} Coins
            </div>
          </div>
          <Link
            href="/"
            className="flex w-full min-h-[72px] items-center justify-center rounded-bq bg-gradient-to-br from-bq-primary to-indigo-400 text-xl font-extrabold text-white shadow-purple"
          >
            Về trang chủ
          </Link>
          <Link href="/dashboard" className="mt-4 font-bold text-bq-primary">
            Xem tiến độ →
          </Link>
        </main>
      </AppShell>
    </div>
  );
}
