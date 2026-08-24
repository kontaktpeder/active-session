import { useEffect, useRef, useState } from "react";
import { formatLoad } from "../../domain/format";
import { EXERCISE_TYPES } from "../../data/exercises";
import type { WorkoutDay } from "../../domain/types";
import { AppSheet, SheetBody } from "./AppSheet";
import { ExerciseInfoSheet } from "./ExerciseInfoSheet";

export function WorkoutSheet({
  day,
  activeId,
  completedIds,
  onJump,
  onClose,
}: {
  day: WorkoutDay;
  activeId: string | undefined;
  completedIds: string[];
  onJump: (id: string) => void;
  onClose: () => void;
}) {
  const [infoId, setInfoId] = useState<string | null>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      activeRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeId]);

  const infoExercise = infoId
    ? day.exercises.find((exercise) => exercise.id === infoId)
    : undefined;
  const infoDone = infoExercise ? completedIds.includes(infoExercise.id) : false;
  const infoActive = infoExercise?.id === activeId;
  const canJump = Boolean(infoExercise && !infoDone && !infoActive);

  return (
    <>
      <AppSheet
        onClose={onClose}
        detents={["half", "full"]}
        initialDetent="half"
        zClassName="z-[55]"
      >
      <SheetBody>
        <h2 className="display pt-1 text-3xl text-foreground">Hele økten</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {day.weekdayLabel} · {day.title}. Sveip ned for å lukke.
        </p>
        <ul className="mt-4 min-w-0 space-y-2 pb-4">
          {day.exercises.map((exercise) => {
            const done = completedIds.includes(exercise.id);
            const active = exercise.id === activeId;
            const type = EXERCISE_TYPES[exercise.typeId];
            return (
              <li key={exercise.id} className="min-w-0">
                <button
                  type="button"
                  ref={active ? activeRef : undefined}
                  onClick={() => setInfoId(exercise.id)}
                  className={`flex w-full min-w-0 items-center justify-between gap-3 border p-4 text-left transition-colors duration-200 ease-out ${
                    active
                      ? "border-primary bg-card"
                      : done
                        ? "border-border bg-card opacity-40"
                        : "border-border bg-card"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="display block truncate text-base text-foreground">
                      {type.name}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {formatLoad(exercise.load)}
                    </span>
                  </span>
                  <span className="display shrink-0 text-[11px] tracking-[0.16em] text-muted-foreground">
                    {done ? "Ferdig" : active ? "Aktiv" : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </SheetBody>
      </AppSheet>
      {infoExercise && (
        <ExerciseInfoSheet
          typeId={infoExercise.typeId}
          load={infoExercise.load}
          onClose={() => setInfoId(null)}
          onJump={canJump ? () => onJump(infoExercise.id) : undefined}
        />
      )}
    </>
  );
}
