import { useCallback, useEffect, useMemo, useState } from "react";
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
import { AppSheet, SheetBody } from "./components/AppSheet";
import { RestOverlay, restOverlayLabel } from "./components/RestOverlay";

interface Summary {
  dayId: WeekdayId;
  completed: number;
  elapsedMs: number;
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

  const elapsedMs = session ? masterElapsedMs(session, now) : 0;
  const restLabel =
    session ? restOverlayLabel(session.restEndsAt, now, visible, "START") : null;
  const timer = session?.activityTimerState;
  const stretchLabel =
    timer?.kind === "running"
      ? restOverlayLabel(timer.endsAt, now, visible, "STRETCHING FERDIG")
      : null;
  const overlayLabel = restLabel ?? stretchLabel;

  let body;
  if (!hydrated) {
    body = (
      <SheetBody>
        <p className="pt-2 text-sm text-muted-foreground">Åpner…</p>
      </SheetBody>
    );
  } else if (summary) {
    const summaryDay = WORKOUT_DAYS.find((item) => item.id === summary.dayId)!;
    body = (
      <SummaryScreen
        weekdayLabel={summaryDay.weekdayLabel}
        title={summaryDay.title}
        completed={summary.completed}
        elapsedMs={summary.elapsedMs}
        onClose={onLeave}
      />
    );
  } else if (!session) {
    body = (
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
    );
  } else if (isAllDone(session)) {
    body = (
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
    );
  } else {
    body = (
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
    );
  }

  return (
    <>
      <AppSheet onClose={onLeave}>{body}</AppSheet>
      {overlayLabel && <RestOverlay label={overlayLabel} />}
    </>
  );
}
