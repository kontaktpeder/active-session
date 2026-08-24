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
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Hvile</div>
        <div className="mt-1 font-mono text-4xl font-semibold tabular-nums text-primary">
          {formatCountdown(restEndsAt - now)}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 text-sm font-medium text-muted-foreground underline underline-offset-4"
        >
          Avbryt hvile
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onStart(m)}
          className="min-h-14 rounded-2xl border border-border bg-card text-base font-semibold text-foreground transition-colors duration-200 ease-out active:bg-accent"
        >
          {m} min
        </button>
      ))}
    </div>
  );
}
