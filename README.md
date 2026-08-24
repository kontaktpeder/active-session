# Workout Companion

Her er et ferdig kodeforslag du kan lime inn i Lovable. Kjernen er **hardkodet program + lokal økt-tilstand + tidsstempler som sannhetskilde**. UI-et leser bare repository og session-store.

Jeg er i **Ask-modus**, så dette er forslag — ikke filer i et prosjekt. Bytt til Agent-modus hvis du vil at jeg skal bygge det.

---

## Filstruktur

```text
src/
  domain/
    types.ts
    queue.ts
    format.ts
  data/
    exercises.ts
    program.ts
    HardcodedWorkoutRepository.ts
  session/
    types.ts
    storage.ts
    WorkoutSession.ts
  hooks/
    useNow.ts
    useVisibility.ts
  ui/
    App.tsx
    screens/PreSessionScreen.tsx
    screens/ActiveSessionScreen.tsx
    screens/CompletedScreen.tsx
    screens/SummaryScreen.tsx
    components/MasterTimer.tsx
    components/RestButtons.tsx
    components/RestOverlay.tsx
    components/StretchingTimer.tsx
    components/ExerciseImage.tsx
    components/WorkoutSheet.tsx
    components/BottomAction.tsx
  styles.css
public/
  icons/
  images/exercises/*.svg
  fallback.svg
  manifest.webmanifest
  sw.js
```

---

## 1. Domene — typer

```ts
// src/domain/types.ts

export type WeekdayId =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ExerciseTypeId =
  | "run"
  | "pull-ups"
  | "push-ups"
  | "air-squats"
  | "stretching"
  | "deadlifts"
  | "box-jumps"
  | "floor-wipers"
  | "clean-press"
  | "bent-over-row"
  | "sled-pull"
  | "lat-pulldown"
  | "close-grip-cable-row"
  | "cable-bicep-curls"
  | "bench-press"
  | "tricep-pushdown"
  | "tricep-overhead"
  | "chest-flys"
  | "dips"
  | "weighted-planks"
  | "squats"
  | "military-press"
  | "leg-press"
  | "arnold-press"
  | "hamstring-curls"
  | "shoulder-front-raises";

export type Load =
  | { kind: "distance"; value: number; unit: "mile" | "km" | "m" | "yards" }
  | { kind: "reps"; value: number }
  | { kind: "setsReps"; sets: number; reps: number }
  | { kind: "pyramid"; reps: number[] }
  | { kind: "timedSets"; sets: number; seconds: number }
  | { kind: "amrapSets"; sets: number } // til utmattelse
  | { kind: "activityTimer"; minutes: number };

export interface ExerciseType {
  id: ExerciseTypeId;
  name: string; // engelsk øvelsesnavn
  imagePath: string;
}

export interface WorkoutExercise {
  id: string; // unik per forekomst, f.eks. wed-pull-ups-1
  typeId: ExerciseTypeId;
  load: Load;
}

export interface WorkoutDay {
  id: WeekdayId;
  weekdayLabel: string;
  title: string;
  isRestDay: boolean;
  exercises: WorkoutExercise[];
}

export interface WorkoutRepository {
  getWorkoutDays(): Promise;
  getWorkoutDay(id: WeekdayId): Promise;
  getExerciseType(id: ExerciseTypeId): Promise;
}
```

---

## 2. Kølogikk (hopp A → C blir C → A → B → D)

```ts
// src/domain/queue.ts

/** remaining[0] er alltid aktiv øvelse. */
export function jumpToExercise(
  remaining: string[],
  targetId: string
): string[] {
  if (remaining.length === 0) return remaining;
  if (remaining[0] === targetId) return remaining;

  const idx = remaining.indexOf(targetId);
  if (idx < 0) return remaining; // fullført eller ukjent: ignorer

  const selected = remaining[idx];
  const skipped = remaining.slice(0, idx);
  const after = remaining.slice(idx + 1);
  return [selected, ...skipped, ...after];
}

export function completeCurrent(remaining: string[]): string[] {
  return remaining.slice(1);
}
```

Flere hopp bevarer alle ufullførte. Ingen øvelse markeres ferdig ved hopping.

---

## 3. Format (norsk UI, engelske øvelsesnavn)

```ts
// src/domain/format.ts
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
```

---

## 4. Hardkodet program

