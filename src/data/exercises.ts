import type { ExerciseType, ExerciseTypeId } from "../domain/types";

const img = (id: string) => `/images/exercises/${id}.svg`;

const def = (id: ExerciseTypeId, name: string): ExerciseType => ({
  id,
  name,
  imagePath: img(id),
});

export const EXERCISE_TYPES: Record<ExerciseTypeId, ExerciseType> = {
  run: def("run", "Run"),
  "pull-ups": def("pull-ups", "Pull-ups"),
  "push-ups": def("push-ups", "Push-ups"),
  "air-squats": def("air-squats", "Air Squats"),
  stretching: def("stretching", "Stretching"),
  deadlifts: def("deadlifts", "Deadlifts"),
  "box-jumps": def("box-jumps", "Box Jumps"),
  "floor-wipers": def("floor-wipers", "Floor Wipers"),
  "clean-press": def("clean-press", "Clean & Press"),
  "bent-over-row": def("bent-over-row", "Bent Over Row"),
  "sled-pull": def("sled-pull", "Sled Pull"),
  "lat-pulldown": def("lat-pulldown", "Lat Pulldown"),
  "close-grip-cable-row": def("close-grip-cable-row", "Close-Grip Cable Row"),
  "cable-bicep-curls": def("cable-bicep-curls", "Cable Bicep Curls"),
  "bench-press": def("bench-press", "Bench Press"),
  "tricep-pushdown": def("tricep-pushdown", "Tricep Pushdown"),
  "tricep-overhead": def("tricep-overhead", "Tricep Overhead Extension"),
  "chest-flys": def("chest-flys", "Chest Flys"),
  dips: def("dips", "Dips"),
  "weighted-planks": def("weighted-planks", "Weighted Planks"),
  squats: def("squats", "Squats"),
  "military-press": def("military-press", "Military Press"),
  "leg-press": def("leg-press", "Leg Press"),
  "arnold-press": def("arnold-press", "Arnold Press"),
  "hamstring-curls": def("hamstring-curls", "Hamstring Curls"),
  "shoulder-front-raises": def("shoulder-front-raises", "Shoulder Front Raises"),
};
