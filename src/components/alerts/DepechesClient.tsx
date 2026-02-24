"use client";

import { Alert } from "@/types/database";
import { useRealtimeAlerts } from "@/hooks/useRealtimeAlerts";
import { formatDate, AGENT_NAMES } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Check, CheckCheck } from "lucide-react";
import { useCallback } from "react";

const severityConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: "text-imperial-error", bg: "bg-imperial-error/10" },
  warning: { icon: AlertCircle, color: "text-imperial-warning", bg: "bg-imperial-warning/10" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10" },
  success: { icon: CheckCircle, color: "text-imperial-success", bg: "bg-imperial-success/10" },
};

export default function DepechesClient({ initialAlerts }: { initialAlerts: Alert[] }) {
  const { alerts, setAlerts, unreadCount } = useRealtimeAlerts(initialAlerts);

  const markRead = useCallback(async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
    await fetch("/api/alerts/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }, [setAlerts]);

  const markAllRead = useCallback(async () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
    await fetch("/api/alerts/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
  }, [setAlerts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-imperial-gold">Dépêches</h1>
          <p className="text-imperial-muted font-subtitle text-lg mt-1">
            Alertes et notifications du système
            {unreadCount > 0 && (
              <span className="ml-2 text-sm text-imperial-warning">
                ({unreadCount} non lue{unreadCount > 1 ? "s" : ""})
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-imperial-gold/10 border border-imperial-gold/30 rounded-lg text-sm text-imperial-gold hover:bg-imperial-gold/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`card-imperial flex items-start gap-4 ${!alert.is_read ? "border-l-2 border-l-imperial-gold" : "opacity-70"}`}
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
              {!alert.is_read && (
                <button
                  onClick={() => markRead(alert.id)}
                  className="p-2 text-imperial-muted hover:text-imperial-gold transition-colors"
                  title="Marquer comme lu"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="card-imperial text-center py-12">
            <p className="text-imperial-muted">Aucune dépêche pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
