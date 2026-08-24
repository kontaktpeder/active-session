import type { ExerciseType, ExerciseTypeId } from "../domain/types";

const img = (file: string) => `/exercises/${file}`;

const def = (id: ExerciseTypeId, name: string, file: string): ExerciseType => ({
  id,
  name,
  imagePath: img(file),
});

export const EXERCISE_TYPES: Record<ExerciseTypeId, ExerciseType> = {
  run: def("run", "Run", "run.webp"),
  "pull-ups": def("pull-ups", "Pull-ups", "pull-ups.webp"),
  "push-ups": def("push-ups", "Push-ups", "push-ups.webp"),
  "air-squats": def("air-squats", "Air Squats", "air-squats.webp"),
  stretching: def("stretching", "Stretching", "stretching.webp"),
  deadlifts: def("deadlifts", "Deadlifts", "deadlifts.webp"),
  "box-jumps": def("box-jumps", "Box Jumps", "box-jumps.webp"),
  "floor-wipers": def("floor-wipers", "Floor Wipers", "floor-wipers.webp"),
  "clean-press": def("clean-press", "Clean & Press", "clean-and-press.webp"),
  "bent-over-row": def("bent-over-row", "Bent Over Row", "bent-over-row.webp"),
  "sled-pull": def("sled-pull", "Sled Pull", "sled-pull.webp"),
  "lat-pulldown": def("lat-pulldown", "Lat Pulldown", "lat-pulldown.webp"),
  "close-grip-cable-row": def("close-grip-cable-row", "Close-Grip Cable Row", "close-grip-cable-row.webp"),
  "cable-bicep-curls": def("cable-bicep-curls", "Cable Bicep Curls", "cable-bicep-curls.webp"),
  "bench-press": def("bench-press", "Bench Press", "bench-press.webp"),
  "tricep-pushdown": def("tricep-pushdown", "Tricep Pushdown", "tricep-pushdown.webp"),
  "tricep-overhead": def("tricep-overhead", "Tricep Overhead Extension", "tricep-overhead-extension.webp"),
  "chest-flys": def("chest-flys", "Chest Flys", "chest-flys.webp"),
  dips: def("dips", "Dips", "dips.webp"),
  "weighted-planks": def("weighted-planks", "Weighted Planks", "weighted-planks.webp"),
  squats: def("squats", "Squats", "squats.webp"),
  "military-press": def("military-press", "Military Press", "military-press.webp"),
  "leg-press": def("leg-press", "Leg Press", "leg-press.webp"),
  "arnold-press": def("arnold-press", "Arnold Press", "arnold-press.webp"),
  "hamstring-curls": def("hamstring-curls", "Hamstring Curls", "hamstring-curls.webp"),
  "shoulder-front-raises": def("shoulder-front-raises", "Shoulder Front Raises", "shoulder-front-raises.webp"),
};
