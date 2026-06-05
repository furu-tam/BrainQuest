import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Difficulty, Question } from "@/types/question";
import { initialDifficultyForAge, nextDifficulty } from "@/utils/adaptiveDifficulty";

export type GameType = "pattern" | "memory" | "logic";

export interface GameEvent {
  timestamp: string;
  sessionId: string;
  childId: string;
  game: GameType;
  difficulty: Difficulty;
  correct: boolean;
  responseTime: number;
}

export interface WrongQuestionItem {
  id: string;
  game: GameType;
  question: Question;
  createdAt: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  xp: number;
  coins: number;
  streak: number;
  level: number;
  dailyProgress: { pattern: number; memory: number; logic: number };
  dailyComplete: boolean;
  dailyCompleteCount: number;
  todayWrongQuestions: WrongQuestionItem[];
  towerCurrentFloor: number;
  towerBestFloor: number;
  towerConqueredFloors: number[];
  events: GameEvent[];
  skillDifficulty: Record<GameType, Difficulty>;
}

const DAILY_MISSION = { pattern: 2, memory: 2, logic: 1 };

function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

function isProfileComplete(profile: ChildProfile): boolean {
  return (
    Array.isArray(profile.todayWrongQuestions) &&
    Array.isArray(profile.towerConqueredFloors) &&
    typeof profile.towerCurrentFloor === "number" &&
    typeof profile.towerBestFloor === "number"
  );
}

/** Bổ sung field mặc định cho profile cũ trong localStorage */
export function normalizeProfile(profile: ChildProfile): ChildProfile {
  if (isProfileComplete(profile)) return profile;

  const age = profile.age ?? 6;
  const diff = initialDifficultyForAge(age);
  return {
    ...profile,
    age,
    dailyProgress: profile.dailyProgress ?? { pattern: 0, memory: 0, logic: 0 },
    dailyComplete: profile.dailyComplete ?? false,
    dailyCompleteCount: profile.dailyCompleteCount ?? 0,
    todayWrongQuestions: profile.todayWrongQuestions ?? [],
    towerCurrentFloor: profile.towerCurrentFloor ?? 1,
    towerBestFloor: profile.towerBestFloor ?? 1,
    towerConqueredFloors: profile.towerConqueredFloors ?? [],
    events: profile.events ?? [],
    skillDifficulty: profile.skillDifficulty ?? {
      pattern: diff,
      memory: diff,
      logic: diff,
    },
  };
}

function normalizeProfiles(profiles: ChildProfile[]): ChildProfile[] {
  return profiles.map(normalizeProfile);
}

function createDefaultProfile(name = "Bé Minh", age = 6): ChildProfile {
  const diff = initialDifficultyForAge(age);
  return {
    id: crypto.randomUUID(),
    name,
    age,
    avatar: "🧒",
    xp: 0,
    coins: 0,
    streak: 0,
    level: 1,
    dailyProgress: { pattern: 0, memory: 0, logic: 0 },
    dailyComplete: false,
    dailyCompleteCount: 0,
    todayWrongQuestions: [],
    towerCurrentFloor: 1,
    towerBestFloor: 1,
    towerConqueredFloors: [],
    events: [],
    skillDifficulty: { pattern: diff, memory: diff, logic: diff },
  };
}

interface AppState {
  profiles: ChildProfile[];
  activeProfileId: string;
  parentPin: string;
  voiceEnabled: boolean;
  sessionId: string;
  lastSessionBonus: { xp: number; coins: number } | null;
  parentUnlockedUntil: number | null;

