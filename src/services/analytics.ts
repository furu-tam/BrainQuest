import type { GameEvent } from "@/store/appStore";

export function trackEvent(event: GameEvent) {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event);
  }
  // Phase 2+: sync to FastAPI + PostgreSQL
}
