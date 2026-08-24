import { useState } from "react";
import { formatLoad } from "../../domain/format";
import { EXERCISE_TYPES } from "../../data/exercises";
import type { WorkoutDay } from "../../domain/types";
import type { ActiveSession } from "../../session/types";
import { BottomAction } from "../components/BottomAction";
import { ExerciseImage } from "../components/ExerciseImage";
import { MasterTimer } from "../components/MasterTimer";
import { RestButtons } from "../components/RestButtons";
import { StretchingTimer } from "../components/StretchingTimer";
import { WorkoutSheet } from "../components/WorkoutSheet";

export function ActiveSessionScreen({
  day,
  session,
  now,
  elapsedMs,
  onStartRest,
  onCancelRest,
  onStartActivityTimer,
  onComplete,
  onUndo,
  onJump,
  onReset,
}: {
  day: WorkoutDay;
  session: ActiveSession;
  now: number;
  elapsedMs: number;
  onStartRest: (minutes: number) => void;
  onCancelRest: () => void;
  onStartActivityTimer: (minutes: number) => void;
  onComplete: () => void;
  onUndo: () => void;
  onJump: (id: string) => void;
  onReset: () => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const currentId = session.remainingExerciseIds[0];
  const exercise = day.exercises.find((e) => e.id === currentId);
  if (!exercise) return null;
  const type = EXERCISE_TYPES[exercise.typeId];

  const nextId = session.remainingExerciseIds[1];
  const next = day.exercises.find((e) => e.id === nextId);

  const showUndo = session.undo !== null && now < session.undo.expiresAt;

  return (
    <div className="app px-4">
      <header className="flex items-start justify-between pt-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {day.weekdayLabel}
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{day.title}</h1>
        </div>
        <MasterTimer elapsedMs={elapsedMs} />
      </header>

      <section className="mt-5">
        <ExerciseImage src={type.imagePath} alt={type.name} />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{type.name}</h2>
        <p className="text-lg text-muted-foreground">{formatLoad(exercise.load)}</p>
      </section>

      {exercise.load.kind === "activityTimer" && (
        <div className="mt-4">
          <StretchingTimer
            state={session.activityTimerState}
            minutes={exercise.load.minutes}
            now={now}
            onStart={() => onStartActivityTimer((exercise.load as { minutes: number }).minutes)}
          />
        </div>
      )}

      {session.missedRestCue && (
        <p className="mt-4 rounded-2xl border border-primary bg-card p-4 text-center text-lg font-semibold text-primary">
          START NESTE SETT
        </p>
      )}

      <div className="mt-4">
        <RestButtons
          restEndsAt={session.restEndsAt}
          now={now}
          onStart={onStartRest}
          onCancel={onCancelRest}
        />
      </div>

      {next && (
        <p className="mt-4 text-sm text-muted-foreground">
          Neste: {EXERCISE_TYPES[next.typeId].name} · {formatLoad(next.load)}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
        >
          Hele økten
        </button>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          Nullstill aktiv økt
        </button>
      </div>

      {showUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="mt-4 w-full rounded-2xl border border-border bg-card p-3 text-sm font-medium text-foreground"
        >
          Angre siste «Øvelse ferdig»
        </button>
      )}

      {sheetOpen && (
        <WorkoutSheet
          day={day}
          activeId={currentId}
          completedIds={session.completedExerciseIds}
          onSelect={(id) => {
            onJump(id);
            setSheetOpen(false);
          }}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <BottomAction onClick={onComplete}>Øvelse ferdig</BottomAction>
    </div>
  );
}
