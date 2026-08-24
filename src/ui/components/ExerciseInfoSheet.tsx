import { EXERCISE_GUIDES, EXERCISE_SAFETY, type GuideSource } from "../../data/exerciseGuides";
import { EXERCISE_TYPES } from "../../data/exercises";
import { formatLoad } from "../../domain/format";
import type { ExerciseTypeId, Load } from "../../domain/types";
import { AppSheet, SheetBody } from "./AppSheet";
import { BottomAction } from "./BottomAction";
import { ExerciseImage } from "./ExerciseImage";

export function ExerciseInfoSheet({
  typeId,
  load,
  onClose,
  onJump,
}: {
  typeId: ExerciseTypeId;
  load?: Load | undefined;
  onClose: () => void;
  onJump?: (() => void) | undefined;
}) {
  const type = EXERCISE_TYPES[typeId];
  const guide = EXERCISE_GUIDES[typeId];

  return (
    <AppSheet
      onClose={onClose}
      detents={["half", "full"]}
      initialDetent="half"
      zClassName="z-[60]"
    >
      <SheetBody
        footer={
          onJump ? (
            <BottomAction placement="sheet" onClick={onJump}>
              Gå til denne øvelsen
            </BottomAction>
          ) : undefined
        }
      >
        <ExerciseImage src={type.imagePath} alt={type.name} priority />
        <header className="min-w-0 pt-4">
          <p className="display text-[11px] tracking-[0.24em] text-primary">Øvelse</p>
          <h2 className="display mt-1 text-4xl leading-none text-foreground">{type.name}</h2>
          {load && (
            <p className="mt-1 truncate text-lg text-muted-foreground">{formatLoad(load)}</p>
          )}
        </header>

        <GuideSection title="Slik gjør du" body={guide.how} />
        <GuideSection title="Hvorfor" body={guide.why} source={guide.whySource} />
        {guide.important && <GuideSection title="Viktig" body={guide.important} />}
        <GuideSection
          title="Forstå mer"
          body={guide.understandMore}
          source={guide.understandMoreSource}
        />

        <p className="mt-6 pb-6 text-sm text-muted-foreground">{EXERCISE_SAFETY}</p>
      </SheetBody>
    </AppSheet>
  );
}

function GuideSection({
  title,
  body,
  source,
}: {
  title: string;
  body: string;
  source?: GuideSource | undefined;
}) {
  return (
    <section className="mt-6 min-w-0">
      <h3 className="display text-[11px] tracking-[0.24em] text-muted-foreground">{title}</h3>
      <p className="mt-2 text-base leading-relaxed text-foreground">{body}</p>
      {source && (
        <a
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-primary underline underline-offset-4"
        >
          {source.label}
        </a>
      )}
    </section>
  );
}
