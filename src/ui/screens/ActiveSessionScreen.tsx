import { useEffect, useState } from "react";
import { EXERCISE_TYPES } from "../../data/exercises";
import { formatLoad } from "../../domain/format";
import type { WorkoutDay } from "../../domain/types";
import type { ActiveSession } from "../../session/types";
import { BackLink } from "../components/BackLink";
import { BottomAction } from "../components/BottomAction";
import { ExerciseImage } from "../components/ExerciseImage";
import { ExerciseInfoSheet } from "../components/ExerciseInfoSheet";
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
  const [infoOpen, setInfoOpen] = useState(false);

  const currentId = session.remainingExerciseIds[0];
  const exercise = day.exercises.find((item) => item.id === currentId);
  const type = exercise ? EXERCISE_TYPES[exercise.typeId] : undefined;

  const nextId = session.remainingExerciseIds[1];
  const next = day.exercises.find((item) => item.id === nextId);
  const nextImagePath = next ? EXERCISE_TYPES[next.typeId].imagePath : undefined;

  useEffect(() => {
    setInfoOpen(false);
  }, [currentId]);

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
    <div className="app-session px-4">
      <header className="flex shrink-0 items-start justify-between gap-3 pt-3">
        <div className="min-w-0">
          <BackLink />
          <p className="display mt-1 truncate text-[11px] tracking-[0.24em] text-muted-foreground">
            {day.weekdayLabel}
          </p>
          <h1 className="display truncate text-xl leading-none text-foreground">{day.title}</h1>
        </div>
        <MasterTimer elapsedMs={elapsedMs} />
      </header>

      <section className="mt-3 flex min-h-0 flex-1 flex-col">
        <div className="min-h-[7.5rem] flex-1">
          <ExerciseImage
            src={type.imagePath}
            alt={type.name}
            priority
            fill
            onOpen={() => setInfoOpen(true)}
          />
        </div>
        <h2 className="display mt-2 truncate text-3xl leading-none text-foreground">{type.name}</h2>
        <p className="mt-0.5 truncate text-base text-muted-foreground">{formatLoad(exercise.load)}</p>
      </section>

      {exercise.load.kind === "activityTimer" && (
        <div className="mt-3 shrink-0">
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
        <p className="display mt-2 shrink-0 border border-primary bg-card p-3 text-center text-lg text-primary">
          Start neste sett
        </p>
      )}

      <div className="mt-3 shrink-0">
        <RestButtons
          restEndsAt={session.restEndsAt}
          now={now}
          onStart={onStartRest}
          onCancel={onCancelRest}
        />
      </div>

      <div className="mt-2 flex shrink-0 items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setInfoOpen(false);
            setSheetOpen(true);
          }}
          className="display min-h-10 border border-border bg-card px-3 text-sm tracking-[0.14em] text-foreground"
        >
          Hele økten
        </button>
        <button
          type="button"
          onClick={onReset}
          className="truncate text-sm text-muted-foreground underline underline-offset-4"
        >
          Nullstill
        </button>
      </div>

      {next && (
        <p className="mt-1 shrink-0 min-w-0 truncate text-sm text-muted-foreground">
          Neste: {EXERCISE_TYPES[next.typeId].name} · {formatLoad(next.load)}
        </p>
      )}

      {showUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="mt-2 w-full shrink-0 border border-border bg-card p-2 text-sm font-semibold text-foreground"
        >
          Angre siste «Øvelse ferdig»
        </button>
      )}

      {infoOpen && (
        <ExerciseInfoSheet
          typeId={exercise.typeId}
          load={exercise.load}
          onClose={() => setInfoOpen(false)}
        />
      )}
      {sheetOpen && (
        <WorkoutSheet
          day={day}
          activeId={currentId}
          completedIds={session.completedExerciseIds}
          onJump={(id) => {
            onJump(id);
            setSheetOpen(false);
          }}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <BottomAction placement="session" onClick={onComplete}>
        Øvelse ferdig
      </BottomAction>
    </div>
  );
}
