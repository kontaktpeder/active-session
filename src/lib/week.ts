import type { WeekdayId } from "../domain/types";
import { WORKOUT_DAYS } from "../data/program";

export const WEEKDAY_BY_INDEX: WeekdayId[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const WEEKDAY_IDS: WeekdayId[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const WEEKDAY_SHORT: Record<WeekdayId, string> = {
  monday: "Man",
  tuesday: "Tir",
  wednesday: "Ons",
  thursday: "Tor",
  friday: "Fre",
  saturday: "Lør",
  sunday: "Søn",
};

export function isWeekdayId(value: string): value is WeekdayId {
  return WEEKDAY_IDS.includes(value as WeekdayId);
}

export function getTodayWeekdayId(date = new Date()): WeekdayId {
  return WEEKDAY_BY_INDEX[date.getDay()] ?? "monday";
}

export function getWorkoutDay(id: WeekdayId) {
  const day = WORKOUT_DAYS.find((item) => item.id === id);
  if (!day) {
    throw new Error(`Ukjent treningsdag: ${id}`);
  }
  return day;
}
