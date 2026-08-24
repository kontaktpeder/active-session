import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { lockSheetDismiss, unlockSheetDismiss } from "@/lib/sheetGate";
import {
  getNestDepth,
  getNestIndex,
  nestPop,
  nestPush,
  subscribeNest,
} from "@/lib/sheetNest";
import {
  BODY_ACTIVATE_PX,
  COMMIT_PROJECT_SEC,
  DETENT_SPRING,
  DISMISS_VEL,
  NEST_RECESS_EASE,
  NEST_RECESS_MS,
  NEST_RECESS_SCALE,
  NEST_RECESS_Y_PX,
  NUDGE_DEADZONE_PX,
  NUDGE_VEL,
  SAME_DETENT_VEL_CAP,
  SETTLE_SPRING,
  VEL_EMA,
  runSheetEaseOut,
  runSheetSpring,
  type SheetSpringOpts,
} from "@/lib/sheetMotion";

export type SheetDetent = "half" | "full";

interface AppSheetProps {
  onClose: () => void;
  children: ReactNode;
  size?: "hug" | "sheet";
  detents?: SheetDetent[];
  initialDetent?: SheetDetent;
  className?: string;
  zClassName?: string;
  nest?: boolean;
}

const DETENT_VISIBLE: Record<SheetDetent, number> = {
  full: 1,
  half: 0.55,
};

function getScrollEl(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null;
  const marked = root.querySelector("[data-sheet-scroll]") as HTMLElement | null;
  if (marked) return marked;
  return root.querySelector(".overflow-y-auto, .overflow-y-scroll") as HTMLElement | null;
}

function yForDetent(detent: SheetDetent, frameH: number): number {
  return Math.max(0, Math.round(frameH * (1 - DETENT_VISIBLE[detent])));
}

function normalizeDetents(detents: SheetDetent[]): SheetDetent[] {
  const set = new Set(detents);
  const ordered: SheetDetent[] = [];
  if (set.has("full")) ordered.push("full");
  if (set.has("half")) ordered.push("half");
  return ordered.length ? ordered : ["full"];
}

function writeSheetY(el: HTMLElement | null, y: number) {
  if (!el) return;
  el.style.transform = `translate3d(0, ${y}px, 0)`;
}

function rubber(overshoot: number, dimension = 200, constant = 0.55): number {
  const sign = Math.sign(overshoot);
  const x = Math.abs(overshoot);
  return sign * ((x * dimension * constant) / (dimension + constant * x));
}

function resistDragY(raw: number, frameH: number): number {
  if (raw < 0) return rubber(raw);
  if (raw > frameH) return frameH + rubber(raw - frameH, 160, 0.4);
  return raw;
}

type GestureState = {
  pointerId: number;
  startY: number;
  lastY: number;
  lastAt: number;
  startDragY: number;
  velocityY: number;
  dragging: boolean;
  fromGrabber: boolean;
  scrollEl: HTMLElement | null;
};

