import { SESSION_STORAGE_KEY, SESSION_SCHEMA_VERSION, type ActiveSession } from "./types";

export function loadSession(): ActiveSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ActiveSession;
    if (data.schemaVersion !== SESSION_SCHEMA_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveSession(session: ActiveSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}
