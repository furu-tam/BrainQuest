"use client";

import { useShallow } from "zustand/react/shallow";
import { useMathStore, type StudentProfile } from "@/math/store/mathStore";

export function useActiveMathProfile(): StudentProfile {
  return useMathStore(
    useShallow((s) => {
      const profile =
        s.profiles.find((p) => p.id === s.activeProfileId) ?? s.profiles[0];
      return profile;
    })
  );
}
