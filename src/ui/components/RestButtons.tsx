import { formatCountdown } from "../../domain/format";

export function RestButtons({
  restEndsAt,
  now,
  onStart,
  onCancel,
}: {
  restEndsAt: number | null;
  now: number;
  onStart: (minutes: number) => void;
  onCancel: () => void;
}) {
  if (restEndsAt && restEndsAt > now) {
    return (
      <div className="min-w-0 border border-border bg-card p-3">
        <div className="display text-[11px] tracking-[0.2em] text-muted-foreground">Hvile</div>
        <div className="mt-0.5 font-mono text-3xl font-semibold tabular-nums text-primary">
          {formatCountdown(restEndsAt - now)}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 text-sm font-semibold text-muted-foreground underline underline-offset-4"
        >
          Avbryt hvile
        </button>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-3 gap-2">
      {[1, 2, 3].map((minutes) => (
        <button
          key={minutes}
          type="button"
          onClick={() => onStart(minutes)}
          className="display min-h-12 min-w-0 border border-border bg-card text-sm tracking-[0.08em] text-foreground transition-colors duration-200 ease-out active:bg-accent"
        >
          {minutes} min
        </button>
      ))}
    </div>
  );
}
