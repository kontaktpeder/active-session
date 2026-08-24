import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { EXERCISE_TYPES } from "../../data/exercises";
import { WORKOUT_DAYS } from "../../data/program";
import { formatElapsed, formatLoad } from "../../domain/format";
import type { WeekdayId, WorkoutDay } from "../../domain/types";
import { getTodayWeekdayId, WEEKDAY_SHORT } from "../../lib/week";
import { loadSession } from "../../session/storage";
import { masterElapsedMs } from "../../session/WorkoutSession";
import type { ActiveSession } from "../../session/types";

export function DashboardScreen() {
  const [todayId, setTodayId] = useState<WeekdayId | null>(null);
  const [live, setLive] = useState<ActiveSession | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setTodayId(getTodayWeekdayId());
    setLive(loadSession());
    setNow(Date.now());
  }, []);

  const liveDay = live ? WORKOUT_DAYS.find((day) => day.id === live.workoutDayId) : undefined;

  return (
    <div className="app app-plain px-4">
      <header className="min-w-0 pt-7">
        <p className="display text-[11px] tracking-[0.28em] text-primary">ØKT</p>
        <h1 className="display mt-1 text-5xl leading-none text-foreground">Ukeprogram</h1>
        <p className="mt-2 max-w-full text-sm text-muted-foreground">
          Velg dag. Økten åpnes med timer, hvile og kø.
        </p>
      </header>

      {live && liveDay && live.endedAt === null && (
        <Link
          to="/okt/$dayId"
          params={{ dayId: live.workoutDayId }}
          className="mt-6 flex min-w-0 items-center justify-between gap-3 border border-primary bg-card px-4 py-4"
        >
          <span className="min-w-0">
            <span className="display block text-[11px] tracking-[0.22em] text-primary">
              Aktiv økt
            </span>
            <span className="display mt-1 block truncate text-2xl leading-none text-foreground">
              {liveDay.weekdayLabel}
            </span>
            <span className="mt-1 block font-mono text-sm tabular-nums text-muted-foreground">
              {formatElapsed(masterElapsedMs(live, now))}
            </span>
          </span>
          <span className="display shrink-0 text-sm tracking-[0.16em] text-primary">
            Fortsett
          </span>
        </Link>
      )}

      <section className="mt-8 min-w-0">
        <h2 className="display text-[11px] tracking-[0.24em] text-muted-foreground">Hele uka</h2>
        <div className="mt-3 flex min-w-0 flex-col gap-3">
          {WORKOUT_DAYS.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              isToday={day.id === todayId}
              isLive={live?.workoutDayId === day.id && live.endedAt === null}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 min-w-0 border-t border-border pt-6">
        <h2 className="display text-[11px] tracking-[0.24em] text-muted-foreground">Om appen</h2>
        <p className="mt-3 text-sm text-muted-foreground">Exercise data by RepDB</p>
        <a
          href="https://repdb.co"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm text-primary underline underline-offset-4"
        >
          https://repdb.co
        </a>
      </section>
    </div>
  );
}

function DayCard({
  day,
  isToday,
  isLive,
}: {
  day: WorkoutDay;
  isToday: boolean;
  isLive: boolean;
}) {
  return (
    <Link
      to="/okt/$dayId"
      params={{ dayId: day.id }}
      className={`block min-w-0 overflow-hidden border p-4 transition-colors duration-200 ease-out active:bg-accent ${
        isToday ? "border-primary bg-card" : "border-border bg-card"
      }`}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="display text-4xl leading-none text-foreground">
              {WEEKDAY_SHORT[day.id]}
            </span>
            {isToday && (
              <span className="display border border-primary px-2 py-0.5 text-[10px] tracking-[0.18em] text-primary">
                I dag
              </span>
            )}
            {isLive && (
              <span className="display border border-border px-2 py-0.5 text-[10px] tracking-[0.18em] text-muted-foreground">
                Pågår
              </span>
            )}
          </div>
          <h3 className="display mt-2 truncate text-xl leading-none text-foreground">
            {day.weekdayLabel}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{day.title}</p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
      </div>

      {day.isRestDay ? (
        <p className="display mt-4 text-sm tracking-[0.16em] text-muted-foreground">Hviledag</p>
      ) : (
        <ol className="mt-4 min-w-0 space-y-2">
          {day.exercises.map((exercise, index) => {
            const type = EXERCISE_TYPES[exercise.typeId];
            return (
              <li key={exercise.id} className="flex min-w-0 items-center gap-3">
                <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img
                  src={type.imagePath}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-8 shrink-0 object-contain"
                  onError={(event) => {
                    event.currentTarget.src = "/fallback.svg";
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="display block truncate text-sm leading-tight text-foreground">
                    {type.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {formatLoad(exercise.load)}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="display mt-4 text-[11px] tracking-[0.2em] text-primary">
        {day.isRestDay ? "Se dag" : isLive ? "Fortsett økt" : "Åpne økt"}
      </p>
    </Link>
  );
}
