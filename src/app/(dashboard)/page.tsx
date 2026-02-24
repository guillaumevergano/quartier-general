import { supabaseAdmin } from "@/lib/supabase";
import { formatCost, formatNumber, AGENT_COLORS, AGENT_NAMES } from "@/lib/utils";
import { MessageSquare, Coins, Zap, Clock } from "lucide-react";
import KPICard from "@/components/layout/KPICard";
import ActivityChart from "@/components/charts/ActivityChart";
import CostChart from "@/components/charts/CostChart";
import RecentActions from "@/components/dashboard/RecentActions";
import AgentStatus from "@/components/dashboard/AgentStatus";

export const revalidate = 60;

async function getDashboardData() {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  const [actionsRes, costsRes, agentsRes, recentRes] = await Promise.all([
    supabaseAdmin
      .from("actions")
      .select("id, cost_usd, duration_ms, created_at")
      .gte("created_at", weekAgo),
    supabaseAdmin
      .from("daily_costs")
      .select("*")
      .gte("date", weekAgo)
      .order("date"),
    supabaseAdmin.from("agents").select("*"),
    supabaseAdmin
      .from("actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const actions = actionsRes.data || [];
  const costs = costsRes.data || [];
  const agents = agentsRes.data || [];
  const recent = recentRes.data || [];

  const totalActions = actions.length;
  const totalCost = actions.reduce((s, a) => s + (a.cost_usd || 0), 0);
  const avgDuration = actions.length
    ? actions.reduce((s, a) => s + (a.duration_ms || 0), 0) / actions.length
    : 0;

  // Group costs by date and agent for charts
  const dailyByAgent: Record<string, Record<string, number>> = {};
  const costByAgent: Record<string, number> = {};
  for (const c of costs) {
    if (!dailyByAgent[c.date]) dailyByAgent[c.date] = {};
    dailyByAgent[c.date][c.agent_id] = (dailyByAgent[c.date][c.agent_id] || 0) + c.action_count;
    costByAgent[c.agent_id] = (costByAgent[c.agent_id] || 0) + Number(c.total_cost_usd);
  }

  const activityData = Object.entries(dailyByAgent)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, agents]) => ({
      date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      ...agents,
    }));

  const costData = Object.entries(costByAgent).map(([agent_id, cost]) => ({
    name: AGENT_NAMES[agent_id] || agent_id,
    cost: Number(cost.toFixed(4)),
    fill: AGENT_COLORS[agent_id] || "#C9A84C",
  }));

  return {
    totalActions,
    totalCost,
    avgDuration,
    todayActions: actions.filter((a) => a.created_at?.startsWith(today)).length,
    activityData,
    costData,
    agents,
    recent,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">Tableau de Campagne</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Vue d&apos;ensemble des opérations — 7 derniers jours
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Actions (7j)"
          value={formatNumber(data.totalActions)}
          subtitle={`${data.todayActions} aujourd'hui`}
          icon={Zap}
        />
        <KPICard
          title="Coût total (7j)"
          value={formatCost(data.totalCost)}
          icon={Coins}
        />
        <KPICard
          title="Temps moyen"
          value={`${(data.avgDuration / 1000).toFixed(1)}s`}
          subtitle="par action"
          icon={Clock}
        />
        <KPICard
          title="Agents actifs"
          value={String(data.agents.filter((a) => a.status === "online").length)}
          subtitle={`sur ${data.agents.length}`}
          icon={MessageSquare}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">Activité par agent</h3>
          <ActivityChart data={data.activityData} />
        </div>
        <div className="card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">Coûts par agent</h3>
          <CostChart data={data.costData} />
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">Dernières actions</h3>
          <RecentActions actions={data.recent} />
        </div>
        <div className="card-imperial">
          <h3 className="font-display text-imperial-gold mb-4">État des Maréchaux</h3>
          <AgentStatus agents={data.agents} />
        </div>
      </div>
    </div>
  );
}
