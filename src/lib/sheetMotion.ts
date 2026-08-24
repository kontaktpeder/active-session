export type SheetSpringOpts = {
  stiffness?: number;
  damping?: number;
  mass?: number;
  restDelta?: number;
  restSpeed?: number;
};

/** Tiny body threshold only to separate scroll intent from sheet drag. Grabber is 0. */
export const BODY_ACTIVATE_PX = 2;
export const NUDGE_DEADZONE_PX = 16;
export const NUDGE_VEL = 350;
export const SAME_DETENT_VEL_CAP = 260;
export const DISMISS_VEL = 900;
export const HANDOFF_VEL_CAP = 1600;
export const ANIM_VEL_SCALE = 0.28;
export const ANIM_VEL_CAP = 480;
export const ANIM_VEL_DIST_FACTOR = 2.2;
export const SPRING_DT = 1 / 120;
export const VEL_EMA = 0.32;
export const COMMIT_PROJECT_SEC = 0.22;

export const NEST_RECESS_SCALE = 0.97;
export const NEST_RECESS_Y_PX = 8;
export const NEST_RECESS_MS = 380;
export const NEST_RECESS_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export const DETENT_SPRING: SheetSpringOpts = {
  stiffness: 360,
  damping: 52,
  mass: 0.88,
  restDelta: 0.9,
  restSpeed: 22,
};

export const SETTLE_SPRING: SheetSpringOpts = {
  stiffness: 340,
  damping: 50,
  mass: 0.92,
  restDelta: 0.9,
  restSpeed: 20,
};

export function animationHandoffVelocity(from: number, to: number, vy: number): number {
  const travel = to - from;
  if (Math.abs(travel) < 0.5) return 0;
  const toward = Math.sign(travel);
  let v = vy;
  if (v !== 0 && Math.sign(v) !== toward) {
    v = 0;
  }
  v *= ANIM_VEL_SCALE;
  const distCap = Math.abs(travel) * ANIM_VEL_DIST_FACTOR;
  if (Math.abs(v) > distCap) v = toward * distCap;
  if (Math.abs(v) > ANIM_VEL_CAP) v = toward * ANIM_VEL_CAP;
  if (Math.abs(v) > HANDOFF_VEL_CAP) v = toward * HANDOFF_VEL_CAP;
  return v;
}

export function runSheetSpring(options: {
  from: number;
  to: number;
  velocity?: number;
  spring?: SheetSpringOpts;
  onUpdate: (y: number) => void;
  onComplete?: () => void;
}): () => void {
  const {
    from,
    to,
    velocity = 0,
    spring = DETENT_SPRING,
    onUpdate,
    onComplete,
  } = options;
  const stiffness = spring.stiffness ?? DETENT_SPRING.stiffness!;
  const damping = spring.damping ?? DETENT_SPRING.damping!;
  const mass = spring.mass ?? DETENT_SPRING.mass!;
  const restDelta = spring.restDelta ?? DETENT_SPRING.restDelta!;
  const restSpeed = spring.restSpeed ?? DETENT_SPRING.restSpeed!;

  let y = from;
  let v = animationHandoffVelocity(from, to, velocity);
  let last = performance.now();
  let acc = 0;
  let raf = 0;
  let cancelled = false;

  onUpdate(from);

  const integrate = (dt: number) => {
    const force = -stiffness * (y - to) - damping * v;
    const accel = force / mass;
    v += accel * dt;
    y += v * dt;
  };

  const step = (now: number) => {
    if (cancelled) return;
    acc += Math.min(0.064, Math.max(0, (now - last) / 1000));
    last = now;

    let guard = 0;
    while (acc >= SPRING_DT && guard < 8) {
      integrate(SPRING_DT);
      acc -= SPRING_DT;
      guard += 1;
      if (Math.abs(v) < restSpeed && Math.abs(y - to) < restDelta) {
        onUpdate(to);
        onComplete?.();
        return;
      }
    }

    onUpdate(y);
    raf = requestAnimationFrame(step);
  };

  raf = requestAnimationFrame(step);
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}

export function runSheetEaseOut(options: {
  from: number;
  to: number;
  duration?: number;
  onUpdate: (y: number) => void;
  onComplete?: () => void;
}): () => void {
  const { from, to, onUpdate, onComplete } = options;
  const distance = Math.abs(to - from);
  const duration = options.duration ?? Math.min(0.45, Math.max(0.26, distance / 1800));
  const start = performance.now();
  let raf = 0;
  let cancelled = false;

  onUpdate(from);

  const step = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / (duration * 1000));
    const eased = 1 - (1 - t) ** 4;
    const y = from + (to - from) * eased;
    onUpdate(y);
    if (t >= 1) {
      onUpdate(to);
      onComplete?.();
      return;
    }
    raf = requestAnimationFrame(step);
  };

  raf = requestAnimationFrame(step);
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}
