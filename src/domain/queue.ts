/** remaining[0] er alltid aktiv øvelse. */
export function jumpToExercise(remaining: string[], targetId: string): string[] {
  if (remaining.length === 0) return remaining;
  if (remaining[0] === targetId) return remaining;

  const idx = remaining.indexOf(targetId);
  if (idx < 0) return remaining;

  const selected = remaining[idx]!;

}

export function completeCurrent(remaining: string[]): string[] {
  return remaining.slice(1);
}
