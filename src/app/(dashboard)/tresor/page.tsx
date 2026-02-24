import { supabaseAdmin } from "@/lib/supabase";
import { formatCost, formatNumber, AGENT_NAMES, AGENT_COLORS } from "@/lib/utils";
import { Coins, TrendingUp, PieChart as PieIcon, Calendar } from "lucide-react";
import KPICard from "@/components/layout/KPICard";
import CostEvolutionChart from "@/components/charts/CostEvolutionChart";
import CostChart from "@/components/charts/CostChart";

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

  return { totalMonth, totalWeek, totalToday, totalTokens, evolutionData, agentData, byModel };
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
          <h3 className="font-display text-imperial-gold mb-4">Coût par modèle</h3>
          <div className="space-y-3">
            {Object.entries(data.byModel)
              .sort(([, a], [, b]) => b - a)
              .map(([model, cost]) => (
                <div key={model} className="flex items-center justify-between py-2 border-b border-imperial-gold/10">
                  <span className="font-mono text-sm text-imperial-cream">{model}</span>
                  <span className="font-mono text-sm text-imperial-gold">{formatCost(cost)}</span>
                </div>
              ))}
            {Object.keys(data.byModel).length === 0 && (
              <p className="text-imperial-muted text-center py-8">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
