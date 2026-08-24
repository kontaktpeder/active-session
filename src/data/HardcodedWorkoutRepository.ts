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
