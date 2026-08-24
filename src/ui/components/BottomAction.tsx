import type { ReactNode } from "react";

export function BottomAction({
  children,
  onClick,
  placement = "page",
}: {
  children: ReactNode;
  onClick: () => void;
  placement?: "page" | "sheet";
}) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className="display min-h-14 w-full bg-primary text-xl tracking-[0.14em] text-primary-foreground transition-transform duration-200 ease-out active:scale-[0.99]"
    >
      {children}
    </button>
  );

  if (placement === "sheet") {
    return (
      <div className="shrink-0 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {button}
      </div>
    );
  }

  return (
    <div className="bottom-action">
      <div className="mx-auto w-full min-w-0 max-w-[430px] px-0">{button}</div>
    </div>
  );
}
