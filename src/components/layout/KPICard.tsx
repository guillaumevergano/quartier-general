import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export default function KPICard({ title, value, subtitle, icon: Icon, trend }: KPICardProps) {
  return (
    <div className="card-imperial flex items-start justify-between">
      <div>
        <p className="text-sm text-imperial-muted font-subtitle">{title}</p>
        <p className="text-2xl font-mono font-bold text-imperial-cream mt-1">{value}</p>
        {subtitle && <p className="text-xs text-imperial-muted mt-1">{subtitle}</p>}
        {trend && (
          <p
            className={cn(
              "text-xs mt-2 font-mono",
              trend.positive ? "text-imperial-success" : "text-imperial-error"
            )}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </p>
        )}
      </div>
      <div className="bg-imperial-gold/10 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-imperial-gold" />
      </div>
    </div>
  );
}
