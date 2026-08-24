import { useEffect, useRef } from "react";
import { formatLoad } from "../../domain/format";
import { EXERCISE_TYPES } from "../../data/exercises";
import type { WorkoutDay } from "../../domain/types";
import { AppSheet, SheetBody } from "./AppSheet";

export function WorkoutSheet({
  day,
  activeId,
  completedIds,
  onSelect,
  onClose,
}: {
  day: WorkoutDay;
  activeId: string | undefined;
  completedIds: string[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      activeRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeId]);

  return (
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
                  disabled={done}
                  onClick={() => onSelect(exercise.id)}
                  className={`flex w-full min-w-0 items-center justify-between gap-3 border p-4 text-left transition-colors duration-200 ease-out ${
                    active
                      ? "border-primary bg-card"
                      : done
                        ? "border-border bg-card opacity-40"
                        : "border-border bg-card active:bg-accent"
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
  );
}
