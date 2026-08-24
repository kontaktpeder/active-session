import { formatLoad } from "../../domain/format";
import { EXERCISE_TYPES } from "../../data/exercises";
import type { WorkoutDay } from "../../domain/types";

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
  return (
    <div className="fixed inset-0 z-50 flex min-w-0 flex-col overflow-x-clip bg-background/95">
      <div className="mx-auto w-full min-w-0 max-w-[430px] flex-1 overflow-x-clip overflow-y-auto px-4 pb-28 pt-[calc(env(safe-area-inset-top)+16px)]">
        <h2 className="display text-3xl text-foreground">Hele økten</h2>
        <ul className="mt-4 min-w-0 space-y-2">
          {day.exercises.map((exercise) => {
            const done = completedIds.includes(exercise.id);
            const active = exercise.id === activeId;
            const type = EXERCISE_TYPES[exercise.typeId];
            return (
              <li key={exercise.id} className="min-w-0">
                <button
                  type="button"
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
      </div>
      <div className="bottom-action">
        <div className="mx-auto w-full min-w-0 max-w-[430px]">
          <button
            type="button"
            onClick={onClose}
            className="display min-h-14 w-full border border-border bg-card text-lg tracking-[0.14em] text-foreground"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
}
