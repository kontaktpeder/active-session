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
  const compact = label.length > 2;
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center overflow-x-clip bg-background/85 px-4">
      <div
        className={`display animate-in fade-in zoom-in max-w-full text-center text-primary duration-200 ${
          compact ? "text-4xl leading-tight" : "text-7xl leading-none"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
