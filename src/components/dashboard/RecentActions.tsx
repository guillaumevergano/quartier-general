import { Action } from "@/types/database";
import { formatDate, AGENT_NAMES, AGENT_COLORS } from "@/lib/utils";

export default function RecentActions({ actions }: { actions: Action[] }) {
  if (!actions.length) {
    return <p className="text-imperial-muted text-center py-8">Aucune action récente</p>;
  }

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <div
          key={action.id}
          className="flex items-center gap-3 py-2 border-b border-imperial-gold/10 last:border-0"
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: AGENT_COLORS[action.agent_id] || "#C9A84C" }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-badge text-imperial-gold">
                {AGENT_NAMES[action.agent_id] || action.agent_id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-imperial-gold/10 text-imperial-muted">
                {action.action_type}
              </span>
              {action.status === "error" && (
                <span className="text-xs px-2 py-0.5 rounded bg-imperial-error/20 text-imperial-error">
                  erreur
                </span>
              )}
            </div>
            <p className="text-sm text-imperial-cream/80 truncate mt-0.5">
              {action.summary || "—"}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-imperial-muted">{formatDate(action.created_at)}</p>
            {action.cost_usd ? (
              <p className="text-xs font-mono text-imperial-gold">${action.cost_usd.toFixed(4)}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