  getActiveProfile: () => ChildProfile;
  addProfile: (name: string, age: number, avatar: string) => void;
  updateProfile: (id: string, data: Partial<Pick<ChildProfile, "name" | "age" | "avatar">>) => void;
  removeProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  setParentPin: (pin: string) => void;
  unlockParent: (pin: string) => boolean;
  lockParent: () => void;
  setVoiceEnabled: (enabled: boolean) => void;
  startSession: () => void;
  resetDailyIfNewDay: () => void;
  recordAnswer: (
    game: GameType,
    correct: boolean,
    responseTime: number,
    difficulty: Difficulty,
    question?: Question,
    reviewQuestionId?: string
  ) => void;
  getTodayWrongQuestions: () => WrongQuestionItem[];
  resolveWrongQuestion: (questionId: string) => void;
  completeDaily: () => void;
  getDifficultyForGame: (game: GameType) => Difficulty;
  recordTowerAnswer: (
    game: GameType,
    correct: boolean,
    responseTime: number,
    difficulty: Difficulty
  ) => void;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function updateProfileInList(
  profiles: ChildProfile[],
  id: string,
  updater: (p: ChildProfile) => ChildProfile
): ChildProfile[] {
  return profiles.map((p) => (p.id === id ? updater(p) : p));
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const defaultProfile = createDefaultProfile();

      return {
        profiles: [defaultProfile],
        activeProfileId: defaultProfile.id,
        parentPin: "1234",
        voiceEnabled: true,
        sessionId: crypto.randomUUID(),
        lastSessionBonus: null,
        parentUnlockedUntil: null,

        getActiveProfile: () => {
          const state = get();
          return (
            state.profiles.find((p) => p.id === state.activeProfileId) ??
            state.profiles[0]
          );
        },

        addProfile: (name, age, avatar) => {
          const profile = createDefaultProfile(name, age);
          profile.avatar = avatar;
          set((s) => ({
            profiles: [...s.profiles, profile],
            activeProfileId: profile.id,
          }));
        },

        updateProfile: (id, data) =>
          set((s) => ({
            profiles: updateProfileInList(s.profiles, id, (p) => ({ ...p, ...data })),
          })),

        removeProfile: (id) =>
          set((s) => {
            if (s.profiles.length <= 1) return s;
            const profiles = s.profiles.filter((p) => p.id !== id);
            return {
              profiles,
              activeProfileId:
                s.activeProfileId === id ? profiles[0].id : s.activeProfileId,
            };
          }),

        setActiveProfile: (id) => set({ activeProfileId: id }),

        setParentPin: (pin) => set({ parentPin: pin }),

        unlockParent: (pin) => {
          if (pin !== get().parentPin) return false;
          set({ parentUnlockedUntil: Date.now() + 30 * 60 * 1000 });
          return true;
        },

        lockParent: () => set({ parentUnlockedUntil: null }),

        setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),

        startSession: () => set({ sessionId: crypto.randomUUID(), lastSessionBonus: null }),

        resetDailyIfNewDay: () => {
          if (typeof window === "undefined") return;
          const last = localStorage.getItem("bq_last_day");
          const today = todayKey();
          if (last !== today) {
            localStorage.setItem("bq_last_day", today);
            set((s) => ({
              profiles: s.profiles.map((p) => ({
                ...p,
                dailyProgress: { pattern: 0, memory: 0, logic: 0 },
                dailyComplete: false,
                todayWrongQuestions: [],
              })),
            }));
          }
        },

        getDifficultyForGame: (game) => {
          const profile = get().getActiveProfile();
          return profile.skillDifficulty[game];
        },

        getTodayWrongQuestions: () => {
          return get().getActiveProfile().todayWrongQuestions ?? [];
        },

        resolveWrongQuestion: (questionId) => {
          const profile = get().getActiveProfile();
          set((s) => ({
            profiles: updateProfileInList(s.profiles, profile.id, (p) => ({
              ...p,
              todayWrongQuestions: (p.todayWrongQuestions ?? []).filter((q) => q.id !== questionId),
            })),
          }));
        },

        recordAnswer: (game, correct, responseTime, difficulty, question, reviewQuestionId) => {
          const state = get();
          const profile = state.getActiveProfile();
          const event: GameEvent = {
            timestamp: new Date().toISOString(),
            sessionId: state.sessionId,
            childId: profile.id,
            game,
            difficulty,
            correct,
            responseTime,
          };

          const progress = { ...profile.dailyProgress };
          if (correct && progress[game] < DAILY_MISSION[game]) {
            progress[game] += 1;
          }

          const newDifficulty = nextDifficulty(
            profile.skillDifficulty[game],
            [...profile.events, event],
            game
          );

          const xpGain = correct ? 10 : 0;
          const coinGain = correct ? 5 : 0;
          const newXp = profile.xp + xpGain;
          const shouldAddWrong = !correct && Boolean(question) && !reviewQuestionId;

          set((s) => ({
            profiles: updateProfileInList(s.profiles, profile.id, (p) => ({
              ...p,
              events: [...p.events, event],
              dailyProgress: progress,
              xp: newXp,
              coins: p.coins + coinGain,
              level: levelFromXp(newXp),
              todayWrongQuestions: shouldAddWrong
                ? [
                    ...(p.todayWrongQuestions ?? []),
                    {
                      id: crypto.randomUUID(),
                      game,
                      question: question as Question,
                      createdAt: new Date().toISOString(),
                    },
                  ]
                : correct && reviewQuestionId
                  ? (p.todayWrongQuestions ?? []).filter((q) => q.id !== reviewQuestionId)
                  : (p.todayWrongQuestions ?? []),
              skillDifficulty: {
                ...p.skillDifficulty,
                [game]: newDifficulty,
              },
            })),
          }));
        },

        completeDaily: () => {
          const profile = get().getActiveProfile();
          const bonus = { xp: 50, coins: 20 };
          set((s) => ({
            lastSessionBonus: bonus,
            profiles: updateProfileInList(s.profiles, profile.id, (p) => ({
              ...p,
              dailyComplete: true,
              dailyCompleteCount: p.dailyCompleteCount + 1,
              xp: p.xp + bonus.xp,
              coins: p.coins + bonus.coins,
              level: levelFromXp(p.xp + bonus.xp),
              streak: p.dailyComplete ? p.streak : p.streak + 1,
            })),
          }));
        },

        recordTowerAnswer: (game, correct, responseTime, difficulty) => {
          const state = get();
          const profile = state.getActiveProfile();
          const event: GameEvent = {
            timestamp: new Date().toISOString(),
            sessionId: state.sessionId,
            childId: profile.id,
            game,
            difficulty,
            correct,
            responseTime,
          };

          const xpGain = correct ? 15 : 0;
          const coinGain = correct ? 8 : 0;
          const newXp = profile.xp + xpGain;

          set((s) => ({
            profiles: updateProfileInList(s.profiles, profile.id, (p) => {
              const normalized = normalizeProfile(p);
              if (correct) {
                const conquered = normalized.towerConqueredFloors.includes(
                  normalized.towerCurrentFloor
                )
                  ? normalized.towerConqueredFloors
                  : [...normalized.towerConqueredFloors, normalized.towerCurrentFloor];
                const nextFloor = normalized.towerCurrentFloor + 1;
                return {
                  ...normalized,
                  events: [...normalized.events, event],
                  xp: newXp,
                  coins: normalized.coins + coinGain,
                  level: levelFromXp(newXp),
                  towerConqueredFloors: conquered,
                  towerCurrentFloor: nextFloor,
                  towerBestFloor: Math.max(normalized.towerBestFloor, nextFloor),
                };
              }

              return {
                ...normalized,
                events: [...normalized.events, event],
                towerCurrentFloor: 1,
                towerConqueredFloors: [],
              };
            }),
          }));
        },
      };
    },
    {
      name: "brainquest-v2",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { profiles?: ChildProfile[] };
        return {
          ...(persisted as object),
          profiles: normalizeProfiles(state.profiles ?? []),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state?.profiles?.length) return;
        const normalized = normalizeProfiles(state.profiles);
        const changed = normalized.some((p, i) => p !== state.profiles[i]);
        if (changed) {
          useAppStore.setState({ profiles: normalized });
        }
      },
    }
  )
);

export function dailyTotalProgress(progress: ChildProfile["dailyProgress"]) {
  return progress.pattern + progress.memory + progress.logic;
}

export function isDailyMissionDone(progress: ChildProfile["dailyProgress"]) {
  return (
    progress.pattern >= DAILY_MISSION.pattern &&
    progress.memory >= DAILY_MISSION.memory &&
    progress.logic >= DAILY_MISSION.logic
  );
}

export const DAILY_MISSION_TOTAL = 5;

/** @deprecated use useAppStore */
export const useGameStore = useAppStore;
