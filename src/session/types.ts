import type { WeekdayId } from "../domain/types";

export const SESSION_SCHEMA_VERSION = 1;
export const SESSION_STORAGE_KEY = "okt.activeSession.v1";

export type ActivityTimerState =
  | { kind: "idle" }
  | { kind: "running"; endsAt: number }
  | { kind: "finished" };

export type SessionPhase = "pre" | "active" | "allDone" | "summary";

export interface UndoSnapshot {
  completedId: string;
  remainingExerciseIds: string[];
  completedExerciseIds: string[];
  expiresAt: number;
}

export interface ActiveSession {
  schemaVersion: number;
  workoutDayId: WeekdayId;
  startedAt: number;
  endedAt: number | null;
  remainingExerciseIds: string[];
  completedExerciseIds: string[];
  restEndsAt: number | null;
  missedRestCue: boolean;
  activityTimerState: ActivityTimerState;
  undo: UndoSnapshot | null;
}