```ts
// src/data/exercises.ts
import type { ExerciseType, ExerciseTypeId } from "../domain/types";

export const EXERCISE_TYPES: Record = {
  run: { id: "run", name: "Run", imagePath: "/images/exercises/run.svg" },
  "pull-ups": { id: "pull-ups", name: "Pull-ups", imagePath: "/images/exercises/pull-ups.svg" },
  "push-ups": { id: "push-ups", name: "Push-ups", imagePath: "/images/exercises/push-ups.svg" },
  "air-squats": { id: "air-squats", name: "Air Squats", imagePath: "/images/exercises/air-squats.svg" },
  stretching: { id: "stretching", name: "Stretching", imagePath: "/images/exercises/stretching.svg" },
  deadlifts: { id: "deadlifts", name: "Deadlifts", imagePath: "/images/exercises/deadlifts.svg" },
  "box-jumps": { id: "box-jumps", name: "Box Jumps", imagePath: "/images/exercises/box-jumps.svg" },
  "floor-wipers": { id: "floor-wipers", name: "Floor Wipers", imagePath: "/images/exercises/floor-wipers.svg" },
  "clean-press": { id: "clean-press", name: "Clean & Press", imagePath: "/images/exercises/clean-press.svg" },
  "bent-over-row": { id: "bent-over-row", name: "Bent Over Row", imagePath: "/images/exercises/bent-over-row.svg" },
  "sled-pull": { id: "sled-pull", name: "Sled Pull", imagePath: "/images/exercises/sled-pull.svg" },
  "lat-pulldown": { id: "lat-pulldown", name: "Lat Pulldown", imagePath: "/images/exercises/lat-pulldown.svg" },
  "close-grip-cable-row": {
    id: "close-grip-cable-row",
    name: "Close-Grip Cable Row",
    imagePath: "/images/exercises/close-grip-cable-row.svg",
  },
  "cable-bicep-curls": {
    id: "cable-bicep-curls",
    name: "Cable Bicep Curls",
    imagePath: "/images/exercises/cable-bicep-curls.svg",
  },
  "bench-press": { id: "bench-press", name: "Bench Press", imagePath: "/images/exercises/bench-press.svg" },
  "tricep-pushdown": {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    imagePath: "/images/exercises/tricep-pushdown.svg",
  },
  "tricep-overhead": {
    id: "tricep-overhead",
    name: "Tricep Overhead Extension",
    imagePath: "/images/exercises/tricep-overhead.svg",
  },
  "chest-flys": { id: "chest-flys", name: "Chest Flys", imagePath: "/images/exercises/chest-flys.svg" },
  dips: { id: "dips", name: "Dips", imagePath: "/images/exercises/dips.svg" },
  "weighted-planks": {
    id: "weighted-planks",
    name: "Weighted Planks",
    imagePath: "/images/exercises/weighted-planks.svg",
  },
  squats: { id: "squats", name: "Squats", imagePath: "/images/exercises/squats.svg" },
  "military-press": {
    id: "military-press",
    name: "Military Press",
    imagePath: "/images/exercises/military-press.svg",
  },
  "leg-press": { id: "leg-press", name: "Leg Press", imagePath: "/images/exercises/leg-press.svg" },
  "arnold-press": { id: "arnold-press", name: "Arnold Press", imagePath: "/images/exercises/arnold-press.svg" },
  "hamstring-curls": {
    id: "hamstring-curls",
    name: "Hamstring Curls",
    imagePath: "/images/exercises/hamstring-curls.svg",
  },
  "shoulder-front-raises": {
    id: "shoulder-front-raises",
    name: "Shoulder Front Raises",
    imagePath: "/images/exercises/shoulder-front-raises.svg",
  },
};
```

