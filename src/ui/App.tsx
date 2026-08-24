import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { WORKOUT_DAYS } from "../data/program";
import type { WeekdayId } from "../domain/types";
import { useNow } from "../hooks/useNow";
import { useVisibility } from "../hooks/useVisibility";
import { getWorkoutDay } from "../lib/week";
import { loadSession, saveSession } from "../session/storage";
import type { ActiveSession } from "../session/types";
import {
  clearRest,
  completeExercise,
  endSession,
  isAllDone,
  jump,
  markMissedRestIfNeeded,
  masterElapsedMs,
  startActivityTimer,
  startRest,
  startSession,
  syncActivityTimer,
  undoComplete,
} from "../session/WorkoutSession";
import { ActiveSessionScreen } from "./screens/ActiveSessionScreen";
import { CompletedScreen } from "./screens/CompletedScreen";
import { PreSessionScreen } from "./screens/PreSessionScreen";
import { SummaryScreen } from "./screens/SummaryScreen";
import { AppSheet } from "./components/AppSheet";
import { RestOverlay, restOverlayLabel } from "./components/RestOverlay";

interface Summary {
  dayId: WeekdayId;
  completed: number;
  elapsedMs: number;
}

function SessionPage({ children }: { children: ReactNode }) {
  return <div className="fixed inset-0 z-40 overflow-hidden bg-background">{children}</div>;
}

export function SessionApp({ dayId, onLeave }: { dayId: WeekdayId; onLeave: () => void }) {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  const { visible, wasHiddenRef } = useVisibility();

  useEffect(() => {
    const stored = loadSession();
    if (stored && stored.endedAt === null && stored.workoutDayId === dayId) {
      setSession(stored);
    } else {
      setSession(null);
    }
    setHydrated(true);
  }, [dayId]);

  const update = useCallback((next: ActiveSession | null) => {
    setSession(next);
    saveSession(next);
  }, []);

  const now = useNow(hydrated && session !== null);

  useEffect(() => {
    if (!session) return;
    let next = session;
    if (session.restEndsAt && now >= session.restEndsAt) {
      const wasHidden = wasHiddenRef.current || document.visibilityState !== "visible";
      next = markMissedRestIfNeeded(next, wasHidden, now);
      wasHiddenRef.current = false;
    }
    next = syncActivityTimer(next, now);
    if (next !== session) update(next);
  }, [now, session, update, wasHiddenRef]);

  const day = useMemo(() => getWorkoutDay(dayId), [dayId]);
  const foreignSession = useMemo(() => {
    if (typeof window === "undefined" || !hydrated) return null;
    const stored = loadSession();
    if (stored && stored.endedAt === null && stored.workoutDayId !== dayId) return stored;
    return null;
  }, [dayId, hydrated, session]);

  const startThisDay = () => {
    if (foreignSession) {
      const other = WORKOUT_DAYS.find((item) => item.id === foreignSession.workoutDayId);
      const ok = window.confirm(
        `Du har en uferdig økt (${other?.weekdayLabel ?? "annen dag"}). Starte ${day.weekdayLabel} likevel? Den andre økten slettes.`,
      );
      if (!ok) return;
    }
    update(startSession(day));
  };

  if (!hydrated) return null;

  if (summary) {
    const summaryDay = WORKOUT_DAYS.find((item) => item.id === summary.dayId)!;
    return (
      <AppSheet onClose={onLeave}>
        <SummaryScreen
          weekdayLabel={summaryDay.weekdayLabel}
          title={summaryDay.title}
          completed={summary.completed}
          elapsedMs={summary.elapsedMs}
          onClose={onLeave}
        />
      </AppSheet>
    );
  }

  if (!session) {
    return (
      <AppSheet onClose={onLeave}>
        <PreSessionScreen
          day={day}
          conflictLabel={
            foreignSession
              ? WORKOUT_DAYS.find((item) => item.id === foreignSession.workoutDayId)?.weekdayLabel
              : undefined
          }
          conflictDayId={foreignSession?.workoutDayId}
          onStart={startThisDay}
        />
      </AppSheet>
    );
  }

  const elapsedMs = masterElapsedMs(session, now);
  const restLabel = restOverlayLabel(session.restEndsAt, now, visible, "START");
  const timer = session.activityTimerState;
  const stretchLabel =
    timer.kind === "running"
      ? restOverlayLabel(timer.endsAt, now, visible, "STRETCHING FERDIG")
      : null;
  const overlayLabel = restLabel ?? stretchLabel;

  if (isAllDone(session)) {
    return (
      <SessionPage>
        <CompletedScreen
          elapsedMs={elapsedMs}
          onEnd={() => {
            const ended = endSession(session);
            setSummary({
              dayId: ended.workoutDayId,
              completed: ended.completedExerciseIds.length,
              elapsedMs: masterElapsedMs(ended),
            });
            update(null);
          }}
        />
      </SessionPage>
    );
  }

  return (
    <SessionPage>
      {overlayLabel && <RestOverlay label={overlayLabel} />}
      <ActiveSessionScreen
        day={day}
        session={session}
        now={now}
        elapsedMs={elapsedMs}
        onStartRest={(minutes) => update(startRest(session, minutes))}
        onCancelRest={() => update(clearRest(session))}
        onStartActivityTimer={(minutes) => update(startActivityTimer(session, minutes))}
        onComplete={() => update(completeExercise(session))}
        onUndo={() => update(undoComplete(session))}
        onJump={(id) => update(jump(session, id))}
        onReset={() => {
          if (window.confirm("Dette sletter fremdriften for denne økten. Fortsette?")) {
            update(null);
          }
        }}
      />
    </SessionPage>
  );
}
