import { formatElapsed } from "../../domain/format";

export function MasterTimer({ elapsedMs }: { elapsedMs: number }) {
  return (
    <div className="min-w-0 shrink-0 text-right">
      <div className="display text-[11px] tracking-[0.2em] text-muted-foreground">Total tid</div>
      <div className="font-mono text-2xl font-semibold tabular-nums text-foreground">
        {formatElapsed(elapsedMs)}
      </div>
    </div>
  );
}
