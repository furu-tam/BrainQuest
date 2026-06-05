import { useShallow } from "zustand/react/shallow";
import { normalizeProfile, useAppStore } from "@/store/appStore";

export function useActiveProfile() {
  return useAppStore(
    useShallow((s) => {
      const p = s.profiles.find((x) => x.id === s.activeProfileId) ?? s.profiles[0];
      return normalizeProfile(p);
    })
  );
}
