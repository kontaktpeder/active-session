import { BottomAction } from "../components/BottomAction";
import { MasterTimer } from "../components/MasterTimer";

export function CompletedScreen({
  elapsedMs,
  onEnd,
}: {
  elapsedMs: number;
  onEnd: () => void;
}) {
  return (
    <div className="app px-4">
      <div className="flex justify-end pt-6">
        <MasterTimer elapsedMs={elapsedMs} />
      </div>
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Alle øvelser er fullført
        </h1>
        <p className="mt-3 text-muted-foreground">Timeren går til du avslutter økten.</p>
      </div>
      <BottomAction onClick={onEnd}>Avslutt økt</BottomAction>
    </div>
  );
}
