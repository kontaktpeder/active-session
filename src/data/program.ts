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
      {
        id: "wed-floor-wipers",
        typeId: "floor-wipers",
        load: { kind: "setsReps", sets: 5, reps: 10 },
      },
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
      {
        id: "thu-bent-over-row",
        typeId: "bent-over-row",
        load: { kind: "pyramid", reps: [12, 10, 8, 5, 3] },
      },
      {
        id: "thu-sled-pull",
        typeId: "sled-pull",
        load: { kind: "setsRepsDistance", sets: 3, value: 50, unit: "yards" },
      },
      {
        id: "thu-lat-pulldown",
        typeId: "lat-pulldown",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      {
        id: "thu-close-grip-cable-row",
        typeId: "close-grip-cable-row",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      {
        id: "thu-cable-bicep-curls",
        typeId: "cable-bicep-curls",
        load: { kind: "setsReps", sets: 3, reps: 15 },
      },
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
      {
        id: "fri-bench-press",
        typeId: "bench-press",
        load: { kind: "pyramid", reps: [12, 10, 8, 5, 3] },
      },
      {
        id: "fri-tricep-pushdown",
        typeId: "tricep-pushdown",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      {
        id: "fri-tricep-overhead",
        typeId: "tricep-overhead",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      { id: "fri-chest-flys", typeId: "chest-flys", load: { kind: "setsReps", sets: 3, reps: 10 } },
      { id: "fri-dips", typeId: "dips", load: { kind: "amrapSets", sets: 3 } },
      {
        id: "fri-weighted-planks",
        typeId: "weighted-planks",
        load: { kind: "timedSets", sets: 3, seconds: 60 },
      },
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
      {
        id: "sat-military-press",
        typeId: "military-press",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      { id: "sat-leg-press", typeId: "leg-press", load: { kind: "setsReps", sets: 3, reps: 10 } },
      {
        id: "sat-arnold-press",
        typeId: "arnold-press",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      {
        id: "sat-hamstring-curls",
        typeId: "hamstring-curls",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      {
        id: "sat-shoulder-front-raises",
        typeId: "shoulder-front-raises",
        load: { kind: "setsReps", sets: 3, reps: 10 },
      },
      {
        id: "sat-weighted-planks",
        typeId: "weighted-planks",
        load: { kind: "timedSets", sets: 3, seconds: 60 },
      },
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
