import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "purple";

const toneStyles: Record<Tone, string> = {
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  danger: "bg-red-500/10 text-red-300 border-red-500/30",
  info: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  neutral: "bg-white/5 text-gray-300 border-white/10",
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/30",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (["done", "active", "success"].includes(s)) return "success";
  if (["in_progress", "review", "pending"].includes(s)) return "warning";
  if (["failure", "inactive", "overdue"].includes(s)) return "danger";
  if (["todo"].includes(s)) return "info";
  return "neutral";
}

export function priorityTone(priority: string): Tone {
  if (priority === "high") return "danger";
  if (priority === "medium") return "warning";
  return "info";
}

export function roleTone(role: string): Tone {
  if (role === "super_admin") return "purple";
  if (role === "admin") return "danger";
  if (role === "team_lead") return "warning";
  if (role === "employee") return "info";
  return "neutral";
}
