import Link from "next/link";
import { Agent } from "@/types/database";
import { Shield, Cpu } from "lucide-react";
import { AGENT_COLORS } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const color = AGENT_COLORS[agent.id] || "#C9A84C";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/marechaux/${agent.id}`}>
      <div className="card-imperial hover:border-imperial-gold/40 transition-all duration-200 group">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {agent.avatar_url ? (
              <img
                src={agent.avatar_url}
                alt={`Avatar de ${agent.name}`}
                className="w-12 h-12 rounded-lg object-cover border border-imperial-gold/20"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center border" 
                style={{ 
                  backgroundColor: `${color}20`, 
                  borderColor: color 
                }}
              >
                <div className="text-sm font-display" style={{ color }}>
                  {getInitials(agent.name)}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-imperial-cream group-hover:text-imperial-gold transition-colors truncate">
                {agent.name}
              </h3>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                agent.status === "online" 
                  ? "bg-imperial-success" 
                  : agent.status === "busy" 
                    ? "bg-imperial-warning" 
                    : "bg-imperial-muted/50"
              }`} />
            </div>

            {agent.grade && (
              <p className="font-badge text-xs tracking-widest mt-0.5" style={{ color }}>
                {agent.grade}
              </p>
            )}

            {agent.title && (
              <p className="font-subtitle text-sm text-imperial-muted italic">
                {agent.title}
              </p>
            )}

            {agent.model && (
              <div className="flex items-center gap-1 mt-1">
                <Cpu className="w-3 h-3 text-imperial-muted" />
                <span className="font-mono text-xs text-imperial-muted truncate">
                  {agent.model}
                </span>
              </div>
            )}
          </div>

          {/* Icône */}
          <div className="flex-shrink-0">
            <Shield className="w-5 h-5" style={{ color }} />
          </div>
        </div>

        {/* Description si disponible */}
        {agent.description && (
          <div className="mt-3 pt-3 border-t border-imperial-gold/10">
            <p className="text-sm text-imperial-muted line-clamp-2">
              {agent.description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}