import type { ReactNode } from "react";

export function BottomAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <div className="bottom-action">
      <div className="mx-auto w-full min-w-0 max-w-[430px] px-0">
        <button
          type="button"
          onClick={onClick}
          className="display min-h-14 w-full bg-primary text-xl tracking-[0.14em] text-primary-foreground transition-transform duration-200 ease-out active:scale-[0.99]"
        >
          {children}
        </button>
      </div>
    </div>
  );
}
