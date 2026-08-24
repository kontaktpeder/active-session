import { BackLink } from "../components/BackLink";
import { BottomAction } from "../components/BottomAction";
import { MasterTimer } from "../components/MasterTimer";

export function CompletedScreen({ elapsedMs, onEnd }: { elapsedMs: number; onEnd: () => void }) {
  return (
    <div className="app px-4">
      <div className="flex items-start justify-between gap-3 pt-5">
        <BackLink />
        <MasterTimer elapsedMs={elapsedMs} />
      </div>
      <div className="mt-16 min-w-0 text-center">
        <h1 className="display text-4xl leading-none text-foreground">Alle øvelser er fullført</h1>
        <p className="mt-3 text-muted-foreground">Timeren går til du avslutter økten.</p>
      </div>
      <BottomAction onClick={onEnd}>Avslutt økt</BottomAction>
    </div>
  );
}
