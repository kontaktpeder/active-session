import { Link } from "@tanstack/react-router";
import { EXERCISE_TYPES } from "../../data/exercises";
import { formatLoad } from "../../domain/format";
import type { WeekdayId, WorkoutDay } from "../../domain/types";
import { SheetBody } from "../components/AppSheet";
import { BottomAction } from "../components/BottomAction";

export function PreSessionScreen({
  day,
  conflictLabel,
  conflictDayId,
  onStart,
}: {
  day: WorkoutDay;
  conflictLabel?: string | undefined;
  conflictDayId?: WeekdayId | undefined;
  onStart: () => void;
}) {
  return (
    <SheetBody
      footer={
        day.isRestDay ? undefined : <BottomAction placement="sheet" onClick={onStart}>Start økt</BottomAction>
      }
    >
      <header className="min-w-0 pt-2 pb-1">
        <p className="display text-[11px] tracking-[0.28em] text-primary">Økt</p>
        <h1 className="display mt-1 truncate text-5xl leading-none text-foreground">
          {day.weekdayLabel}
        </h1>
        <p className="mt-1 truncate text-lg text-muted-foreground">{day.title}</p>
      </header>

      {conflictLabel && conflictDayId && (
        <Link
          to="/okt/$dayId"
          params={{ dayId: conflictDayId }}
          className="mt-5 block min-w-0 border border-border bg-card px-4 py-3"
        >
          <p className="display text-[11px] tracking-[0.18em] text-muted-foreground">Aktiv økt</p>
          <p className="mt-1 truncate text-sm text-foreground">
            Fortsett {conflictLabel} i stedet, eller start denne dagen.
          </p>
        </Link>
      )}

      {day.isRestDay ? (
        <div className="mt-8 border border-border bg-card p-6 text-center">
          <p className="display text-3xl text-foreground">Hviledag</p>
          <p className="mt-2 text-sm text-muted-foreground">Ingen økt i dag. Sveip ned for å gå til ukeprogrammet.</p>
        </div>
      ) : (
        <ul className="mt-6 min-w-0 space-y-2 pb-4">
          {day.exercises.map((exercise, index) => {
            const type = EXERCISE_TYPES[exercise.typeId];
            return (
              <li
                key={exercise.id}
                className="flex min-w-0 items-center gap-3 border border-border bg-card p-3"
              >
                <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img
                  src={type.imagePath}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 shrink-0 object-contain"
                  onError={(event) => {
                    event.currentTarget.src = "/fallback.svg";
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="display block truncate text-base leading-tight text-foreground">
                    {type.name}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {formatLoad(exercise.load)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </SheetBody>
  );
}
