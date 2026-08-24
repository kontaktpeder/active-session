import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function BackLink({ label = "Program" }: { label?: string }) {
  return (
    <Link
      to="/"
      className="inline-flex min-w-0 items-center gap-1 text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4 shrink-0" />
      <span className="display text-[11px] tracking-[0.2em]">{label}</span>
    </Link>
  );
}
