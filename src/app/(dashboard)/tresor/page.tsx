import { supabaseAdmin } from "@/lib/supabase";
import { formatCost, formatNumber, AGENT_NAMES, AGENT_COLORS } from "@/lib/utils";
import { Coins, TrendingUp, PieChart as PieIcon, Calendar } from "lucide-react";
import KPICard from "@/components/layout/KPICard";
import CostEvolutionChart from "@/components/charts/CostEvolutionChart";
import CostChart from "@/components/charts/CostChart";
import ModelPieChart from "@/components/charts/ModelPieChart";
import ActionTypeChart from "@/components/charts/ActionTypeChart";

export const revalidate = 60;

async function getTresorData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const { data: costs } = await supabaseAdmin
    .from("daily_costs")
    .select("*")
    .gte("date", thirtyDaysAgo)
    .order("date");

  const allCosts = costs || [];

  const totalMonth = allCosts.reduce((s, c) => s + Number(c.total_cost_usd), 0);
  const totalWeek = allCosts
    .filter((c) => c.date >= sevenDaysAgo)
    .reduce((s, c) => s + Number(c.total_cost_usd), 0);
  const totalToday = allCosts
    .filter((c) => c.date === today)
    .reduce((s, c) => s + Number(c.total_cost_usd), 0);
  const totalTokens = allCosts.reduce(
    (s, c) => s + Number(c.total_input_tokens) + Number(c.total_output_tokens),
    0
  );

  // Daily evolution
  const dailyMap: Record<string, number> = {};
  for (const c of allCosts) {
    dailyMap[c.date] = (dailyMap[c.date] || 0) + Number(c.total_cost_usd);
  }
  const evolutionData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cost]) => ({
      date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      cost: Number(cost.toFixed(4)),
    }));

  // By agent
  const byAgent: Record<string, number> = {};
  for (const c of allCosts) {
    byAgent[c.agent_id] = (byAgent[c.agent_id] || 0) + Number(c.total_cost_usd);
  }
  const agentData = Object.entries(byAgent).map(([id, cost]) => ({
    name: AGENT_NAMES[id] || id,
    cost: Number(cost.toFixed(4)),
    fill: AGENT_COLORS[id] || "#C9A84C",
  }));

  // By model
  const byModel: Record<string, number> = {};
  for (const c of allCosts) {
    const model = c.model || "unknown";
    byModel[model] = (byModel[model] || 0) + Number(c.total_cost_usd);
  }
  const modelData = Object.entries(byModel)
    .sort(([, a], [, b]) => b - a)
    .map(([name, cost]) => ({ name, cost: Number(cost.toFixed(4)) }));

  // By action type
  const byType: Record<string, number> = {};
  for (const c of allCosts) {
    const t = c.action_type || "unknown";
    byType[t] = (byType[t] || 0) + Number(c.total_cost_usd);
  }
  const typeData = Object.entries(byType)
    .sort(([, a], [, b]) => b - a)
    .map(([type, cost]) => ({ type, cost: Number(cost.toFixed(4)) }));

  // Top 5 sessions
  const { data: topSessions } = await supabaseAdmin
    .from("actions")
    .select("session_id, cost_usd, agent_id")
    .not("session_id", "is", null)
    .not("cost_usd", "is", null)
    .order("created_at", { ascending: false })
    .limit(2000);

  const sessionCosts: Record<string, { cost: number; agent_id: string }> = {};
  for (const a of topSessions || []) {
    if (!a.session_id || !a.cost_usd) continue;
    if (!sessionCosts[a.session_id]) sessionCosts[a.session_id] = { cost: 0, agent_id: a.agent_id };
    sessionCosts[a.session_id].cost += Number(a.cost_usd);
  }
  const top5Sessions = Object.entries(sessionCosts)
    .sort(([, a], [, b]) => b.cost - a.cost)
    .slice(0, 5)
    .map(([id, data]) => ({ id: id.slice(0, 12) + "…", cost: data.cost, agent: AGENT_NAMES[data.agent_id] || data.agent_id }));

  // Projection mensuelle
  const uniqueDays = new Set(allCosts.map((c) => c.date)).size;
  const avgDaily = uniqueDays > 0 ? totalMonth / uniqueDays : 0;
  const monthlyProjection = avgDaily * 30;

  return { totalMonth, totalWeek, totalToday, totalTokens, evolutionData, agentData, modelData, typeData, top5Sessions, monthlyProjection, avgDaily };
}

export default async function TresorPage() {
  const data = await getTresorData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">Trésor de Guerre</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Suivi des dépenses et consommation de tokens
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Coût aujourd'hui" value={formatCost(data.totalToday)} icon={Calendar} />
        <KPICard title="Coût (7j)" value={formatCost(data.totalWeek)} icon={Coins} />
        <KPICard title="Coût (30j)" value={formatCost(data.totalMonth)} icon={TrendingUp} />
        <KPICard
          title="Tokens (30j)"
          value={formatNumber(data.totalTokens)}
          icon={PieIcon}
        />
      </div>

      {/* Projection */}
      <div className="card-imperial">
        <h3 className="font-display text-imperial-gold mb-2">Projection mensuelle</h3>
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-display text-imperial-cream">{formatCost(data.monthlyProjection)}</span>
          <span className="text-sm text-imperial-muted">basé sur une moyenne de {formatCost(data.avgDaily)}/jour</span>
        </div>
      </div>

      <div className="card-imperial">
        <h3 className="font-display text-imperial-gold mb-4">Évolution des coûts (30 jours)</h3>
        <CostEvolutionChart data={data.evolutionData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">Répartition par agent</h3>
          <CostChart data={data.agentData} />
        </div>
        <div className="card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">Répartition par modèle</h3>
          <ModelPieChart data={data.modelData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">Coût par type d&apos;action</h3>
          <ActionTypeChart data={data.typeData} />
        </div>
        <div className="card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">Top 5 sessions les plus coûteuses</h3>
          <div className="space-y-3">
            {data.top5Sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-imperial-gold/10">
                <div>
                  <span className="font-mono text-sm text-imperial-cream">{s.id}</span>
                  <span className="text-xs text-imperial-muted ml-2">({s.agent})</span>
                </div>
                <span className="font-mono text-sm text-imperial-gold">{formatCost(s.cost)}</span>
              </div>
            ))}
            {data.top5Sessions.length === 0 && (
              <p className="text-imperial-muted text-center py-8">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