```ts
// src/data/program.ts
import type { WorkoutDay } from "../domain/types";

export const WORKOUT_DAYS: WorkoutDay[] = [
  {
    id: "monday",
    weekdayLabel: "Mandag",
    title: "WOD",
    isRestDay: false,
    exercises: [
      { id: "mon-run-1", typeId: "run", load: { kind: "distance", value: 1, unit: "mile" } },
      { id: "mon-pull-ups", typeId: "pull-ups", load: { kind: "reps", value: 100 } },
      { id: "mon-push-ups", typeId: "push-ups", load: { kind: "reps", value: 200 } },
      { id: "mon-air-squats", typeId: "air-squats", load: { kind: "reps", value: 300 } },
      { id: "mon-run-2", typeId: "run", load: { kind: "distance", value: 1, unit: "mile" } },
    ],
  },
  {
    id: "tuesday",
    weekdayLabel: "Tirsdag",
    title: "Kondisjon",
    isRestDay: false,
    exercises: [
      { id: "tue-stretching", typeId: "stretching", load: { kind: "activityTimer", minutes: 30 } },
      { id: "tue-run", typeId: "run", load: { kind: "distance", value: 5, unit: "km" } },
    ],
  },
  {
    id: "wednesday",
    weekdayLabel: "Onsdag",
    title: "300 Workout",
    isRestDay: false,
    exercises: [
      { id: "wed-pull-ups-1", typeId: "pull-ups", load: { kind: "setsReps", sets: 5, reps: 5 } },
      { id: "wed-deadlifts", typeId: "deadlifts", load: { kind: "setsReps", sets: 10, reps: 5 } },
      { id: "wed-push-ups", typeId: "push-ups", load: { kind: "setsReps", sets: 5, reps: 10 } },
      { id: "wed-box-jumps", typeId: "box-jumps", load: { kind: "setsReps", sets: 10, reps: 5 } },
      { id: "wed-floor-wipers", typeId: "floor-wipers", load: { kind: "setsReps", sets: 5, reps: 10 } },
      { id: "wed-clean-press", typeId: "clean-press", load: { kind: "setsReps", sets: 5, reps: 5 } },
      { id: "wed-pull-ups-2", typeId: "pull-ups", load: { kind: "setsReps", sets: 5, reps: 5 } },
    ],
  },
  {
    id: "thursday",
    weekdayLabel: "Torsdag",
    title: "Rygg og biceps",
    isRestDay: false,
    exercises: [
      { id: "thu-run", typeId: "run", load: { kind: "distance", value: 800, unit: "m" } },
      { id: "thu-pull-ups", typeId: "pull-ups", load: { kind: "setsReps", sets: 3, reps: 5 } },
      { id: "thu-push-ups", typeId: "push-ups", load: { kind: "setsReps", sets: 3, reps: 15 } },
      { id: "thu-air-squats", typeId: "air-squats", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "thu-bent-over-row", typeId: "bent-over-row", load: { kind: "pyramid", reps: [12, 10, 8, 5, 3] } },
      { id: "thu-sled-pull", typeId: "sled-pull", load: { kind: "setsReps", sets: 3, reps: 50 } }, // vis som 50 yards
      { id: "thu-lat-pulldown", typeId: "lat-pulldown", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "thu-close-grip-cable-row", typeId: "close-grip-cable-row", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "thu-cable-bicep-curls", typeId: "cable-bicep-curls", load: { kind: "setsReps", sets: 3, reps: 15 } },
    ],
  },
  {
    id: "friday",
    weekdayLabel: "Fredag",
    title: "Armer og kjerne",
    isRestDay: false,
    exercises: [
      { id: "fri-pull-ups", typeId: "pull-ups", load: { kind: "setsReps", sets: 3, reps: 5 } },
      { id: "fri-air-squats", typeId: "air-squats", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "fri-push-ups", typeId: "push-ups", load: { kind: "setsReps", sets: 3, reps: 15 } },
      { id: "fri-bench-press", typeId: "bench-press", load: { kind: "pyramid", reps: [12, 10, 8, 5, 3] } },
      { id: "fri-tricep-pushdown", typeId: "tricep-pushdown", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "fri-tricep-overhead", typeId: "tricep-overhead", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "fri-chest-flys", typeId: "chest-flys", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "fri-dips", typeId: "dips", load: { kind: "amrapSets", sets: 3 } },
      { id: "fri-weighted-planks", typeId: "weighted-planks", load: { kind: "timedSets", sets: 3, seconds: 60 } },
    ],
  },
  {
    id: "saturday",
    weekdayLabel: "Lørdag",
    title: "Skuldre og bein",
    isRestDay: false,
    exercises: [
      { id: "sat-run", typeId: "run", load: { kind: "distance", value: 800, unit: "m" } },
      { id: "sat-pull-ups", typeId: "pull-ups", load: { kind: "setsReps", sets: 3, reps: 5 } },
      { id: "sat-air-squats", typeId: "air-squats", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "sat-push-ups", typeId: "push-ups", load: { kind: "setsReps", sets: 3, reps: 15 } },
      { id: "sat-squats", typeId: "squats", load: { kind: "pyramid", reps: [12, 10, 8, 5, 3] } },
      { id: "sat-military-press", typeId: "military-press", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "sat-leg-press", typeId: "leg-press", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "sat-arnold-press", typeId: "arnold-press", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "sat-hamstring-curls", typeId: "hamstring-curls", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "sat-shoulder-front-raises", typeId: "shoulder-front-raises", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "sat-weighted-planks", typeId: "weighted-planks", load: { kind: "timedSets", sets: 3, seconds: 60 } },
    ],
  },
  {
    id: "sunday",
    weekdayLabel: "Søndag",
    title: "Hviledag",
    isRestDay: true,
    exercises: [],
  },
];
```

