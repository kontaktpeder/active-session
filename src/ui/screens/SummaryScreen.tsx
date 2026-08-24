import { formatElapsed } from "../../domain/format";
import { BottomAction } from "../components/BottomAction";

export function SummaryScreen({
  weekdayLabel,
  title,
  completed,
  elapsedMs,
  onClose,
}: {
  weekdayLabel: string;
  title: string;
  completed: number;
  elapsedMs: number;
  onClose: () => void;
}) {
  return (
    <div className="app px-4">
      <header className="pt-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Oppsummering</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {weekdayLabel}
        </h1>
        <p className="text-lg text-muted-foreground">{title}</p>
      </header>

      <dl className="mt-8 space-y-2">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <dt className="text-muted-foreground">Øvelser fullført</dt>
          <dd className="text-xl font-semibold text-foreground">{completed}</dd>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <dt className="text-muted-foreground">Total tid</dt>
          <dd className="font-mono text-xl font-semibold tabular-nums text-foreground">
            {formatElapsed(elapsedMs)}
          </dd>
        </div>
      </dl>

      <BottomAction onClick={onClose}>Ferdig</BottomAction>
    </div>
  );
}