export function AppSheet({
  onClose,
  children,
  size = "sheet",
  detents: detentsProp,
  initialDetent,
  className,
  zClassName = "z-50",
  nest: nestProp,
}: AppSheetProps) {
  const nestEnabled = nestProp ?? size === "sheet";
  const cardRef = useRef<HTMLDivElement>(null);
  const sheetLayerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<GestureState | null>(null);
  const detentRef = useRef<SheetDetent>("full");
  const canDragRef = useRef(true);
  const frameHRef = useRef(700);
  const multiDetentRef = useRef(false);
  const nestIdRef = useRef<number | null>(null);
  const yRef = useRef(typeof window !== "undefined" ? window.innerHeight : 640);
  const settleDragRef = useRef<(vy: number) => void>(() => {});
  const cancelSpringRef = useRef<(() => void) | null>(null);
  const animatingRef = useRef(false);

  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const nestDepth = useSyncExternalStore(subscribeNest, getNestDepth, () => 0);

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  const detents = normalizeDetents(detentsProp ?? ["full"]);
  const multiDetent = detents.length > 1 && size === "sheet";
  const startDetent: SheetDetent =
    initialDetent && detents.includes(initialDetent)
      ? initialDetent
      : detents.includes("half") && multiDetent
        ? "half"
        : "full";

  const [frameH, setFrameH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 700,
  );

  const maxDim = multiDetent ? 0.28 : 0.4;
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [flyingOut, setFlyingOut] = useState(false);
  const flyingOutRef = useRef(false);
  const enteredRef = useRef(false);
  const dismissLockedRef = useRef(false);

  useLayoutEffect(() => {
    if (!nestEnabled) return;
    nestIdRef.current = nestPush();
    return () => {
      if (nestIdRef.current != null) {
        nestPop(nestIdRef.current);
        nestIdRef.current = null;
      }
    };
  }, [nestEnabled]);

  const releaseNest = () => {
    if (nestIdRef.current != null) {
      nestPop(nestIdRef.current);
      nestIdRef.current = null;
    }
  };

  const myNestIndex = nestIdRef.current != null ? getNestIndex(nestIdRef.current) : -1;
  const isRecessed = nestEnabled && myNestIndex >= 0 && nestDepth > myNestIndex + 1;

  const canDrag = !flyingOut && !isRecessed;
  canDragRef.current = canDrag;
  flyingOutRef.current = flyingOut;
  frameHRef.current = frameH;
  multiDetentRef.current = multiDetent;

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setBackdropOpen(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setFrameH(el.clientHeight || window.innerHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [portalHost]);

  useEffect(() => {
    return () => {
      cancelSpringRef.current?.();
      if (dismissLockedRef.current) {
        dismissLockedRef.current = false;
        unlockSheetDismiss();
      }
    };
  }, []);

  const setY = (y: number) => {
    yRef.current = y;
    writeSheetY(sheetLayerRef.current, y);
  };

  const stopSpring = () => {
    cancelSpringRef.current?.();
    cancelSpringRef.current = null;
    animatingRef.current = false;
  };

  const animateTo = (
    target: number,
    opts?: {
      velocity?: number;
      spring?: SheetSpringOpts;
      mode?: "spring" | "easeOut";
      onComplete?: () => void;
    },
  ) => {
    stopSpring();
    animatingRef.current = true;
    const finish = () => {
      cancelSpringRef.current = null;
      animatingRef.current = false;
      setY(target);
      opts?.onComplete?.();
    };

    if (opts?.mode === "easeOut") {
      cancelSpringRef.current = runSheetEaseOut({
        from: yRef.current,
        to: target,
        onUpdate: setY,
        onComplete: finish,
      });
      return;
    }

    cancelSpringRef.current = runSheetSpring({
      from: yRef.current,
      to: target,
      velocity: opts?.velocity ?? 0,
      spring: opts?.spring ?? DETENT_SPRING,
      onUpdate: setY,
      onComplete: finish,
    });
  };

  const snapTo = (detent: SheetDetent, opts?: { velocity?: number; spring?: SheetSpringOpts }) => {
    detentRef.current = detent;
    animateTo(yForDetent(detent, frameHRef.current), {
      velocity: opts?.velocity ?? 0,
      spring: opts?.spring ?? DETENT_SPRING,
    });
  };

  useEffect(() => {
    if (!portalHost || flyingOut || frameH <= 0) return;
    if (!enteredRef.current) {
      enteredRef.current = true;
      detentRef.current = startDetent;
      animateTo(yForDetent(startDetent, frameH), { spring: SETTLE_SPRING });
      return;
    }
    if (gestureRef.current?.dragging || animatingRef.current) return;
    const target = yForDetent(detentRef.current, frameH);
    if (Math.abs(yRef.current - target) < 6) return;
    animateTo(target, { spring: SETTLE_SPRING });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameH, flyingOut, portalHost]);

  const flyOutThenDismiss = () => {
    if (flyingOutRef.current) return;
    flyingOutRef.current = true;
    setFlyingOut(true);
    setBackdropOpen(false);
    gestureRef.current = null;
    releaseNest();
    if (!dismissLockedRef.current) {
      dismissLockedRef.current = true;
      lockSheetDismiss();
    }
    const curY = yRef.current;
    const travel = Math.max(frameH * 1.05 - curY, frameH * 0.55);
    animateTo(curY + travel, {
      mode: "easeOut",
      onComplete: () => {
        if (dismissLockedRef.current) {
          dismissLockedRef.current = false;
          unlockSheetDismiss();
        }
        onClose();
      },
    });
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || flyingOutRef.current) return;
      if (nestEnabled && nestIdRef.current != null) {
        const top = getNestDepth() - 1;
        if (getNestIndex(nestIdRef.current) !== top) return;
      }
      event.preventDefault();
      flyOutThenDismiss();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settleDrag = (vy: number) => {
    if (flyingOut) return;
    const y = yRef.current;
    const h = frameHRef.current;
    const current = detentRef.current;
    const currentY = yForDetent(current, h);
    const deltaFromCurrent = y - currentY;

    const positions = detents
      .map((d) => ({ d, y: yForDetent(d, h) }))
      .sort((a, b) => a.y - b.y);

    const peekY = positions[positions.length - 1]?.y ?? 0;
    const dismissLine = peekY + Math.max(100, (h - peekY) * 0.35);

    if (y >= dismissLine || (vy >= DISMISS_VEL && y > peekY * 0.35)) {
      flyOutThenDismiss();
      return;
    }

    if (Math.abs(deltaFromCurrent) < NUDGE_DEADZONE_PX && Math.abs(vy) < NUDGE_VEL) {
      snapTo(current, { velocity: 0, spring: SETTLE_SPRING });
      return;
    }

    const projected = y + vy * COMMIT_PROJECT_SEC;
    let best = positions[0]!;
    let bestDist = Math.abs(projected - best.y);
    for (const p of positions) {
      const dist = Math.abs(projected - p.y);
      if (dist < bestDist) {
        best = p;
        bestDist = dist;
      }
    }

    const returningHome = best.d === current;
    const settleVy = returningHome
      ? Math.max(-SAME_DETENT_VEL_CAP, Math.min(SAME_DETENT_VEL_CAP, vy * 0.35))
      : vy;

    snapTo(best.d, {
      velocity: settleVy,
      spring: returningHome ? SETTLE_SPRING : DETENT_SPRING,
    });
  };
  settleDragRef.current = settleDrag;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const beginDrag = (state: GestureState, clientY: number, timeStamp: number) => {
      const ae = document.activeElement;
      if (ae instanceof HTMLElement) ae.blur();
      state.dragging = true;
      state.startY = clientY;
      state.lastY = clientY;
      state.lastAt = timeStamp;
      state.startDragY = yRef.current;
      stopSpring();
      try {
        card.setPointerCapture(state.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (flyingOutRef.current || event.button !== 0) {
        gestureRef.current = null;
        return;
      }
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']")) {
        gestureRef.current = null;
        return;
      }

      const fromGrabber = !!target.closest("[data-sheet-grabber]");
      if (!fromGrabber && !canDragRef.current) {
        gestureRef.current = null;
        return;
      }

      const state: GestureState = {
        pointerId: event.pointerId,
        startY: event.clientY,
        lastY: event.clientY,
        lastAt: event.timeStamp,
        startDragY: yRef.current,
        velocityY: 0,
        dragging: false,
        fromGrabber,
        scrollEl: (target.closest("[data-sheet-scroll]") as HTMLElement | null) ?? getScrollEl(card),
      };
      gestureRef.current = state;

      if (fromGrabber) {
        beginDrag(state, event.clientY, event.timeStamp);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const state = gestureRef.current;
      if (!state || event.pointerId !== state.pointerId) return;

      const dy = event.clientY - state.startY;

      if (!state.dragging) {
        if (!canDragRef.current) return;
        const scrollTop = state.scrollEl?.scrollTop ?? 0;
        const expandFromHalf =
          dy < -BODY_ACTIVATE_PX && multiDetentRef.current && detentRef.current !== "full";
        const pullDownFromTop = dy > BODY_ACTIVATE_PX && scrollTop <= 1;
        if (!expandFromHalf && !pullDownFromTop) return;
        beginDrag(state, event.clientY, event.timeStamp);
      }

      const elapsed = Math.max(1, event.timeStamp - state.lastAt);
      const sample = ((event.clientY - state.lastY) / elapsed) * 1000;
      state.velocityY = state.velocityY * (1 - VEL_EMA) + sample * VEL_EMA;
      state.lastY = event.clientY;
      state.lastAt = event.timeStamp;

      const h = frameHRef.current;
      const raw = state.startDragY + event.clientY - state.startY;
      setY(resistDragY(raw, h));
    };

    const finishPointer = (event: PointerEvent) => {
      const state = gestureRef.current;
      if (!state || event.pointerId !== state.pointerId) return;
      gestureRef.current = null;
      if (state.dragging) {
        settleDragRef.current(state.velocityY);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (gestureRef.current?.dragging) {
        event.preventDefault();
      }
    };

    card.addEventListener("pointerdown", onPointerDown);
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerup", finishPointer);
    card.addEventListener("pointercancel", finishPointer);
    card.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      card.removeEventListener("pointerdown", onPointerDown);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerup", finishPointer);
      card.removeEventListener("pointercancel", finishPointer);
      card.removeEventListener("touchmove", onTouchMove);
    };
  }, [portalHost]);

  const useSheetLayout = size === "sheet";
  const initialY = yRef.current;
  const recessTransform = isRecessed
    ? `translate3d(0, ${NEST_RECESS_Y_PX}px, 0) scale(${NEST_RECESS_SCALE})`
    : "translate3d(0, 0, 0) scale(1)";

  if (!portalHost) return null;

  return createPortal(
    <div
      className={cn("fixed inset-0", zClassName, (flyingOut || isRecessed) && "pointer-events-none")}
      aria-hidden={isRecessed || undefined}
    >
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          backgroundColor: "black",
          opacity: backdropOpen ? maxDim : 0,
          transitionDuration: flyingOut ? "240ms" : `${NEST_RECESS_MS}ms`,
          transitionTimingFunction: NEST_RECESS_EASE,
        }}
        onClick={flyingOut || isRecessed ? undefined : () => flyOutThenDismiss()}
        aria-hidden
      />

      <div
        ref={frameRef}
        className={cn(
          "absolute inset-0 flex justify-center overflow-hidden pointer-events-none",
          useSheetLayout ? "items-stretch" : "items-end",
        )}
        style={{
          paddingTop: "max(0.5rem, env(safe-area-inset-top))",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <div
          ref={sheetLayerRef}
          className={cn(
            "relative z-10 flex w-full min-h-0 max-w-[430px]",
            !isRecessed && "pointer-events-auto",
            useSheetLayout ? "h-full max-h-full self-stretch" : "h-auto max-h-[min(92dvh,100%)]",
          )}
          style={{ transform: `translate3d(0, ${initialY}px, 0)` }}
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className={cn("flex min-h-0 w-full origin-top", useSheetLayout ? "h-full" : "h-auto max-h-full")}
            style={{
              transform: recessTransform,
              transition: isRecessed ? "none" : `transform ${NEST_RECESS_MS}ms ${NEST_RECESS_EASE}`,
            }}
          >
            <div
              ref={cardRef}
              role="dialog"
              aria-modal={!isRecessed}
              className={cn(
                "relative flex min-h-0 w-full flex-col overflow-hidden border border-border bg-background",
                "rounded-t-[10px] rounded-b-none",
                useSheetLayout ? "h-full" : "h-auto max-h-full",
                className,
              )}
            >
              <div
                data-sheet-grabber
                className="relative z-30 flex shrink-0 items-center justify-center px-3 pt-2 pb-1"
                style={{ touchAction: "none" }}
              >
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center py-3 touch-none"
                  aria-label="Dra arket ned for å lukke"
                  tabIndex={-1}
                >
                  <span className="block h-1.5 w-12 rounded-full bg-muted-foreground" />
                </button>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalHost,
  );
}

export function SheetBody({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        data-sheet-scroll
        className="scroll-touch min-h-0 flex-1 overflow-y-auto overscroll-contain px-4"
        style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
      >
        {children}
      </div>
      {footer}
    </div>
  );
}
