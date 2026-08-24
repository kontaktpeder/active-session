import { formatElapsed } from "../../domain/format";
import { SheetBody } from "../components/AppSheet";
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
    <SheetBody
      footer={
        <BottomAction placement="sheet" onClick={onClose}>
          Ferdig
        </BottomAction>
      }
    >
      <header className="min-w-0 pt-2">
        <p className="display text-[11px] tracking-[0.28em] text-primary">Oppsummering</p>
        <h1 className="display mt-1 truncate text-5xl leading-none text-foreground">
          {weekdayLabel}
        </h1>
        <p className="truncate text-lg text-muted-foreground">{title}</p>
      </header>

      <dl className="mt-8 min-w-0 space-y-2 pb-4">
        <div className="flex min-w-0 items-center justify-between gap-3 border border-border bg-card p-4">
          <dt className="truncate text-muted-foreground">Øvelser fullført</dt>
          <dd className="display shrink-0 text-2xl text-foreground">{completed}</dd>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3 border border-border bg-card p-4">
          <dt className="truncate text-muted-foreground">Total tid</dt>
          <dd className="shrink-0 font-mono text-xl font-semibold tabular-nums text-foreground">
            {formatElapsed(elapsedMs)}
          </dd>
        </div>
      </dl>
    </SheetBody>
  );
}
