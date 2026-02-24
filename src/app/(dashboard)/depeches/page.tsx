import { supabaseAdmin } from "@/lib/supabase";
import { Alert } from "@/types/database";
import { formatDate, AGENT_NAMES } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

export const revalidate = 30;

const severityConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: "text-imperial-error", bg: "bg-imperial-error/10" },
  warning: { icon: AlertCircle, color: "text-imperial-warning", bg: "bg-imperial-warning/10" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10" },
  success: { icon: CheckCircle, color: "text-imperial-success", bg: "bg-imperial-success/10" },
};

export default async function DepechesPage() {
  const { data: alerts } = await supabaseAdmin
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">Dépêches</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Alertes et notifications du système
        </p>
      </div>

      <div className="space-y-3">
        {(alerts as Alert[] || []).map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`card-imperial flex items-start gap-4 ${!alert.is_read ? "border-l-2 border-l-imperial-gold" : ""}`}
            >
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-imperial-cream">{alert.title}</h4>
                  <span className={`text-xs font-badge ${config.color}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {alert.agent_id && (
                    <span className="text-xs text-imperial-muted">
                      {AGENT_NAMES[alert.agent_id] || alert.agent_id}
                    </span>
                  )}
                </div>
                <p className="text-sm text-imperial-muted mt-1">{alert.message}</p>
                <p className="text-xs text-imperial-muted/50 mt-2">{formatDate(alert.created_at)}</p>
              </div>
            </div>
          );
        })}

        {(!alerts || alerts.length === 0) && (
          <div className="card-imperial text-center py-12">
            <p className="text-imperial-muted">Aucune dépêche pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
