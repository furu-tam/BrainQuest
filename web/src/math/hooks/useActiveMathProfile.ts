import { useShallow } from "zustand/react/shallow";
import { normalizeProfile, useMathStore } from "@/math/store/mathStore";

export function useActiveMathProfile() {
  return useMathStore(
    useShallow((s) => {
      const p = s.profiles.find((x) => x.id === s.activeProfileId) ?? s.profiles[0];
      return normalizeProfile(p);
    })
  );
}
