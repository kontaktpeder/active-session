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
      <div className="min-w-0 border border-border bg-card p-4 text-center">
        <div className="display text-[11px] tracking-[0.2em] text-muted-foreground">Stretching</div>
        <div className="mt-1 font-mono text-4xl font-semibold tabular-nums text-primary">
          {formatCountdown(state.endsAt - now)}
        </div>
      </div>
    );
  }

  if (state.kind === "finished") {
    return (
      <div className="display min-w-0 border border-primary bg-card p-4 text-center text-xl text-primary">
        Stretching ferdig
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onStart}
      className="display min-h-14 w-full min-w-0 border border-border bg-card text-base tracking-[0.08em] text-foreground transition-colors duration-200 ease-out active:bg-accent"
    >
      Start {minutes} min stretching
    </button>
  );
}
