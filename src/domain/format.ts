import type { Load } from "./types";

export function formatLoad(load: Load): string {
  switch (load.kind) {
    case "distance":
      if (load.unit === "mile") return load.value === 1 ? "1 mile" : `${load.value} miles`;
      if (load.unit === "km") return `${load.value} kilometer`;
      if (load.unit === "m") return `${load.value} meter`;
      return `${load.value} yards`;
    case "reps":
      return `${load.value} reps`;
    case "setsReps":
      return `${load.sets} sett × ${load.reps} reps`;
    case "setsRepsDistance":
      return `${load.sets} sett × ${load.value} ${load.unit}`;
    case "pyramid":
      return load.reps.join(", ") + " reps";
    case "timedSets":
      return `${load.sets} sett × ${load.seconds} sekunder`;
    case "amrapSets":
      return `${load.sets} sett til utmattelse`;
    case "activityTimer":
      return `${load.minutes} minutter`;
  }
}

export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