Sled Pull vises som distanse, ikke reps. Rett den ene linjen:

```ts
{
  id: "thu-sled-pull",
  typeId: "sled-pull",
  load: { kind: "setsRepsDistance", sets: 3, value: 50, unit: "yards" },
}
```

Legg til denne `Load`-varianten:

```ts
| { kind: "setsRepsDistance"; sets: number; value: number; unit: "yards" }
```

Og i `formatLoad`:

```ts
case "setsRepsDistance":
  return `${load.sets} sett × ${load.value} ${load.unit}`;
```

---

## 5. Repository

```ts
// src/data/HardcodedWorkoutRepository.ts
import type { WeekdayId, ExerciseTypeId, WorkoutRepository } from "../domain/types";
import { WORKOUT_DAYS } from "./program";
import { EXERCISE_TYPES } from "./exercises";

export class HardcodedWorkoutRepository implements WorkoutRepository {
  async getWorkoutDays() {
    return WORKOUT_DAYS;
  }

  async getWorkoutDay(id: WeekdayId) {
    return WORKOUT_DAYS.find((d) => d.id === id);
  }

  async getExerciseType(id: ExerciseTypeId) {
    return EXERCISE_TYPES[id];
  }
}

export const workoutRepository = new HardcodedWorkoutRepository();
```

Senere bytter du bare denne klassen. UI importerer `workoutRepository`, aldri `WORKOUT_DAYS` direkte.

---

## 6. Lokal økt-tilstand

```ts
// src/session/types.ts
import type { WeekdayId } from "../domain/types";

export const SESSION_SCHEMA_VERSION = 1;
export const SESSION_STORAGE_KEY = "okt.activeSession.v1";

export type ActivityTimerState =
  | { kind: "idle" }
  | { kind: "running"; endsAt: number }
  | { kind: "finished" };

export type SessionPhase = "pre" | "active" | "allDone" | "summary";

export interface UndoSnapshot {
  completedId: string;
  remainingExerciseIds: string[];
  completedExerciseIds: string[];
  expiresAt: number;
}

export interface ActiveSession {
  schemaVersion: number;
  workoutDayId: WeekdayId;
  startedAt: number;
  endedAt: number | null;
  remainingExerciseIds: string[]; // [0] = aktiv
  completedExerciseIds: string[];
  restEndsAt: number | null;
  missedRestCue: boolean; // hvile utløp i bakgrunn
  activityTimerState: ActivityTimerState;
  undo: UndoSnapshot | null;
}
```

```ts
// src/session/storage.ts
import { SESSION_STORAGE_KEY, SESSION_SCHEMA_VERSION, type ActiveSession } from "./types";

export function loadSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ActiveSession;
    if (data.schemaVersion !== SESSION_SCHEMA_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveSession(session: ActiveSession | null) {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}
```

---

## 7. Session-motor (alt som kan gå galt, skjer her)

