import { useState } from "react";

export function ExerciseImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-2xl border border-border bg-card"
        aria-label={`Vis ${alt} i fullskjerm`}
      >
        <img
          src={failed ? "/fallback.svg" : src}
          alt={alt}
          onError={() => setFailed(true)}
          className="aspect-[4/3] w-full object-contain"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
        >
          <img
            src={failed ? "/fallback.svg" : src}
            alt={alt}
            className="max-h-full w-full max-w-lg object-contain"
          />
        </div>
      )}
    </>
  );
}
