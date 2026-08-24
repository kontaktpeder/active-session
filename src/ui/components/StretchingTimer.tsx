import { formatCountdown } from "../../domain/format";
import type { ActivityTimerState } from "../../session/types";

export function StretchingTimer({
  state,
  minutes,
  now,
  onStart,
}: {
  state: ActivityTimerState;
  minutes: number;
  now: number;
  onStart: () => void;
}) {
  if (state.kind === "running") {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-center">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Stretching
        </div>
        <div className="mt-1 font-mono text-4xl font-semibold tabular-nums text-primary">
          {formatCountdown(state.endsAt - now)}
        </div>
      </div>
    );
  }

  if (state.kind === "finished") {
    return (
      <div className="rounded-2xl border border-primary bg-card p-4 text-center text-lg font-semibold text-primary">
        STRETCHING FERDIG
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onStart}
      className="min-h-14 w-full rounded-2xl border border-border bg-card text-base font-semibold text-foreground transition-colors duration-200 ease-out active:bg-accent"
    >
      Start {minutes} min stretching
    </button>
  );
}
