import { supabaseAdmin } from "@/lib/supabase";
import { Agent, Action } from "@/types/database";
import { notFound } from "next/navigation";
import { formatDate, formatCost, formatNumber, AGENT_COLORS } from "@/lib/utils";
import { Shield, Cpu, Coins, Zap, Clock } from "lucide-react";
import KPICard from "@/components/layout/KPICard";

export const revalidate = 30;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;

  const { data: agent } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (!agent) return notFound();

  const typedAgent = agent as Agent;
  const color = AGENT_COLORS[id] || "#C9A84C";

  // Stats
  const { data: actions } = await supabaseAdmin
    .from("actions")
    .select("*")
    .eq("agent_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const allActions = (actions as Action[]) || [];

  const { data: costData } = await supabaseAdmin
    .from("daily_costs")
    .select("*")
    .eq("agent_id", id);

  const costs = costData || [];
  const totalCost = costs.reduce((s, c) => s + Number(c.total_cost_usd), 0);
  const totalTokensIn = costs.reduce((s, c) => s + Number(c.total_input_tokens), 0);
  const totalTokensOut = costs.reduce((s, c) => s + Number(c.total_output_tokens), 0);
  const totalActions = costs.reduce((s, c) => s + Number(c.action_count), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}>
          <Shield className="w-8 h-8" style={{ color }} />
        </div>
        <div>
          <h1 className="text-3xl font-display text-imperial-cream">{typedAgent.name}</h1>
          {typedAgent.grade && (
            <p className="font-badge text-sm tracking-widest mt-1" style={{ color }}>
              {typedAgent.grade}
            </p>
          )}
          {typedAgent.title && (
            <p className="font-subtitle text-imperial-muted italic mt-0.5">{typedAgent.title}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2.5 h-2.5 rounded-full ${typedAgent.status === "online" ? "bg-imperial-success" : typedAgent.status === "busy" ? "bg-imperial-warning" : "bg-imperial-muted/50"}`} />
            <span className="text-sm text-imperial-muted capitalize">{typedAgent.status}</span>
            {typedAgent.model && (
              <>
                <span className="text-imperial-muted">•</span>
                <Cpu className="w-4 h-4 text-imperial-muted" />
                <span className="font-mono text-xs text-imperial-muted">{typedAgent.model}</span>
              </>
            )}
          </div>
        </div>
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
        {typedAgent.soul_md && (
          <div className="card-imperial">
            <h3 className="font-display text-imperial-gold mb-3">SOUL.md</h3>
            <div className="prose prose-invert prose-sm max-h-80 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-imperial-cream/80 font-mono bg-imperial-bg/50 rounded p-4">
                {typedAgent.soul_md}
              </pre>
            </div>
          </div>
        )}
        {typedAgent.identity_md && (
          <div className="card-imperial">
            <h3 className="font-display text-imperial-gold mb-3">IDENTITY.md</h3>
            <div className="prose prose-invert prose-sm max-h-80 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-imperial-cream/80 font-mono bg-imperial-bg/50 rounded p-4">
                {typedAgent.identity_md}
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
              {allActions.map((action) => (
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
                    <span className={`text-xs ${action.status === "error" ? "text-imperial-error" : action.status === "pending" ? "text-imperial-warning" : "text-imperial-success"}`}>
                      {action.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allActions.length === 0 && (
            <p className="text-center py-8 text-imperial-muted">Aucune action</p>
          )}
        </div>
      </div>
    </div>
  );
}
