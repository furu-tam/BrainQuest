"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/ui/AppShell";
import { getPathRecommendation } from "@/services/learningPath";
import { computeSkillScores } from "@/utils/skillStats";
import { useAppStore } from "@/store/appStore";
import { DIFFICULTY_LABEL } from "@/types/question";

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const unlockParent = useAppStore((s) => s.unlockParent);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (unlockParent(pin)) {
      onUnlock();
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
      <div className="text-5xl">🔒</div>
      <h1 className="mt-4 text-2xl font-extrabold text-bq-primary">Khu vực phụ huynh</h1>
      <p className="mt-2 text-center text-sm text-bq-muted">
        Nhập mã PIN để xem báo cáo tiến độ (mặc định: 1234)
      </p>
      <form onSubmit={submit} className="mt-6 w-full">
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="mb-3 w-full rounded-bq-sm border border-slate-200 px-4 py-4 text-center text-2xl tracking-widest"
          placeholder="••••"
        />
        {error && (
          <p className="mb-2 text-center text-sm font-bold text-bq-danger">PIN không đúng</p>
        )}
        <button
          type="submit"
          className="w-full rounded-bq bg-bq-primary py-4 font-extrabold text-white"
        >
          Mở khóa
        </button>
      </form>
    </main>
  );
}

export default function ParentPage() {
  const profiles = useAppStore((s) => s.profiles);
  const parentUnlockedUntil = useAppStore((s) => s.parentUnlockedUntil);
  const lockParent = useAppStore((s) => s.lockParent);
  const setParentPin = useAppStore((s) => s.setParentPin);
  const parentPin = useAppStore((s) => s.parentPin);
  const [unlocked, setUnlocked] = useState(false);
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    if (parentUnlockedUntil && parentUnlockedUntil > Date.now()) {
      setUnlocked(true);
    }
  }, [parentUnlockedUntil]);

  const handleLock = () => {
    lockParent();
    setUnlocked(false);
  };

  if (!unlocked) {
    return (
      <div className="page-wrap">
        <AppShell activeNav="parent" showNav={false}>
          <PinGate onUnlock={() => setUnlocked(true)} />
        </AppShell>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <AppShell activeNav="parent">
        <main className="flex flex-1 flex-col px-4 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-extrabold text-bq-primary">👨‍👩‍👧 Báo cáo phụ huynh</h1>
            <button
              type="button"
              onClick={handleLock}
              className="text-sm font-bold text-bq-muted"
            >
              Khóa
            </button>
          </div>

          {profiles.map((p) => {
            const scores = computeSkillScores(p.events);
            const total = p.events.length;
            const correct = p.events.filter((e) => e.correct).length;
            const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
            const avgTime =
              total > 0
                ? Math.round(
                    (p.events.reduce((s, e) => s + e.responseTime, 0) / total) * 10
                  ) / 10
                : 0;

            return (
              <section key={p.id} className="mb-5 rounded-bq bg-white p-4 shadow-bq">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{p.avatar}</span>
                  <div>
                    <h2 className="font-extrabold">{p.name}</h2>
                    <p className="text-sm text-bq-muted">
                      {p.age} tuổi · Streak {p.streak} ngày · {p.dailyCompleteCount} ngày hoàn thành
                    </p>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-indigo-50 py-2">
                    <div className="text-lg font-extrabold text-bq-primary">{accuracy}%</div>
                    <div className="text-xs text-bq-muted">Độ chính xác</div>
                  </div>
                  <div className="rounded-lg bg-teal-50 py-2">
                    <div className="text-lg font-extrabold text-teal-600">{avgTime}s</div>
                    <div className="text-xs text-bq-muted">TB phản hồi</div>
                  </div>
                  <div className="rounded-lg bg-amber-50 py-2">
                    <div className="text-lg font-extrabold text-amber-600">{total}</div>
                    <div className="text-xs text-bq-muted">Tổng câu</div>
                  </div>
                </div>

                <div className="mb-3 space-y-2 text-sm">
                  {(["pattern", "memory", "logic"] as const).map((g) => (
                    <div key={g} className="flex justify-between">
                      <span className="capitalize">{g}</span>
                      <span className="font-bold">
                        {scores[g].accuracy}% · {DIFFICULTY_LABEL[p.skillDifficulty[g]]}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="rounded-lg bg-bq-bg px-3 py-2 text-sm font-semibold text-bq-primary">
                  💡 {getPathRecommendation(p)}
                </p>
              </section>
            );
          })}

          <section className="rounded-bq-sm border border-slate-200 bg-white p-4">
            <h3 className="mb-2 font-extrabold">Đổi mã PIN</h3>
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="PIN mới"
                className="flex-1 rounded-lg border px-3 py-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (newPin.length >= 4) {
                    setParentPin(newPin);
                    setNewPin("");
                  }
                }}
                className="rounded-lg bg-bq-primary px-4 py-2 font-bold text-white"
              >
                Lưu
              </button>
            </div>
            <p className="mt-1 text-xs text-bq-muted">PIN hiện tại: {parentPin.replace(/./g, "•")}</p>
          </section>
        </main>
      </AppShell>
    </div>
  );
}
