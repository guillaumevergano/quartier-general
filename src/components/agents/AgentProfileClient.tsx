"use client";

import { useState } from "react";
import { Agent, Action, DailyCost } from "@/types/database";
import { formatDate, formatCost, formatNumber, AGENT_COLORS } from "@/lib/utils";
import { Shield, Cpu, Coins, Zap, Clock } from "lucide-react";
import KPICard from "@/components/layout/KPICard";
import AgentEditForm from "./AgentEditForm";

interface AgentProfileClientProps {
  initialAgent: Agent;
  actions: Action[];
  costs: DailyCost[];
}

export default function AgentProfileClient({ 
  initialAgent, 
  actions, 
  costs 
}: AgentProfileClientProps) {
  const [agent, setAgent] = useState(initialAgent);
  const color = AGENT_COLORS[agent.id] || "#C9A84C";

  const totalCost = costs.reduce((s, c) => s + Number(c.total_cost_usd), 0);
  const totalTokensIn = costs.reduce((s, c) => s + Number(c.total_input_tokens), 0);
  const totalTokensOut = costs.reduce((s, c) => s + Number(c.total_output_tokens), 0);
  const totalActions = costs.reduce((s, c) => s + Number(c.action_count), 0);

  const handleAgentUpdate = (updatedFields: Partial<Agent>) => {
    setAgent(prev => ({ ...prev, ...updatedFields }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Header avec formulaire d'édition */}
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {agent.avatar_url ? (
              <img
                src={agent.avatar_url}
                alt={`Avatar de ${agent.name}`}
                className="w-16 h-16 rounded-xl object-cover border-2 border-imperial-gold/20"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center border-2" 
                style={{ 
                  backgroundColor: `${color}20`, 
                  borderColor: color 
                }}
              >
                <div className="text-xl font-display" style={{ color }}>
                  {getInitials(agent.name)}
                </div>
              </div>
            )}
          </div>

          {/* Info agent */}
          <div className="flex-1">
            <h1 className="text-3xl font-display text-imperial-cream">{agent.name}</h1>
            {agent.grade && (
              <p className="font-badge text-sm tracking-widest mt-1" style={{ color }}>
                {agent.grade}
              </p>
            )}
            {agent.title && (
              <p className="font-subtitle text-imperial-muted italic mt-0.5">{agent.title}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                agent.status === "online" 
                  ? "bg-imperial-success" 
                  : agent.status === "busy" 
                    ? "bg-imperial-warning" 
                    : "bg-imperial-muted/50"
              }`} />
              <span className="text-sm text-imperial-muted capitalize">{agent.status}</span>
              {agent.model && (
                <>
                  <span className="text-imperial-muted">•</span>
                  <Cpu className="w-4 h-4 text-imperial-muted" />
                  <span className="font-mono text-xs text-imperial-muted">{agent.model}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {agent.description && (
          <div className="card-imperial">
            <h3 className="font-display text-imperial-gold mb-3">Description</h3>
            <p className="text-imperial-cream/80 whitespace-pre-wrap">
              {agent.description}
            </p>
          </div>
        )}

        {/* Formulaire d'édition */}
        <AgentEditForm agent={agent} onUpdate={handleAgentUpdate} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Coût total" value={formatCost(totalCost)} icon={Coins} />
        <KPICard title="Tokens entrée" value={formatNumber(totalTokensIn)} icon={Zap} />
        <KPICard title="Tokens sortie" value={formatNumber(totalTokensOut)} icon={Zap} />
        <KPICard title="Actions totales" value={formatNumber(totalActions)} icon={Clock} />
      </div>

      {/* SOUL.md & IDENTITY.md */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agent.soul_md && (
          <div className="card-imperial">
            <h3 className="font-display text-imperial-gold mb-3">SOUL.md</h3>
            <div className="prose prose-invert prose-sm max-h-80 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-imperial-cream/80 font-mono bg-imperial-bg/50 rounded p-4">
                {agent.soul_md}
              </pre>
            </div>
          </div>
        )}
        {agent.identity_md && (
          <div className="card-imperial">
            <h3 className="font-display text-imperial-gold mb-3">IDENTITY.md</h3>
            <div className="prose prose-invert prose-sm max-h-80 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-imperial-cream/80 font-mono bg-imperial-bg/50 rounded p-4">
                {agent.identity_md}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Dernières actions */}
      <div className="card-imperial">
        <h3 className="font-display text-imperial-gold mb-4">Dernières actions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-imperial-gold/20 text-left">
                <th className="py-3 px-4 text-imperial-muted font-subtitle">Date</th>
                <th className="py-3 px-4 text-imperial-muted font-subtitle">Type</th>
                <th className="py-3 px-4 text-imperial-muted font-subtitle">Résumé</th>
                <th className="py-3 px-4 text-imperial-muted font-subtitle text-right">Coût</th>
                <th className="py-3 px-4 text-imperial-muted font-subtitle">Statut</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action.id} className="border-b border-imperial-gold/5 hover:bg-imperial-gold/5">
                  <td className="py-2 px-4 text-xs text-imperial-muted font-mono whitespace-nowrap">
                    {formatDate(action.created_at)}
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-imperial-gold/10 text-imperial-muted">
                      {action.action_type}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-xs text-imperial-cream/80 max-w-xs truncate">
                    {action.summary || "—"}
                  </td>
                  <td className="py-2 px-4 text-xs font-mono text-imperial-gold text-right">
                    {action.cost_usd ? formatCost(action.cost_usd) : "—"}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`text-xs ${
                      action.status === "error" 
                        ? "text-imperial-error" 
                        : action.status === "pending" 
                          ? "text-imperial-warning" 
                          : "text-imperial-success"
                    }`}>
                      {action.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {actions.length === 0 && (
            <p className="text-center py-8 text-imperial-muted">Aucune action</p>
          )}
        </div>
      </div>
    </div>
  );
}