export function restOverlayLabel(
  endsAt: number | null,
  now: number,
  visible: boolean,
  finalLabel = "START",
) {
  if (!visible || !endsAt) return null;
  const left = endsAt - now;
  if (left > 3000 || left < -400) return null;
  if (left > 2000) return "3";
  if (left > 1000) return "2";
  if (left > 0) return "1";
  return finalLabel;
}

export function RestOverlay({ label }: { label: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-background/85">
      <div className="animate-in fade-in zoom-in text-center text-6xl font-bold tracking-tight text-primary duration-200">
        {label}
      </div>
    </div>
  );
}
