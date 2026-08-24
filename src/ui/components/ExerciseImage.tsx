import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function ExerciseImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? "/fallback.svg" : src;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full min-w-0 overflow-hidden border border-border bg-card"
        aria-label={`Vis ${alt} større`}
      >
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          onError={() => setFailed(true)}
          className="aspect-[4/3] h-auto w-full max-w-full object-contain"
        />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-auto max-h-[88dvh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{alt}</DrawerTitle>
            <DrawerDescription>Dra ned eller trykk utenfor for å lukke.</DrawerDescription>
          </DrawerHeader>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-0 flex-1 items-center justify-center px-4 pb-6 pt-2"
            aria-label="Lukk bilde"
          >
            <img
              src={imageSrc}
              alt=""
              className="max-h-[70dvh] w-full object-contain"
            />
          </button>
        </DrawerContent>
      </Drawer>
    </>
  );
}
