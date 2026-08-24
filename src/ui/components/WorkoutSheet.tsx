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
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95">
      <div className="mx-auto w-full max-w-[430px] flex-1 overflow-y-auto px-4 pb-28 pt-[calc(env(safe-area-inset-top)+16px)]">
        <h2 className="text-xl font-semibold text-foreground">Hele økten</h2>
        <ul className="mt-4 space-y-2">
          {day.exercises.map((ex) => {
            const done = completedIds.includes(ex.id);
            const active = ex.id === activeId;
            return (
              <li key={ex.id}>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => onSelect(ex.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors duration-200 ease-out ${
                    active
                      ? "border-primary bg-card"
                      : done
                        ? "border-border bg-card opacity-40"
                        : "border-border bg-card active:bg-accent"
                  }`}
                >
                  <span>
                    <span className="block font-medium text-foreground">
                      {EXERCISE_TYPES[ex.typeId].name}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {formatLoad(ex.load)}
                    </span>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {done ? "Ferdig" : active ? "Aktiv" : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="bottom-action">
        <div className="mx-auto w-full max-w-[430px]">
          <button
            type="button"
            onClick={onClose}
            className="min-h-14 w-full rounded-2xl border border-border bg-card text-lg font-semibold text-foreground"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
}
