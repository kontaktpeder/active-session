import { useCallback, useEffect, useMemo, useState } from "react";
import { WORKOUT_DAYS } from "../data/program";
import type { WeekdayId } from "../domain/types";
import { useNow } from "../hooks/useNow";
import { useVisibility } from "../hooks/useVisibility";
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
import { RestOverlay, restOverlayLabel } from "./components/RestOverlay";

const WEEKDAY_BY_INDEX: WeekdayId[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

interface Summary {
  dayId: WeekdayId;
  completed: number;
  elapsedMs: number;
}

export function App() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<WeekdayId>("monday");
  const [summary, setSummary] = useState<Summary | null>(null);

  const { visible, wasHiddenRef } = useVisibility();

  useEffect(() => {
    const stored = loadSession();
    if (stored && stored.endedAt === null) {
      setSession(stored);
      setSelectedDayId(stored.workoutDayId);
    } else {
      setSelectedDayId(WEEKDAY_BY_INDEX[new Date().getDay()] ?? "monday");
    }
    setHydrated(true);
  }, []);

  const update = useCallback((next: ActiveSession | null) => {
    setSession(next);
    saveSession(next);
  }, []);

  const now = useNow(hydrated && session !== null);

  // Hvile og aktivitetstimer avstemmes mot klokka, aldri mot tellere.
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

  const day = useMemo(
    () => WORKOUT_DAYS.find((d) => d.id === (session?.workoutDayId ?? selectedDayId))!,
    [session, selectedDayId],
  );

  if (!hydrated) return <div className="app" />;

  if (summary) {
    const sDay = WORKOUT_DAYS.find((d) => d.id === summary.dayId)!;
    return (
      <SummaryScreen
        weekdayLabel={sDay.weekdayLabel}
        title={sDay.title}
        completed={summary.completed}
        elapsedMs={summary.elapsedMs}
        onClose={() => setSummary(null)}
      />
    );
  }

  if (!session) {
    const preDay = WORKOUT_DAYS.find((d) => d.id === selectedDayId)!;
    return (
      <PreSessionScreen
        day={preDay}
        onSelectDay={setSelectedDayId}
        onStart={() => update(startSession(preDay))}
      />
    );
  }

  const elapsedMs = masterElapsedMs(session, now);

  if (isAllDone(session)) {
    return (
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
  }

  const restLabel = restOverlayLabel(session.restEndsAt, now, visible, "START");
  const timer = session.activityTimerState;
  const stretchLabel =
    timer.kind === "running"
      ? restOverlayLabel(timer.endsAt, now, visible, "STRETCHING FERDIG")
      : null;
  const overlayLabel = restLabel ?? stretchLabel;

  return (
    <>
      {overlayLabel && <RestOverlay label={overlayLabel} />}
      <ActiveSessionScreen
        day={day}
        session={session}
        now={now}
        elapsedMs={elapsedMs}
        onStartRest={(m) => update(startRest(session, m))}
        onCancelRest={() => update(clearRest(session))}
        onStartActivityTimer={(m) => update(startActivityTimer(session, m))}
        onComplete={() => update(completeExercise(session))}
        onUndo={() => update(undoComplete(session))}
        onJump={(id) => update(jump(session, id))}
        onReset={() => {
          if (window.confirm("Dette sletter fremdriften for denne økten. Fortsette?")) {
            update(null);
          }
        }}
      />
    </>
  );
}
