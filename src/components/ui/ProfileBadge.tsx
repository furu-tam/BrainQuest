"use client";

import Link from "next/link";
import { useAppStore } from "@/store/appStore";

export function ProfileBadge() {
  const profile = useAppStore((s) => s.getActiveProfile());

  return (
    <Link
      href="/profiles"
      className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold shadow-sm"
    >
      <span className="text-xl">{profile.avatar}</span>
      <span>{profile.name}</span>
    </Link>
  );
}
