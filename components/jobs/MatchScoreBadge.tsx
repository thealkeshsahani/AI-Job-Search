import { Sparkles } from "lucide-react";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function MatchScoreBadge({ score, size = "md" }: MatchScoreBadgeProps) {
  let colorClasses = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400";
  if (score < 65) {
    colorClasses = "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400";
  } else if (score < 80) {
    colorClasses = "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1.5 text-sm font-bold gap-2",
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${colorClasses} ${sizeClasses} shadow-sm`}>
      <Sparkles className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />
      <span>{score}% Match</span>
    </span>
  );
}
