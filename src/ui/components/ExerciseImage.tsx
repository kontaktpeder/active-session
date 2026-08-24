import { useState } from "react";
import { AppSheet, SheetBody } from "./AppSheet";

export function ExerciseImage({
  src,
  alt,
  priority = false,
  onOpen,
  fill = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  onOpen?: () => void;
  fill?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? "/fallback.svg" : src;

  return (
    <>
      <button
        type="button"
        onClick={() => (onOpen ? onOpen() : setOpen(true))}
        className={
          fill
            ? "flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden border border-border bg-card"
            : "block w-full min-w-0 overflow-hidden border border-border bg-card"
        }
        aria-label={onOpen ? `Hvordan og hvorfor: ${alt}` : `Vis ${alt} større`}
      >
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          onError={() => setFailed(true)}
          className={
            fill
              ? "h-full w-full object-contain"
              : "aspect-[4/3] h-auto w-full max-w-full object-contain"
          }
        />
      </button>

      {open && (
        <AppSheet onClose={() => setOpen(false)} size="hug" nest zClassName="z-[70]">
          <SheetBody>
            <p className="display sr-only">{alt}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center pb-6 pt-1"
              aria-label="Lukk bilde"
            >
              <img src={imageSrc} alt="" className="max-h-[70dvh] w-full object-contain" />
            </button>
          </SheetBody>
        </AppSheet>
      )}
    </>
  );
}
