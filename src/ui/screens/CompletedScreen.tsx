import { SheetBody } from "../components/AppSheet";
import { BottomAction } from "../components/BottomAction";
import { MasterTimer } from "../components/MasterTimer";

export function CompletedScreen({ elapsedMs, onEnd }: { elapsedMs: number; onEnd: () => void }) {
  return (
    <SheetBody
      footer={
        <BottomAction placement="sheet" onClick={onEnd}>
          Avslutt økt
        </BottomAction>
      }
    >
      <div className="flex justify-end pt-2">
        <MasterTimer elapsedMs={elapsedMs} />
      </div>
      <div className="mt-16 min-w-0 pb-8 text-center">
        <h1 className="display text-4xl leading-none text-foreground">Alle øvelser er fullført</h1>
        <p className="mt-3 text-muted-foreground">Timeren går til du avslutter økten.</p>
      </div>
    </SheetBody>
  );
}
