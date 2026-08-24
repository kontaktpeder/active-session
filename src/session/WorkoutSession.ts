import type { WorkoutDay } from "../domain/types";
import { completeCurrent, jumpToExercise } from "../domain/queue";
import type { ActiveSession } from "./types";
import { SESSION_SCHEMA_VERSION } from "./types";

const UNDO_MS = 5000;

export function startSession(day: WorkoutDay, now = Date.now()): ActiveSession {
  const ids = day.exercises.map((e) => e.id);
  return {
    schemaVersion: SESSION_SCHEMA_VERSION,
    workoutDayId: day.id,
    startedAt: now,
    endedAt: null,
    remainingExerciseIds: ids,
    completedExerciseIds: [],
    restEndsAt: null,
    missedRestCue: false,
    activityTimerState: { kind: "idle" },
    undo: null,
  };
}

export function startRest(session: ActiveSession, minutes: number, now = Date.now()): ActiveSession {
  return { ...session, restEndsAt: now + minutes * 60_000, missedRestCue: false };
}

export function clearRest(session: ActiveSession): ActiveSession {
  return { ...session, restEndsAt: null, missedRestCue: false };
}

export function markMissedRestIfNeeded(
  session: ActiveSession,
  wasHidden: boolean,
  now = Date.now(),
): ActiveSession {
  if (!session.restEndsAt || now < session.restEndsAt) return session;
  if (wasHidden) return { ...session, restEndsAt: null, missedRestCue: true };
  return { ...session, restEndsAt: null };
}

export function completeExercise(session: ActiveSession, now = Date.now()): ActiveSession {
  const current = session.remainingExerciseIds[0];
  if (!current) return session;

  return {
    ...session,
    remainingExerciseIds: completeCurrent(session.remainingExerciseIds),
    completedExerciseIds: [...session.completedExerciseIds, current],
    restEndsAt: null,
    missedRestCue: false,
    activityTimerState: { kind: "idle" },
    undo: {
      completedId: current,
      remainingExerciseIds: session.remainingExerciseIds,
      completedExerciseIds: session.completedExerciseIds,
      expiresAt: now + UNDO_MS,
    },
  };
}

export function undoComplete(session: ActiveSession, now = Date.now()): ActiveSession {
  if (!session.undo || now > session.undo.expiresAt) return { ...session, undo: null };
  return {
    ...session,
    remainingExerciseIds: session.undo.remainingExerciseIds,
    completedExerciseIds: session.undo.completedExerciseIds,
    undo: null,
  };
}

export function jump(session: ActiveSession, targetId: string): ActiveSession {
  if (session.completedExerciseIds.includes(targetId)) return session;
  return {
    ...session,
    remainingExerciseIds: jumpToExercise(session.remainingExerciseIds, targetId),
    restEndsAt: null,
    missedRestCue: false,
    activityTimerState: { kind: "idle" },
    undo: null,
  };
}

export function startActivityTimer(
  session: ActiveSession,
  minutes: number,
  now = Date.now(),
): ActiveSession {
  return { ...session, activityTimerState: { kind: "running", endsAt: now + minutes * 60_000 } };
}

export function syncActivityTimer(session: ActiveSession, now = Date.now()): ActiveSession {
  const t = session.activityTimerState;
  if (t.kind === "running" && now >= t.endsAt) {
    return { ...session, activityTimerState: { kind: "finished" } };
  }
  return session;
}

export function endSession(session: ActiveSession, now = Date.now()): ActiveSession {
  return { ...session, endedAt: now, restEndsAt: null };
}

export function masterElapsedMs(session: ActiveSession, now = Date.now()): number {
  const end = session.endedAt ?? now;
  return Math.max(0, end - session.startedAt);
}

export function isAllDone(session: ActiveSession): boolean {
  return session.remainingExerciseIds.length === 0 && session.endedAt === null;
}
