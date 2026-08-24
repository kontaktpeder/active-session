import { formatLoad } from "../../domain/format";
import { EXERCISE_TYPES } from "../../data/exercises";
import { WORKOUT_DAYS } from "../../data/program";
import type { WeekdayId, WorkoutDay } from "../../domain/types";
import { BottomAction } from "../components/BottomAction";

export function PreSessionScreen({
  day,
  onSelectDay,
  onStart,
}: {
  day: WorkoutDay;
  onSelectDay: (id: WeekdayId) => void;
  onStart: () => void;
}) {
  return (
    <div className="app px-4">
      <header className="pt-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">ØKT</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {day.weekdayLabel}
        </h1>
        <p className="text-lg text-muted-foreground">{day.title}</p>
      </header>

      <nav className="-mx-4 mt-5 overflow-x-auto px-4" aria-label="Velg dag">
        <div className="flex gap-2">
          {WORKOUT_DAYS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDay(d.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out ${
                d.id === day.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {d.weekdayLabel.slice(0, 3)}
            </button>
          ))}
        </div>
      </nav>

      {day.isRestDay ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-xl font-semibold text-foreground">Hviledag</p>
          <p className="mt-2 text-sm text-muted-foreground">Ingen økt i dag. Velg en annen dag.</p>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-2">
            {day.exercises.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <img
                  src={EXERCISE_TYPES[ex.typeId].imagePath}
                  alt=""
                  className="h-12 w-12 shrink-0 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/fallback.svg";
                  }}
                />
                <span>
                  <span className="block font-medium text-foreground">
                    {EXERCISE_TYPES[ex.typeId].name}
                  </span>
                  <span className="block text-sm text-muted-foreground">{formatLoad(ex.load)}</span>
                </span>
              </li>
            ))}
          </ul>
          <BottomAction onClick={onStart}>Start økt</BottomAction>
        </>
      )}
    </div>
  );
}
