import { useShallow } from "zustand/react/shallow";
import { useMathStore, type StudentProfile } from "@/math/store/mathStore";

/** Profile đang active — tham chiếu ổn định từ store, tránh re-render vô hạn */
export function useActiveMathProfile(): StudentProfile {
  return useMathStore(
    useShallow((s) => {
      const profile =
        s.profiles.find((p) => p.id === s.activeProfileId) ?? s.profiles[0];
      return profile;
    })
  );
}
