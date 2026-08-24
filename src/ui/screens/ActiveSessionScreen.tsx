import { useEffect, useState } from "react";
import { EXERCISE_TYPES } from "../../data/exercises";
import { formatLoad } from "../../domain/format";
import type { WorkoutDay } from "../../domain/types";
import type { ActiveSession } from "../../session/types";
import { BackLink } from "../components/BackLink";
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
  const exercise = day.exercises.find((item) => item.id === currentId);
  const type = exercise ? EXERCISE_TYPES[exercise.typeId] : undefined;

  const nextId = session.remainingExerciseIds[1];
  const next = day.exercises.find((item) => item.id === nextId);
  const nextImagePath = next ? EXERCISE_TYPES[next.typeId].imagePath : undefined;

  useEffect(() => {
    if (!nextImagePath) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = nextImagePath;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [nextImagePath]);

  if (!exercise || !type) return null;

  const showUndo = session.undo !== null && now < session.undo.expiresAt;

  return (
    <div className="app px-4">
      <header className="flex min-w-0 items-start justify-between gap-3 pt-5">
        <div className="min-w-0">
          <BackLink />
          <p className="display mt-3 truncate text-[11px] tracking-[0.24em] text-muted-foreground">
            {day.weekdayLabel}
          </p>
          <h1 className="display truncate text-2xl leading-none text-foreground">{day.title}</h1>
        </div>
        <MasterTimer elapsedMs={elapsedMs} />
      </header>

      <section className="mt-5 min-w-0">
        <ExerciseImage src={type.imagePath} alt={type.name} priority />
        <h2 className="display mt-4 truncate text-4xl leading-none text-foreground">{type.name}</h2>
        <p className="mt-1 truncate text-lg text-muted-foreground">{formatLoad(exercise.load)}</p>
      </section>

      {exercise.load.kind === "activityTimer" && (
        <div className="mt-4 min-w-0">
          <StretchingTimer
            state={session.activityTimerState}
            minutes={exercise.load.minutes}
            now={now}
            onStart={() => {
              if (exercise.load.kind === "activityTimer") {
                onStartActivityTimer(exercise.load.minutes);
              }
            }}
          />
        </div>
      )}

      {session.missedRestCue && (
        <p className="display mt-4 border border-primary bg-card p-4 text-center text-xl text-primary">
          Start neste sett
        </p>
      )}

      <div className="mt-4 min-w-0">
        <RestButtons
          restEndsAt={session.restEndsAt}
          now={now}
          onStart={onStartRest}
          onCancel={onCancelRest}
        />
      </div>

      {next && (
        <p className="mt-4 min-w-0 truncate text-sm text-muted-foreground">
          Neste: {EXERCISE_TYPES[next.typeId].name} · {formatLoad(next.load)}
        </p>
      )}

      <div className="mt-4 flex min-w-0 items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="display min-h-11 border border-border bg-card px-4 text-sm tracking-[0.14em] text-foreground"
        >
          Hele økten
        </button>
        <button
          type="button"
          onClick={onReset}
          className="truncate text-sm text-muted-foreground underline underline-offset-4"
        >
          Nullstill aktiv økt
        </button>
      </div>

      {showUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="mt-4 w-full border border-border bg-card p-3 text-sm font-semibold text-foreground"
        >
          Angre siste «Øvelse ferdig»
        </button>
      )}

      <WorkoutSheet
        open={sheetOpen}
        day={day}
        activeId={currentId}
        completedIds={session.completedExerciseIds}
        onSelect={(id) => {
          onJump(id);
          setSheetOpen(false);
        }}
        onOpenChange={setSheetOpen}
      />

      <BottomAction onClick={onComplete}>Øvelse ferdig</BottomAction>
    </div>
  );
}
