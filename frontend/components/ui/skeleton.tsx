import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "shimmer-bg animate-shimmer rounded-md bg-white/[0.04]",
        className,
      )}
    />
  );
}
