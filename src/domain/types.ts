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
  | { kind: "setsRepsDistance"; sets: number; value: number; unit: "yards" }
  | { kind: "pyramid"; reps: number[] }
  | { kind: "timedSets"; sets: number; seconds: number }
  | { kind: "amrapSets"; sets: number }
  | { kind: "activityTimer"; minutes: number };

export interface ExerciseType {
  id: ExerciseTypeId;
  name: string;
  imagePath: string;
}

export interface WorkoutExercise {
  id: string;
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
  getWorkoutDays(): Promise<WorkoutDay[]>;
  getWorkoutDay(id: WeekdayId): Promise<WorkoutDay | undefined>;
  getExerciseType(id: ExerciseTypeId): Promise<ExerciseType>;
}
