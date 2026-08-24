import { formatElapsed } from "../../domain/format";

export function MasterTimer({ elapsedMs }: { elapsedMs: number }) {
  return (
    <div className="text-right">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Total tid</div>
      <div className="font-mono text-2xl font-semibold tabular-nums text-foreground">
        {formatElapsed(elapsedMs)}
      </div>
    </div>
  );
}
