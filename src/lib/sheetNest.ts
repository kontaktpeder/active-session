type Listener = () => void;

let nextId = 1;
const stack: number[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

function syncDocumentLock() {
  if (typeof document === "undefined") return;
  if (stack.length > 0) document.documentElement.setAttribute("data-sheet-open", "true");
  else document.documentElement.removeAttribute("data-sheet-open");
}

export function nestPush(): number {
  const id = nextId++;
  stack.push(id);
  syncDocumentLock();
  notify();
  return id;
}

export function nestPop(id: number): void {
  const idx = stack.lastIndexOf(id);
  if (idx === -1) return;
  stack.splice(idx, 1);
  syncDocumentLock();
  notify();
}

export function getNestDepth(): number {
  return stack.length;
}

export function getNestIndex(id: number): number {
  return stack.indexOf(id);
}

export function subscribeNest(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
