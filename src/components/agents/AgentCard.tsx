import { Agent } from "@/types/database";
import { AGENT_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Shield, Cpu, Radio } from "lucide-react";

const statusColors: Record<string, string> = {
  online: "bg-imperial-success",
  offline: "bg-imperial-muted/50",
  busy: "bg-imperial-warning",
};

export default function AgentCard({ agent }: { agent: Agent }) {
  const color = AGENT_COLORS[agent.id] || "#C9A84C";

  return (
    <div className="card-imperial relative overflow-hidden">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />

      <div className="pl-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl text-imperial-cream">{agent.name}</h3>
              <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[agent.status])} />
            </div>
            {agent.grade && (
              <p className="font-badge text-xs text-imperial-gold tracking-widest mt-1">
                {agent.grade}
              </p>
            )}
            {agent.title && (
              <p className="font-subtitle text-imperial-muted italic mt-0.5">{agent.title}</p>
            )}
          </div>
          <div className="bg-imperial-gold/10 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-imperial-gold" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {agent.model && (
            <div className="flex items-center gap-2 text-sm text-imperial-muted">
              <Cpu className="w-4 h-4" />
              <span className="font-mono text-xs">{agent.model}</span>
            </div>
          )}
          {agent.channels && Object.keys(agent.channels).length > 0 && (
            <div className="flex items-center gap-2 text-sm text-imperial-muted">
              <Radio className="w-4 h-4" />
              <span>{Object.keys(agent.channels).join(", ")}</span>
            </div>
          )}
        </div>

        {agent.is_default && (
          <span className="inline-block mt-3 text-xs font-badge bg-imperial-gold/20 text-imperial-gold px-2 py-1 rounded">
            AGENT PRINCIPAL
          </span>
        )}
      </div>
    </div>
  );
}
