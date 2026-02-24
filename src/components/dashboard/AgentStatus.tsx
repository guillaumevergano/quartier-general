import { Agent } from "@/types/database";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  online: "En ligne",
  offline: "Hors ligne",
  busy: "En mission",
};

const statusColors: Record<string, string> = {
  online: "bg-imperial-success",
  offline: "bg-imperial-muted/50",
  busy: "bg-imperial-warning",
};

export default function AgentStatus({ agents }: { agents: Agent[] }) {
  if (!agents.length) {
    return <p className="text-imperial-muted text-center py-8">Aucun agent configuré</p>;
  }

  return (
    <div className="space-y-3">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="flex items-center gap-3 py-2 border-b border-imperial-gold/10 last:border-0"
        >
          <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[agent.status] || statusColors.offline)} />
          <div className="flex-1">
            <p className="text-sm font-badge text-imperial-cream">{agent.name}</p>
            <p className="text-xs text-imperial-muted">{agent.title || agent.grade || agent.model}</p>
          </div>
          <span className="text-xs text-imperial-muted">
            {statusLabels[agent.status] || agent.status}
          </span>
        </div>
      ))}
    </div>
  );
}