```ts
// src/session/WorkoutSession.ts
import type { WorkoutDay } from "../domain/types";
import { completeCurrent, jumpToExercise } from "../domain/queue";
import type { ActiveSession, ActivityTimerState } from "./types";
import { SESSION_SCHEMA_VERSION } from "./types";

const UNDO_MS = 5000;

export function startSession(day: WorkoutDay, now = Date.now()): ActiveSession {
  const ids = day.exercises.map((e) => e.id);
  return {
    schemaVersion: SESSION_SCHEMA_VERSION,
    workoutDayId: day.id,
    startedAt: now,
    endedAt: null,
    remainingExerciseIds: ids,
    completedExerciseIds: [],
    restEndsAt: null,
    missedRestCue: false,
    activityTimerState: { kind: "idle" },
    undo: null,
  };
}

export function startRest(session: ActiveSession, minutes: number, now = Date.now()): ActiveSession {
  return {
    ...session,
    restEndsAt: now + minutes * 60_000,
    missedRestCue: false,
  };
}

export function clearRest(session: ActiveSession): ActiveSession {
  return { ...session, restEndsAt: null, missedRestCue: false };
}

export function markMissedRestIfNeeded(
  session: ActiveSession,
  wasHidden: boolean,
  now = Date.now()
): ActiveSession {
  if (!session.restEndsAt || now < session.restEndsAt) return session;
  if (wasHidden) {
    return { ...session, restEndsAt: null, missedRestCue: true };
  }
  return { ...session, restEndsAt: null };
}

export function completeExercise(session: ActiveSession, now = Date.now()): ActiveSession {
  const current = session.remainingExerciseIds[0];
  if (!current) return session;

  return {
    ...session,
    remainingExerciseIds: completeCurrent(session.remainingExerciseIds),
    completedExerciseIds: [...session.completedExerciseIds, current],
    restEndsAt: null,
    missedRestCue: false,
    activityTimerState: { kind: "idle" },
    undo: {
      completedId: current,
      remainingExerciseIds: session.remainingExerciseIds,
      completedExerciseIds: session.completedExerciseIds,
      expiresAt: now + UNDO_MS,
    },
  };
}

export function undoComplete(session: ActiveSession, now = Date.now()): ActiveSession {
  if (!session.undo || now > session.undo.expiresAt) {
    return { ...session, undo: null };
  }
  return {
    ...session,
    remainingExerciseIds: session.undo.remainingExerciseIds,
    completedExerciseIds: session.undo.completedExerciseIds,
    undo: null,
  };
}

export function jump(session: ActiveSession, targetId: string): ActiveSession {
  if (session.completedExerciseIds.includes(targetId)) return session;
  return {
    ...session,
    remainingExerciseIds: jumpToExercise(session.remainingExerciseIds, targetId),
    restEndsAt: null,
    missedRestCue: false,
    activityTimerState: { kind: "idle" },
    undo: null,
  };
}

export function startActivityTimer(
  session: ActiveSession,
  minutes: number,
  now = Date.now()
): ActiveSession {
  return {
    ...session,
    activityTimerState: { kind: "running", endsAt: now + minutes * 60_000 },
  };
}

export function syncActivityTimer(session: ActiveSession, now = Date.now()): ActiveSession {
  const t = session.activityTimerState;
  if (t.kind === "running" && now >= t.endsAt) {
    return { ...session, activityTimerState: { kind: "finished" } };
  }
  return session;
}

export function endSession(session: ActiveSession, now = Date.now()): ActiveSession {
  return { ...session, endedAt: now, restEndsAt: null };
}

export function masterElapsedMs(session: ActiveSession, now = Date.now()): number {
  const end = session.endedAt ?? now;
  return Math.max(0, end - session.startedAt);
}

export function isAllDone(session: ActiveSession): boolean {
  return session.remainingExerciseIds.length === 0 && session.endedAt === null;
}
```

**Mastertimer:** aldri basert på antall `setInterval`. Vis `Date.now() - startedAt`. Hvile endrer aldri `startedAt`.

---

## 8. Klokke som tåler låsing

```ts
// src/hooks/useNow.ts
import { useEffect, useState } from "react";

export function useNow(enabled: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;

    const tick = () => setNow(Date.now());
    tick();

    const id = window.setInterval(tick, 1000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", tick);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", tick);
    };
  }, [enabled]);

  return now;
}
```

`setInterval` oppdaterer bare visningen. Ved `visibilitychange` beregnes tiden på nytt.

**Hvile i bakgrunn:** når appen blir synlig og `now >= restEndsAt`, sett `missedRestCue: true` og vis «START NESTE SETT». Ikke spill av 3–2–1 i ettertid. Cue forsvinner ved ny hvile eller «Øvelse ferdig».

**3–2–1-overlay** kun hvis appen er synlig *mens* nedtellingen treffer 3, 2, 1, START:

```ts
function restOverlayLabel(restEndsAt: number | null, now: number, visible: boolean) {
  if (!visible || !restEndsAt) return null;
  const left = restEndsAt - now;
  if (left > 3000 || left < -400) return null;
  if (left > 2000) return "3";
  if (left > 1000) return "2";
  if (left > 0) return "1";
  return "START";
}
```

Samme mønster for stretching, men slutt-tekst er «STRETCHING FERDIG». Stretching markerer **ikke** øvelsen ferdig.

---

## 9. UI-flyt (én app-state)

```ts
type View =
  | { name: "pre"; dayId: WeekdayId }
  | { name: "active" }
  | { name: "allDone" }
  | { name: "summary"; dayId: WeekdayId; completed: number; elapsedMs: number };
```

**Åpning:**

1. Last `localStorage`.
2. Hvis session med `endedAt === null` → gjenoppta (`active` eller `allDone`).
3. Ellers vis dagens ukedag (`new Date().getDay()`, søndag = 0).

