import type { ReactNode } from "react";

export function BottomAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <div className="bottom-action">
      <div className="mx-auto w-full max-w-[430px]">
        <button
          type="button"
          onClick={onClick}
          className="min-h-14 w-full rounded-2xl bg-primary text-lg font-semibold text-primary-foreground transition-transform duration-200 ease-out active:scale-[0.99]"
        >
          {children}
        </button>
      </div>
    </div>
  );
}
