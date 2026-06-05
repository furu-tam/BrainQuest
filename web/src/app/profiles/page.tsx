"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/ui/AppShell";
import { useAppStore } from "@/store/appStore";

const AVATARS = ["🧒", "👧", "👦", "🧒🏻", "👧🏽", "🦸", "🌟"];

export default function ProfilesPage() {
  const profiles = useAppStore((s) => s.profiles);
  const activeId = useAppStore((s) => s.activeProfileId);
  const setActive = useAppStore((s) => s.setActiveProfile);
  const addProfile = useAppStore((s) => s.addProfile);
  const removeProfile = useAppStore((s) => s.removeProfile);

  const [name, setName] = useState("");
  const [age, setAge] = useState(6);
  const [avatar, setAvatar] = useState("🧒");
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    addProfile(name.trim(), age, avatar);
    setName("");
    setAge(6);
    setShowForm(false);
  };

  return (
    <div className="page-wrap">
      <AppShell showNav={false}>
        <main className="flex flex-1 flex-col px-4 py-5">
          <Link href="/" className="mb-4 text-2xl">
            ←
          </Link>
          <h1 className="mb-1 text-2xl font-extrabold text-bq-primary">Hồ sơ bé</h1>
          <p className="mb-5 text-sm text-bq-muted">Chọn hoặc thêm hồ sơ con</p>

          <div className="mb-5 flex flex-col gap-3">
            {profiles.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-bq-sm bg-white p-4 shadow-sm ${
                  p.id === activeId ? "ring-2 ring-bq-primary" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActive(p.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className="text-3xl">{p.avatar}</span>
                  <div>
                    <div className="font-extrabold">{p.name}</div>
                    <div className="text-sm text-bq-muted">
                      {p.age} tuổi · Level {p.level}
                    </div>
                  </div>
                </button>
                {profiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProfile(p.id)}
                    className="ml-2 text-sm text-bq-danger"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>

          {showForm ? (
            <div className="rounded-bq bg-white p-4 shadow-bq">
              <label className="mb-2 block text-sm font-bold">Tên bé</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3 w-full rounded-bq-sm border border-slate-200 px-3 py-3 text-lg"
                placeholder="VD: Bé An"
              />
              <label className="mb-2 block text-sm font-bold">Tuổi: {age}</label>
              <input
                type="range"
                min={3}
                max={10}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="mb-3 w-full"
              />
              <label className="mb-2 block text-sm font-bold">Avatar</label>
              <div className="mb-4 flex flex-wrap gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`rounded-lg p-2 text-2xl ${avatar === a ? "bg-indigo-100 ring-2 ring-bq-primary" : "bg-slate-50"}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="w-full rounded-bq bg-bq-primary py-3 font-extrabold text-white"
              >
                Tạo hồ sơ
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-bq border-2 border-dashed border-bq-primary py-4 font-bold text-bq-primary"
            >
              + Thêm hồ sơ mới
            </button>
          )}
        </main>
      </AppShell>
    </div>
  );
}
