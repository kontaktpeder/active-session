import { useEffect, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatLoad } from "../../domain/format";
import { EXERCISE_TYPES } from "../../data/exercises";
import type { WorkoutDay } from "../../domain/types";

export function WorkoutSheet({
  open,
  day,
  activeId,
  completedIds,
  onSelect,
  onOpenChange,
}: {
  open: boolean;
  day: WorkoutDay;
  activeId: string | undefined;
  completedIds: string[];
  onSelect: (id: string) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      activeRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, activeId]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85dvh]">
        <DrawerHeader>
          <DrawerTitle>Hele økten</DrawerTitle>
          <DrawerDescription>
            {day.weekdayLabel} · {day.title}. Dra ned for å lukke.
          </DrawerDescription>
        </DrawerHeader>

        <ul className="scroll-touch min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-3">
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

        <DrawerFooter>
          <DrawerClose asChild>
            <button
              type="button"
              className="display min-h-14 w-full border border-border bg-card text-lg tracking-[0.14em] text-foreground"
            >
              Lukk
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