**Pre:** ukedag, tittel, oversikt, «Start økt». Søndag: «Hviledag», ingen startknapp, men dagvelger. Mastertimer starter **ikke** før «Start økt».

**Aktiv skjerm, topp til bunn:**

1. Mastertimer øverst til høyre  
2. Ukedag + øktnavn  
3. Aktiv øvelse: bilde, navn, load  
4. Hvile: 1 min / 2 min / 3 min  
5. Neste øvelse  
6. «Hele økten»  
7. Fast bunn: «Øvelse ferdig»

Ingen «Sett ferdig». Ingen setteller.

Etter «Øvelse ferdig»: kort «Angre» i ~5 sekunder, uten dialog.

**All done:** «Alle øvelser er fullført», mastertimer fortsetter, «Avslutt økt».

**Summary:** ukedag, antall øvelser, total tid. Ikke lagre historikk. Deretter slett session.

**Meny:** «Nullstill aktiv økt» med `window.confirm("Dette sletter fremdriften for denne økten. Fortsette?")`.

---

## 10. Nøkkelkomponenter (skjelett)

```tsx
// src/ui/screens/ActiveSessionScreen.tsx — struktur


{day.weekdayLabel} · {day.title}





{type.name}

{formatLoad(exercise.load)}


  {exercise.load.kind === "activityTimer" && (
     startActivityTimer(session, 30)} />
  )}




 startRest(session, m)} />

{next && 

Neste: {nextName}

}

Hele økten

{session.undo && now < session.undo.expiresAt && (
  Angre
)}

{session.missedRestCue && 

START NESTE SETT

}

Øvelse ferdig
```

```tsx
function BottomAction({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    


      {children}
    


  );
}
```

```css
.bottom-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: linear-gradient(transparent, #0b0d10 24%);
}
.primary {
  width: 100%;
  min-height: 56px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
}
.app {
  min-height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: calc(88px + env(safe-area-inset-bottom));
  max-width: 430px;
  margin: 0 auto;
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

Animasjoner: `180–250ms`, `ease-out`. Ingen bunnmeny. Ingen horisontal scroll.

---

## 11. PWA (uten varsler)

`manifest.webmanifest`:

```json
{
  "name": "ØKT",
  "short_name": "ØKT",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B0D10",
  "theme_color": "#0B0D10",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

Service worker: cache `index.html`, JS, CSS, ikoner og alle `/images/exercises/*.svg`. Ingen push, ingen Notification API, ingen `vibrate()`.

---

## 12. Bilder

Ett lokalt SVG per `ExerciseTypeId`, linjeillustrasjon på mørk bakgrunn. `ExerciseImage` med `onError` → `/fallback.svg`. Trykk åpner fullskjerm-lightbox. Ikke hotlink, ikke kjendiser.

Sled Pull-format i lista: `3 sett × 50 yards`. Planke: `3 sett × 60 sekunder`. Onsdag: to unike pull-up-ID-er (`wed-pull-ups-1`, `wed-pull-ups-2`).

---

## 13. Hva Lovable ofte gjør feil — si dette eksplisitt

1. Ikke lag sett-knapper eller setteller.  
2. Ikke pause mastertimer ved hvile.  
3. Ikke bruk `secondsElapsed++` i interval.  
4. Ikke spill 3–2–1 hvis hvilen utløp i bakgrunn.  
5. Hopp endrer bare `remainingExerciseIds`, aldri `completedExerciseIds`.  
6. Stretching ferdig ≠ øvelse ferdig.  
7. «Avslutt økt» kun når køen er tom.  
8. Ingen Supabase, auth, historikk eller notifikasjoner.

---

## Testrekkefølge (lim inn nederst i Lovable-prompten)

1. Start mandag → lukk fanen i 10 s → åpne igjen: mastertimer har hoppet ~10 s.  
2. Start 2 min hvile: mastertimer fortsetter.  
3. Hopp A → C: kø blir C, A, B, D. Fullfør alle: alle fire kommer.  
4. Tirsdag stretching: start 30 min, lås telefon, åpne: tid stemmer, mastertimer upåvirket.  
5. Hvile utløper i bakgrunn: «START NESTE SETT», ingen 3–2–1.  
6. Refresh midt i økt: samme øvelse og kø.  
7. Søndag: Hviledag, kan bytte til mandag.  
8. Ingen dialog om varsler.

---

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://active-session.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2fb2684b-771c-4a7e-87dd-41c9bbac8138).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
